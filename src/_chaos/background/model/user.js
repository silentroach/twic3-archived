import ModelJSON from '../modelJSON';
import { FieldTypes, Parser } from 'core/http/response/parser';

import Entities from 'core/entities';

import { processLineBreaks } from '../twitter/text';

const COORDS_REGEXP = /-?[\d.]+/g;

/**
 * In streaming api we have no entities info for users
 * so we need to split parsers into two
 */

const commonParserRules = {
	'id_str': [FieldTypes.String, 'id'],
	'name': FieldTypes.String,
	'screen_name': [FieldTypes.String, (original) => {
		return {
			screenName: original,
			screenNameNormalized: original.toLowerCase()
		};
	}],
	'location': [FieldTypes.String, (original) => {
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
	'created_at': [FieldTypes.Date, 'registerTime'],
	'protected': [FieldTypes.Boolean, 'isProtected'],
	'profile_image_url_https': [FieldTypes.String, (original) => {
		return {
			avatar: original.replace(/_normal\./, '{size}.')
		};
	}],
	'verified': [FieldTypes.Boolean, 'isVerified'],
	'geo_enabled': [FieldTypes.Boolean, 'isGeoEnabled'],
	'followers_count': [FieldTypes.Int, 'followersCount'],
	'friends_count': [FieldTypes.Int, 'friendsCount']
};

const fullParserRules = Object.create(commonParserRules);

fullParserRules.description = [FieldTypes.String, (description, userJSON) => {
	return {
		description: processLineBreaks(
			description
		)
	};
}];

fullParserRules.url = [FieldTypes.String, (url, userJSON) => {
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
