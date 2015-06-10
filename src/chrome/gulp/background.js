const path = require('path');

const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');

module.exports = function(gulp, config) {

	const webpackConfig = config.webpack();

	webpackConfig.entry = {
		'index': 'background/index.js',
		'vendor': [
			'vendor/babel-helpers',
			'vendor/twitter-text',
			'hmacsha1',
			'lodash.merge',
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

	gulp.task('build:chrome:background', function() {
		return gulp.src('src/_chaos/background/index.js')
			.pipe(gulpWebpack(webpackConfig, webpack))
			.pipe(gulp.dest(config.paths.build.chrome));
	});

};
