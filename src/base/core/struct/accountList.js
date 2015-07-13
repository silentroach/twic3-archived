import Struct from './';
import Account from './account';

const listField = Symbol('list');

export default class AccountList extends Struct {
	constructor() {
		super();

		this[listField] = new Map();
	}

	get length() {
		return this[listField].size;
	}

	add(account) {
		account.on('change', () => this.emit('change'));
		this[listField].set(account.userId, account);

		this.emit('change');

		return this;
	}

	map(callback) {
		const result = [];

		this[listField].forEach(function(account, key) {
			result.push(callback(account, key));
		});

		return result;
	}

	getByUserId(userId) {
		return this[listField].get(userId);
	}

	serialize() {
		return this.map(account => account.serialize());
	}

	unserialize(data) {
		if (!Array.isArray(data)) {
			return;
		}

		data.forEach(accountData => this.add(Account.unserialize(accountData)));
	}
}
