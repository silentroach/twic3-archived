import TwitterAPI from './twitter/api';

import User from './model/user';
import Friendship from './model/friendship';
import Tweet from './model/tweet';

import Response from './response';

const AUTH_SESSION_TIMEOUT = 300;

var authenticationWindows = { };

export default class Twitter {
	constructor(db) {
		this.api = new TwitterAPI();
		this.db = db;
	}

	isAuthenticationWindowRegistered(windowId) {
		var timestamp = authenticationWindows[windowId];

		if (undefined === timestamp) {
			return false;
		}

		if (Date.now() - timestamp > AUTH_SESSION_TIMEOUT * 1000) {
			delete authenticationWindows[windowId];
			return false;
		}

		return true;
	}

	startAuthentication(login = null) {
		var twitter = this;

		this.api.resetToken();

		return new Promise(function(resolve, reject) {
			twitter.api.getRequestToken()
				.then(function(token) {
					var url = twitter.api.getAuthorizeUrl(token, login);

					chrome.windows.create({
						url: url,
						width: 600,
						height: 650,
						focused: true,
						type: 'popup'
					}, function(window) {
						authenticationWindows[window.id] = Date.now();
						resolve();
					});
				});
		});
	}

	authorize(windowId, pin) {
		var twitter = this;

		if (!this.isAuthenticationWindowRegistered(windowId)) {
			return Promise.reject();
		}

		delete authenticationWindows[windowId];

		return this.api
			.getAccessToken(pin)
			.then(function([token, userId]) {
				return twitter.getUser(userId)
					.then(function(user) {
						return [token, user];
					});
			});
	}

	updateUser(userJSON) {
		var twitter = this;

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

	updateTweet(tweetJSON) {
		var twitter = this;

		Tweet
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
							twitter.updateUser(tweetJSON['user']),
							function() {
								if (tweetJSON['retweeted_status']) {
									return twitter.updateTweet(tweetJSON['retweeted_status']);
								}

								return Promise.resolve();
							}
						]).then(function() {
							return tweet;
						});
					});
			});
	}

	getUser(userId) {
		var twitter = this;

		return User
			.getById(this.db, userId)
			.then(function(user) {
				if (user
					&& !user.isOutdated()
				) {
					return user;
				}

				if (!user) {
					user = new User();
				}

				return twitter.api.getUserInfo(userId)
					.then(twitter.updateUser.bind(twitter))
					.catch(function(response) {
						if (!(response instanceof Response)) {
							throw response;
						}

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

	getHomeTimeline(token, sinceId) {
		var twitter = this;

		this.api.getHomeTimeline(token, sinceId)
			.then(function(tweets) {
				if (!Array.isArray(tweets)) {
					return [];
				}

				return Promise.all(
					tweets.map(tweetJSON => twitter.updateTweet(tweetJSON))
				);
			});
	}

	updateFriendShip(userId, targetUserId, isFollower) {
		var twitter = this;

		return Friendship
			.getByUserIds(this.db, userId, targetUserId)
			.then(function(friendship) {
				if (!friendship) {
					let friendship = new Friendship();
					friendship.ids = [userId, targetUserId].join('_');
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

	getConfiguration() {
		return this.api.getConfiguration();
	}
}

setInterval(function() {
	for (let windowId of Object.keys(authenticationWindows)) {
		if (Date.now() - authenticationWindows[windowId] > AUTH_SESSION_TIMEOUT * 1000) {
			delete authenticationWindows[windowId];
		}
	}
}, AUTH_SESSION_TIMEOUT * 1000);
