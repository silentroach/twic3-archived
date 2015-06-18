import Message from '../../message';
import MessageHandler from '../messageHandler';

export default class AuthHandler extends MessageHandler {
	getMessageType() {
		return Message.TYPE_TIMELINE;
	}

	getTweetData(tweet) {
		const handler = this;
		const data = tweet.getData();

		return Promise.all([
			undefined === tweet.retweetedId
				? Promise.resolve()
				: handler.app.twitter
					.getTweetById(tweet.retweetedId)
					.then(function(retweet) {
						if (!retweet) {
							return Promise.resolve();
						}

						return handler.getTweetData(retweet)
							.then(function(retweetData) {
								if (retweetData) {
									data.retweeted = retweetData;
								}
							});
					}),
			handler.app.twitter
				.getUserById(tweet.userId, true)
				.then(function(user) {
					data.user = user;
				})
		]).then(function() {
			return data;
		});
	}

	handle(messageData) {
		const handler = this;
		const userId = messageData.userId;

		return this.app.twitter
			.getCachedHomeTimeline(userId)
			.then(function(tweets) {
				return Promise.all(
					tweets.map(tweet => handler.getTweetData(tweet))
				);
			});
	}
}
