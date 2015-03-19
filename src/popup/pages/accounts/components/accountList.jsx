import React from 'react';

import Account from './account';
import AccountAdd from './accountAdd';

import './accountList.styl';

export default class AccountList extends React.Component {
	render() {
		var users = this.props.users;

		return (
			<ul className="accountList">
				{users.length === 0
					? ''
					: users.map(user =>
						<Account
							key={user.id}
							user={user}
							modifierPressed={this.props.modifierPressed}
						/>
					)
				}
				<AccountAdd />
			</ul>
		);
	}
}

AccountList.propTypes = {
	users: React.PropTypes.array,
	modifierPressed: React.PropTypes.bool
};
