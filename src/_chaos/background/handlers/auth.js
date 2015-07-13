import Account from 'core/struct/account';
import Message from '../../message';
import MessageHandler from '../messageHandler';

export default class AuthHandler extends MessageHandler {
	getMessageType() {
		return Message.TYPE_AUTH;
	}

	handle(messageData) {
		const app = this.app;

		app.twitter
			.authorize(messageData ? messageData.screenName : null)
			.then(function([token, user]) {
				console.info('user authenticated', token, user);

				const accounts = app.accounts;
				let account = accounts.getByUserId(user.id);

				if (!account) {
					account = new Account(user.id, token);
					accounts.add(account);
				} else {
					account.token = token;
				}
			})
			.catch(function(e) {
				console.error('authentication failed', e);
			});
	}
}
