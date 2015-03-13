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
}, function(userJSON) {
	var data = { };

	if (userJSON.url
		&& userJSON.entities
		&& userJSON.entities.url
		&& Array.isArray(userJSON.entities.url.urls)
		&& userJSON.entities.url.urls[0]
		&& userJSON.url === userJSON.entities.url.urls[0].url
	) {
		let urlData = userJSON.entities.url.urls[0];

		let element = document.createElement('a');
		element.href = urlData.url;
		element.innerText = urlData.display_url;
		element.title = urlData.expanded_url;

		data.url = element.outerHTML;
	}

	return data;
});

export default class User extends ModelJSON {
	static getCollectionName() {
		return 'users';
	}

	static getParser() {
		return parser;
	}
}
