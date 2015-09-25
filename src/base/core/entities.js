import EntityMention from './entity/mention';
import EntityMedia from './entity/media';
import EntityUrl from './entity/url';
import EntityHashtag from './entity/hashtag';
import EntitySymbol from './entity/symbol';

import objectMerge from 'lodash.merge';

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

// U+1F300 to U+1F3FF
// U+1F400 to U+1F64F
// U+1F680 to U+1F6FF
const emoticonsRegexp = /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g;

const propMap = Symbol('map');
const propCounters = Symbol('counters');

const methodParseData = Symbol('parseData');
const methodProcessByEntity = Symbol('processTextByEntity');
const methodGetEntitiesPosition = Symbol('getEntitiesPositions');

export default class Entities {
	constructor() {
		this[propMap] = { };
		this[propCounters] = { };
	}

	[methodParseData](entityList, type) {
		const TypeClass = TYPES_MAP[type];
		let typeCounter = this[propCounters][type] || 0;

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
					if (undefined === this[propMap][startIdx]) {
						this[propMap][startIdx] = [];
					}

					this[propMap][startIdx].push(entity);
				} else {
					this[propMap][startIdx] = entity;
				}
			}
		});

		this[propCounters][type] = typeCounter;

		return this;
	}

	parseSymbols(entityList) {
		return this[methodParseData](entityList, TYPE_SYMBOL);
	}

	parseMentions(entityList) {
		return this[methodParseData](entityList, TYPE_MENTION);
	}

	parseMedia(entityList) {
		return this[methodParseData](entityList, TYPE_MEDIA);
	}

	parseUrls(entityList) {
		return this[methodParseData](entityList, TYPE_URL);
	}

	parseHashtags(entityList) {
		return this[methodParseData](entityList, TYPE_HASH);
	}

	[methodProcessByEntity](text, entity) {
		const indices = entity.indices;

		// @todo context based replacements?
		// example: should remove trailing slashes from urls if there is a non-letter after it

		return [
			text.substr(0, indices[0]),
			entity.render(),
			text.substr(indices[1])
		].join('');
	}

	[methodGetEntitiesPosition](reversed = false) {
		return Object
			.keys(this[propMap])
			.map(Number)
			.sort((a, b) => reversed ? b - a : a - b);
	}

	processText(input) {
		const entitiesPos = this[methodGetEntitiesPosition](true);
		const emoticons = [];

		// replacing two-byte emoticons with private use unicode symbol
		let output = input.replace(emoticonsRegexp, match => {
			emoticons.push(match);
			return '\u0091';
		});

		entitiesPos.forEach(pos => {
			const entry = this[propMap][pos];
			const entity = Array.isArray(entry) ? entry[0] : entry;

			output = this[methodProcessByEntity](output, entity);
		});

		// bringing back emoticons
		return output.replace(/\u0091/g, () => emoticons.shift());
	}

	getAdditionalData() {
		const entitiesPos = this[methodGetEntitiesPosition]();
		let result = { };

		entitiesPos.forEach(pos => {
			const entry = this[propMap][pos];
			const entities = Array.isArray(entry) ? entry : [entry];

			entities.forEach(entity => {
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
		return this[propCounters][TYPE_URL] || 0;
	}

	getHashCount() {
		return this[propCounters][TYPE_HASH] || 0;
	}

	getMediaCount() {
		return this[propCounters][TYPE_MEDIA] || 0;
	}

	getMentionsCount() {
		return this[propCounters][TYPE_MENTION] || 0;
	}

	getSymbolsCount() {
		return this[propCounters][TYPE_SYMBOL] || 0;
	}
}
