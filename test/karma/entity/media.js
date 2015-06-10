import EntityMedia from '../../../src/_chaos/background/entity/media';

describe('Entity.Media', function() {

	const indices = [10, 15];
	const type = 'photo';
	const url = 'http://www.twitter.com/lalala/photo/1';
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
			'expanded_url': url,
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

	it('should render to nothing', function() {
		assert.equal(entity.render(), '');
	});

	it('should return additional data', function() {
		assert.deepEqual(
			entity.getAdditionalData(),
			{
				gallery: [
					{
						imageUrl: fullUrl,
						url,
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
