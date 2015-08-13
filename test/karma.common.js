import _ from 'lodash';
import path from 'path';

const babelConfig = {
	optional: 'runtime',
	stage: 0,
	loose: 'all'
};

export default {
	colors: true,
	frameworks: ['mocha', 'sinon', 'chai-as-promised', 'chai'],
	singleRun: true,
	files: [
		'karma.config.js',
		'src/**/*.js',
		'src/**/*.jsx'
	],
	preprocessors: {
		'src/**/*.js': 'webpack',
		'src/**/*.jsx': 'webpack'
	},
	reporters: ['mocha'],
	webpack: {
		cache: true,
		resolve: {
			extensions: ['', '.js', '.jsx', '.styl'],
			root: [
				path.resolve(__dirname, '../src/chrome'),
				path.resolve(__dirname, '../src/base'),
				path.resolve(__dirname, '../src/_chaos')
			]
		},
		module: {
			preLoaders: [
				{
					test: /\.jsx?$/,
					include: path.resolve('test/src/'),
					loader: 'babel?' + JSON.stringify(babelConfig)
				},
				{
					test: /\.jsx?$/,
					include: path.resolve('src'),
					loader: 'isparta',
					query: {
						noAutoWrap: false,
						babel: babelConfig
					}
				},
				{
					test: /\.js$/,
					exclude: /node_modules\/(?!@twic)/,
					include: path.resolve('node_modules'),
					loader: 'babel?' + JSON.stringify(babelConfig)
				},
				{
					test: /\.styl$/,
					loaders: ['css-loader', 'stylus']
				},
				{
					test: /\.svg$/,
					loaders: ['file-loader']
				}
			]
		}
	},
	webpackMiddleware: {
		noInfo: true,
		quiet: true
	}
};
