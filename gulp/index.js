const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const gulpJade = require('gulp-jade');
const gulpRename = require('gulp-rename');

const rimraf = require('rimraf');

const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./_webpack');

const isProduction = 'production' === process.env.NODE_ENV;
const buildPath = path.resolve(__dirname, '../build');

// --- includes

require('./i18n');
require('./lint');
require('./vendor');
require('./manifest');
require('./dev');
require('./phantom');

// ---

function buildBackground(watch) {
	return gulp.src('src/common/background/index.js')
		.pipe(gulpWebpack(
			webpackConfig({
				entry: {
					'index': 'background/index.js',
					'vendor': [
						'vendor/babel-helpers',
						'vendor/twitter-text',
						'hmacsha1',
						'lodash/object/merge',
						'qs'
					]
				},
				watch: watch,
				output: {
					filename: 'background.js'
				},
				plugins: [
					new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
				]
			})
		))
		.pipe(gulp.dest('build/'));
}

gulp.task('background', () => buildBackground());
gulp.task('background:watch', () => buildBackground(true));

// options

function buildOptions(watch) {
	return gulp.src('src/common/options/index.jsx')
		.pipe(gulpWebpack(
			webpackConfig({
				entry: {
					'index': 'options/index.jsx',
					'vendor': ['vendor/babel-helpers', 'react', 'normalize.stylus/index.styl']
				},
				watch: watch,
				output: {
					filename: 'index.js',
					path: path.resolve(buildPath, 'options'),
					publicPath: '/options/'
				},
				plugins: [
					new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
				]
			})
		))
		.pipe(gulp.dest('build/options'));
}

gulp.task('options:modules', () => buildOptions());
gulp.task('options:modules:watch', () => buildOptions(true));

gulp.task('options:templates', function() {
	return gulp.src('src/common/options/template.jade')
		.pipe(gulpJade({
			pretty: true
		}))
		.pipe(gulpRename('index.html'))
		.pipe(gulp.dest('build/options'));
});

gulp.task('options', gulp.series('options:templates', 'options:modules'));

// popup

function buildPopup(watch) {
	return gulp.src('src/common/popup/index.jsx')
		.pipe(gulpWebpack(
			webpackConfig({
				entry: {
					'index': 'popup/index.jsx',
					'vendor': [
						'vendor/babel-helpers',
						'react',
						'react-pure-render/component',
						'moment',
						'normalize.stylus/index.styl'
					]
				},
				watch: watch,
				output: {
					filename: 'index.js',
					path: path.resolve(buildPath, 'popup'),
					publicPath: '/popup/'
				},
				plugins: [
					new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
				]
			})
		))
		.pipe(gulp.dest('build/popup'));
}

gulp.task('popup:modules', () => buildPopup());
gulp.task('popup:modules:watch', () => buildPopup(true));

gulp.task('popup:templates', function() {
	return gulp.src('src/common/popup/template.jade')
		.pipe(gulpJade({
			pretty: true
		}))
		.pipe(gulpRename('index.html'))
		.pipe(gulp.dest('build/popup'));
});

gulp.task('popup', gulp.series('popup:templates', 'popup:modules'));

// --- dev

gulp.task(
	'watch',
	gulp.parallel(
		'manifest:watch',
		'phantom:watch',
		'i18n:watch',
		'background:watch',
		'options:modules:watch'
		/*, 'popup:modules:watch'*/
	)
);

// --- build

gulp.task('build:cleanup', (callback) => rimraf('build', callback));

gulp.task('build:mkdir', function(callback) {
	fs.exists(buildPath, function(exists) {
		if (!exists) {
			fs.mkdir(buildPath, callback);
		} else {
			callback();
		}
	});
});

gulp.task(
	'build',
	gulp.series(
		'build:cleanup', 'build:mkdir', 'vendor',
		gulp.parallel('phantom', 'i18n', 'manifest', 'popup', 'options', 'background')
	)
);

gulp.task('production', gulp.series('build'));
