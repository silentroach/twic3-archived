import twitterText from '../../../vendor/twitter-text';

function processText(text, mentionEntities = []) {
	if (!Array.isArray(mentionEntities)) {
		return text;
	}

	const entities = { };

	mentionEntities.forEach(entity => {
		const screenName = entity.screen_name.toLowerCase();
		const element = document.createElement('a');
		element.href = `#users/${entity.id_str}`;
		element.className = 'tweet-mention';
		element.title = entity.name;

		// screen name must be case insensitive, so we just store the node
		// and add name after while replacing
		entities[screenName] = element;
	});

	text = text.replace(
		twitterText.mention,
		function(match, before, sign, name) {
			const screenName = name.toLowerCase();

			if (undefined === entities[screenName]) {
				return match;
			}

			const node = entities[screenName].cloneNode();
			node.innerText = `@${name}`;

			return `${before}${node.outerHTML}`;
		}
	);

	return text;
}

export default {
	processText: processText
};
