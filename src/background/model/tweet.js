import ModelJSON from '../modelJSON';
import Parser from '../parser';

import urlEntityHelper from './entities/url';

const parser = new Parser({
	'id_str': [Parser.TYPE_STRING, 'id'],
	'text': [Parser.TYPE_STRING, (original, tweetJSON) => {
		let text = original;

		if (tweetJSON.entities) {
			text = urlEntityHelper.processText(original, tweetJSON.entities.urls);
		}

		return {
			originalText: original,
			text: text
		};
	}],
	'created_at': [Parser.TYPE_DATE, 'createTime']
});

export default class Tweet extends ModelJSON {
	static getCollectionName() {
		return 'tweets';
	}

	static getParser() {
		return parser;
	}
}
