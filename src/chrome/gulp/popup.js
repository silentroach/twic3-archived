const path = require('path');

const gulpWebpack = require('webpack-stream');
const gulpJade = require('gulp-jade');
const gulpRename = require('gulp-rename');
const webpack = require('webpack');

module.exports = function(gulp, config) {

	const popupTargetPath = path.resolve(config.paths.build.chrome, 'popup');

	const htmlSourcePath = path.resolve(config.paths.src, 'chrome/popup/index.jade');

	function getWebpackConfig(isWatch = false) {
		const webpackConfig = config.webpack({
			watch: isWatch
		});

		webpackConfig.entry = {
			'index': 'popup/index.jsx',
			'vendor': [
				'vendor/babel-helpers',
				'vendor/moment',

				'react',
				'react-pure-render/component',

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

		return webpackConfig;
	}

	gulp.task('build:chrome:popup:html', function() {
		return gulp.src(htmlSourcePath)
			.pipe(gulpJade({
				pretty: true
			}))
			.pipe(gulpRename('index.html'))
			.pipe(gulp.dest(popupTargetPath));
	});

	gulp.task('watch:chrome:popup:html', function() {
		gulp.watch(htmlSourcePath, gulp.task('build:chrome:popup:html'));
	});

	gulp.task('build:chrome:popup:content', function() {
		return gulp.src('src/_chaos/popup/index.js')
			.pipe(gulpWebpack(getWebpackConfig(), webpack))
			.pipe(gulp.dest(popupTargetPath));
	});

	gulp.task('watch:chrome:popup:content', function() {
		return gulp.src('src/_chaos/popup/index.js')
			.pipe(gulpWebpack(getWebpackConfig(true), webpack))
			.pipe(gulp.dest(popupTargetPath));
	});

	gulp.task(
		'build:chrome:popup',
		gulp.parallel(
			'build:chrome:popup:html',
			'build:chrome:popup:content'
		)
	);

	gulp.task(
		'watch:chrome:popup',
		gulp.parallel(
			'watch:chrome:popup:html',
			'watch:chrome:popup:content'
		)
	);

};
