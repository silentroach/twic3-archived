import EventEmitter from '@twic/eventemitter';
import Config from 'core/config';

class FakeBackend extends EventEmitter {
	constructor() {
		super();

		this.storage = { };
	}

	set(key, value) {
		this.storage[key] = value;

		return new Promise(function(resolve) {
			resolve(value);
		});
	}

	get(key) {
		return new Promise(resolve => resolve(this.storage[key]));
	}
}

describe('Config', function() {

	const backend = new FakeBackend();
	let config;

	beforeEach(function() {
		config = new Config(backend);
	});

	it('should set and resolve it with value', function() {
		return assert.becomes(
			config.set('somekey', 'somevalue'),
			'somevalue'
		);
	});

	it('should get written values', function() {
		return assert.becomes(
			config
				.set('somekey', 'somevalue')
				.then(() => config.get('somekey')),
			'somevalue'
		);
	});

	it('should trigger change event on backend side changes', function() {
		const callback = sinon.spy();

		config.on('change', callback);
		backend.emit('change', {
			test: 5
		});

		assert(callback.called);
	});

	it('should trigger per item change event on backend side changes', function() {
		const callback = sinon.spy();
		const noCallback = sinon.spy();

		config.on('change.test', callback);
		config.on('change.notest', noCallback);
		backend.emit('change', {
			test: 5
		});

		assert.isTrue(callback.called);
		assert.isFalse(noCallback.called);
	});

});
