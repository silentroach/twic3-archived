import AccountList from './accountList';
import Message from '../message';

import i18n from '../i18n';
import connection from '../connection';

/** message handlers */
import UserInfoHandler from './handlers/userInfo';
import AccountListHandler from './handlers/accountList';
import AuthHandler from './handlers/auth';

export default class App {
	constructor(config, twitter) {
		const app = this;

		this.config = config;
		this.twitter = twitter;

		this.updateToolbar();
		connection.on('change', this.updateToolbar.bind(this));

		this.accounts = null;

		this.messageHandlers = { };

		[
			UserInfoHandler,
			AccountListHandler,
			AuthHandler
		].forEach(HandlerClass => {
			const handler = new HandlerClass(app);
			this.messageHandlers[handler.getMessageType()] = handler;
		});

		AccountList
			.load(this.config)
			.then(function(accountList) {
				console.log('account list loaded', accountList);

				app.accounts = accountList;

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

				app.listen();
			});
	}

	listen() {
		console.log('listening for messages...');
		chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
	}

	updateToolbar() {
		const imagePrefix = 'images/toolbar' + (connection.connected ? '' : '.disconnected');
		const nameParts = [chrome.runtime.getManifest().name];

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

	handleMessage(message, sender, sendResponse) {
		const msg = new Message(message.type, message.data);
		let handler;
		let reply;

		console.log('message received', msg);

		if (undefined === this.messageHandlers[msg.type]) {
			console.error('unknown message type', msg.type);
		} else {
			let handlerReply = this.messageHandlers[msg.type].handle(msg.data);

			if (handlerReply instanceof Promise) {
				handlerReply.then(function(response) {
					sendResponse(response);
				});

				reply = true;
			} else {
				reply = handlerReply;
			}
		}

		return reply;
	}
}
