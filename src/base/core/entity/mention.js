import Entity from './';

/** example input:

id: 13072452
id_str: "13072452"
indices: [3, 8]
name: "Erik Wilde"
screen_name: "dret"
*/

export default class EntityMention extends Entity {
	constructor(indices, id, name, screenName) {
		super(indices);

		this.id = id;
		this.name = name;
		this.screenName = screenName;
	}

	static parse(data) {
		return new EntityMention(
			data.indices,
			data.id_str,
			data.name,
			data.screen_name
		);
	}

	render() {
		const element = document.createElement('a');
		element.className = 'tweet-link-mention';
		element.href = `#users/${this.id}`;
		element.title = this.name;
		element.innerText = `@${this.screenName}`;

		return element.outerHTML;
	}

	getAdditionalData() {
		return {
			mentionedIds: [this.id]
		};
	}
}
