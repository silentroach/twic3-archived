const fs = require('fs');
const path = require('path');
const phantom = require('phantom');

const _ = require('lodash');
const gutil = require('gulp-util');

module.exports = (gulp, config) => {

	const imagesPath = path.resolve(config.paths.src, 'base/client/images');
	const targetPath = path.resolve(config.paths.build.chrome, 'images');

	const images = {
		[path.resolve(imagesPath, 'toolbar/default.svg')]: {
			// toolbar icons
			[path.resolve(targetPath, 'toolbar@2x.png')]: {
				size: { width: 38, height: 38 }
			},
			[path.resolve(targetPath, 'toolbar.png')]: {
				size: { width: 19, height: 19 },
				zoom: 19 / 38
			},

			// application icons
			[path.resolve(targetPath, 'app.16.png')]: {
				size: { width: 16, height: 16 },
				zoom: 16 / 38
			},
			[path.resolve(targetPath, 'app.48.png')]: {
				size: { width: 48, height: 48 },
				zoom: 48 / 38
			},
			[path.resolve(targetPath, 'app.128.png')]: {
				size: { width: 128, height: 128 },
				zoom: 128 / 38
			}
		},

		// disconnected toolbar icons
		[path.resolve(imagesPath, 'toolbar/disconnected.svg')]: {
			[path.resolve(targetPath, 'toolbar.disconnected@2x.png')]: {
				size: { width: 38, height: 38 }
			},
			[path.resolve(targetPath, 'toolbar.disconnected.png')]: {
				size: { width: 19, height: 19 },
				zoom: 19 / 38
			}
		}
	};

	function render(sourcePath, renderPath, settings) {
		return new Promise(resolve => {
			gutil.log(
				gutil.colors.magenta(
					'[src]/' + path.relative(config.paths.src, sourcePath)
				),
				'->',
				gutil.colors.yellow(
					'[build:chrome]/' + path.relative(config.paths.build.chrome, renderPath)
				)
			);

			if (!fs.existsSync(sourcePath)) {
				throw new Error('File ' + sourcePath + ' not found');
			}

			phantom.create(function(phantomInstance) {
				phantomInstance.createPage(function(page) {
					page.open(sourcePath, function(status) {
						const clipRect = _.clone(settings.size);
						clipRect.left = 0;
						clipRect.top = 0;

						page.set('viewportSize', settings.size);
						page.set('clipRect', clipRect);
						page.set('zoomFactor', settings.zoom ? settings.zoom : 1);

						page.render(renderPath, function() {
							phantomInstance.exit();
							resolve();
						});
					});
				});
			});
		});
	}

	gulp.task('build:chrome:icons', callback => {
		Promise.all(
			_.map(images, (target, sourceImage) => {
				return Promise.all(
					_.map(target, (settings, targetFilePath) => {
						return render(sourceImage, targetFilePath, settings);
					})
				);
			})
		)
		.then(callback)
		.catch(callback);
	});

};
