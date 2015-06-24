import React from 'react';

import Toolbar from '../../components/toolbar';
import AccountList from './components/accountList';
import Message from '../../../message';

import device from 'app/device';
import i18n from 'i18n';

const HINT_KEY = device.isOSX() ? 'osx' : 'default';

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
			<div>
				<div className="page">
					<AccountList
						users={this.state.users}
						modifierPressed={this.state.modifierKeyPressed}
					/>
				</div>
				<Toolbar position={Toolbar.POSITION_BOTTOM}>
					{hintTranslation}
				</Toolbar>
			</div>
		);
	}

	handleKeyDown(e) {
		if (e[device.modifierKey]) {
			this.setState({
				modifierKeyPressed: true
			});
		}
	}

	handleKeyUp(e) {
		if (!e[device.modifierKey]) {
			this.setState({
				modifierKeyPressed: false
			});
		}
	}

	componentWillUnmount() {
		document.onkeydown = null;
		document.onkeyup = null;
	}

	componentWillMount() {
		var accountPage = this;
		var msg;

		// @todo tried with {add,remove}EventListener, but it doesnt work :{
		document.onkeydown = this.handleKeyDown.bind(this);
		document.onkeyup = this.handleKeyUp.bind(this);

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
