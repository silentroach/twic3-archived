import Page from '../../page';

import Toolbar from '../../components/toolbar';
import AccountList from './components/accountList';
import Message from '../../../message';

import device from '../../device';

// modifier key to use for account removal
const MODIFIER_KEY = device.platform === device.platforms.OSX
	? 'metaKey' : 'ctrlKey';

// we can cache account users to prevent flicker
// cause it will never been modified in current popup session
var usersCache = null;

export default class AccountsPage extends Page {
	constructor(props) {
		super(props);

		this.state = {
			users: usersCache || [],
			modifierKeyPressed: false
		};
	}

	render() {
		return (
			<div>
				<AccountList
					users={this.state.users}
					modifierPressed={this.state.modifierKeyPressed}
				/>
				<Toolbar position={Toolbar.POSITION_BOTTOM}>
					Test
				</Toolbar>
			</div>
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
		var msg;

		document.addEventListener('keydown', this.handleKeyDown.bind(this));
		document.addEventListener('keyup', this.handleKeyUp.bind(this));

		if (usersCache) {
			return;
		}

		msg = new Message(Message.TYPE_ACCOUNT_USERS);

		msg
			.send()
			.then(function(users) {
				usersCache = users;
				accountPage.setState({
					users: usersCache
				});
			});
	}
}
