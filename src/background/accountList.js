import Account from './account';

const STORAGE_KEY = 'accounts';

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

	save(storage) {
		var storeObj = { };

		storeObj[STORAGE_KEY] = this.accounts.map(account => account.serialize());

		return new Promise(function(resolve, reject) {
			storage.set(storeObj, function() {
				if (chrome.runtime.lastError) {
					reject(
						new Error(
							undefined !== chrome.runtime.lastError.message ?
								chrome.runtime.lastError.message : 'Failed to save data'
						)
					);
				} else {
					resolve();
				}
			});
		});
	}

	static load(storage) {
		var list = new AccountList();

		return new Promise(function(resolve) {
			storage.get(STORAGE_KEY, function(items) {
				if (undefined !== items[STORAGE_KEY]) {
					items[STORAGE_KEY].forEach(function(data) {
						list.add(Account.load(data));
					});
				}

				resolve(list);
			});
		});
	}
}
