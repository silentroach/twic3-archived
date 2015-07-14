import Entity from 'core/entity';

describe('Entity', () => describe('base', () => {

	let entity;

	before(() => entity = new Entity());

	it('should throw an error on render', () => {
		assert.throws(() => entity.render());
	});

	it('should return null additional data', () => {
		assert.strictEqual(entity.getAdditionalData(), null);
	});

}));
