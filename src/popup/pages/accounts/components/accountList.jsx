import React from 'react';

import Account from './account';

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
			</ul>
		);
	}
}

AccountList.propTypes = {
	users: React.PropTypes.array,
	modifierPressed: React.PropTypes.bool
};
