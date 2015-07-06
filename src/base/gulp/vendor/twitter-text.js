const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const twitterText = require('twitter-text');
const jsStringEscape = require('js-string-escape');

module.exports = function(gulp, config) {

	gulp.task('build:vendor:twitter-text', function(callback) {
		const content = [
			'/**',
			' * @preserve Many thanks to Twitter for their Twitter Text project',
			' *   https://github.com/twitter/twitter-text-js',
			' */',
			'const regexps = { };'
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

		fs.writeFile(
			path.resolve(config.paths.vendor.root, 'twitter-text.js'),
			content.join('\n'),
			{},
			callback
		);
	});

};
