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

describe('Struct', () => {

	describe('base', () => {
		let struct;

		before(() => struct = new Struct());

		it('should throw an error on [serialize] call', () => assert.throws(() => struct.serialize()));
		it('should throw an error on [unserialize] call', () => assert.throws(() => struct.unserialize()));
	});

	it('should serialize/deserialize data', () => {
		const value = Math.random();
		const struct = new FakeStruct(value);

		assert.equal(struct.value, value);

		assert.deepEqual(
			struct.serialize(struct.unserialize(struct.serialize())),
			struct.serialize()
		);
	});

	it('should deserialize with static call', () => {
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
