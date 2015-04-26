import twitterText from '../../vendor/twitter-text';

// @todo inherit from url entities?

function processText(text, mediaEntities = []) {
	if (!Array.isArray(mediaEntities)) {
		return text;
	}

	const entities = { };

	function getLinkText(url, text, title) {
		const element = document.createElement('a');
		element.href = url;
		element.className = 'tweet-link-media';
		element.innerText = text;
		element.title = title;
		element.target = '_blank';

		return element.outerHTML;
	}

	mediaEntities.forEach(entity => {
		// only photo is supported by twitter now
		if ('photo' !== entity.type) {
			console.error('Unknown media type ' + entity.type);
			return;
		}

		const url = entity.url.toLowerCase();

		entities[url] = getLinkText(
			entity.url,
			entity.display_url,
			entity.expanded_url
		);
	});

	text = text.replace(
		twitterText.url,
		function(match, all, before, url, protocol, domain, path, query) {
			const urlNormalized = url.toLowerCase();
			let linkText;

			if (undefined === entities[urlNormalized]) {
				return match;
			}

			return `${before}${entities[urlNormalized]}`;
		}
	);

	return text;
}

export default {
	processText: processText
};
