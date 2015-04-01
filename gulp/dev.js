var gulp = require('gulp');
var gulpTodos = require('gulp-todo');

gulp.task('todo', function() {
	return gulp.src([
			'src/**/*.*(js|jsx)',
			'gulp/*.js',
			'test/**/*.js',
			'!src/vendor/*'
		])
		.pipe(gulpTodos())
		.pipe(gulp.dest('./'));
});
