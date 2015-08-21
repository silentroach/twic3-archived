const path = require('path');

const gulpWebpack = require('webpack-stream');
const webpack = require('webpack');

module.exports = function(gulp, config) {

	function getWebpackConfig(isWatch = false) {
		const webpackConfig = config.webpack({
			watch: isWatch
		});

		webpackConfig.entry = {
			'index': 'background/index.js',
			'vendor': [
				'vendor/babel-helpers',
				'hmacsha1',
				'lodash.merge', 'lodash.throttle',
				'qs'
			]
		};

		webpackConfig.output = {
			filename: 'background.js'
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

	gulp.task('build:chrome:background', function() {
		return gulp.src('src/_chaos/background/index.js')
			.pipe(gulpWebpack(getWebpackConfig(), webpack))
			.pipe(gulp.dest(config.paths.build.chrome));
	});

	gulp.task('watch:chrome:background', function() {
		return gulp.src('src/_chaos/background/index.js')
			.pipe(gulpWebpack(getWebpackConfig(true), webpack))
			.pipe(gulp.dest(config.paths.build.chrome));
	});

};
