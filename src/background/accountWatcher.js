import TwitterStream from './twitter/stream';
import connection from '../connection';

const STREAM_CHECK_TIMEOUT = 1000 * 60;

export default class AccountWatcher {
	constructor(twitter, account) {
		this.twitter = twitter;
		this.account = account;

		this.stream = null;
		this.streamCheckInterval = null;

		this.state = AccountWatcher.STATE_STOPPED;

		connection.on('change', this.handleConnectedChange.bind(this));
	}

	handleConnectedChange(connected) {
		if (!connected
			&& this.state !== AccountWatcher.STATE_STOPPED
		) {
			this.stop();
			this.state = AccountWatcher.STATE_DISCONNECTED;
		} else
		if (connected
			&& this.state === AccountWatcher.STATE_DISCONNECTED
		) {
			this.start();
		}
	}

	start() {
		console.log('starting to watch account', this.account);

		if (!connection.connected) {
			this.state = AccountWatcher.STATE_DISCONNECTED;
			return;
		}

		this.state = AccountWatcher.STATE_STARTED;

		this.stream = this.twitter.api.getUserStream(this.account.token);
		this.stream.on('data', this.handleStreamData.bind(this));
		this.stream.start();

		this.streamCheckInterval = setInterval(this.streamCheck.bind(this), STREAM_CHECK_TIMEOUT);

		this.twitter.getHomeTimeline(this.account.token/**, @todo sinceId */);
	}

	stop() {
		console.log('account watch stopped', this.account);

		this.state = AccountWatcher.STATE_STOPPED;

		clearInterval(this.streamCheckInterval);
		this.streamCheckInterval = null;

		this.stream.stop();
	}

	restart() {
		this.stop();
		this.start();
	}

	streamCheck() {
		var updateDiff = Date.now() - this.stream.lastUpdateTime;
		if (updateDiff > STREAM_CHECK_TIMEOUT
			|| this.stream.errorsCount > 0
		) {
			console.warn('stream distrust, restarting', {
				lastUpdateDiff: updateDiff,
				errorsCount: this.stream.errorsCount
			});

			this.restart();
		}
	}

	handleStreamFriendsList(idsList) {
		idsList.forEach(id => {
			this.twitter.updateFriendShip(this.account.userId, id, true);
		});
	}

	handleStreamData(type, data) {
		switch (type) {
			case TwitterStream.TYPE_FRIENDS_LIST:
				this.handleStreamFriendsList(data);
				break;
			default:
				console.warn('unhandled stream data update', type, data);
		}
	}
}

AccountWatcher.STATE_STARTED = 1;
AccountWatcher.STATE_DISCONNECTED = 2;
AccountWatcher.STATE_STOPPED = 3;
