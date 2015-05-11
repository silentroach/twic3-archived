import EntityMention from './entity/mention';
import EntityMedia from './entity/media';
import EntityUrl from './entity/url';
import EntityHashtag from './entity/hashtag';

const MAP_FIELD = Symbol('map');

export default class Entities {
	constructor() {
		this[MAP_FIELD] = { };
	}

	/** @private */ parseData(entityList, typeClass) {
		if (!Array.isArray(entityList)) {
			return this;
		}

		entityList.forEach(entityData => {
			const entity = typeClass.parse(entityData);
			const startPos = entity.indices[0];

			this[MAP_FIELD][startPos] = entity;
		});

		return this;
	}

	parseMentions(entityList) {
		return this.parseData(entityList, EntityMention);
	}

	parseMedia(entityList) {
		return this.parseData(entityList, EntityMedia);
	}

	parseUrls(entityList) {
		return this.parseData(entityList, EntityUrl);
	}

	parseHashtags(entityList) {
		return this.parseData(entityList, EntityHashtag);
	}

	/** @private */ processTextByEntity(text, entity) {
		const indices = entity.indices;

		return [
			text.substr(0, indices[0]),
			entity.render(),
			text.substr(indices[1])
		].join('');
	}

	processText(input) {
		const self = this;
		const entitiesPos = Object
			.keys(this[MAP_FIELD])
			.map(Number)
			.sort(function(a, b) {
				// reversing for correct replacement order
				return b - a;
			});

		let pos;
		let output = input;

		entitiesPos.forEach(function(pos) {
			output = self.processTextByEntity(
				output,
				self[MAP_FIELD][pos]
			);
		});

		return output;
	}
}
