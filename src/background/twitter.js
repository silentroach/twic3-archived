import TwitterAPI from './twitter/api';

import User from './model/user';

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

				return twitter.api.getUserInfo(userId)
					.then(function(userJSON) {
						var user = new User();
						user.parseFromJSON(userJSON);

						return user.save(twitter.db)
							.then(function() {
								return user;
							})
					});
			})
	}
}

setInterval(function() {
	for (let windowId of Object.keys(authenticationWindows)) {
		if (Date.now() - authenticationWindows[windowId] > AUTH_SESSION_TIMEOUT * 1000) {
			delete authenticationWindows[windowId];
		}
	}
}, AUTH_SESSION_TIMEOUT * 1000);
