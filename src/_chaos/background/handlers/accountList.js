import Message from '../../message';
import MessageHandler from '../messageHandler';

export default class AccountListHandler extends MessageHandler {
	getMessageType() {
		return Message.TYPE_ACCOUNT_USERS;
	}

	handle(messageData) {
		return Promise.all(
			this.app.accounts.map(account => {
				return this.app.twitter
					.getUserById(account.userId)
					.then(function(user) {
						user.isAuthorized = account.isAuthorized();

						return user;
					});
			})
		);
	}
}
