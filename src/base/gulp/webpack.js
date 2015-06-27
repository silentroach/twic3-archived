const _ = require('lodash');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(gulp, config) {

	const autoprefixerOptions = {
		'browsers': 'Chrome >= 40'
	};

	const babelOptions = {
		loose: 'all',
		externalHelpers: true,
		cacheDirectory: true,
		blacklist: ['useStrict', 'es6.constants'],
		optional: ['utility.inlineEnvironmentVariables'],
		plugins: []
	};

	if (config.production) {
		babelOptions.plugins.push('remove-console', 'remove-debugger');
	} else {
		babelOptions.optional.push('validation.react');
	}

	const baseWebpackConfig = {
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
							'css-loader?sourceMap',
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

		webpackConfig.plugins = plugins;
		webpackConfig.target = options.target;

		return webpackConfig;
	};
};
