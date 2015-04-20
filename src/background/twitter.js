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

	// @todo move to twitter.auth module
	authorize(screenName = null) {
		const twitter = this;

		return getTwitterAuthorizer(screenName)
			.then(function(auth) {
				return new Promise(function(resolve) {
					chrome.identity.launchWebAuthFlow({
						url: auth.getAuthenticateUrl(),
						interactive: true
					}, function(redirectURI) {
						if (chrome.runtime.lastError) {
							throw new Error(chrome.runtime.lastError.message);
						}

						var linkElement = document.createElement('a');
						var params;

						linkElement.href = redirectURI;

						if (!linkElement.search) {
							throw new Error('wrong redirect url');
						}

						params = qs.decode(linkElement.search.substr(1));

						if (undefined !== params.denied) {
							throw new Error('access denied');
						}

						if (!params
							|| undefined === params.oauth_token
							|| undefined === params.oauth_verifier
						) {
							throw new Error('unknown auth reply');
						}

						if (!auth.isTokenValid(params.oauth_token)) {
							throw new Error('auth reply token invalid');
						}

						auth.getAccessToken(params.oauth_verifier)
							.then(resolve);
					});
				});
			})
			.then(function([token, userId]) {
				return twitter
					.getUser(userId)
					.then(function(user) {
						return [token, user];
					});
			});
	}

	updateUser(userJSON) {
		const twitter = this;

		return User
			.getById(this.db, userJSON['id_str'])
			.then(function(user) {
				if (!user) {
					user = new User();
				}

				user.parse(userJSON);

				return user
					.save(twitter.db)
					.then(function() {
						return user;
					});
			});
	}

	updateTweet(tweetJSON, skipUserUpdate = false) {
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
						return Promise.all([
							skipUserUpdate
								? Promise.resolve()
								: twitter.updateUser(tweetJSON['user']),
							undefined === tweetJSON['retweeted_status']
								? Promise.resolve()
								: twitter.updateTweet(tweetJSON['retweeted_status'])
						]).then(function() {
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
		const tweetUserIds = new Set();

		return this.api.getHomeTimeline(token, sinceId)
			.then(function(tweets) {
				if (!Array.isArray(tweets)) {
					return [];
				}

				return Promise.all(
					tweets.map(tweetJSON => {
						const tweetUserId = tweetJSON.user['id_str'];
						const skipUserUpdate = tweetUserIds.has(tweetUserId);

						if (!skipUserUpdate) {
							tweetUserIds.add(tweetUserId);
						}

						return twitter
							.updateTweet(tweetJSON, skipUserUpdate)
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
