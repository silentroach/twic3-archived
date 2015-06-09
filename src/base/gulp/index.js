const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

module.exports = function(gulp, config) {

	config.paths.build = {
		root: path.resolve(config.paths.root, 'build')
	};

	// ---

	require('./webpack')(gulp, config);
	require('./todo')(gulp, config);
	require('./lint')(gulp, config);
	require('./vendor')(gulp, config);

	// ---

	gulp.task('build:base:cleanup', (callback) => rimraf(config.paths.build.root, callback));

	gulp.task('build:base:mkdirp', (callback) => mkdirp(config.paths.build.root, callback));

	gulp.task(
		'build:base',
		gulp.parallel(
			'build:vendor',
			gulp.series(
				'build:base:cleanup',
				'build:base:mkdirp'
			)
		)
	);

};
