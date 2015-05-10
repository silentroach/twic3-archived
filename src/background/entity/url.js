import Entity from './';

/** example input:

display_url: "soundcloud.com/hwls/elizabeth…"
expanded_url: "https://soundcloud.com/hwls/elizabeth-rose-another-earth-hwls-remix"
indices: [54, 77]
url: "https://t.co/5emJ1w5T0F"
*/

export default class EntityUrl extends Entity {
	constructor(indices, url, displayUrl, expandedUrl) {
		super(indices);

		this.url = url;
		this.displayUrl = displayUrl;
		this.expandedUrl = expandedUrl;
	}

	static parse(data) {
		return new EntityUrl(
			data.indices,
			data.url,
			data.display_url,
			data.expanded_url
		);
	}

	render() {
		const element = document.createElement('a');
		element.href = this.url;
		element.className = 'tweet-link';
		element.innerText = this.displayUrl;
		element.title = this.expandedUrl;
		element.target = '_blank';

		return element.outerHTML;
	}
}
