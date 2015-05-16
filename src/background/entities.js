import EntityMention from './entity/mention';
import EntityMedia from './entity/media';
import EntityUrl from './entity/url';
import EntityHashtag from './entity/hashtag';

import objectAssign from 'object-assign';

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

			if (entity) {
				this[MAP_FIELD][
					entity.indices[0]
				] = entity;
			}
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

	/** @private */ getEntitiesPositions() {
		return Object
			.keys(this[MAP_FIELD])
			.map(Number)
			.sort(function(a, b) {
				// reversing for correct replacement order
				return b - a;
			});
	}

	processText(input) {
		const self = this;
		const entitiesPos = this.getEntitiesPositions();

		let output = input;

		entitiesPos.forEach(function(pos) {
			output = self.processTextByEntity(
				output,
				self[MAP_FIELD][pos]
			);
		});

		return output;
	}

	getAdditionalData() {
		const self = this;
		const entitiesPos = this.getEntitiesPositions();
		let result = { };

		entitiesPos.forEach(function(pos) {
			let additionalData = self[MAP_FIELD][pos].getAdditionalData();

			if (additionalData) {
				result = objectAssign(result, additionalData);
			}
		});

		if (!Object.keys(result).length) {
			result = null;
		}

		return result;
	}
}
