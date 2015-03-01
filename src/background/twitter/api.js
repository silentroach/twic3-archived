import qs from 'querystring';

import RequestOAuth from '../request/OAuth';
import OAuthToken from '../oauthToken';
import Limits from './limits';
import TwitterStream from './stream';

const BASE_URL = 'https://api.twitter.com/1.1/';
const AUTH_URL = 'https://api.twitter.com/oauth/';
const STREAM_URL = 'https://userstream.twitter.com/1.1/';

const TIMELINE_LIMIT = 100;

export default class TwitterAPI {
	constructor() {
		this.resetToken();

		this.limits = { };
	}

	getLimits(token = null) {
		var key = token ? token.token : '_';

		if (undefined === this.limits[key]) {
			this.limits[key] = new Limits(token);
		}

		return this.limits[key];
	}

	resetToken() {
		this.token = null;
	}

	// @todo split authorization calls into another module
	getAuthorizeUrl(token, login = null) {
		var params = {
			'oauth_token': token.token
		};

		if (login) {
			params['screen_name'] = login;
		}

		return AUTH_URL + 'authorize?' + qs.encode(params);
	}

	getRequestToken() {
		var api = this;
		var req;

		if (this.token) {
			return Promise.resolve(this.token);
		}

		console.log('api: requesting token');

		req = new RequestOAuth(AUTH_URL + 'request_token', 'POST');

		return req.send()
			.then(function(response) {
				var data = qs.decode(response.content);

				if (!data
					|| undefined === data.oauth_token
					|| undefined === data.oauth_token_secret
				) {
					throw new Error('Wrong request token response');
				}

				api.token = new OAuthToken(data.oauth_token, data.oauth_token_secret);

				return api.token;
			});
	}

	// requestToken нужен только здесь?
	getAccessToken(pin) {
		var api = this;

		return this.getRequestToken()
			.then(function(token) {
				var req = new RequestOAuth(AUTH_URL + 'access_token', 'POST');

				console.log('api: requesting access token');

				return req
					.setRequestData('oauth_verifier', pin)
					.send(token);
			})
			.then(function(response) {
				var data = qs.decode(response.content);
				var token;

				if (!data
					|| undefined === data.oauth_token
					|| undefined === data.oauth_token_secret
				) {
					throw new Error('Invalid access token response');
				}

				token = new OAuthToken(data.oauth_token, data.oauth_token_secret);

				return [token, data.user_id];
			})
			.catch(function() {
				api.resetToken();
			});
	}

	getConfiguration() {
		var path = BASE_URL + 'help/configuration.json';
		var limits = this.getLimits();
		var req = new RequestOAuth(path);

		if (limits.isRestricted(path)) {
			throw new Error('Request rate exceeded');
		}

		console.log('api: requesting configuration');

		return req
			.send()
			.then(function(response) {
				limits.update(path, response);
				return response;
			})
			.then(function(response) {
				return response.content;
			});
	}

	getUserInfo(userId) {
		var path = BASE_URL + 'users/show.json';
		var limits = this.getLimits();
		var req = new RequestOAuth(path);

		if (limits.isRestricted(path)) {
			throw new Error('Request rate exceeded');
		}

		console.log('api: requesting user info', userId);

		return req
			.setRequestData('user_id', userId)
			.setRequestData('include_entities', 1)
			.send()
			.then(function(response) {
				limits.update(path, response);
				return response;
			})
			.then(function(response) {
				return response.content;
			});
	}

	getHomeTimeline(token, sinceId = null) {
		var path = BASE_URL + 'statuses/home_timeline.json';
		var limits = this.getLimits(token);
		var req;

		if (limits.isRestricted(path)) {
			throw new Error('Request rate exceeded');
		}

		console.log('api: requesting timeline', sinceId);

		req = new RequestOAuth(path);

		if (sinceId) {
			req.setRequestData('since_id', sinceId);
		}

		return req
			.setRequestData('count', TIMELINE_LIMIT)
			.setRequestData('include_entities', 1)
			.send(token)
			.then(function(response) {
				limits.update(path, response);
				return response;
			})
			.then(function(response) {
				return response.content;
			});
	}

	getUserStream(token) {
		var path = STREAM_URL + 'user.json';
		var stream = new TwitterStream(path, token);

		return stream.setRequestData('stringify_friend_ids', true);
	}
}
