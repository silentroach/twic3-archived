import chai from 'chai';
const assert = chai.assert;

import Tweet from '../../src/background/model/tweet';

describe('Model.Tweet', function() {
	let tweet;

	beforeEach(function() {
		tweet = new Tweet();
	});

	it('should get id from id_str strictly as string', function() {
		var id = '12345678901234567890';

		tweet.parse({
			'id_str': '12345678901234567890'
		});

		assert.strictEqual(tweet.id, id);
	});
});
