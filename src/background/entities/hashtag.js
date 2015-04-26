import twitterText from '../../vendor/twitter-text';

function processText(text, hashTagEntities) {
	if (!Array.isArray(hashTagEntities)) {
		return text;
	}

	const entities = { };

	hashTagEntities.forEach(entity => {
		const hashtag = entity.text.toLowerCase();
		const element = document.createElement('span');
		element.className = 'tweet-link-hashtag';

		// hashtag name must be case insensitive, so we just store the node
		// and add name after while replacing
		entities[hashtag] = element;
	});

	text = text.replace(
		twitterText.hash,
		function(match, before, sign, hashtag) {
			const hashtagNormalized = hashtag.toLowerCase();

			if (undefined === entities[hashtagNormalized]) {
				return match;
			}

			const node = entities[hashtagNormalized].cloneNode();
			node.innerText = `${sign}${hashtag}`;

			return `${before}${node.outerHTML}`;
		}
	);

	return text;
}

export default {
	processText: processText
};
