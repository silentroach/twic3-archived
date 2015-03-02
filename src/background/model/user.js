import ModelJSON from '../modelJSON';

export default class User extends ModelJSON {
	static getCollectionName() {
		return 'users';
	}

	static getJSONMap() {
		return {
			'id_str': 'id',
			'name': 'name',
			'screen_name': function(data) {
				return {
					screenName: data,
					screenNameNormalized: data.toLowerCase()
				};
			},
			'location': 'location',
			'created_at': function(data) {
				return {
					registerTime: new Date(data).getTime()
				};
			},
			'description': 'description',
			'url': 'url',
			'protected': 'isProtected',
			'profile_image_url_https': function(data) {
				return {
					avatar: data.replace(/_normal\./, '{size}.')
				};
			},
			'verified': 'verified',
			'geo_enabled': 'isGeoEnabled',
			'followers_count': 'followersCount',
			'friends_count': 'friendsCount'
		};
	}
}
