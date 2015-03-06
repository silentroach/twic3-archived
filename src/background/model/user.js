import ModelJSON from '../modelJSON';
import Parser from '../parser';

var parser = new Parser({
	'id_str': [Parser.TYPE_STRING, 'id'],
	'name': Parser.TYPE_STRING,
	'screen_name': [Parser.TYPE_STRING, (original) => {
		return {
			screenName: original,
			screenNameNormalized: original.toLowerCase()
		};
	}],
	'location': Parser.TYPE_STRING,
	'created_at': [Parser.TYPE_DATE, 'registerTime'],
	'description': Parser.TYPE_STRING,
	'url': Parser.TYPE_STRING,
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
});

export default class User extends ModelJSON {
	static getCollectionName() {
		return 'users';
	}

	static getParser() {
		return parser;
	}
}
