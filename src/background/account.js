import OAuthToken from './oauthToken';
import EventEmitter from '../eventEmitter';

export default class Account extends EventEmitter {
	constructor() {
		super();

		this.userId = null;
		this.token = null;
	}

	serialize() {
		return {
			userId: this.userId,
			token: this.token ? this.token.serialize() : null
		};
	}

	unauthorize() {
		this.token = null;
		this.emit('change');
	}

	isAuthorized() {
		return null !== this.token;
	}

	static load(data) {
		const account = new Account();

		account.userId = data.userId;
		if (data.token) {
			account.token = OAuthToken.load(data.token);
		}

		return account;
	}
}
