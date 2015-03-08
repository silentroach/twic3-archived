import connection from '../connection';

export default class Watcher {
	constructor() {
		this.state = Watcher.STATE_STOPPED;

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
				this.start();
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
