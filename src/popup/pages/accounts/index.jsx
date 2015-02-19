import Page from '../../page';

import AccountList from './components/accountList';
import Message from '../../../message';

import device from '../../device';

const MODIFIER_KEY = device.platform === device.platforms.OSX
	? 'altKey' : 'ctrlKey';

export default class AccountsPage extends Page {
	constructor(props) {
		super(props);

		this.state = {
			users: [],
			modifierKeyPressed: false
		};
	}

	render() {
		return (
			<AccountList
				users={this.state.users}
				modifierPressed={this.state.modifierKeyPressed}
			/>
		);
	}

	handleKeyDown(e) {
		if (e[MODIFIER_KEY]) {
			this.setState({
				modifierKeyPressed: true
			});
		}
	}

	handleKeyUp(e) {
		if (!e[MODIFIER_KEY]) {
			this.setState({
				modifierKeyPressed: false
			});
		}
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown.bind(this));
		document.removeEventListener('keyup', this.handleKeyUp.bind(this));
	}

	componentWillMount() {
		var accountPage = this;
		var msg = new Message(Message.TYPE_ACCOUNT_USERS);

		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));

		msg
			.send()
			.then(function(users) {
				accountPage.setState({
					users: users
				});
			});
	}
}
