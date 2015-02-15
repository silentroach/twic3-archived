import OAuthToken from './oauthToken';

export default class Account {
	constructor() {
		this.userId = null;
		this.token = null;
	}

	serialize() {
		return {
			userId: this.userId,
			token: this.token.serialize()
		};
	}
}

Account.load = function(data) {
	var account = new Account();

	account.userId = data.userId;
	account.token = OAuthToken.load(data.token);

	return account;
};
