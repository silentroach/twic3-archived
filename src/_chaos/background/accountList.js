import AccountListStruct from 'core/struct/accountList';

const CONFIG_KEY = 'accounts';

// @todo temporary before moving load/save
export default class AccountList extends AccountListStruct {
	save(config) {
		return config
			.set(CONFIG_KEY, this.serialize());
	}

	static load(config) {
		return config
			.get(CONFIG_KEY)
			.then(data => this.unserialize(data));
	}
}
