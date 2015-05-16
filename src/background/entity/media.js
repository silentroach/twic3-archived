import Entity from './';

/** example input:

display_url: "pic.twitter.com/sBOkw1ynch"
expanded_url: "http://twitter.com/NASA/status/595375103510192129/photo/1"
id: 595375103417921500
id_str: "595375103417921536"
indices: [122, 140]
media_url: "http://pbs.twimg.com/media/CEMygItWMAAp1Uk.jpg"
media_url_https: "https://pbs.twimg.com/media/CEMygItWMAAp1Uk.jpg"
sizes: {
	large:  { h: 786 w: 1024 resize: "fit"  }
	medium: { h: 460 w: 600  resize: "fit"  }
	small:  { h: 260 w: 340  resize: "fit"  }
	thumb:  { h: 150 w: 150  resize: "crop" }
}
source_status_id: 595375103510192100
source_status_id_str: "595375103510192129"
source_user_id: 11348282
source_user_id_str: "11348282"
type: "photo"
url: "http://t.co/sBOkw1ynch"
*/

export default class EntityMedia extends Entity {
	constructor(indices, url, imageUrl, sizes, type) {
		super(indices);

		this.url = url;
		this.imageUrl = imageUrl;
		this.type = type;

		this.sizes = { };

		for (let key of Object.keys(sizes)) {
			let info = sizes[key];
			this.sizes[key] = [info.w, info.h];
		}
	}

	static parse(data) {
		const type = data.type;

		switch (type) {
			case 'photo':
			case 'animated_gif':
			case 'video':
				break;
			default:
				console.warn(
					'unknown media entity type',
					type,
					data
				);
				return null;
		}

		return new EntityMedia(
			data.indices,
			data.url,
			data.media_url_https,
			data.sizes,
			type
		);
	}

	render() {
		const element = document.createElement('a');
		element.href = this.url;
		element.className = 'tweet-link-media';
		element.target = '_blank';

		return element.outerHTML;
	}

	getAdditionalData() {
		return {
			gallery: [
				{
					url: this.imageUrl,
					sizes: this.sizes,
					type: this.type
				}
			]
		};
	}
}
