import React from 'react';

import Avatar from '../../../components/avatar';

import './account.styl';

export default class Account extends React.Component {
	render() {
		var user = this.props.user;
		var url = [/*'#timeline',*/ '#user', user.id].join('/');
		var classes = ['account'];

		if (this.props.modifierPressed) {
			classes.push('account-remove');
		}

		return (
			<li>
				<a href={url} className={classes.join(' ')} onClick={this.clickHandler.bind(this)}>
					<Avatar template={user.avatar} type={Avatar.TYPE_BIG} />
					<span className="nick">
						{user.screenName ? user.screenName : user.name}
					</span>
				</a>
			</li>
		);
	}

	clickHandler(e) {
		if (this.props.modifierPressed) {
			e.preventDefault();

			console.log('remove');
		}
	}
}

Account.propTypes = {
	user: React.PropTypes.object,
	modifierPressed: React.PropTypes.bool
};
