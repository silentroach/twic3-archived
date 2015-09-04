import EntityMention from './entity/mention';
import EntityMedia from './entity/media';
import EntityUrl from './entity/url';
import EntityHashtag from './entity/hashtag';
import EntitySymbol from './entity/symbol';

import objectMerge from 'lodash.merge';

const MAP_FIELD = Symbol('map');
const COUNTERS_FIELD = Symbol('counters');

const TYPE_MENTION = 'mention';
const TYPE_MEDIA = 'media';
const TYPE_HASH = 'hash';
const TYPE_URL = 'url';
const TYPE_SYMBOL = 'symbol';

const TYPES_MAP = {
	[TYPE_MENTION]: EntityMention,
	[TYPE_MEDIA]: EntityMedia,
	[TYPE_HASH]: EntityHashtag,
	[TYPE_URL]: EntityUrl,
	[TYPE_SYMBOL]: EntitySymbol
};

export default class Entities {
	constructor() {
		this[MAP_FIELD] = { };
		this[COUNTERS_FIELD] = { };
	}

	/** @private */ parseData(entityList, type) {
		const TypeClass = TYPES_MAP[type];
		let typeCounter = this[COUNTERS_FIELD][type] || 0;

		if (!Array.isArray(entityList)) {
			return this;
		}

		entityList.forEach(entityData => {
			const entity = TypeClass.parse(entityData);
			const startIdx = entity.indices[0];

			if (entity) {
				++typeCounter;

				// can be multiple media entities with same indices
				if (TYPE_MEDIA === type) {
					if (undefined === this[MAP_FIELD][startIdx]) {
						this[MAP_FIELD][startIdx] = [];
					}

					this[MAP_FIELD][startIdx].push(entity);
				} else {
					this[MAP_FIELD][startIdx] = entity;
				}
			}
		});

		this[COUNTERS_FIELD][type] = typeCounter;

		return this;
	}

	parseSymbols(entityList) {
		return this.parseData(entityList, TYPE_SYMBOL);
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
			const entry = self[MAP_FIELD][pos];
			const entity = Array.isArray(entry) ? entry[0] : entry;

			output = self.processTextByEntity(output, entity);
		});

		return output;
	}

	getAdditionalData() {
		const self = this;
		const entitiesPos = this.getEntitiesPositions();
		let result = { };

		entitiesPos.forEach(function(pos) {
			const entry = self[MAP_FIELD][pos];
			const entities = Array.isArray(entry) ? entry : [entry];

			entities.forEach(function(entity) {
				const additionalData = entity.getAdditionalData();

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
		});

		if (!Object.keys(result).length) {
			result = null;
		}

		return result;
	}

	getCount() {
		return this.getUrlCount()
			+ this.getHashCount()
			+ this.getMediaCount()
			+ this.getMentionsCount()
			+ this.getSymbolsCount();
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

	getSymbolsCount() {
		return this[COUNTERS_FIELD][TYPE_SYMBOL] || 0;
	}
}
