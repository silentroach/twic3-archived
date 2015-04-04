import React from 'react';

import Message from '../../../message';

import Avatar from '../../components/avatar';
import Map from '../../components/map';

import './index.styl';

export default class UserPage extends React.Component {
	render() {
		if (!this.state || !this.state.data) {
			return <div />;
		}

		var user = this.state.data;

		if (!user) {
			return (
				<div>Not found</div>
			);
		}

		return (
			<div id="profile" className="page">
				<Avatar template={user.avatar} type={Avatar.TYPE_BIG} />

				<ul id="info">
					<li>{user.name ? user.name : ''} [{user.screenName}]</li>
					{user.url ? <li dangerouslySetInnerHTML={{__html: user.url }} /> : ''}
					{user.description ? <li id="info-description">{user.description}</li> : ''}
					{user.location ? <li>{user.location}</li> : ''}
					{user.coords ? <Map coords={user.coords} locale={chrome.app.getDetails().current_locale} /> : ''}
				</ul>
			</div>
		);
	}

	fetchUserInfo(user) {
		const page = this;
		const msgParams = { };

		if ('@' === user[0]) {
			msgParams.screenName = user.substr(1);
		} else {
			msgParams.id = user;
		}

		const msg = new Message(Message.TYPE_USER, msgParams);

		msg
			.send()
			.then(function(reply) {
				page.setState({
					data: reply
				});
			});
	}

	componentWillReceiveProps(nextProps) {
		this.fetchUserInfo(nextProps.params[0]);
	}

	componentWillMount() {
		this.fetchUserInfo(this.props.params[0]);
	}
}
