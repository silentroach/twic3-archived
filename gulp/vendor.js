const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const gulp = require('gulp');
const gulpSVG = require('gulp-svg-sprite');

const buildPath = path.resolve(__dirname, '../src/base/vendor');

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

gulp.task('vendor:icons-other', function() {
	return renderSVGSprite([
		'ei-retweet.svg',
		'ei-check.svg',
		'ei-lock.svg'
	], 'src/base/vendor/evil-icons');
});

gulp.task(
	'vendor:icons',
	gulp.parallel('vendor:icons-other')
);

gulp.task(
	'vendor',
	gulp.parallel(
		'vendor:icons',
		'vendor:contributors'
	)
);
