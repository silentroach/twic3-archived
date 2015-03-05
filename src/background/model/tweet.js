import ModelJSON from '../modelJSON';

export default class Tweet extends ModelJSON {
	static getCollectionName() {
		return 'tweets';
	}

	static getJSONMap() {
		return {
			'id_str': 'id',
			'text': 'text',
			'created_at': function(data) {
				return {
					createTime: new Date(data).getTime()
				};
			}
		};
	}
}
