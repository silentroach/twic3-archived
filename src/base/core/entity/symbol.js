import Entity from './';

/** example input:

indices: [8, 13],
text: "appl"
*/

export default class EntitySymbol extends Entity {
	constructor(indices, text) {
		super(indices);

		this.text = text;
	}

	static parse(data) {
		return new EntitySymbol(
			data.indices,
			data.text
		);
	}

	render() {
		const element = document.createElement('span');
		element.className = 'tweet-link-symbol';
		element.innerText = `$${this.text}`;

		return element.outerHTML;
	}
}
