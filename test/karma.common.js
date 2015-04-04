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
		'karma/**/*.js'
	],
	preprocessors: {
		'karma/**/*.js': 'webpack'
	},
	webpack: {
		cache: true,
		resolve: {
			extensions: ['', '.js']
		},
		module: {
			preLoaders: [
				{
					test: /\.js$/,
					include: path.resolve('test/karma/'),
					loader: 'babel?' + babelConfig
				},
				{
					test: /\.js$/,
					include: path.resolve('src/'),
					loader: 'babel?' + babelConfig
				}
			]
		}
	},
	webpackMiddleware: {
		noInfo: true,
		quiet: true
	}
}
