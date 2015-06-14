import Localization from 'core/localization';

class FakeBackend {
	constructor() {
		this.lastKey = null;
	}

	translate(key) {
		this.lastKey = key;

		return true;
	}
}

describe('Localization', function() {

	let localization;
	let backend;

	beforeEach(function() {
		backend = new FakeBackend();
		localization = new Localization(backend);
	});

	it('should translate key dots to underscore', function() {
		localization.translate('test.me.multiple');

		assert.equal(backend.lastKey, 'test_me_multiple');
	});

	it('should return correct plural values', function() {
		localization.plural(1, ['single', 'two', 'multiple']);
		assert.equal(backend.lastKey, 'single', 1);

		localization.plural(2, ['single', 'two', 'multiple']);
		assert.equal(backend.lastKey, 'two', 2);

		localization.plural(50, ['single', 'two', 'multiple']);
		assert.equal(backend.lastKey, 'multiple', 50);

		localization.plural(21, ['single', 'two', 'multiple']);
		assert.equal(backend.lastKey, 'single', 21);
	});

});
