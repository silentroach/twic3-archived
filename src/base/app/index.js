import EventEmitter from 'core/eventEmitter';
import DB from 'core/db';

import AccountList from 'core/struct/accountList';

const CONFIG_ACCOUNTS_KEY = 'accounts';

export default class Application extends EventEmitter {
	constructor(config) {
		super();

		this.db = new DB('twic');

		this.db.registerMigration(1, instance => {
			let objectStore = instance.createObjectStore('users', { keyPath: 'id' });
			objectStore.createIndex('screenName', 'screenNameNormalized', { unique: true });

			objectStore = instance.createObjectStore('tweets', { keyPath: 'id' });
			objectStore.createIndex('timeline', 'timelineUserIds', { unique: false, multiEntry: true });
			objectStore.createIndex('mention', 'mentionUserId', { unique: false, multiEntry: true });
			objectStore.createIndex('retweeted', 'retweetedId', { unique: false, multiEntry: true });

			objectStore = instance.createObjectStore('friendship', { keyPath: 'ids' });
			objectStore.createIndex('userId', 'userId', { unique: false });
		});

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
