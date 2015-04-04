import path from 'path';

const babelConfig = JSON.stringify({
	optional: 'runtime',
	stage: 1
});

export default {
	colors: true,
	frameworks: ['mocha'],
	singleRun: true,
	files: [
		'karma/**/*.js',
		'karma/**/*.jsx',
	],
	preprocessors: {
		'karma/**/*.js': 'webpack',
		'karma/**/*.jsx': 'webpack'
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
}
