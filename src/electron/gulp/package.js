const path = require('path');
const fs = require('fs');

module.exports = function(gulp, config) {

	gulp.task('build:electron:package', function(callback) {
		const targetPath = path.resolve(config.paths.build.electron, 'package.json');

		const appInfo = {
			productName: config.package.name,
			version: config.package.version,
			main: 'application.js'
		};

		fs.writeFile(targetPath, JSON.stringify(appInfo, null, '  '), {}, callback);
	});

};
