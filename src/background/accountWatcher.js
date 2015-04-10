import Watcher from './watcher';
import TwitterStream from './twitter/stream';

const STREAM_CHECK_TIMEOUT = 1000 * 60;

export default class AccountWatcher extends Watcher {
	constructor(twitter, account) {
		super();

		this.twitter = twitter;
		this.account = account;

		this.homeTimelineLastTweetId = null;

		this.stream = null;
		this.streamCheckInterval = null;
	}

	start() {
		const watcher = this;

		if (!super.start()) {
			return;
		}

		console.log('starting to watch account', this.account);

		this.stream = this.twitter.api.getUserStream(this.account.token);
		this.stream.on('data', this.handleStreamData.bind(this));
		this.stream.start();

		this.streamCheckInterval = setInterval(this.streamCheck.bind(this), STREAM_CHECK_TIMEOUT);

		this.twitter
			.getHomeTimeline(this.account.token, this.homeTimelineLastTweetId)
			.catch(function(e) {
				if (401 === e.status) {
					watcher.handleTokenRevoke();
				}
			})
			.then(function(tweets) {
				const tweet = tweets.shift();

				if (tweet) {
					watcher.homeTimelineLastTweetId = tweet.id;
				}
			});
	}

	stop() {
		super.stop();

		console.log('account watch stopped', this.account);

		clearInterval(this.streamCheckInterval);
		this.streamCheckInterval = null;

		this.stream.stop();
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

	handleTweet(tweet) {
		const watcher = this;

		this.twitter
			.updateTweet(tweet)
			.then(function(tweet) {
				watcher.homeTimelineLastTweetId = tweet.id;
			});
	}

	handleStreamFriendsList(idsList) {
		const watcher = this;

		this.twitter
			.flushFriendShip(this.account.userId)
			.then(function() {
				idsList.forEach(id => {
					watcher.twitter.updateFriendShip(watcher.account.userId, id, true);
				});
			});
	}

	handleTokenRevoke() {
		console.warn('token is revoked, stopping watcher');

		this.account.unauthorize();
		this.stop();
	}

	handleStreamData(type, data) {
		switch (type) {
			case TwitterStream.TYPE_TOKEN_REVOKED:
				this.handleTokenRevoke();
				break;
			case TwitterStream.TYPE_TWEET:
				this.handleTweet(data);
				break;
			case TwitterStream.TYPE_FRIENDS_LIST:
				this.handleStreamFriendsList(data);
				break;
			default:
				console.warn('unhandled stream data update', type, data);
		}
	}
}
