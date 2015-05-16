import TwitterAPI from './twitter/api';
import getTwitterAuthorizer from './twitter/auth';

import User from './model/user';
import Friendship from './model/friendship';
import Tweet from './model/tweet';

import Response from './response';

import qs from 'querystring';

export default class Twitter {
	constructor(db) {
		this.api = new TwitterAPI();
		this.db = db;
	}

	authorize(screenName = null) {
		const twitter = this;

		return getTwitterAuthorizer(screenName)
			.then(function(auth) {
				return auth.authorize();
			})
			.then(function([token, userId]) {
				return twitter
					.getUserById(userId)
					.then(function(user) {
						return [token, user];
					});
			});
	}

	updateUser(userJSON, isStreaming = false) {
		const twitter = this;

		return User
			.getById(this.db, userJSON['id_str'])
			.then(function(user) {
				if (!user) {
					user = new User();
				}

				user.parse(userJSON, !isStreaming);

				return user
					.save(twitter.db)
					.then(function() {
						return user;
					});
			});
	}

	deleteTweet(id) {
		return Tweet.deleteById(this.db, id);
	}

	updateTweet(
		tweetJSON,
		skipUpdateUserIds,
		isStreaming = false
	) {
		const twitter = this;

		return Tweet
			.getById(twitter.db, tweetJSON['id_str'])
			.then(function(tweet) {
				if (!tweet) {
					tweet = new Tweet();
				}

				tweet.parse(tweetJSON);

				return tweet
					.save(twitter.db)
					.then(function() {
						const promises = [];
						const tweetUserId = tweetJSON['user']['id_str'];

						if (!skipUpdateUserIds
							|| !skipUpdateUserIds.has(tweetUserId)
						) {
							if (skipUpdateUserIds) {
								skipUpdateUserIds.add(tweetUserId);
							}

							promises.push(
								twitter.updateUser(
									tweetJSON['user'],
									isStreaming
								)
							);
						}

						if (undefined !== tweetJSON['retweeted_status']) {
							promises.push(
								twitter.updateTweet(
									tweetJSON['retweeted_status'],
									skipUpdateUserIds,
									isStreaming
								)
							);
						}

						return Promise
							.all(promises)
							.then(function() {
								return tweet;
							});
					});
			});
	}

	/* private */ getUser(modelMethod, apiMethod, value, allowOutdated) {
		const twitter = this;

		return modelMethod.call(User, this.db, value)
			.then(function(user) {
				if (user
					&& (allowOutdated
						|| !user.isOutdated()
					)
				) {
					return user;
				}

				if (!user) {
					user = new User();
				}

				return apiMethod.call(twitter.api, value)
					.then(twitter.updateUser.bind(twitter))
					.catch(function(response) {
						if (404 === response.status) {
							return null;
						}
						// error codes @ https://dev.twitter.com/overview/api/response-codes
						// if (403 === response.status) {
							// .code == 63 -> user has beed suspended
						// }
					});
			});
	}

	getUserByScreenName(screenName, allowOutdated = false) {
		return this.getUser(
			User.getByScreenName, this.api.getUserInfoByScreenName, screenName, allowOutdated
		);
	}

	getUserById(userId, allowOutdated = false) {
		return this.getUser(
			User.getById, this.api.getUserInfoById, userId, allowOutdated
		);
	}

	getTweetById(tweetId) {
		return Tweet.getById(this.db, tweetId);
	}

	getHomeTimelineLastCachedId(userId) {
		return Tweet.getLastTimelineId(this.db, userId);
	}

	// @todo rethink it all
	getCachedHomeTimeline(userId) {
		return Tweet.getHomeTimeline(this.db, userId);
	}

	getHomeTimeline(userId, token, sinceId) {
		const twitter = this;
		const skipUpdateUserIds = new Set();

		return this.api.getHomeTimeline(token, sinceId)
			.then(function(tweets) {
				if (!Array.isArray(tweets)) {
					return [];
				}

				return Promise.all(
					tweets.map(tweetJSON => {
						const tweetUserId = tweetJSON.user['id_str'];

						return twitter
							.updateTweet(tweetJSON, skipUpdateUserIds)
							.then(function(tweet) {
								return tweet
									.addTimelineUserId(userId)
									.save(twitter.db);
							});
					})
				);
			});
	}

	flushFriendShip(userId) {
		return Friendship.flush(this.db, userId);
	}

	updateFriendShip(userId, targetUserId, isFollower) {
		const twitter = this;

		return Friendship
			.getByUserIds(this.db, userId, targetUserId)
			.then(function(friendship) {
				if (!friendship) {
					friendship = new Friendship();
					friendship.ids = [userId, targetUserId].join('_');
					friendship.userId = userId;
					friendship.exists = true;
					friendship.markAsChanged();
					return friendship.save(twitter.db);
				} else {
					if (!friendship.exists) {
						friendship.exists = true;
						friendship.markAsChanged();
						return friendship.save(twitter.db);
					}
				}

				return Promise.resolve();
			});
	}

	// @todo store it
	getConfiguration() {
		return this.api.getConfiguration();
	}
}
