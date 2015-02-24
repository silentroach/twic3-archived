var chai = require('chai');
var assert = chai.assert;

import Config from '../src/config';
import EventEmitter from '../src/eventEmitter';

class FakeStorage extends EventEmitter {
	constructor() {
		var storage = this;

		super();

		this.changes = { };

		this.onChanged = {
			addListener: function(callback) {
				storage.on('change', callback);
			}
		}
	}

	set(obj, callback) {
		for (let key in obj) {
			this.changes[key] = obj[key];
		}

		callback();
	}

	get(obj, callback) {
		var results = { };
		for (let key in obj) {
			if (undefined !== this.changes[key]) {
				results[key] = this.changes[key];
			}
		}

		callback(results);
	}
}

describe('Config', function() {
	var storage;
	var config;

	before(function() {
		global.chrome = {
			runtime: {
				lastError: 0
			}
		};
	});

	after(function() {
		delete global.chrome;
	})

	beforeEach(function() {
		storage = new FakeStorage();
		config = new Config(storage);
	});

	it('should pass changes to storage and get it later', function(callback) {
		var key = 'testkey';
		var value = 'testvalue';

		config
			.set(key, value)
			.then(function(res) {
				assert.property(storage.changes, key);
				assert.equal(storage.changes[key], value);

				return config
					.get(key)
					.then(function(storageValue) {
						assert.equal(storageValue, value);

						callback();
					});
			})
			.catch(callback);
	});
});
