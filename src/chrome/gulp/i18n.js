const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const mkdirp = require('mkdirp');

module.exports = function(gulp, config) {

	const localesPath = path.resolve(config.paths.build.chrome, '_locales');

	gulp.task('build:chrome:i18n:mkdir', function(callback) {
		mkdirp(localesPath, callback);
	});

	gulp.task('build:chrome:i18n:generate', function(callback) {
		const translations = require(path.resolve(config.paths.src, 'chrome/i18n'));
		const parsed = { };

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

					if (Array.isArray(value)) {
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

		Promise.all(
			_.map(parsed, function(values, key) {
				return new Promise(function(resolve) {
					const localePath = path.resolve(localesPath, key);

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

};

