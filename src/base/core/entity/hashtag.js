import Entity from './';

/** example input:

indices: [35, 40]
text: "Ikea"
*/

export default class EntityHashtag extends Entity {
	constructor(indices, text) {
		super(indices);

		this.text = text;
	}

	static parse(data) {
		return new EntityHashtag(
			data.indices,
			data.text
		);
	}

	render() {
		const element = document.createElement('span');
		element.className = 'tweet-link-hashtag';
		element.innerText = `#${this.text}`;

		return element.outerHTML;
	}
}
