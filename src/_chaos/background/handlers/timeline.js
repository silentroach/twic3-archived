import uniq from 'lodash.uniq';

import Message from '../../message';
import MessageHandler from '../messageHandler';

export default class AuthHandler extends MessageHandler {
	getMessageType() {
		return Message.TYPE_TIMELINE;
	}

	getIdsHash(data) {
		const hash = { };
		data.forEach(element => hash[element.id] = element);
		return hash;
	}

	getRetweetDataByIds(ids) {
		return Promise.all(
			ids.map(id => this.app.twitter.getTweetById(id))
		).then(data => this.getIdsHash(data));
	}

	getUserInfoByIds(ids) {
		return Promise.all(
			ids.map(id => this.app.twitter.getUserById(id, true))
		).then(data => this.getIdsHash(data));
	}

	handle(messageData) {
		const handler = this;
		const userId = messageData.userId;

		return this.app.twitter
			.getCachedHomeTimeline(userId)
			.then(tweets => {
				const retweetIds = uniq(
					tweets
						.map(tweet => tweet.retweetedId)
						.filter(id => id)
				);

				return this.getRetweetDataByIds(retweetIds).then(retweeted => {
					const userIds = uniq([
						...tweets.map(tweet => tweet.userId),
						...Object.keys(retweeted).map(id => retweeted[id].userId)
					]);

					return this.getUserInfoByIds(userIds).then(users => {
						function getTweetData(tweet) {
							const data = tweet.getData();
							data.user = users[tweet.userId];
							return data;
						}

						return tweets.map(tweet => {
							const data = getTweetData(tweet);

							if (tweet.retweetedId) {
								data.retweeted = getTweetData(retweeted[tweet.retweetedId]);
							}

							return data;
						});
					});
				});
			});
	}
}
