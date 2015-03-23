import 'babel/external-helpers';

import AccountList from './accountList';
import Account from './account';
import AccountWatcher from './accountWatcher';
import DB from './db';
import Twitter from './twitter';
import Message from '../message';
import Config from '../config';
import ConfigWatcher from './twitter/configWatcher';

import connection from '../connection';
import i18n from '../i18n';

var config = new Config(chrome.storage);

var twitter = new Twitter(
	new DB()
);

var twitterConfigWatcher = new ConfigWatcher(config, twitter);

var watchers = [];

function updateToolbar() {
	var imagePrefix = 'images/toolbar' + (connection.connected ? '' : '.disconnected');
	var nameParts = [chrome.runtime.getManifest().name];

	if (!connection.connected) {
		nameParts.push(i18n.translate('toolbar.disconnected'));
	}

	chrome.browserAction.setIcon({
		path: {
			19: [imagePrefix, '.png'].join(''),
			38: [imagePrefix, '@2x', '.png'].join('')
		}
	});

	chrome.browserAction.setTitle({
		title: nameParts.join(' - ')
	});
}

updateToolbar();
connection.on('change', updateToolbar);

twitterConfigWatcher.start();

AccountList
	.load(config)
	.then(function(accountList) {
		console.log('account list loaded', accountList);

		accountList.on('change', function() {
			accountList.save(config);
		});

		// ---
		if (accountList.length) {
			console.log('twitter/api/token exported for debug');
			window.token = accountList.accounts[0].token;
			window.twitter = twitter;
			window.api = twitter.api;
		}
		// ---

		accountList.map(account => {
			const watcher = new AccountWatcher(twitter, account);
			if (account.isAuthorized()) {
				watcher.start();
			}
			watchers.push(watcher);
		});

		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
			var msg = new Message(message.type, message.data);

			console.log('message received', msg);

			switch (msg.type) {
				case Message.TYPE_USER:
					twitter
						.getUser(msg.data.userId)
						.then(function(user) {
							sendResponse(user);
						});

					return true;

				case Message.TYPE_ACCOUNT_USERS:
					Promise.all(
						accountList.map(account => {
							return twitter
								.getUser(account.userId)
								.then(function(user) {
									user.isAuthorized = account.isAuthorized();

									return user;
								});
						})
					).then(function(list) {
						sendResponse(list);
					});

					return true;

				case Message.TYPE_AUTH:
					twitter
						.authorize(sendResponse, msg.data.screenName)
						.then(function([token, user]) {
							var account;

							console.info('user authenticated', token, user);

							// fetching timeline in a background
							twitter.getHomeTimeline(token);

							account = accountList.getByUserId(user.id);
							if (!account) {
								account = new Account();
								account.userId = user.id;
								account.token = token;

								accountList.add(account);
							} else {
								account.token = token;
							}

							accountList.save(config);
						})
						.catch(function(e) {
							console.error('authentication failed', e);
							sendResponse(false);
						});

					return true;

				default:
					console.error('unknown message type', msg.type);
					break;
			}
		});
	} );
