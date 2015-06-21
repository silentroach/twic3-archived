const path = require('path');

const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');

module.exports = function(gulp, config) {

	function getWebpackConfig(isWatch = false) {
		const webpackConfig = config.webpack({
			vendor: false,
			target: 'atom'
		});

		if (isWatch) {
			webpackConfig.watch = true;
		}

		webpackConfig.entry = {
			'index': 'application.js'
		};

		webpackConfig.output = {
			filename: 'application.js'
		};

		webpackConfig.resolve = {
			root: [
				path.resolve(config.paths.src, 'electron'),
				path.resolve(config.paths.src, 'base')
			],
			extensions: ['', '.js', '.jsx']
		};

		return webpackConfig;
	}

	gulp.task('build:electron:application', function() {
		return gulp.src('src/electron/application.js')
			.pipe(gulpWebpack(getWebpackConfig(), webpack))
			.pipe(gulp.dest(config.paths.build.electron));
	});

	gulp.task('watch:electron:application', function() {
		return gulp.src('src/electron/application.js')
			.pipe(gulpWebpack(getWebpackConfig(true), webpack))
			.pipe(gulp.dest(config.paths.build.electron));
	});

};
