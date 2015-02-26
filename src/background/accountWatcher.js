import TwitterStream from './twitter/stream';

export default class AccountWatcher {
	constructor(twitter, account) {
		this.twitter = twitter;
		this.account = account;

		this.stream = null;
	}

	start() {
		console.log('starting to watch account', this.account);

		this.stream = this.twitter.api.getUserStream(this.account.token);
		this.stream.on('data', this.handleStreamData.bind(this));
		this.stream.start();
	}

	stop() {
		console.log('account watch stopped', this.account);
	}

	handleStreamFriendsList(idsList) {
		idsList.forEach(id => {
			this.twitter.updateFriendShip(this.account.userId, id, true)
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
