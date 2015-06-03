import i18n from '../../src/_chaos/i18n';

describe('i18n', function() {
	let keys = [];

	before(function() {
		chrome = {
			i18n: {
				getMessage: function(key) {
					keys.push(key);
				}
			}
		};
	});

	beforeEach(function() {
		keys = [];
	});

	after(function() {
		delete chrome.i18n;
	});

	it('should translate key dots to underscore', function() {
		i18n.translate('test.me.multiple');

		assert.deepEqual(keys, ['test_me_multiple']);
	});

	it('should return correct plural values', function() {
		i18n.plural(1, ['single', 'two', 'multiple']);
		i18n.plural(2, ['single', 'two', 'multiple']);
		i18n.plural(50, ['single', 'two', 'multiple']);
		i18n.plural(21, ['single', 'two', 'multiple']);

		assert.deepEqual(keys, ['single', 'two', 'multiple', 'single']);
	});
});
