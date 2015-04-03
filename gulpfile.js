var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var gulpJade = require('gulp-jade');
var gulpRename = require('gulp-rename');

var rimraf = require('rimraf');

var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');
var webpackConfig = require('./gulp/_webpack');

var isProduction = 'production' === process.env.NODE_ENV;
var buildPath = path.resolve(__dirname, 'build');

function buildBackground(watch) {
	return gulp.src('src/background/index.js')
		.pipe(gulpWebpack(
			webpackConfig({
				watch: watch,
				output: {
					filename: 'background.js'
				}
			})
		))
		.pipe(gulp.dest('build/'));
}

gulp.task('background', function() {
	return buildBackground();
});

gulp.task('background:watch', function() {
	return buildBackground(true);
});

// options

function buildOptions(watch) {
	return gulp.src('src/options/index.jsx')
		.pipe(gulpWebpack(
			webpackConfig({
				entry: {
					'index': 'options/index.jsx',
					'vendor': ['babel-core/external-helpers', 'react', 'normalize.stylus/index.styl']
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

gulp.task('options:modules', function() {
	return buildOptions();
});

gulp.task('options:modules:watch', function() {
	return buildOptions(true);
});

gulp.task('options:templates', function() {
	return gulp.src('src/options/template.jade')
		.pipe(gulpJade({
			pretty: true
		}))
		.pipe(gulpRename('index.html'))
		.pipe(gulp.dest('build/options'));
});

gulp.task('options', gulp.series('options:templates', 'options:modules'));

// popup

function buildPopup(watch) {
	return gulp.src('src/popup/index.jsx')
		.pipe(gulpWebpack(
			webpackConfig({
				entry: {
					'index': 'popup/index.jsx',
					'vendor': ['babel-core/external-helpers', 'react', 'normalize.stylus/index.styl']
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

gulp.task('popup:modules', function() {
	buildPopup();
});

gulp.task('popup:modules:watch', function() {
	buildPopup(true);
});

gulp.task('popup:templates', function() {
	return gulp.src('src/popup/template.jade')
		.pipe(gulpJade({
			pretty: true
		}))
		.pipe(gulpRename('index.html'))
		.pipe(gulp.dest('build/popup'));
});

gulp.task('popup', gulp.series('popup:templates', 'popup:modules'));

// --- includes

require('./gulp/i18n');
require('./gulp/lint');
require('./gulp/vendor');
require('./gulp/manifest');
require('./gulp/dev');
require('./gulp/phantom');

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

gulp.task('build:cleanup', function(callback) {
	rimraf('build', callback);
});

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
		'build:cleanup', 'build:mkdir',
		gulp.parallel('phantom', 'vendor', 'i18n', 'manifest', 'popup', 'options', 'background')
	)
);

gulp.task('production', gulp.series('build'));
