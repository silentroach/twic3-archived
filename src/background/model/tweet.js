import ModelJSON from '../modelJSON';
import Parser from '../parser';

import hashtagEntityHelper from './entities/hashtag';
import urlEntityHelper from './entities/url';
import mentionEntityHelper from './entities/mention';

const parser = new Parser({
	'id_str': [Parser.TYPE_STRING, 'id'],
	'text': [Parser.TYPE_STRING, (original, tweetJSON) => {
		const data = { };
		let text = original;

		if (tweetJSON.entities) {
			// @todo merge entity helpers
			text = hashtagEntityHelper.processText(original, tweetJSON.entities.hashtags);
			text = mentionEntityHelper.processText(text, tweetJSON.entities.user_mentions);
			text = urlEntityHelper.processText(text, tweetJSON.entities.urls);

			if (original !== text) {
				data.originalText = original;
			}
		}

		data.text = text;

		return data;
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
