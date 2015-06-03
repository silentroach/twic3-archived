import EntityHashtag from '../../../src/_chaos/background/entity/hashtag';

describe('Entity.Hashtag', function() {

	const indices = [1, 10];
	const text = 'twicext';
	let entity;

	beforeEach(function() {
		entity = EntityHashtag.parse({
			indices,
			text
		});
	});

	it('should parse data', function() {
		assert.deepEqual(entity.indices, indices);
		assert.equal(entity.text, text);
	});

	it('should render', function() {
		assert.equal(
			entity.render(),
			`<span class="tweet-link-hashtag">#${text}</span>`
		);
	});

});
