const fs = require('fs');
const path = require('path');

const babel = require('babel');

const babelHelpers = babel.buildExternalHelpers();

module.exports = function(gulp, config) {

	gulp.task('build:vendor:babel', (callback) => {
		fs.writeFile(
			path.resolve(config.paths.vendor.root, 'babel-helpers.js'),
			babelHelpers,
			{ },
			callback
		);
	});

};
