import Account from '../account';
import Message from '../../message';
import MessageHandler from '../messageHandler';

export default class AuthHandler extends MessageHandler {
	getMessageType() {
		return Message.TYPE_TIMELINE;
	}

	handle(messageData) {
		const handler = this;
		const userId = messageData.userId;

		return this.app.twitter
			.getCachedHomeTimeline(userId)
			.then(function(tweets) {
				return Promise.all(
					tweets.map(tweet => {
						const data = tweet.getData();

						return handler.app.twitter
							.getUserById(tweet.userId, true)
							.then(function(user) {
								data.user = user;
								return data;
							});
					})
				);
			});
	}
}
