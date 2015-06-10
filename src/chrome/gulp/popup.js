const path = require('path');

const gulpWebpack = require('gulp-webpack');
const gulpJade = require('gulp-jade');
const gulpRename = require('gulp-rename');
const webpack = require('webpack');

module.exports = function(gulp, config) {

	const popupTargetPath = path.resolve(config.paths.build.chrome, 'popup');
	const webpackConfig = config.webpack();

	webpackConfig.entry = {
		'index': 'popup/index.jsx',
		'vendor': [
			'vendor/babel-helpers',
			'react',
			'react-pure-render/component',
			'moment',
			'normalize.stylus/index.styl'
		]
	};

	webpackConfig.output = {
		filename: 'index.js',
		path: popupTargetPath,
		publicPath: '/popup/'
	};

	webpackConfig.resolve = {
		root: [
			path.resolve(config.paths.src, 'chrome'),
			path.resolve(config.paths.src, 'base'),
			path.resolve(config.paths.src, '_chaos')
		],
		extensions: ['', '.js', '.jsx']
	};

	gulp.task('build:chrome:popup:html', function() {
		return gulp.src(path.resolve(config.paths.src, 'chrome/popup/index.jade'))
			.pipe(gulpJade({
				pretty: true
			}))
			.pipe(gulpRename('index.html'))
			.pipe(gulp.dest(popupTargetPath));
	});

	gulp.task('build:chrome:popup:content', function() {
		return gulp.src('src/_chaos/popup/index.js')
			.pipe(gulpWebpack(webpackConfig, webpack))
			.pipe(gulp.dest(popupTargetPath));
	});

	gulp.task(
		'build:chrome:popup',
		gulp.parallel(
			'build:chrome:popup:html',
			'build:chrome:popup:content'
		)
	);

};
