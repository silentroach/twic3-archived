import twitterText from '../../../vendor/twitter-text';

function processText(text, urlEntities = []) {
	if (!Array.isArray(urlEntities)) {
		return text;
	}

	const entities = { };

	function getLinkText(url, text, title) {
		const element = document.createElement('a');
		element.href = url;
		element.className = 'tweet-url';
		element.innerText = text;
		element.title = title;
		element.target = '_blank';

		return element.outerHTML;
	}

	urlEntities.forEach(entity => {
		const url = entity.url.toLowerCase();
		const element = document.createElement('a');
		element.href = entity.url;
		element.className = 'tweet-url';
		element.innerText = entity.display_url;
		element.title = entity.expanded_url;
		element.target = '_blank';

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

			if (undefined !== entities[urlNormalized]) {
				linkText = entities[urlNormalized];
			} else {
				linkText = getLinkText(
					url, url, url
				);
			}

			return `${before}${linkText}`;
		}
	);

	return text;
}

export default {
	processText: processText
};
