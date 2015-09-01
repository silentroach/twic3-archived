import EntityMedia from 'core/entity/media';

describe('Entity', () => describe('#media', () => {

	it('should not be parsed if type is incorrect', () => {
		const entity = EntityMedia.parse({});

		assert(null === entity);
	});

	describe('correct input data', () => {
		const indices = [10, 15];
		const type = 'photo';
		const url = 'http://www.twitter.com/lalala/photo/1';
		const fullUrl = 'http://t.co/sBOkw1ynch/test.jpg';
		const sizes = {
			alias: {
				h: 10, w: 10, resize: 'fit'
			},
			alias2: {
				h: 20, w: 20, resize: 'crop'
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
				alias: [10, 10],
				alias2: [20, 20]
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
							url,
							preview: [{
								url: [fullUrl, 'alias'].join(':'),
								size: [10, 10]
							}, {
								url: [fullUrl, 'alias2'].join(':'),
								size: [20, 20]
							}]
						}
					]
				}
			);
		});
	});

}));
