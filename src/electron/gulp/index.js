const gulp = require('gulp');
const mkdirp = require('mkdirp');

// ---

require('./package');

// ---

gulp.task('build:electron:mkdir', function(callback) {
	mkdirp('build/electron', callback);
});

gulp.task(
	'build:electron',
	gulp.series(
		'build:electron:mkdir',
		'build:electron:package'
	)
);
