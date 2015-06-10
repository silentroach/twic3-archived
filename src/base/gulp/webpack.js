const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(gulp, config) {

	const babelOptions = {
		loose: 'all',
		externalHelpers: true,
		cacheDirectory: true
	};
	const autoprefixerOptions = JSON.stringify({
		'browsers': 'Chrome >= 40'
	});
	const webpackConfig = { };
	const plugins = [ ];

	babelOptions.blacklist = [
		'useStrict',
		'es6.constants'
	];

	babelOptions.optional = [
		'validation.react'
	];

	plugins.push(
		new ExtractTextPlugin('[name].css'),
		new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
	);

	if (config.production) {
		babelOptions.optional.push('utility.removeDebugger');

		/*eslint camelcase: 0*/
		plugins.push(
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify('production')
				}
			}),
			// ---
			new webpack.optimize.DedupePlugin(),
			// ---
			new webpack.optimize.UglifyJsPlugin(
				{
					mangle: {
						screw_ie8: true
					},
					compress: {
						screw_ie8: true
					}
				}
			)
		);
	} else {
		webpackConfig.debug = true;
		webpackConfig.devtool = '#source-map';
	}

	webpackConfig.module = {
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
					`css-loader?sourceMap!autoprefixer-loader?${autoprefixerOptions}!stylus-loader`
				)
			}
		]
	};

	// ---

	webpackConfig.plugins = plugins;

	config.webpack = webpackConfig;

};
