import twitterText from '../../../vendor/twitter-text';

function processText(text, mentionEntities) {
	if (!Array.isArray(mentionEntities)) {
		return text;
	}

	const entities = { };

	mentionEntities.forEach(entity => {
		const element = document.createElement('a');
		element.href = `#user/${entity.id_str}`;
		element.className = 'tweet-mention';
		element.innerText = entity.screen_name;
		element.title = entity.name;

		entities[entity.screen_name] = element.outerHTML;
	});

	console.dir(entities);

	text = text.replace(
		twitterText.mention,
		function(match, before, sign, name) {
			if (undefined === entities[name]) {
				return match;
			}

			return `${before}${entities[name]}`;
		}
	);

	return text;
}

export default {
	processText: processText
};
