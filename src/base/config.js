import EventEmitter from 'eventEmitter';

const STORAGE_FIELD = Symbol('storage');

const CHANGE_EVENT = 'change';

export default class Config extends EventEmitter {
	constructor(storage) {
		super();

		const config = this;

		this[STORAGE_FIELD] = storage.sync;

		storage.onChanged.addListener((changes, namespace) => {
			if ('sync' !== namespace) {
				return;
			}

			for (let key in changes) {
				config.emit(
					[CHANGE_EVENT, key].join('.'),
					changes[key].newValue
				);
			}

			config.emit(CHANGE_EVENT);
		});
	}

	get(key) {
		const config = this;

		return new Promise(function(resolve) {
			config[STORAGE_FIELD].get(key, function(items) {
				resolve(items[key]);
			});
		});
	}

	set(key, value) {
		const config = this;
		const storeObj = { };

		storeObj[key] = value;

		return new Promise(function(resolve) {
			config[STORAGE_FIELD].set(storeObj, function() {
				resolve();
			});
		});
	}
}
