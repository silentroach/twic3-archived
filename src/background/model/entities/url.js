import ModelJSON from '../../modelJSON';
import Parser from '../../parser';

var parser = new Parser({
	'url': Parser.TYPE_STRING,
	'expanded_url': [Parser.TYPE_STRING, 'expanded'],
	'display_url': [Parser.TYPE_STRING, 'display']
});

export default class Url extends ModelJSON {
	static getCollectionName() {
		return 'urls';
	}

	static getParser() {
		return parser;
	}
}
