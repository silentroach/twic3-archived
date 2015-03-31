import Message from '../../message';
import MessageHandler from '../messageHandler';

export default class UserInfoHandler extends MessageHandler {
	getMessageType() {
		return Message.TYPE_ACCOUNT_USERS;
	}

	handle(messageData) {
		let method;
		let value;

		if (undefined !== messageData.id) {
			method = this.app.twitter.getUserById;
			value = messageData.id;
		} else {
			method = this.app.twitter.getUserByScreenName;
			value = messageData.screenName;
		}

		return method.call(this.app.twitter, value);
	}
}
