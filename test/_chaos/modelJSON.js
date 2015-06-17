import ModelJSON from '../../src/_chaos/background/modelJSON';
import Parser from '../../src/_chaos/background/parser';

class Something extends ModelJSON {
	static getParser() {
		return new Parser({
			'id': Parser.TYPE_INT,
			'something': [Parser.TYPE_STRING, 'someOtherName'],
			'twice': [Parser.TYPE_STRING, function(data) {
				return {
					twice: data ? data + data : null
				};
			}],
			'someNullValue': [Parser.TYPE_UNDEFINED, 'nullValue']
		});
	}
}

describe('ModelJSON', function() {
	it('should mark new properties as readonly while parsing', function() {
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
		assert.equal(m.twice, twice + twice);
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
