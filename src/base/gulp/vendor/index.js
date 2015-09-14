const path = require('path');

module.exports = function(gulp, config) {

	config.paths.vendor = {
		root: path.resolve(config.paths.src, 'base/vendor')
	};

	// ---
	require('./icons')(gulp, config);
	require('./babel')(gulp, config);
	require('./contributors')(gulp, config);
	require('./moment')(gulp, config);
	// ---

	gulp.task(
		'build:vendor',
		gulp.parallel(
			'build:vendor:moment',
			'build:vendor:icons',
			'build:vendor:babel',
			'build:vendor:contributors'
		)
	);

};
