const path = require('path');

const _ = require('lodash');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const supportedBrowsers = 'Chrome >= 40';
var loaderBabel = 'babel-loader';
var loaderCSS = ['css-loader', `autoprefixer-loader?{browsers:["${supportedBrowsers}"]}`].join('!');

const webpackBasicConfig = {
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../build'),
		publicPath: '/'
	},
	module: {
		loaders: [
			{
				test: /\.js?x$/,
				exclude: /node_modules/,
				loader: loaderBabel
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract(loaderCSS)
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file?name=images/[path][name].[ext]'
				]
			},
			{
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract([loaderCSS, 'stylus-loader'].join('!'))
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('[name].css'),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(
					'production' === process.env.NODE_ENV ? 'production' : 'debug'
				)
			}
		})
	],
	resolve: {
		root: [
			path.resolve(__dirname, '../src/chrome'),
			path.resolve(__dirname, '../src/base'),
			path.resolve(__dirname, '../src/_chaos')
		],
		extensions: ['', '.js', '.jsx']
	}
};

module.exports = function(opts) {
	var options = opts || { };
	var config = _.clone(webpackBasicConfig);

	if (options.watch) {
		config.watch = true;
	}

	if (options.output) {
		config.output = options.output;
	}

	if (Array.isArray(options.plugins)) {
		_.forEach(options.plugins, function(plugin) {
			config.plugins.push(plugin);
		});
	}

	if (options.entry) {
		config.entry = options.entry;
	}

	if (options.disableDebug) {
		config.debug = false;
		config.devtool = false;
	}

	return config;
};
