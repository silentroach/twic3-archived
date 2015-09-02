import urlRegexp from 'twitter-regexps/url';

import instagram from './services/instagram';

export default function extractAdditionalData(url) {
	const urlParts = urlRegexp.exec(url);
	if (!urlParts) {
		return null;
	}

	const domain = urlParts[5];
	const path = urlParts[7];

	switch (domain) {
		case 'instagram.com':
			return instagram(path, domain, url);
		default:
			return null;
	}
}
