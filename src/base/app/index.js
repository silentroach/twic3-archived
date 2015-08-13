import throttle from 'lodash.throttle';

import EventEmitter from '@twic/eventemitter';
import AccountList from 'core/struct/accountList';

import db from './db';

const CONFIG_ACCOUNTS_KEY = 'accounts';

const onAccountsUpdate = Symbol('onAccountsUpdate');

export default class Application extends EventEmitter {
	constructor(config) {
		super();

		this.db = db;
		this.config = config;
		this.accounts = null;
	}

	[onAccountsUpdate]() {
		console.log('accounts info changes, updating');

		this.config
			.set(CONFIG_ACCOUNTS_KEY, this.accounts.serialize())
			.then(() => {
				console.log('accounts list successfully updated');

				// @todo WARNING! old watchers are still working after load
				this.loadAccounts();
			});
	}

	loadAccounts() {
		return this.config
			.get(CONFIG_ACCOUNTS_KEY)
			.then(data => {
				console.log('account list loaded', data);

				this.accounts = AccountList.unserialize(data);
				this.accounts.on('change', throttle(() => this[onAccountsUpdate](), 1000));
			});
	}

	start() {
		return this.loadAccounts();
	}

	listen() {
		console.log('listening for messages...');
	}
}
