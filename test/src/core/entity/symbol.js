import EntitySymbol from 'core/entity/symbol';

describe('Entity', () => describe('#symbol', () => {

	const indices = [1, 5];
	const text = 'appl';
	let entity;

	beforeEach(function() {
		entity = EntitySymbol.parse({
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
			`<span class="tweet-link-symbol">$${text}</span>`
		);
	});

}));
