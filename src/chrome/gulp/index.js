const mkdirp = require('mkdirp');
const path = require('path');

module.exports = function(gulp, config) {

	config.paths.build.chrome = path.resolve(config.paths.build.root, 'chrome');

	// ---

	require('./manifest')(gulp, config);
	require('./icons')(gulp, config);
	require('./i18n')(gulp, config);
	require('./background')(gulp, config);

	// ---

	gulp.task('build:chrome:mkdirp', function(callback) {
		mkdirp(config.paths.build.chrome, callback);
	});

	gulp.task(
		'build:chrome',
		gulp.series(
			'build:chrome:mkdirp',
			gulp.parallel(
				'build:chrome:icons',
				'build:chrome:manifest',
				'build:chrome:i18n',
				'build:chrome:background'
			)
		)
	);

};
