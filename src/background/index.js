import AccountList from './accountList';
import Account from './account';
import DB from './db';
import Twitter from './twitter';
import Message from '../message';

var twitter = new Twitter(
	new DB()
);

var accountListStorage = chrome.storage.sync;

AccountList
	.load(accountListStorage)
	.then(function(accountList) {
		console.debug('account list loaded', accountList);

		chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
			var msg = new Message(message.type, message.data);

			console.debug('message received', msg);

			switch (msg.type) {
				case Message.TYPE_ACCOUNT_USERS:
					Promise.all(
						accountList.map(account => twitter.getUser(account.userId))
					).then(function(list) {
						sendResponse(list);
					});

					return true;

					break;

				case Message.TYPE_AUTH_START:
					twitter.startAuthentication();
					break;

				case Message.TYPE_AUTH_CHECK:
					sendResponse(
						twitter.isAuthenticationWindowRegistered(sender.tab.windowId)
					);

					break;

				case Message.TYPE_AUTH:
					twitter
						.authorize(sender.tab.windowId, msg.data.pin)
						.then(function([token, user]) {
							var account;

							console.info('user authenticated', token, user);

							account = accountList.getByUserId(user.id);
							if (!account) {
								account = new Account();
								account.userId = user.id;
								account.token = token;

								accountList.add(account);
							} else {
								account.token = token;
							}

							accountList.save(accountListStorage);

							sendResponse(user.getData());
						})
						.catch(function(e) {
							console.error('authentication failed', e);
							sendResponse(false);
						});

					return true;

					break;
			}
		});
	} );
