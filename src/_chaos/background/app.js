import Application from 'app';
import AccountWatcher from './accountWatcher';
import ConfigWatcher from './twitter/configWatcher';
import Message from '../message';
import Twitter from './twitter';

import i18n from 'i18n';
import connection from 'core/connection';

/** message handlers */
import UserInfoHandler from './handlers/userInfo';
import AccountListHandler from './handlers/accountList';
import AuthHandler from './handlers/auth';
import TimelineHandler from './handlers/timeline';
/** ---------------- */

export default class App extends Application {
	constructor(config) {
		super(config);

		this.twitter = new Twitter(this.db);

		this.messageHandlers = { };
	}

	start() {
		const app = this;

		const twitterConfigWatcher = new ConfigWatcher(this.config, this.twitter);
		twitterConfigWatcher.start();

		this.updateToolbar();
		connection.on('change', this.updateToolbar.bind(this));

		[
			UserInfoHandler,
			AccountListHandler,
			AuthHandler,
			TimelineHandler
		].forEach(HandlerClass => {
			const handler = new HandlerClass(app);
			this.messageHandlers[handler.getMessageType()] = handler;
		});

		return super()
			.then(() => {
				this.accounts.map(account => {
					const watcher = new AccountWatcher(app.twitter, account);
					if (account.isAuthorized()) {
						watcher.start();
					}
				});
			});
	}

	listen() {
		super();

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
		let isAsync = false;
		let isReplySent = false;
		let handler;

		console.log('message received', msg);

		function reply(data) {
			isReplySent = true;
			sendResponse(data);
		}

		if (undefined === this.messageHandlers[msg.type]) {
			console.error('unknown message type', msg.type);
		} else {
			let handlerReply;

			try {
				handlerReply = this.messageHandlers[msg.type].handle(msg.data);

				if (handlerReply instanceof Promise) {
					isAsync = true;

					handlerReply
						.then(function(response) {
							reply(response);
						})
						.catch(function(error) {
							console.error('Handler error', error);
							// @todo some error handling?
							reply();
						});
				} else {
					reply(handlerReply);
				}
			} catch (e) {
				// @todo some error handling?
				reply();
			}
		}

		if (!isAsync) {
			reply();
		}

		return isAsync;
	}
}
