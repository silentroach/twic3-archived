require('babel/register');

const path = require('path');
const gulp = require('gulp');
const config = {
	paths: { },
	production: 'production' === process.env.NODE_ENV,
	package: require('./package.json')
};

config.paths.root = path.resolve(__dirname);
config.paths.src  = path.resolve(__dirname, 'src');

require('./src/base/gulp')(gulp, config);
require('./src/chrome/gulp')(gulp, config);
require('./src/electron/gulp')(gulp, config);

gulp.task(
	'build',
	gulp.series(
		'build:base',
		gulp.parallel(
			'build:chrome',
			'build:electron'
		)
	)
);
