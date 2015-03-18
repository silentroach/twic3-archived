export default class Message {
	constructor(type, data = null) {
		this.type = type;
		this.data = data;
	}

	send() {
		var message = this;

		return new Promise(function(resolve, reject) {
			console.log('sending message', message);

			chrome.runtime.sendMessage({
				type: message.type,
				data: message.data
			}, function(reply) {
				console.log('reply received', reply);
				resolve(reply);
			});
		});
	}
}

Message.TYPE_AUTH = 0;
Message.TYPE_ACCOUNT_USERS = 1;
Message.TYPE_USER = 2;

if ('production' !== process.env.NODE_ENV) {
	Message.TYPE_AUTH = 'auth';
	Message.TYPE_ACCOUNT_USERS = 'account_list';
	Message.TYPE_USER = 'user';
}
