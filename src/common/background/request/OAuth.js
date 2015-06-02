import hmacsha1 from 'hmacsha1';

import Request from '../request';
import keys from '../keys';

var timestampOffset = 0;

const NONCE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

function getNonce() {
	var result = [];

	for (let i = 0; i < 32; ++i) {
		result.push(
			NONCE_CHARS[Math.floor(Math.random() * NONCE_CHARS.length)]
		);
	}

	return result.join('');
}

function checkTimestamp(response) {
	for (let field of ['Last-Modified', 'Date']) {
		let value = response.getHeader(field);

		if (value
			&& 'string' === typeof value
		) {
			let remoteDate = Date.parse(value);

			if (remoteDate) {
				let newOffset = remoteDate - Date.now();

				if (timestampOffset !== newOffset) {
					timestampOffset = newOffset;
					return true;
				}
			}
		}
	}

	return false;
}

export default class RequestOAuth extends Request {
	constructor(url, method = 'GET') {
		super(url, method);

		this.OAuthData = { };
	}

	setOAuthData(name, value) {
		this.OAuthData[name] = value;
		return this;
	}

	getData() {
		var data = super.getData();

		Object.keys(this.OAuthData).forEach(key => data[key] = this.OAuthData[key]);

		return data;
	}

	sign(token = null) {
		var hashDataEncoded = [this.method, this.encode(this.url)].join('&');
		var hashData = [];
		var data;

		if ('GET' !== this.method) {
			this.setHeader('Content-Type', 'application/x-www-form-urlencoded');
		}

		this
			.setOAuthData('oauth_consumer_key', keys.CONSUMER_KEY)
			.setOAuthData('oauth_signature_method', 'HMAC-SHA1')
			.setOAuthData('oauth_version', '1.0')
			.setOAuthData('oauth_timestamp', Math.round((Date.now() - timestampOffset) / 1000))
			.setOAuthData('oauth_nonce', getNonce());

		if (token) {
			this.setOAuthData('oauth_token', token.token);
		}

		data = this.getData();

		Object.keys(data).sort().forEach(key => hashData.push(
			[
				this.encode(key),
				this.encode(data[key])
			].join('=')
		));

		hashDataEncoded = [hashDataEncoded, this.encode(hashData.join('&'))].join('&');

		this.setOAuthData(
			'oauth_signature',
			hmacsha1(
				[this.encode(keys.CONSUMER_SECRET), token ? this.encode(token.secret) : ''].join('&'),
				hashDataEncoded
			)
		);
	}

	send(token = null) {
		var request = this;
		var isRetry = false;

		function sendRequest() {
			if (token) {
				request.sign(token);
			} else {
				request.sign();
			}

			return super.send()
				.catch(function(response) {
					if (!isRetry
						&& 401 === response.status
						&& checkTimestamp(response)
					) {
						isRetry = true;

						delete request.OAuthData.oauth_signature;

						return sendRequest();
					}

					throw response;
				});
		}

		return sendRequest();
	}
}
