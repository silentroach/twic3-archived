const path = require('path');

const gulpSVG = require('gulp-svg-sprite');

module.exports = function(gulp, config) {

	function renderSVGSprite(icons, destination, filename = 'sprite.svg') {
		if (!Array.isArray(icons)) {
			icons = [icons];
		}

		return gulp
			.src(icons.map(path => 'node_modules/evil-icons/assets/icons/' + path))
			.pipe(gulpSVG({
				mode: {
					css: {
						prefix: '.%s',
						sprite: filename,
						dest: '',
						bust: false,
						render: {
							styl: true
						}
					}
				}
			}))
			.pipe(
				gulp.dest(destination)
			);
	}

	// ---

	gulp.task('build:vendor:icons-map', function() {
		return renderSVGSprite(
			'ei-location.svg',
			path.resolve(config.paths.src, 'base/ui/map/vendor')
		);
	});

	gulp.task('build:vendor:icons-loader', function() {
		return renderSVGSprite(
			'ei-spinner.svg',
			path.resolve(config.paths.src, 'base/ui/loader/vendor')
		);
	});

	gulp.task('build:vendor:icons-other', function() {
		return renderSVGSprite(
			[
				'ei-retweet.svg',
				'ei-check.svg',
				'ei-lock.svg'
			],
			path.resolve(config.paths.src, 'base/vendor/evil-icons')
		);
	});

	gulp.task(
		'build:vendor:icons',
		gulp.parallel(
			'build:vendor:icons-map',
			'build:vendor:icons-loader',
			// ---
			'build:vendor:icons-other'
		)
	);

};
