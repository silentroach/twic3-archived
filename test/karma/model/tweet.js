import Tweet from '../../../src/background/model/tweet';

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

	it('should convert breaks to br tag', function() {
		const text = 'test\nbr tag';

		tweet.parse({
			text
		});

		assert.equal(tweet.text, 'test<br />br tag');
	});

	it('should convert 3+ breaks to 2 brs', function() {
		const text = 'test multiple\n\n\nbreaks';

		tweet.parse({
			text
		});

		assert.equal(tweet.text, 'test multiple<br /><br />breaks');
	});

/*
	it('should prepare entities for display', function() {
		const displayUrl = 'youtu.be/SsYY77hxXUE';
		const expandedUrl = 'http://youtu.be/SsYY77hxXUE';
		const url = 'http://t.co/tKQrdjr6ag';
		const originalText = `Visualization of #live Twitter updates ${url}`;
		const hashtag = 'live';

		tweet.parse({
			entities: {
				urls: [
					{
						'display_url': displayUrl,
						'expanded_url': expandedUrl,
						url: url
					}
				],
				hashtags: [
					{
						text: hashtag
					}
				]
			},
			text: originalText
		});

		assert.equal(
			tweet.text,
			`Visualization of <span class="tweet-link-hashtag">#${hashtag}</span> Twitter updates <a href="${url}" class="tweet-link" title="${expandedUrl}" target="_blank">${displayUrl}</a>`
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
*/
});
