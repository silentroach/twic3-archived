import chai from 'chai';
const assert = chai.assert;

import jsdom from 'jsdom';

import Tweet from '../../src/background/model/tweet';

describe('Model.Tweet', function() {
	let tweet;

	before(function() {
		const jsdomDocument = jsdom.jsdom('<body />');
		global.document = jsdomDocument.defaultView.document;
	});

	after(function() {
		delete global.document;
	});

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

	it('should prepare urls for display', function() {
		const displayUrl = 'youtu.be/SsYY77hxXUE';
		const expandedUrl = 'http://youtu.be/SsYY77hxXUE';
		const url = 'http://t.co/tKQrdjr6ag';
		const originalText = `Visualization of live Twitter updates ${url}`;

		tweet.parse({
			entities: {
				urls: [
					{
						'display_url': displayUrl,
						'expanded_url': expandedUrl,
						url: url
					}
				]
			},
			text: originalText
		});

		assert.equal(
			tweet.text,
			`Visualization of live Twitter updates <a href="${url}" title="${expandedUrl}" target="_blank">${displayUrl}</a>`
		);

		assert.equal(tweet.originalText, originalText);
	});

	it('should not create originalText property if it is not needed', function() {
		const tweetText = 'test';

		tweet.parse({
			text: tweetText
		});

		assert.equal(tweet.text, tweetText);
		assert.notProperty(tweet, 'originalText');
	});
});
