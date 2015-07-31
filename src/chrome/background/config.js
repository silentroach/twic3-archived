import EventEmitter from 'core/eventEmitter';
import Config from 'core/config';

class ChromeSyncStorageBackend extends EventEmitter {
	constructor() {
		super();

		chrome.storage.onChanged.addListener((changes, namespace) => {
			if ('sync' !== namespace) {
				return;
			}

			this.emit('change', changes);
		});
	}

	get(key) {
		return new Promise(resolve => {
			chrome.storage.sync.get(key, items => {
				resolve(items[key]);
			});
		});
	}

	set(key, value) {
		return new Promise(resolve => {
			chrome.storage.sync.set({
				[key]: value
			}, () => resolve());
		});
	}
}

export default new Config(new ChromeSyncStorageBackend());
