var gulp = require('gulp');
var gulpEslint = require('gulp-eslint');

gulp.task('lint', function() {
	return gulp.src('src/background/*.js')
		.pipe(gulpEslint())
		.pipe(gulpEslint.format())
		.pipe(gulpEslint.failAfterError());
});
