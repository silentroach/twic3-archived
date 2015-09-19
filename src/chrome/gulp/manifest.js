const fs = require('fs');
const path = require('path');

module.exports = (gulp, config) => {

	gulp.task('build:chrome:manifest', callback => {
		/*eslint camelcase: 0*/
		const manifest = {
			manifest_version: 2,
			name: config.package.name,
			version: config.package.version,
			minimum_chrome_version: '40',
			description: '__MSG_manifest_description__',
			default_locale: 'en',
			author: config.package.author,
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
					'vendor.js',
					'background.js'
				]
			},
			permissions: [
				'storage',
				'identity',

				'https://api.twitter.com/1.1/*',
				'https://userstream.twitter.com/1.1/*',
				'https://twitter.com/oauth/*'
			]
		};

		fs.writeFile(
			path.resolve(config.paths.build.chrome, 'manifest.json'),
			JSON.stringify(manifest, null, '  '),
			{},
			callback
		);
	});

	gulp.task('watch:chrome:manifest', () => {
		gulp.watch(__filename, gulp.task('build:chrome:manifest'));
	});

};
