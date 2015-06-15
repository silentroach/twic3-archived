const path = require('path');

const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');

module.exports = function(gulp, config) {

	const webpackConfig = config.webpack({
		vendor: false,
		target: 'atom'
	});

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

	gulp.task('build:electron:application', function() {
		return gulp.src('src/electron/application.js')
			.pipe(gulpWebpack(webpackConfig, webpack))
			.pipe(gulp.dest(config.paths.build.electron));
	});

};
