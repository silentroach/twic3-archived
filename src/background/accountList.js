import Account from './account';

const CONFIG_KEY = 'accounts';

export default class AccountList {
	constructor() {
		this.accounts = [ ];
	}

	get length() {
		return this.accounts.length;
	}

	add(account) {
		this.accounts.push(account);
		return this;
	}

	map(callback) {
		return this.accounts.map(callback);
	}

	[Symbol.iterator]() {
		var list = this;
		var idx = 0;

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

	getByScreenName(screenName) {
		for (let account of this) {
			if (screenName === account.screenName) {
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
		var list = new AccountList();

		return config
			.get(CONFIG_KEY)
			.then(function(data) {
				if (Array.isArray(data)) {
					data.forEach(function(accountData) {
						list.add(Account.load(accountData));
					});
				}

				return list;
			});
	}
}
