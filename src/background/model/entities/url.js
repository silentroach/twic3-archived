import twitterText from '../../../vendor/twitter-text';

function processText(text, urlEntities) {
	if (!Array.isArray(urlEntities)) {
		return text;
	}

	const entities = { };

	urlEntities.forEach(entity => {
		const element = document.createElement('a');
		element.href = entity.url;
		element.className = 'tweet-url';
		element.innerText = entity.display_url;
		element.title = entity.expanded_url;
		element.target = '_blank';

		entities[entity.url] = element.outerHTML;
	});

	text = text.replace(
		twitterText.url,
		function(match, all, before, url, protocol, domain, path, query) {
			if (undefined === entities[url]) {
				return all;
			}

			return `${before}${entities[url]}`;
		}
	);

	return text;
}

export default {
	processText: processText
};
