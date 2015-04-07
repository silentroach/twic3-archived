import Watcher from '../watcher';

const CONFIG_CHECK_TIMEOUT = 1000 * 60 * 60;

export default class TwitterConfigWatcher extends Watcher {
	constructor(config, twitter) {
		super();

		this.config = config;
		this.twitter = twitter;

		this.checkInterval = null;
	}

	start() {
		if (!super.start()) {
			return;
		}

		console.log('config watcher started');

		this.checkInterval = setInterval(this.fetchNewConfigData.bind(this), CONFIG_CHECK_TIMEOUT);
		this.fetchNewConfigData();
	}

	stop() {
		super.stop();

		console.log('config watcher stopped');

		clearInterval(this.checkInterval);
		this.checkInterval = null;
	}

	fetchNewConfigData() {
		const watcher = this;

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
