import connection from '../../connection';

const CONFIG_CHECK_TIMEOUT = 1000 * 60 * 60;

export default class TwitterConfigWatcher {
	constructor(config, twitter) {
		this.config = config;
		this.twitter = twitter;

		this.state = TwitterConfigWatcher.STATE_STOPPED;

		this.checkInterval = null;

		connection.on('change', this.handleConnectedChange.bind(this));
	}

	handleConnectedChange(connected) {
		if (!connected
			&& this.state !== TwitterConfigWatcher.STATE_STOPPED
		) {
			this.stop();
			this.state = TwitterConfigWatcher.STATE_DISCONNECTED;
		} else
		if (connected
			&& this.state === TwitterConfigWatcher.STATE_DISCONNECTED
		) {
			this.start();
		}
	}

	start() {
		if (!connection.connected) {
			this.state = TwitterConfigWatcher.STATE_DISCONNECTED;
			return;
		}

		console.log('config watcher started');

		this.checkInterval = setInterval(this.fetchNewConfigData.bind(this), CONFIG_CHECK_TIMEOUT);
		this.fetchNewConfigData();
	}

	stop() {
		console.log('config watcher stopped');

		this.state = TwitterConfigWatcher.STATE_STOPPED;

		clearInterval(this.checkInterval);
		this.checkInterval = null;
	}

	fetchNewConfigData() {
		var watcher = this;

		this.config
			.get('short_url_limits')
			.then(function(limits) {
				if (limits && Date.now() - limits.updated < CONFIG_CHECK_TIMEOUT) {
					return true;
				}

				watcher.twitter
					.getConfiguration()
					.then(function(config) {
						watcher.config.set('short_url_limits', {
							http: config.short_url_length,
							https: config.short_url_length_https,
							updated: Date.now()
						});
					});
			});
	}
}

TwitterConfigWatcher.STATE_STARTED = 1;
TwitterConfigWatcher.STATE_DISCONNECTED = 2;
TwitterConfigWatcher.STATE_STOPPED = 3;
