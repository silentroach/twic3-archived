var gulp = require('gulp');
var childProcess = require('child_process');

gulp.task('phantom:rasterize', function(callback) {
	console.log('generating raster icons...');

	childProcess.exec('phantomjs dev/rasterize.js', function(error, stdout) {
		if (error) {
			throw error;
		}

		console.log(stdout);
	});
});

gulp.task('phantom', gulp.parallel('phantom:rasterize'));
