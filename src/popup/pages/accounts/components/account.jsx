import React from 'react';

import Avatar from '../../../components/avatar';

import Message from '../../../../message.js';

import './account.styl';

export default class Account extends React.Component {
	render() {
		var user = this.props.user;
		var url = ['#timeline', user.id].join('/');
		var classes = ['account'];

		if (this.props.modifierPressed) {
			classes.push('account-remove-candidate');
		}

		if (!user.isAuthorized) {
			classes.push('account-need-auth');
		}

		return (
			<li>
				<a href={url} className={classes.join(' ')} onClick={this.clickHandler.bind(this)}>
					<Avatar template={user.avatar} type={Avatar.TYPE_BIG} />
					<span className="account-remover" onClick={this.removeClickHandler.bind(this)}>+</span>
					<span className="nick">
						{user.screenName ? user.screenName : user.name}
					</span>
				</a>
			</li>
		);
	}

	removeClickHandler(e) {
		e.preventDefault();

		console.log('remove');
	}

	clickHandler(e) {
		if (!this.props.user.isAuthorized) {
			e.preventDefault();

			var msg = new Message(Message.TYPE_AUTH, {
				screenName: this.props.user.screenName
			});

			msg
				.send()
				.then(function() {
					window.close();
				});
		}
	}
}

Account.propTypes = {
	user: React.PropTypes.object,
	modifierPressed: React.PropTypes.bool
};
