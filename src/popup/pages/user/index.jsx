import React from 'react';

import Message from '../../../message';

import Avatar from '../../components/avatar';

import './index.styl';

export default class UserPage extends React.Component {
	render() {
		if (!this.state || !this.state.user) {
			return <div />;
		}

		var user = this.state.user;

		if (!user) {
			return (
				<div>Not found</div>
			);
		}

		/* @todo resolve user url */

		return (
			<div id="profile" className="page">
				<Avatar template={user.avatar} type={Avatar.TYPE_BIG} />

				<ul id="info">
					<li>{user.name ? user.name : ''} [{user.screenName}]</li>
					{user.url ? <li><a href={user.url}>{user.url}</a></li> : ''}
					{user.description ? <li id="info-description">{user.description}</li> : ''}
					{user.location ? <li>{user.location}</li> : ''}
				</ul>
			</div>
		);
	}

	componentWillMount() {
		var page = this;
		var msgParams = { };

		if ('@' === this.props.params[0][0]) {
			msgParams.userScreenName = this.props.params[0];
		} else {
			msgParams.userId = this.props.params[0];
		}

		var msg = new Message(Message.TYPE_USER, msgParams);

		msg
			.send()
			.then(function(reply) {
				page.setState({
					user: reply
				});
			});
	}
}
