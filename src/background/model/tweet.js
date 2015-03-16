import ModelJSON from '../modelJSON';
import Parser from '../parser';

const parser = new Parser({
	'id_str': [Parser.TYPE_STRING, 'id'],
	'text': Parser.TYPE_STRING,
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
