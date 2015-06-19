import Parser from 'core/http/response/parser';

describe('Parser', function() {
	it('should not return empty values', function() {
		const obj = {
			'undef': undefined,
			'null': null,
			'notanumber': NaN,
			'val': '5',
			'undefcallback': 5
		};

		const parser = new Parser({
			'undef': Parser.TYPE_INT,
			'null': [Parser.TYPE_INT, (originalValue) => {
				assert.fail('called', 'not called');
			}],
			'notanumber': Parser.TYPE_INT,
			'val': Parser.TYPE_INT,
			'undefcallback': [Parser.TYPE_INT, originalValue => {
				return null;
			}]
		});

		const result = parser.process(obj);

		assert.equal(typeof result, 'object');
		assert.notProperty(result, 'undef');
		assert.notProperty(result, 'null');
		assert.notProperty(result, 'notanumber');
		assert.notProperty(result, 'undefcallback');
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

		const result = parser.process(obj);

		assert.equal(typeof result, 'object');
		assert.property(result, 'test');
	});

	it('should return empty object if source is not an object', function() {
		const parser = new Parser();
		let testReply = parser.process([]);

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
		const boolSource = 1;
		const strSource = 10;
		const intSource = '50';
		const dateSource = 'Tue Mar 10 2015 09:26:06 GMT+0300 (MSK)';
		const parser = new Parser({
			'bool': Parser.TYPE_BOOLEAN,
			'str': Parser.TYPE_STRING,
			'int': Parser.TYPE_INT,
			'something': Parser.TYPE_INT,
			'date': Parser.TYPE_DATE
		});

		const result = parser.process({
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
		const parser = new Parser({
			'something': [Parser.TYPE_INT, 'id']
		});

		const result = parser.process({
			'something': '5'
		});

		assert.equal(typeof result, 'object');
		assert.property(result, 'id');
		assert.notProperty(result, 'something');
		assert.strictEqual(result.id, 5);
	});

	it('should use callback to convert data', function() {
		const parser = new Parser({
			'something': [Parser.TYPE_STRING, function(original) {
				return {
					somethingDifferent: original,
					somethingLowered: original.toLowerCase()
				};
			}]
		});

		const result = parser.process({
			'something': 'SiLeNt'
		});

		assert.equal(typeof result, 'object');
		assert.property(result, 'somethingDifferent');
		assert.property(result, 'somethingLowered');
		assert.notProperty(result, 'something');

		assert.strictEqual(result.somethingDifferent, 'SiLeNt');
		assert.strictEqual(result.somethingLowered, 'silent');
	});

	it('should throw an error if callback did not return object', function() {
		const parser = new Parser({
			'something': [Parser.TYPE_STRING, function(original) {
				return true;
			}]
		});

		assert.throws(function() {
			parser.process({
				'something': 5
			});
		});
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
