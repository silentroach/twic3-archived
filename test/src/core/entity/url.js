import EntityUrl from 'core/entity/url';

describe('Entity', () => describe('#url', () => {

	it('should parse data', function() {
		const indices = [1, 10];
		const url = 'https://t.co/123131';
		const displayUrl = 'https://somelink...';
		const expandedUrl = 'https://somelink/long';

		const entity = EntityUrl.parse({
			indices,
			url,
			'display_url': displayUrl,
			'expanded_url': expandedUrl
		});

		assert.deepEqual(entity.indices, indices);
		assert.equal(entity.url, url);
		assert.equal(entity.displayUrl, displayUrl);
		assert.equal(entity.expandedUrl, expandedUrl);
	});

	it('should render', function() {
		const indices = [1, 10];
		const url = 'https://t.co/123131';
		const displayUrl = 'https://somelink...';
		const expandedUrl = 'https://somelink/long';

		const entity = EntityUrl.parse({
			indices,
			url,
			'display_url': displayUrl,
			'expanded_url': expandedUrl
		});

		assert.equal(
			entity.render(),
			`<a href="${url}" class="tweet-link" title="${expandedUrl}" target="_blank">${displayUrl}</a>`
		);
	});

	describe('data extracting', () => {

		describe('instagram', () => {

			it('should extract gallery item', () => {
				const entity = EntityUrl.parse({
					indices: [1, 10],
					url: 'somelink',
					'display_url': 'https://somelink.com',
					'expanded_url': 'https://instagram.com/p/7HlC8KFJBY/'
				});

				const additionalData = entity.getAdditionalData();

				assert(additionalData);
				assert.property(additionalData, 'gallery');
			});

		});

	});

}));
