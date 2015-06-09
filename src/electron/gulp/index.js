const mkdirp = require('mkdirp');
const path = require('path');

module.exports = function(gulp, config) {

	config.paths.build.electron = path.resolve(config.paths.build.root, 'electron');

	// ---

	require('./package')(gulp, config);

	// ---

	gulp.task('build:electron:mkdirp', function(callback) {
		mkdirp(config.paths.build.electron, callback);
	});

	gulp.task(
		'build:electron',
		gulp.series(
			'build:electron:mkdirp',
			'build:electron:package'
		)
	);

};
