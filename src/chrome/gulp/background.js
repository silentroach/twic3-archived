const path = require('path');

const gulpWebpack = require('webpack-stream');
const webpack = require('webpack');

module.exports = (gulp, config) => {

	function getWebpackConfig(isWatch) {
		const webpackConfig = config.webpack({
			watch: isWatch
		});

		webpackConfig.entry = {
			'index': 'background/index.js',
			'vendor': [
				'vendor/babel-helpers',
				'hmacsha1',
				'lodash.merge', 'lodash.throttle', 'lodash.uniq',
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

	gulp.task('build:chrome:background', () => {
		return gulp.src('src/_chaos/background/index.js')
			.pipe(gulpWebpack(getWebpackConfig(), webpack))
			.pipe(gulp.dest(config.paths.build.chrome));
	});

	gulp.task('watch:chrome:background:content', () => {
		return gulp.src('src/_chaos/background/index.js')
			.pipe(gulpWebpack(getWebpackConfig(true), webpack))
			.pipe(gulp.dest(config.paths.build.chrome));
	});

	gulp.task(
		'watch:chrome:background',
		gulp.parallel(
			'watch:chrome:background:content',
			() => gulp.watch(__filename, gulp.task('build:chrome:background'))
		)
	);

};
