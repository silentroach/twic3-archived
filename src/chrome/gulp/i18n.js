const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const mkdirp = require('mkdirp');

module.exports = function(gulp, config) {

	const targetPath = path.resolve(config.paths.build.chrome, '_locales');

	const sourcePath = path.resolve(config.paths.src, 'chrome/i18n');
	const sourceBasePath = path.resolve(config.paths.src, 'base/i18n');

	gulp.task('build:chrome:i18n:mkdir', function(callback) {
		mkdirp(targetPath, callback);
	});

	gulp.task('build:chrome:i18n:generate', function(callback) {
		const translations = require(path.resolve(sourcePath, 'index.js'));
		const parsed = { };

		function parse(inputData, prefix) {
			_.forEach(inputData, function(value, key) {
				let data;

				if (_.isPlainObject(value)) {
					parse(value, [prefix, key].filter(function(val) {
						return undefined !== val;
					}).join('_'));
				} else {
					if (undefined === parsed[key]) {
						parsed[key] = { };
					}

					if (Array.isArray(value)) {
						data = {
							message: value[0],
							placeholders: { }
						};

						_.forEach(value[1], function(val, valueKey) {
							data.placeholders[valueKey] = {
								content: val
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

		Promise.all(
			_.map(parsed, function(values, key) {
				return new Promise(function(resolve) {
					const localePath = path.resolve(targetPath, key);

					mkdirp(localePath, function() {
						fs.writeFile(
							path.resolve(localePath, 'messages.json'),
							JSON.stringify(values, null, '\t'),
							{ },
							function() {
								resolve();
							}
						);
					});
				});
			})
		).then(function() {
			callback();
		}).catch(callback);
	});

	gulp.task(
		'build:chrome:i18n',
		gulp.series(
			'build:chrome:i18n:mkdir',
			'build:chrome:i18n:generate'
		)
	);

	gulp.task('watch:chrome:i18n', function() {
		return gulp.watch([
			path.resolve(sourcePath, './**/*.js'),
			path.resolve(sourceBasePath, './**/*.js'),
			__filename
		], gulp.task('build:chrome:i18n:generate'));
	});

};

