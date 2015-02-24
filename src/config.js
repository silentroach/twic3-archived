import EventEmitter from './eventEmitter';

var STORAGE_FIELD = Symbol('storage');
var CACHE_FIELD = Symbol('cache');

export default class Config extends EventEmitter {
	constructor(storage) {
		var config = this;
		var cache = this[CACHE_FIELD] = { };

		super();

		this[STORAGE_FIELD] = storage;

		storage.onChanged.addListener(function(changes) {
			for (let key in changes) {
				cache[key] = changes[key].newValue;
			}

			config.emit('change');
		});
	}

	get(key) {
		var config = this;

		if (undefined !== config[CACHE_FIELD][key]) {
			return Promise.resolve(config[CACHE_FIELD][key]);
		}

		return new Promise(function(resolve, reject) {
			config[STORAGE_FIELD].get(key, function(items) {
				resolve(items[key]);
			});
		});
	}

	set(key, value) {
		var config = this;
		var storeObj = { };

		storeObj[key] = value;

		return new Promise(function(resolve, reject) {
			config[STORAGE_FIELD].set(storeObj, function() {
				if (chrome.runtime.lastError) {
					reject(
						new Error(
							undefined !== chrome.runtime.lastError.message ?
								chrome.runtime.lastError.message : 'Failed to save data'
						)
					);
				} else {
					config[CACHE_FIELD][key] = value;

					resolve();
				}
			});
		});
	}
}
