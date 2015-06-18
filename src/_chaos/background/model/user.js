import ModelJSON from '../modelJSON';
import Parser from 'core/http/response/parser';

import Entities from 'core/entities';

import textUtils from '../twitter/text';

const COORDS_REGEXP = /-?[\d.]+/g;

/**
 * In streaming api we have no entities info for users
 * so we need to split parsers into two
 */

const commonParserRules = {
	'id_str': [Parser.TYPE_STRING, 'id'],
	'name': Parser.TYPE_STRING,
	'screen_name': [Parser.TYPE_STRING, (original) => {
		return {
			screenName: original,
			screenNameNormalized: original.toLowerCase()
		};
	}],
	'location': [Parser.TYPE_STRING, (original) => {
		const data = {
			location: original
		};

		let coordsMatches = original.match(COORDS_REGEXP);

		if (coordsMatches) {
			coordsMatches = coordsMatches
				.map(coord => Number(coord))
				.filter(coord => coord);

			if (2 === coordsMatches.length) {
				let [latitude, longitude] = coordsMatches;

				if (latitude >= -90 && latitude <= 90
					&& longitude >= -180 && longitude <= 180
				) {
					data.coords = [latitude, longitude];
				}
			}
		}

		return data;
	}],
	'created_at': [Parser.TYPE_DATE, 'registerTime'],
	'protected': [Parser.TYPE_BOOLEAN, 'isProtected'],
	'profile_image_url_https': [Parser.TYPE_STRING, (original) => {
		return {
			avatar: original.replace(/_normal\./, '{size}.')
		};
	}],
	'verified': [Parser.TYPE_BOOLEAN, 'isVerified'],
	'geo_enabled': [Parser.TYPE_BOOLEAN, 'isGeoEnabled'],
	'followers_count': [Parser.TYPE_INT, 'followersCount'],
	'friends_count': [Parser.TYPE_INT, 'friendsCount']
};

const fullParserRules = Object.create(commonParserRules);

fullParserRules.description = [Parser.TYPE_STRING, (description, userJSON) => {
	return {
		description: textUtils.processLineBreaks(
			description
		)
	};
}];

fullParserRules.url = [Parser.TYPE_STRING, (url, userJSON) => {
	if (userJSON.entities && userJSON.entities.url) {
		const entities = new Entities();
		entities.parseUrls(userJSON.entities.url.urls);

		url = entities.processText(url);
	}

	return {
		url: url
	};
}];

const simpleParser = new Parser(commonParserRules);
const parser = new Parser(fullParserRules);

const FULL_UPDATE_TIME_FIELD_NAME = 'fullUpdateTime';

export default class User extends ModelJSON {
	static getCollectionName() {
		return 'users';
	}

	static getParser(isFull = true) {
		return isFull ? parser : simpleParser;
	}

	static getByScreenName(db, screenName) {
		return this.getByIndex(db, 'screenName', screenName);
	}

	parse(json, isFull = true) {
		super.parse(json, isFull);

		if (isFull) {
			this[FULL_UPDATE_TIME_FIELD_NAME] = Date.now();
			this.markAsChanged();
		}
	}

	isOutdated() {
		return undefined === this[FULL_UPDATE_TIME_FIELD_NAME]
			|| Date.now() - this[FULL_UPDATE_TIME_FIELD_NAME] > this.getFreshTime();
	}
}
