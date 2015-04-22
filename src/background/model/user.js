import ModelJSON from '../modelJSON';
import Parser from '../parser';

import urlEntityHelper from '../entities/url';

const COORDS_REGEXP = /-?[\d.]+/g;

const parser = new Parser({
	'id_str': [Parser.TYPE_STRING, 'id'],
	'name': Parser.TYPE_STRING,
	'screen_name': [Parser.TYPE_STRING, (original) => {
		return {
			screenName: original,
			screenNameNormalized: original.toLowerCase()
		};
	}],
	'location': [Parser.TYPE_STRING, (original) => {
		let data = {
			location: original
		};

		let coordsMatches = original.match(COORDS_REGEXP);

		if (coordsMatches) {
			coordsMatches = coordsMatches
				.map(coord => Number(coord))
				.filter(coord => coord);

			if (2 === coordsMatches.length) {
				// @todo or longitude,latitude ? check it
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
	'description': Parser.TYPE_STRING,
	'protected': [Parser.TYPE_BOOLEAN, 'isProtected'],
	'profile_image_url_https': [Parser.TYPE_STRING, (original) => {
		return {
			avatar: original.replace(/_normal\./, '{size}.')
		};
	}],
	'verified': [Parser.TYPE_BOOLEAN, 'isVerified'],
	'geo_enabled': [Parser.TYPE_BOOLEAN, 'isGeoEnabled'],
	'followers_count': [Parser.TYPE_INT, 'followersCount'],
	'friends_count': [Parser.TYPE_INT, 'friendsCount'],
	'url': [Parser.TYPE_STRING, (url, userJSON) => {
		if (userJSON.entities && userJSON.entities.url) {
			url = urlEntityHelper.processText(url, userJSON.entities.url.urls);
		}

		return {
			url: url
		};
	}]
});

export default class User extends ModelJSON {
	static getCollectionName() {
		return 'users';
	}

	static getParser() {
		return parser;
	}

	static getByScreenName(db, screenName) {
		return this.getByIndex(db, 'screenName', screenName);
	}
}
