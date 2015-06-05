const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const _ = require('lodash');
const jsStringEscape = require('js-string-escape');
const gulp = require('gulp');
const gulpSVG = require('gulp-svg-sprite');

const twitterText = require('twitter-text');

const buildPath = path.resolve(__dirname, '../src/base/vendor');

gulp.task('vendor:babel-helpers', function(callback) {
	var targetPath = path.resolve(buildPath, './babel-helpers.js');
	var helpers = require('babel').buildExternalHelpers();

	fs.writeFile(targetPath, helpers, {}, callback);
});

gulp.task('vendor:twitter-text', function(callback) {
	var targetPath = path.resolve(buildPath, './twitter-text.js');

	var content = [
		'/**',
		' * @preserve Many thanks to Twitter for their Twitter Text project',
		' *   https://github.com/twitter/twitter-text-js',
		' */',
		'var regexps = { };'
	];

	_.forEach({
		url: 'extractUrl',
		hash: 'validHashtag',
		mention: 'validMentionOrList'
	}, function(twitterTextRegexpName, regexpName) {
		const regexp = twitterText.regexen[twitterTextRegexpName];

		if (undefined === regexp) {
			throw new Error('Failed to find regexp ' + twitterTextRegexpName);
		}

		const escaped = jsStringEscape(regexp);
		const parts = escaped.match(/\/(.*)\/([^\/]*)/);

		content.push(
			'regexps.' + regexpName + ' = new RegExp("' + parts[1] + '", "' + parts[2] + '");'
		);
	} );

	content.push('export default regexps;');

	fs.writeFile(targetPath, content.join('\n'), {}, callback);
});

gulp.task('vendor:contributors', function(callback) {
	var targetPath = path.resolve(buildPath, './contributors.js');

	childProcess.exec('git shortlog -sne < /dev/tty', function(error, stdout) {
		if (!error) {
			var contributors = [ ];

			stdout
				.replace(/^\s+|\s+$/g, '')
				.split('\n')
				.forEach(function(str) {
					var matches = str.split('\t')[1].match(/(.*?) <(.*?)>/);

					contributors.push({
						name: matches[1],
						email: matches[2]
					});
				} );

			fs.writeFile(
				targetPath,
				'var contributors = ' + JSON.stringify(contributors) + ';\nexport default contributors;',
				{},
				callback
			);
		} else {
			throw error;
		}
	});
});

gulp.task('vendor:icons-map', function() {
	const paths = [
		'ei-location.svg'
	].map(path => 'node_modules/evil-icons/assets/icons/' + path);

	return gulp.src(paths)
		.pipe(gulpSVG({
			mode: {
				css: {
					prefix: '.%s',
					sprite: 'sprite.svg',
					dest: '',
					bust: false,
					render: {
						styl: true
					}
				}
			}
		}))
		.pipe(gulp.dest('src/base/ui/map/vendor'));
});

gulp.task('vendor:icons-other', function() {
	const paths = [
		'ei-retweet.svg',
		'ei-check.svg',
		'ei-lock.svg',
		'ei-spinner.svg'
	].map(path => 'node_modules/evil-icons/assets/icons/' + path);

	return gulp.src(paths)
		.pipe(gulpSVG({
			mode: {
				css: {
					prefix: '.%s',
					sprite: 'sprite.svg',
					dest: '',
					bust: false,
					render: {
						styl: true
					}
				}
			}
		}))
		.pipe(gulp.dest('src/base/vendor/evil-icons'));
});

gulp.task(
	'vendor:icons',
	gulp.parallel('vendor:icons-map', 'vendor:icons-other')
);

gulp.task(
	'vendor',
	gulp.parallel(
		'vendor:babel-helpers',
		'vendor:twitter-text',
		'vendor:icons',
		'vendor:contributors'
	)
);
