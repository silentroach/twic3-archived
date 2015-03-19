import qs from 'querystring';

import RequestOAuth from '../request/OAuth';
import OAuthToken from '../oauthToken';

const AUTH_URL = 'https://api.twitter.com/oauth/';

function getRequestToken() {
	var redirectUrl = chrome.identity.getRedirectURL();
	var req;

	console.log('twitter auth: requesting token');

	req = new RequestOAuth(AUTH_URL + 'request_token', 'POST');

	return req
		.setRequestData('oauth_callback', redirectUrl)
		.send()
		.then(function(response) {
			var data = qs.decode(response.content);

			if (!data
				|| undefined === data.oauth_token
				|| undefined === data.oauth_token_secret
				|| !data.oauth_callback_confirmed
			) {
				throw new Error('Wrong request token response');
			}

			return new OAuthToken(data.oauth_token, data.oauth_token_secret);
		});
}

class TwitterAuth {
	constructor(token, login = null) {
		this.token = token;
		this.login = login;
	}

	getAuthenticateUrl() {
		var params = {
			'oauth_token': this.token.token
		};

		if (this.login) {
			params['screen_name'] = this.login;
		}

		return AUTH_URL + 'authenticate?' + qs.encode(params);
	}

	isTokenValid(token) {
		return this.token.token === token;
	}

	getAccessToken(verifier) {
		var req = new RequestOAuth(AUTH_URL + 'access_token', 'POST');

		console.log('twitter auth: requesting access token');

		return req
			.setRequestData('oauth_verifier', verifier)
			.send(this.token)
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
			});
	}
}

export default function(login = null) {
	return getRequestToken()
		.then(function(token) {
			return new TwitterAuth(token, login);
		});
}
