import EntityUrl from '../../../src/background/entity/url';

describe('Entity.Url', function() {

	const indices = [1, 10];
	const url = 'https://t.co/123131';
	const displayUrl = 'https://somelink...';
	const expandedUrl = 'https://somelink/long';

	let entity;

	beforeEach(function() {
		entity = EntityUrl.parse({
			indices,
			url,
			'display_url': displayUrl,
			'expanded_url': expandedUrl
		});
	});

	it('should parse data', function() {
		assert.deepEqual(entity.indices, indices);
		assert.equal(entity.url, url);
		assert.equal(entity.displayUrl, displayUrl);
		assert.equal(entity.expandedUrl, expandedUrl);
	});

	it('should render', function() {
		assert.equal(
			entity.render(),
			`<a href="${url}" class="tweet-link" title="${expandedUrl}" target="_blank">${displayUrl}</a>`
		);
	});

});
