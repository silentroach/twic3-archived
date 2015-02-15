export default class OAuthToken {
	constructor(token, secret) {
		this.token = token;
		this.secret = secret;
	}

	serialize() {
		return {
			token: this.token,
			secret: this.secret
		};
	}
}

OAuthToken.load = function(data) {
	return new OAuthToken(data.token, data.secret);
};
