import 'babel/external-helpers';

import AccountWatcher from './accountWatcher';
import DB from './db';
import Twitter from './twitter';
import Config from '../config';
import ConfigWatcher from './twitter/configWatcher';

import App from './app';

const twitter = new Twitter(
	new DB()
);

const config = new Config(chrome.storage);

const app = new App(config, twitter);

/* ---- new

var twitterConfigWatcher = new ConfigWatcher(config, twitter);

var watchers = [];

twitterConfigWatcher.start();

AccountList
	.load(config)
	.then(function(accountList) {
		console.log('account list loaded', accountList);

		accountList.map(account => {
			const watcher = new AccountWatcher(twitter, account);
			if (account.isAuthorized()) {
				watcher.start();
			}
			watchers.push(watcher);
		});
	} );
*/
