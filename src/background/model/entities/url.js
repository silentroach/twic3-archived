function processText(text, urlEntities) {
	if (!Array.isArray(urlEntities)) {
		return text;
	}

	urlEntities.forEach(entity => {
		const element = document.createElement('a');
		element.href = entity.url;
		element.innerHTML = entity.display_url;
		element.title = entity.expanded_url;
		element.target = '_blank';

		const html = element.outerHTML;

		text = text.replace(entity.url, html);
	});

	return text;
}

export default {
	processText: processText
};
