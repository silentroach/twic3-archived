const path = require('path');

const _ = require('lodash');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = 'production' === process.env.NODE_ENV;

var loaderBabelParams = [
	'blacklist[]=useStrict',
	'blacklist[]=es6.constants',
	// 'blacklist[]=react', // @todo broken with current babel
	'loose=all',
	'externalHelpers=true',
	'optional[]=validation.react',
	'optional[]=utility.inlineEnvironmentVariables',
	'cacheDirectory=true'
];

if (isProduction) {
	loaderBabelParams.push(
		'optional[]=utility.removeConsole',
		'optional[]=utility.removeDebugger'
	);
}

var loaderBabel = 'babel-loader?' + loaderBabelParams.join('&');
var loaderCSS = ['css-loader', 'autoprefixer-loader?{browsers:["Chrome >= 40"]}'].join('!');

const webpackBasicConfig = {
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../build'),
		publicPath: '/'
	},
	module: {
		loaders: [
			{
				test: /\.jsx$/,
				loader: ['jsx-loader?stripTypes', loaderBabel].join('!')
			},
			{
				test: /\.js$/,
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
					'file?name=images/[name].[ext]'
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
		root: path.resolve(__dirname, '../src/common'),
		extensions: ['', '.js', '.jsx']
	}
};

if (isProduction) {
	/*eslint camelcase: 0*/
	webpackBasicConfig.plugins.push(
		new webpack.optimize.DedupePlugin(),
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
	webpackBasicConfig.debug = true;
	webpackBasicConfig.devtool = '#source-map';
}

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
