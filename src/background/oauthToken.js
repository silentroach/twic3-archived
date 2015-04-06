const TOKEN_FIELD = Symbol('token');
const SECRET_FIELD = Symbol('secret');

export default class OAuthToken {
	constructor(token, secret) {
		this[TOKEN_FIELD] = token;
		this[SECRET_FIELD] = secret;
	}

	get token() {
		return this[TOKEN_FIELD];
	}

	get secret() {
		return this[SECRET_FIELD];
	}

	serialize() {
		return {
			token: this.token,
			secret: this.secret
		};
	}

	static load(data) {
		return new OAuthToken(data.token, data.secret);
	}
}
