import EntityMention from './entity/mention';
import EntityMedia from './entity/media';
import EntityUrl from './entity/url';
import EntityHashtag from './entity/hashtag';

import objectMerge from 'lodash/object/merge';

const MAP_FIELD = Symbol('map');
const COUNTERS_FIELD = Symbol('counters');

const TYPE_MENTION = 'mention';
const TYPE_MEDIA = 'media';
const TYPE_HASH = 'hash';
const TYPE_URL = 'url';

const TYPES_MAP = {
	[TYPE_MENTION]: EntityMention,
	[TYPE_MEDIA]: EntityMedia,
	[TYPE_HASH]: EntityHashtag,
	[TYPE_URL]: EntityUrl
};

export default class Entities {
	constructor() {
		this[MAP_FIELD] = { };
		this[COUNTERS_FIELD] = { };
	}

	/** @private */ parseData(entityList, type) {
		const TypeClass = TYPES_MAP[type];
		let changedCount = 0;

		if (!Array.isArray(entityList)) {
			return changedCount;
		}

		entityList.forEach(entityData => {
			const entity = TypeClass.parse(entityData);
			const startIdx = entity.indices[0];

			if (entity) {
				if (undefined === this[MAP_FIELD][startIdx]) {
					++changedCount;
				}

				this[MAP_FIELD][startIdx] = entity;
			}
		});

		if (changedCount) {
			this[COUNTERS_FIELD][type] = (this[COUNTERS_FIELD][type] || 0) + changedCount;
		}

		return this;
	}

	parseMentions(entityList) {
		return this.parseData(entityList, TYPE_MENTION);
	}

	parseMedia(entityList) {
		return this.parseData(entityList, TYPE_MEDIA);
	}

	parseUrls(entityList) {
		return this.parseData(entityList, TYPE_URL);
	}

	parseHashtags(entityList) {
		return this.parseData(entityList, TYPE_HASH);
	}

	/** @private */ processTextByEntity(text, entity) {
		const indices = entity.indices;

		return [
			text.substr(0, indices[0]),
			entity.render(),
			text.substr(indices[1])
		].join('');
	}

	/** @private */ getEntitiesPositions(reversed = false) {
		return Object
			.keys(this[MAP_FIELD])
			.map(Number)
			.sort(function(a, b) {
				return reversed ? b - a : a - b;
			});
	}

	processText(input) {
		const self = this;
		const entitiesPos = this.getEntitiesPositions(true);

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
				result = objectMerge(
					result,
					additionalData,
					function(a, b) {
						if (Array.isArray(a)) {
							return a.concat(b);
						}
					}
				);
			}
		});

		if (!Object.keys(result).length) {
			result = null;
		}

		return result;
	}

	getUrlCount() {
		return this[COUNTERS_FIELD][TYPE_URL] || 0;
	}

	getHashCount() {
		return this[COUNTERS_FIELD][TYPE_HASH] || 0;
	}

	getMediaCount() {
		return this[COUNTERS_FIELD][TYPE_MEDIA] || 0;
	}

	getMentionsCount() {
		return this[COUNTERS_FIELD][TYPE_MENTION] || 0;
	}
}
