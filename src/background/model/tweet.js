import ModelJSON from '../modelJSON';

export default class Tweet extends ModelJSON {
	static getCollectionName() {
		return 'tweets';
	}

	static getJSONMap() {
		return {
			'id_str': 'id',
			'source': 'source', // @todo normalize
			'text': 'text',
			'created_at': function(data) {
				return {
					createTime: new Date(data).getTime()
				};
			},
			'favorited': 'favorited',
			'favorite_count': 'favoriteCount',
			'retweeted': 'retweeted',
			'retweet_count': 'retweetCount'
		};
	}
}
