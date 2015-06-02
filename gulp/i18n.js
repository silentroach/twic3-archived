const path = require('path');

const _ = require('lodash');
const gulp = require('gulp');
const gutil = require('gulp-util');
const through = require('through2');

gulp.task('i18n', function(callback) {
	return gulp.src('src/common/i18n/index.js', { read: false })
		.pipe(through.obj(function(file) {
			var translations = require(file.path);
			var filepath = path.dirname(file.path);
			var parsed = { };
			var self = this;

			function parse(data, prefix) {
				_.forEach(data, function(value, key) {
					var data;

					if (_.isPlainObject(value)) {
						parse(value, [prefix, key].filter(function(val) {
							return undefined !== val;
						}).join('_'));
					} else {
						if (undefined === parsed[key]) {
							parsed[key] = { };
						}

						if (_.isArray(value)) {
							data = {
								message: value[0],
								placeholders: { }
							};

							_.forEach(value[1], function(value, key) {
								data.placeholders[key] = {
									content: value
								};
							});
						} else {
							data = {
								message: value
							};
						}

						parsed[key][prefix] = data;
					}
				});
			}

			parse(translations);

			_.forEach(parsed, function(values, key) {
				var filename = path.resolve(filepath, key, 'messages.json');

				gutil.log(
					gutil.colors.cyan(path.relative(filepath, filename)) + ':',
					Object.keys(values).length, 'messages'
				);

				self.push(
					new gutil.File({
						base: filepath,
						path: filename,
						contents: new Buffer(JSON.stringify(values, null, '  '))
					})
				);
			});
		}))
		.pipe(gulp.dest('build/_locales'));
});

gulp.task('i18n:watch', function() {
	gulp.watch('src/common/i18n/**/*.js', gulp.series('i18n'));
});
