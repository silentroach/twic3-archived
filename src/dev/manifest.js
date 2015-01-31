'use strict';

var _ = require('lodash');

var path = require('path');
var fs = require('fs');

var packageInfo  = require('../../package.json');

var path = path.resolve(__dirname, '../../build/manifest.json');

var manifest = {
	manifest_version: 2,
	name: _.capitalize(packageInfo.name),
	version: packageInfo.version,
	//description: '__MSG_manifest_description__'
	author: packageInfo.author,
	permissions: [
		'storage'
	]
};

fs.writeFileSync(path, JSON.stringify(manifest, null, '  '));
