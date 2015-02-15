'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');

var webpackConfig = require('../src/webpack.config.js');
var isProduction = 'production' === process.env.NODE_ENV;
var buildPath = path.resolve(__dirname, '../build');

// webpack

console.log(chalk.green('building webpack modules...'));

webpackConfig.output.path = buildPath;
webpackConfig.output.publicPath = '/';
webpackConfig.watch = true;

if (isProduction) {
	webpackConfig.plugins.push(
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);
} else {
	webpackConfig.output.sourceMapFilename = '[file].map';
	webpackConfig.output.pathinfo = true;
}

webpack(webpackConfig, function(error, stats) {
	var statsInfo;

	if (error) {
		throw error;
	}

	statsInfo = stats.toJson();

	_.forEach({
		errors: 'red',
		warnings: 'yellow'
	}, function(color, type) {
		if (Array.isArray(statsInfo[type])
			&& statsInfo[type].length
		) {
			console.log(
				chalk[color]('Found ' + type + ':')
			);

			_.forEach(statsInfo[type], function(message) {
				console.log('  ' + message);
			});

			console.log('\n');
		}
	});
})
