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

	gulp.task(
		'build:vendor:icons',
		gulp.parallel(
			'build:vendor:icons-map',
			'build:vendor:icons-loader'
		)
	);

};
