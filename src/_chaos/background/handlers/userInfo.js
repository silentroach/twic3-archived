import Message from '../../message';
import MessageHandler from '../messageHandler';

export default class UserInfoHandler extends MessageHandler {
	getMessageType() {
		return Message.TYPE_USER;
	}

	handle(messageData) {
		if (undefined !== messageData.id) {
			return this.app.twitter.getUserById(messageData.id);
		} else {
			return this.app.twitter.getUserByScreenName(messageData.screenName);
		}
	}
}
