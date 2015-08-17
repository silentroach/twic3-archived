const gulpTodos = require('gulp-todo');
const through = require('through2');

module.exports = function(gulp, config) {

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

};
