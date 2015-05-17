import path from 'path';

const babelConfig = JSON.stringify({
	optional: 'runtime',
	stage: 1
});

export default {
	colors: true,
	frameworks: ['mocha', 'sinon-chai'],
	singleRun: true,
	files: [
		'karma.config.js',
		'karma/**/*.js',
		'karma/**/*.jsx',
		'unit/**/*.js'
	],
	preprocessors: {
		'karma/**/*.js': 'webpack',
		'karma/**/*.jsx': 'webpack',
		'unit/**/*.js': 'webpack'
	},
	webpack: {
		cache: true,
		resolve: {
			extensions: ['', '.js', '.jsx', '.styl']
		},
		module: {
			preLoaders: [
				{
					test: /\.(js|jsx)$/,
					include: path.resolve('test/karma/'),
					loader: 'babel?' + babelConfig
				},
				{
					test: /\.(js|jsx)$/,
					include: path.resolve('test/unit/'),
					loader: 'babel?' + babelConfig
				},
				{
					test: /\.(js|jsx)$/,
					include: path.resolve('src/'),
					loader: 'babel?' + babelConfig
				},
				{
					test: /\.styl$/,
					loader: 'css-loader!stylus'
				}
			]
		}
	},
	webpackMiddleware: {
		noInfo: true,
		quiet: true
	}
};
