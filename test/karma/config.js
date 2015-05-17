import Config from '../../src/config';
import EventEmitter from '../../src/eventEmitter';

// chrome.storage emulation
class FakeStorage extends EventEmitter {
	constructor() {
		super();

		const storage = this;

		this.changes = { };

		this.onChanged = {
			addListener: function(callback) {
				storage.on('change', callback);
			}
		};

		this.sync = {
			set: function(obj, callback) {
				for (let key in obj) {
					storage.changes[key] = obj[key];
				}

				storage.emit('change', storage.changes, 'sync');

				callback();
			},
			get: function(obj, callback) {
				var results = { };
				for (let key in obj) {
					if (undefined !== storage.changes[key]) {
						results[key] = storage.changes[key];
					}
				}

				callback(results);
			}
		};
	}
}

describe('Config', function() {
	var storage;
	var config;

	before(function() {
		if (!chrome.runtime) {
			chrome.runtime = {
				lastError: 0
			};
		}
	});

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

	it('should emit global changed event on set', function(callback) {
		var key = 'testkey';

		config
			.on('change', callback)
			.set(key, 'somevalue');
	});

	it('should emit key changed event on set', function(callback) {
		var key = 'somekey';

		config
			.on(['change', key].join('.'), callback)
			.set(key, 'somevalue');
	});
});
