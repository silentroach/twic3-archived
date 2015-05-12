// import twitterTextRegexps from '../../vendor/twitter-text';

const utils = { };

// utils.extractUrls = function(text) {
// 	var urls = [];

// 	text.replace(twitterTextRegexps.url, function(match, all, before, url, protocol, domain, path, query) {
// 		urls.push(url);
// 	});

// 	return urls;
// };

utils.processLineBreaks = function(input) {
	return input
		.replace(/[\r\n]/g, '\n')
		.replace(/\n{2,}/g, '\n\n')  // convert 3+ breaks to 2
		.trim()
		.replace(/\n/g, '<br />');
};

export default utils;
