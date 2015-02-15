import qs from 'querystring';

import RequestOAuth from './requestOAuth';
import OAuthToken from './oauthToken';

const BASE_URL = 'https://api.twitter.com/1.1/';
const AUTH_URL = 'https://api.twitter.com/oauth/';

export default class TwitterAPI {
	constructor() {
		this.resetToken();
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

	getAccessToken(pin) {
		var api = this;

		return this.getRequestToken()
			.then(function(token) {
				var req = new RequestOAuth(AUTH_URL + 'access_token', 'POST');

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

	getUserInfo(userId) {
		var req = new RequestOAuth(BASE_URL + 'users/show.json');

		return req
			.setRequestData('user_id', userId)
			.setRequestData('include_entities', 1)
			.send()
			.then(function(response) {
				return JSON.parse(response.content)
			});
	}
}
