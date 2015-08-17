import hmacsha1 from 'hmacsha1';

const NONCE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

function getNonce() {
	const result = [];

	for (let i = 0; i < 32; ++i) {
		result.push(
			NONCE_CHARS[Math.floor(Math.random() * NONCE_CHARS.length)]
		);
	}

	return result.join('');
}

function sign(request, key, secret, token = null) {
	let hashDataEncoded = [request.method, encodeURIComponent(request.url)].join('&');
	const oauthData = {
		'oauth_consumer_key': key,
		'oauth_signature_method': 'HMAC-SHA1',
		'oauth_version': '1.0',
		'oauth_timestamp': Math.round((Date.now() - /* timestampOffset */ 0) / 1000),
		'oauth_nonce': getNonce()
	};

	if (token) {
		oauthData['oauth_token'] = token.token;
	}

	const hashData = Array.from(request.query.keys())
		.sort()
		.map(dataKey => [
			encodeURIComponent(dataKey),
			encodeURIComponent(request.query.get(dataKey))
		].join('='));

	hashDataEncoded = [hashDataEncoded, encodeURIComponent(hashData.join('&'))].join('&');

	oauthData['oauth_signature'] = hmacsha1(
		[secret, token ? token.secret : ''].map(data => encodeURIComponent(data)).join('&'),
		hashDataEncoded
	);

	Object.keys(oauthData).forEach(dataKey => request.query.set(dataKey, oauthData[dataKey]));
}

export default function (key, secret, token = null) {

	return function(request) {
		return sign(request, key, secret, token);
	};

}
