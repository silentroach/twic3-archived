import chai from 'chai';
const assert = chai.assert;

import i18n from '../src/i18n';

describe('i18n', function() {
	var keys = [];

	before(function() {
		global.chrome = {
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
		delete global.chrome;
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

		assert.deepEqual(keys, ['single','two', 'multiple', 'single']);
	});
});
