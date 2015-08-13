import EventEmitter from '@twic/eventemitter';

let connected = navigator.onLine;

/**
 * Internet connection watcher
 */
class Connection extends EventEmitter {
	constructor() {
		super();

		const connection = this;

		function stateChange() {
			if (connected !== navigator.onLine) {
				connected = navigator.onLine;

				console.log('connection is now', connected ? 'on' : 'off');

				connection.emit('change', connected);
			}
		}

		window.addEventListener('online', stateChange);
		window.addEventListener('offline', stateChange);

		// connected state can be switched without online/offline events triggering,
		// so will check it every minute
		setInterval(stateChange, 60 * 1000);
	}

	get connected() {
		return connected;
	}
}

export default new Connection();
