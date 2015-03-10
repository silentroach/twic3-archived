import chai from 'chai';
const assert = chai.assert;

import Parser from '../src/background/parser';

describe('Parser', function() {
	it('should return empty object if source is not an object', function() {
		var parser = new Parser();
		var testReply = parser.process([]);

		assert.equal(typeof testReply, 'object');
		assert.equal(Object.keys(testReply).length, 0);

		testReply = parser.process(undefined);

		assert.equal(typeof testReply, 'object');
		assert.equal(Object.keys(testReply).length, 0);

		testReply = parser.process(null);

		assert.equal(typeof testReply, 'object');
		assert.equal(Object.keys(testReply).length, 0);
	});

	it('should convert types', function() {
		var boolSource = 1;
		var strSource = 10;
		var intSource = '50';
		var parser = new Parser({
			'bool': Parser.TYPE_BOOLEAN,
			'str': Parser.TYPE_STRING,
			'int': Parser.TYPE_INT,
			'something': Parser.TYPE_INT
		});

		var result = parser.process({
			'bool': boolSource,
			'int': intSource,
			'str': strSource
		});

		assert.equal(typeof result, 'object');
		assert.property(result, 'bool');
		assert.property(result, 'int');
		assert.property(result, 'str');

		assert.strictEqual(result.bool, Boolean(boolSource));
		assert.strictEqual(result.str, String(strSource));
		assert.strictEqual(result.int, Number(intSource));
		assert.strictEqual(result.something, undefined);
	});

	it('should rename fields', function() {
		var parser = new Parser({
			'something': [Parser.TYPE_INT, 'id']
		});

		var result = parser.process({
			'something': '5'
		});

		assert.equal(typeof result, 'object');
		assert.property(result, 'id');
		assert.notProperty(result, 'something');
		assert.strictEqual(result.id, 5);
	});

	it('should use callback to convert data', function() {
		var parser = new Parser({
			'something': [Parser.TYPE_STRING, function(original) {
				return {
					somethingDifferent: original,
					somethingLowered: original.toLowerCase()
				}
			}]
		});

		var result = parser.process({
			'something': 'SiLeNt'
		});

		assert.equal(typeof result, 'object');
		assert.property(result, 'somethingDifferent');
		assert.property(result, 'somethingLowered');
		assert.notProperty(result, 'something');

		assert.strictEqual(result.somethingDifferent, 'SiLeNt');
		assert.strictEqual(result.somethingLowered, 'silent');
	});
});
