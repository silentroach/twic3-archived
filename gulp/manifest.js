var path = require('path');
var fs = require('fs');

var _ = require('lodash');
var gulp = require('gulp');

var packageInfo = require('../package.json');

gulp.task('manifest', function(callback) {
	var targetPath = path.resolve(__dirname, '../build/manifest.json');

	/*eslint camelcase: 0*/
	var manifest = {
		manifest_version: 2,
		name: _.capitalize(packageInfo.name),
		version: packageInfo.version,
		minimum_chrome_version: '40',
		description: '__MSG_manifest_description__',
		default_locale: 'en',
		author: packageInfo.author,
		icons: {
			16: 'images/app.16.png',
			48: 'images/app.48.png',
			128: 'images/app.128.png'
		},
		browser_action: {
			default_icon: {
				19: 'images/toolbar.png',
				38: 'images/toolbar@2x.png'
			},
			default_popup: 'popup/index.html'
		},
		background: {
			scripts: [
				'background.js'
			]
		},
		content_scripts: [
			{
				matches: [
					'https://api.twitter.com/oauth/authorize'
				],
				js: [
					'content/auth/index.js'
				],
				css: [
					'content/auth/index.css'
				]
			}
		],
		options_ui: {
			page: 'options/index.html',
			chrome_style: true,
			open_in_tab: true // temporary
		},
		permissions: [
			'storage',

			'https://api.twitter.com/1.1/*',
			'https://userstream.twitter.com/1.1/*',
			'https://twitter.com/oauth/*'
		]
	};

	fs.writeFile(targetPath, JSON.stringify(manifest, null, '  '), {}, callback);
});
