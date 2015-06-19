import Localization from 'core/localization';

class FakeBackend {
	constructor(language) {
		this.lastKey = null;
		this.lastArgs = null;
		this.language = language;
	}

	translate(key, ...args) {
		this.lastKey = key;
		this.lastArgs = args;

		return true;
	}

	getLanguage() {
		return this.language;
	}
}

describe('Localization', function() {

	const language = 'ru';
	let localization;
	let backend;

	beforeEach(function() {
		backend = new FakeBackend(language);
		localization = new Localization(backend);
	});

	it('should translate key dots to underscore', function() {
		localization.translate('test.me.multiple');

		assert.equal(backend.lastKey, 'test_me_multiple');
	});

	it('should proxy arguments to translate backend', function() {
		localization.translate('something', 5, 'test');

		assert.deepEqual(backend.lastArgs, [5, 'test']);
	});

	it('should return correct plural values', function() {
		localization.plural(1, ['single', 'two', 'multiple']);
		assert.equal(backend.lastKey, 'single', 1);

		localization.plural(2, ['single', 'two', 'multiple']);
		assert.equal(backend.lastKey, 'two', 2);

		localization.plural(50, ['single', 'two', 'multiple']);
		assert.equal(backend.lastKey, 'multiple', 50);

		localization.plural(22, ['single', 'two', 'multiple']);
		assert.equal(backend.lastKey, 'two', 22);
	});

	it('should return backend language', function() {
		assert.equal(localization.getLanguage(), language);
	});

});
