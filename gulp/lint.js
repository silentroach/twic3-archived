var gulp = require('gulp');
var gulpEslint = require('gulp-eslint');

gulp.task('lint', function() {
	return gulp.src([
			'src/**/*.*(js|jsx)',
			'gulp/*.js',
			'test/**/*.js',
			'!src/vendor/*'
		])
		.pipe(gulpEslint())
		.pipe(gulpEslint.format())
		.pipe(gulpEslint.failAfterError());
});
