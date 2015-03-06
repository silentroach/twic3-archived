import chai from 'chai';
const assert = chai.assert;

import ModelJSON from '../src/background/modelJSON';

class Something extends ModelJSON {
	static getJSONMap() {
		return {
			'id': 'id',
			'something': 'someOtherName',
			'twice': function(data) {
				return {
					twice: data ? data.repeat(2) : null
				};
			},
			'someNullValue': 'nullValue'
		};
	}
}

describe('ModelJSON', function() {
	it('should make new properties be readonly', function() {
		var m = new Something();
		var id = 5;

		m.parse({id: id});

		assert.equal(m.id, id);

		assert.throws(function() {
			m.id = 10;
		});
	});

	it('should parse data from json by map', function() {
		var m = new Something();
		var id = 5;
		var something = 'something';
		var twice = 'bla';

		m.parse({
			id: id,
			something: something,
			twice: twice
		});

		assert.equal(m.id, id);
		assert.equal(m.someOtherName, something);
		assert.equal(m.twice, twice.repeat(2));
		assert.notProperty(m, 'nullValue');
		assert.notProperty(m, 'someNullValue');
	});

	it('should remove old values while parsing json with null/undefined properties', function() {
		var m = new Something();
		var id = 5;

		m.id = id;

		assert.equal(m.id, id);

		m.parse({});

		assert.notProperty(m, 'id');
	});
});
