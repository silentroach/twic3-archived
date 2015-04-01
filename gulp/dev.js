var gulp = require('gulp');
var gulpTodos = require('gulp-todo');
var through = require('through2');

gulp.task('todo', function() {
	return gulp.src([
		'src/**/*.*(js|jsx)',
		'gulp/*.js',
		'test/**/*.js',
		'!src/vendor/*'
	])
	.pipe(gulpTodos({
		reporter: 'table'
	}))
	.pipe(through.obj(function(file, enc, callback) {
		console.log(file.contents.toString());
		callback();
	}));
});
