const _ = require('lodash');
const qs = require('qs');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(gulp, config) {

	const autoprefixerOptions = {
		'browsers': 'Chrome >= 40'
	};

	const babelOptions = {
		loose: 'all',
		externalHelpers: true,
		cacheDirectory: !config.production,
		blacklist: ['useStrict', 'es6.constants'],
		optional: ['es7.classProperties', 'utility.inlineEnvironmentVariables'],
		plugins: []
	};

	if (config.production) {
		babelOptions.plugins.push(/* @todo it doesn't work 'remove-console', 'remove-debugger' */);
	} else {
		babelOptions.optional.push('validation.react');
	}

	const cssLoaderQuery = {
		sourceMap: null
	};

	if (!config.production) {
		cssLoaderQuery.localIdentName = '[local]_[hash:base64:7]';
	}

	const baseWebpackConfig = {
		stats: {
			colors: true
		},
		module: {
			loaders: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					query: babelOptions
				},
				{
					test: /\.(jpe?g|png|gif|svg)$/i,
					loaders: [
						'file?name=images/[path][name].[ext]'
					]
				},
				{
					test: /\.styl$/,
					loader: ExtractTextPlugin.extract(
						'style-loader',
						[
							'css-loader?' + qs.stringify(cssLoaderQuery, { strictNullHandling: true }),
							'autoprefixer-loader?' + JSON.stringify(autoprefixerOptions),
							'stylus-loader'
						].join('!')
					)
				}
			]
		}
	};

	if (!config.production) {
		baseWebpackConfig.debug = true;
		baseWebpackConfig.devtool = '#cheap-module-source-map';
	}

	// ---

	config.webpack = function(opts) {
		const options = _.assign({
			vendor: true,
			watch: false,
			target: 'web'
		}, opts);

		const webpackConfig = _.clone(baseWebpackConfig);
		const plugins = [
			new ExtractTextPlugin('[name].css')
		];

		if (options.vendor) {
			plugins.push(
				new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
			);
		}

		if (config.production) {
			/*eslint camelcase: 0*/
			plugins.push(
				new webpack.optimize.DedupePlugin(),
				// ---
				new webpack.optimize.UglifyJsPlugin({
					mangle: { screw_ie8: true },
					compress: { screw_ie8: true }
				})
			);
		}

		if (options.watch) {
			webpackConfig.watch = true;

			webpackConfig.stats.reasons = true;
			webpackConfig.stats.modules = true;
		}

		webpackConfig.plugins = plugins;
		webpackConfig.target = options.target;

		return webpackConfig;
	};
};
