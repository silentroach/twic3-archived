import Struct from 'core/struct';

const valueField = Symbol('value');

class FakeStruct extends Struct {
	constructor(someValue) {
		super();

		this[valueField] = someValue;
	}

	get value() {
		return this[valueField];
	}

	serialize() {
		return this.value;
	}

	unserialize(data) {
		this[valueField] = data;
	}
}

describe('Struct', function() {

	it('should serialize/deserialize data', function() {
		const value = Math.random();
		const struct = new FakeStruct(value);

		assert.equal(struct.value, value);

		assert.deepEqual(
			struct.serialize(struct.unserialize(struct.serialize())),
			struct.serialize()
		);
	});

	it('should deserialize with static call', function() {
		const value = Math.random();
		const struct = new FakeStruct(value);
		const serialized = struct.serialize();
		const deserialized = FakeStruct.unserialize(serialized);

		assert.instanceOf(deserialized, FakeStruct);
		assert.deepEqual(
			deserialized.serialize(),
			serialized
		);
	});

});
