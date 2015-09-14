const path = require('path');
const gulpWebpack = require('webpack-stream');
const webpack = require('webpack');

module.exports = function(gulp, config) {

	const sourcePath = path.resolve(config.paths.src, 'base/i18n');

	gulp.task('build:vendor:moment', (callback) => {
		const translations = require(sourcePath);
		const locales = Object
			.keys(translations.moment)
			.map(key => translations.moment[key])
			.filter(locale => 'en' !== locale);

		// @todo better use virgin webpack config
		const webpackConfig = config.webpack({
			vendor: false
		});

		webpackConfig.entry = {
			'moment': [
				'moment',
				...locales.map(locale => ['moment', 'locale', locale].join('/'))
			]
		};

		webpackConfig.output = {
			filename: 'moment.js'
		};

		webpackConfig.debug = false;
		webpackConfig.devtool = false;

		// to avoid extra languages for moment.js
		webpackConfig.plugins.push(
			new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
		);

		return gulp.src(__filename)
			.pipe(gulpWebpack(webpackConfig, webpack))
			.pipe(gulp.dest(path.resolve(config.paths.vendor.root)));
	});

};
