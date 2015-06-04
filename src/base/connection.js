import EventEmitter from './eventEmitter';

let connected = navigator.onLine;

/**
 * Internet connection watcher
 */
class Connection extends EventEmitter {
	constructor() {
		super();

		const connection = this;

		function stateChange() {
			connected = navigator.onLine;

			console.log('connection is now', connected ? 'on' : 'off');

			connection.emit('change', connected);
		}

		window.addEventListener('online', stateChange);
		window.addEventListener('offline', stateChange);
	}

	get connected() {
		return connected;
	}
}

export default new Connection();
