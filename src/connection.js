import EventEmitter from './eventEmitter';

var connected = navigator.onLine;

class Connection extends EventEmitter {
	constructor() {
		super();

		var connection = this;

		// @todo trigger change to [on] state after delay in 3-5 seconds
		function stateChange() {
			console.log('connection is now', connected ? 'on' : 'off');

			connected = navigator.onLine;
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
