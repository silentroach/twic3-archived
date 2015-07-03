import EventEmitter from 'core/eventEmitter';

import AccountList from 'core/struct/accountList';

import db from './db';

const CONFIG_ACCOUNTS_KEY = 'accounts';

export default class Application extends EventEmitter {
	constructor(config) {
		super();

		this.db = db;
		this.config = config;
		this.accounts = null;
	}

	start() {
		return this.config
			.get(CONFIG_ACCOUNTS_KEY)
			.then(data => {
				console.log('account list loaded', data);

				this.accounts = AccountList.unserialize(data);
				this.accounts.on('change', () => this.accounts.save(this.config));
			});
	}

	listen() {
		console.log('listening for messages...');
	}
}
