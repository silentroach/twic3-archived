var gulp = require('gulp');
var gulpEslint = require('gulp-eslint');

gulp.task('lint', function() {
	gulp.src('src/background/*.js')
		.pipe(gulpEslint({
			// @todo wait for normal es6 support
		}))
		.pipe(gulpEslint.format());
});
