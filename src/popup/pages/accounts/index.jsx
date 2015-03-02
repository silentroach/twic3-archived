import React from 'react';

import Toolbar from '../../components/toolbar';
import AccountList from './components/accountList';
import Message from '../../../message';

import device from '../../device';
import i18n from '../../../i18n';

// modifier key to use for account removal
const MODIFIER_KEY = device.platform === device.platforms.OSX
	? 'metaKey' : 'ctrlKey';

const HINT_KEY = device.platform === device.platforms.OSX
	? 'osx' : 'default';

// we can cache account users to prevent flicker
// cause it will never been modified in current popup session
var usersCache = null;

export default class AccountsPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			users: usersCache || [],
			modifierKeyPressed: false
		};
	}

	render() {
		var hintTranslation;

		if (!this.state.modifierKeyPressed) {
			hintTranslation = i18n.translate('pages.accounts.hint.' + HINT_KEY);
		} else {
			hintTranslation = i18n.translate('pages.accounts.remove_hint');
		}

		return (
			<div className="page">
				<AccountList
					users={this.state.users}
					modifierPressed={this.state.modifierKeyPressed}
				/>
				<Toolbar position={Toolbar.POSITION_BOTTOM}>
					{hintTranslation}
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
