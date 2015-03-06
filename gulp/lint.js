var gulp = require('gulp');
var gulpEslint = require('gulp-eslint');

gulp.task('lint', function() {
	// waiting for eslint for es6 support
	// return gulp.src([
	// 		'src/**/*.*(js|jsx)',
	// 		'gulp/*.js',
	// 		'test/**/*.js',
	// 		'!src/vendor/*'
	// 	])
	// 	.pipe(gulpEslint())
	// 	.pipe(gulpEslint.format())
	// 	.pipe(gulpEslint.failAfterError());
});
