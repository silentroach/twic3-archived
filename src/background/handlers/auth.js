import Account from '../account';
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
				var account;

				console.info('user authenticated', token, user);

				// fetching timeline in a background
				app.twitter.getHomeTimeline(token);

				account = app.accounts.getByUserId(user.id);
				if (!account) {
					account = new Account();
					account.userId = user.id;
					account.token = token;

					app.accounts.add(account);
				} else {
					account.token = token;
				}

				app.accounts.save(app.config);
			})
			.catch(function(e) {
				console.error('authentication failed', e);
			});
	}
}
