'use strict';

var path = require('path');
var fs = require('fs');

var _ = require('lodash');
var twitterText = require('twitter-text');

var path = path.resolve(__dirname, '../vendor/compiled/twitter-text.js');

var content = [
	'/**',
	' * @preserve Many thanks to Twitter for their Twitter Text project',
	' *   https://github.com/twitter/twitter-text-js',
	' */',
	'twic.regexp = { };'
];

_.forEach({
	url: 'extractUrl',
	hash: 'validHashtag',
	mention: 'validMentionOrList'
}, function(twitterTextRegexpName, regexpName) {
	var regexp = twitterText.regexen[twitterTextRegexpName];

	if (undefined === regexp) {
		throw new Error('Failed to find regexp ' + twitterTextRegexpName);
	}

	content.push(
		'twic.regexp.' + regexpName + ' = ' + regexp + ';'
	);
} );

fs.writeFileSync(path, content.join('\n'));
