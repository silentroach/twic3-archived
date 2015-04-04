import chai from 'chai';
const assert = chai.assert;

import text from '../../../src/background/twitter/text';

describe('Twitter.Text', function() {

	it('should extract urls', function() {
		const links = [
			'http://stackoverflow.com/questions/29272754/complex-regex-extraction-in-node-io',
			'https://github.com/silentroach'
		];

		const extracted = text.extractUrls(
			`somelink here - ${links[0]} to test and another - ${links[1]}`
		);

		assert.deepEqual(links, extracted);
	});

} );
