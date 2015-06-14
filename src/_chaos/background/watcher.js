import connection from 'core/connection';

// time to wait before triggering [start] after connection is on
const AFTER_CONNECT_WAIT = 10 * 1000;

export default class Watcher {
	constructor() {
		let timeout;

		this.state = Watcher.STATE_STOPPED;

		connection.on('change', (connected) => {
			clearTimeout(timeout);

			if (!connected
				&& this.state !== Watcher.STATE_STOPPED
				&& this.state !== Watcher.STATE_DISCONNECTED
			) {
				this.stop();
				this.state = Watcher.STATE_DISCONNECTED;
			} else
			if (connected
				&& this.state === Watcher.STATE_DISCONNECTED
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
		this.state = Watcher.STATE_STOPPED;
	}

	start() {
		if (!connection.connected) {
			this.state = Watcher.STATE_DISCONNECTED;
			return false;
		}

		this.state = Watcher.STATE_STARTED;

		return true;
	}

	restart() {
		this.stop();
		this.start();
	}
}

Watcher.STATE_STARTED = 1;
Watcher.STATE_DISCONNECTED = 2;
Watcher.STATE_STOPPED = 3;
