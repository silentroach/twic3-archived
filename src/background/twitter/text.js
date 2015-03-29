import twitterTextRegexps from '../../vendor/twitter-text';

const utils = { };

utils.extractUrls = function(text) {
	var urls = [];

	text.replace(twitterTextRegexps.url, function(match, all, before, url, protocol, domain, path, query) {
		urls.push(url);
	});

	return urls;
};

export default utils;
