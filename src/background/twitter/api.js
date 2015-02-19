import qs from 'querystring';

import RequestOAuth from '../requestOAuth';
import OAuthToken from '../oauthToken';
import Limits from './limits';

const BASE_URL = 'https://api.twitter.com/1.1/';
const AUTH_URL = 'https://api.twitter.com/oauth/';

const TIMELINE_LIMIT = 100;

export default class TwitterAPI {
	constructor() {
		this.resetToken();

		this.limits = { };
	}

	getLimits(token) {
		if (undefined === this.limits[token.token]) {
			this.limits[token.token] = new Limits(token);
		}

		return this.limits[token.token];
	}

	resetToken() {
		this.token = null;
	}

	getAuthorizeUrl(token, login = null) {
		var params = {
			oauth_token: token.token
		};

		if (login) {
			params.screen_name = login;
		}

		return AUTH_URL + 'authorize?' + qs.encode(params);
	}

	getRequestToken() {
		var api = this;
		var req;

		if (this.token) {
			return Promise.resolve(this.token);
		}

		console.debug('api: requesting token');

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

				console.debug('api: requesting access token');

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
		var req = new RequestOAuth(path);

		console.debug('api: requesting configuration');

		req
			.send()
			.then(function(response) {
				return response.content;
			});
	}

	getUserInfo(userId) {
		var path = BASE_URL + 'users/show.json';
		var req = new RequestOAuth(path);

		console.debug('api: requesting user info', userId);

		return req
			.setRequestData('user_id', userId)
			.setRequestData('include_entities', 1)
			.send()
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

		console.debug('api: requesting timeline', sinceId);

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
}
