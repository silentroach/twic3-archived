import Account from 'core/struct/account';
import EventEmitter from 'core/eventEmitter';

const CONFIG_KEY = 'accounts';

export default class AccountList extends EventEmitter {
	constructor() {
		super();

		this.accounts = [ ];
	}

	get length() {
		return this.accounts.length;
	}

	add(account) {
		const list = this;

		this.accounts.push(account);
		account.on('change', function() {
			list.emit('change');
		});

		return this;
	}

	map(callback) {
		return this.accounts.map(callback);
	}

	[Symbol.iterator]() {
		const list = this;
		let idx = 0;

		return {
			next() {
				var result = {
					done: true,
					value: undefined
				};

				if (undefined === list.accounts[idx]) {
					return result;
				}

				result.done = false;
				result.value = list.accounts[idx++];

				return result;
			}
		};
	}

	getByUserId(userId) {
		for (let account of this) {
			if (userId === account.userId) {
				return account;
			}
		}

		return null;
	}

	save(config) {
		return config
			.set(CONFIG_KEY, this.accounts.map(account => account.serialize()));
	}

	static load(config) {
		const list = new AccountList();

		return config
			.get(CONFIG_KEY)
			.then(function(data) {
				if (Array.isArray(data)) {
					data.forEach(function(accountData) {
						list.add(Account.unserialize(accountData));
					});
				}

				return list;
			});
	}
}
