import Token from 'core/struct/token';
import EventEmitter from 'core/eventEmitter';

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
			account.token = Token.unserialize(data.token);
		}

		return account;
	}
}
