import connection from '@twic/connection';

const STATE_STARTED = 1;
const STATE_DISCONNECTED = 2;
const STATE_STOPPED = 3;

// time to wait before triggering [start] after connection is on
const AFTER_CONNECT_WAIT = 10 * 1000;

export default class Watcher {
	constructor() {
		let timeout;

		this.state = STATE_STOPPED;

		connection.on('change', (connected) => {
			clearTimeout(timeout);

			if (!connected
				&& this.state !== STATE_STOPPED
				&& this.state !== STATE_DISCONNECTED
			) {
				this.stop();
				this.state = STATE_DISCONNECTED;
			} else
			if (connected
				&& this.state === STATE_DISCONNECTED
			) {
				const state = connected;
				timeout = setTimeout(() => {
					if (connection.connected === state) {
						this.start();
					}
				}, AFTER_CONNECT_WAIT);
			}
		});
	}

	stop() {
		this.state = STATE_STOPPED;
	}

	start() {
		if (!connection.connected) {
			this.state = STATE_DISCONNECTED;
			return false;
		}

		this.state = STATE_STARTED;

		return true;
	}

	restart() {
		this.stop();
		this.start();
	}
}
