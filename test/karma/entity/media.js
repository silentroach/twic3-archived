import EntityMedia from '../../../src/background/entity/media';

describe('Entity.Media', function() {

	const indices = [10, 15];
	const type = 'photo';
	const url = 'http://t.co/sBOkw1ynch';
	const fullUrl = 'http://t.co/sBOkw1ynch/test.jpg';
	const sizes = {
		alias: {
			h: 10, w: 10, resize: 'fit'
		}
	};

	let entity;

	beforeEach(function() {
		entity = EntityMedia.parse({
			indices,
			url,
			'media_url_https': fullUrl,
			sizes,
			type
		});
	});

	it('should parse data', function() {
		assert.deepEqual(entity.sizes, {
			alias: [10, 10]
		});
		assert.deepEqual(entity.indices, indices);
		assert.equal(entity.url, url);
		assert.equal(entity.imageUrl, fullUrl);
		assert.equal(entity.type, type);
	});

	it('should render', function() {
		assert.equal(
			entity.render(),
			`<a href="${url}" class="tweet-link-media" target="_blank"></a>`
		);
	});

	it('should return additional data', function() {
		assert.deepEqual(
			entity.getAdditionalData(),
			{
				gallery: [
					{
						url: fullUrl,
						sizes: {
							alias: [10, 10]
						},
						type
					}
				]
			}
		);
	});

});
