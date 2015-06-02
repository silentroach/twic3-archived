import Parser from '../../src/common/background/parser';

describe('Parser', function() {
	it('should not return empty values', function() {
		const obj = {
			'undef': undefined,
			'null': null,
			'val': '5'
		};

		const parser = new Parser({
			'undef': Parser.TYPE_INT,
			'null': [Parser.TYPE_INT, (originalValue) => {
				assert.fail('called', 'not called');
			}],
			'val': Parser.TYPE_INT
		});

		const result = parser.process(obj);

		assert.equal(typeof result, 'object');
		assert.notProperty(result, 'undef');
		assert.notProperty(result, 'null');
		assert.property(result, 'val');
		assert.equal(result.val, 5);
	});

	it('should pass the entire original object for callbacks', function() {
		const testval = 5;
		const obj = {
			'test': testval
		};

		const parser = new Parser({
			test: [Parser.TYPE_INT, (originalValue, originalJSON) => {
				assert.deepEqual(originalJSON, obj);
				assert.equal(originalValue, testval);

				return {
					test: originalValue
				};
			}]
		});

		var result = parser.process(obj);

		assert.equal(typeof result, 'object');
		assert.property(result, 'test');
	});

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
		var dateSource = 'Tue Mar 10 2015 09:26:06 GMT+0300 (MSK)';
		var parser = new Parser({
			'bool': Parser.TYPE_BOOLEAN,
			'str': Parser.TYPE_STRING,
			'int': Parser.TYPE_INT,
			'something': Parser.TYPE_INT,
			'date': Parser.TYPE_DATE
		});

		var result = parser.process({
			'bool': boolSource,
			'int': intSource,
			'str': strSource,
			'date': dateSource
		});

		assert.equal(typeof result, 'object');
		assert.property(result, 'bool');
		assert.property(result, 'int');
		assert.property(result, 'str');
		assert.property(result, 'date');

		assert.strictEqual(result.bool, Boolean(boolSource));
		assert.strictEqual(result.str, String(strSource));
		assert.strictEqual(result.int, Number(intSource));
		assert.strictEqual(result.something, undefined);
		assert.strictEqual(result.date, 1425968766000);
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
				};
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

	it('should not pass string to object if it is empty', function() {
		const parser = new Parser({
			'empty': Parser.TYPE_STRING,
			'not': Parser.TYPE_STRING
		});

		const result = parser.process({
			'empty': '    ',
			'not': 'not empty'
		});

		assert.equal(typeof result, 'object');
		assert.property(result, 'not');
		assert.notProperty(result, 'empty');
	});
});
