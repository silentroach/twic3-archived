import EventEmitter from '@twic/eventemitter';
import Config from '@twic/config';

class ElectronStorageBackend extends EventEmitter {
	get(key) {
		return Promise.resolve(localStorage.getItem(key));
	}

	set(key, value) {
		localStorage.setItem(key, value);

		return Promise.resolve();
	}
}

export default new Config(new ElectronStorageBackend());
