const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

module.exports = function(gulp, config) {

	gulp.task('build:vendor:contributors', function(callback) {
		childProcess.exec('git shortlog -sne < /dev/tty', function(error, stdout) {
			if (!error) {
				const contributors = [ ];

				stdout
					.replace(/^\s+|\s+$/g, '')
					.split('\n')
					.forEach(function(str) {
						const matches = str.split('\t')[1].match(/(.*?) <(.*?)>/);

						contributors.push({
							name: matches[1],
							email: matches[2]
						});
					} );

				fs.writeFile(
					path.resolve(config.paths.vendor.root, 'contributors.js'),
					'export default ' + JSON.stringify(contributors, null, 2) + ';',
					{},
					callback
				);
			} else {
				throw error;
			}
		});
	});

};
