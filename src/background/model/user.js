import Model from '../model';

export default class User extends Model {
	static getCollectionName() {
		return 'users';
	}

	static getJSONMap() {
		return {
			'id_str': 'id',
			'name': 'name',
			'screen_name': 'screenName',
			'location': 'location',
			'created_at': ['registerTime', function(data) {
				return new Date(data).getTime();
			}],
			'description': 'description',
			'url': 'url',
			'protected': 'isProtected',
			'profile_image_url_https': ['avatar', function(data) {
				return data.replace(/_normal\./, '{size}.');
			}],
			'verified': 'verified',
			'geo_enabled': 'isGeoEnabled',
			'followers_count': 'followersCount',
			'friends_count': 'friendsCount'
		};
	}
}
