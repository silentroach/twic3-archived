import connection from '../connection';

// time to wait before triggering [start] after connection is on
const AFTER_CONNECT_WAIT = 10 * 1000;

export default class Watcher {
	constructor() {
		this.state = Watcher.STATE_STOPPED;

		// @todo handle [on] state change after some delay
		connection.on('change', (connected) => {
			if (!connected
				&& this.state !== Watcher.STATE_STOPPED
			) {
				this.stop();
				this.state = Watcher.STATE_DISCONNECTED;
			} else
			if (connected
				&& this.state === Watcher.STATE_DISCONNECTED
			) {
				const state = connected;
				setTimeout(() => {
					if (connected === state) {
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
