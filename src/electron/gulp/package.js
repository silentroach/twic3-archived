const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const gulp = require('gulp');

const rootPath = path.resolve(__dirname, '../../../');

const packageInfo = require(path.resolve(rootPath, './package.json'));

gulp.task('build:electron:package', function(callback) {
	const targetPath = path.resolve(rootPath, 'build/electron/package.json');

	const appInfo = {
		productName: packageInfo.name,
		version: packageInfo.version,
		main: 'index.js'
	};

	fs.writeFile(targetPath, JSON.stringify(appInfo, null, '  '), {}, callback);
});

