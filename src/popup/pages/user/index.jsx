import React from 'react';

import Message from '../../../message';

import Avatar from '../../components/avatar';
import Map from '../../components/map';

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

		return (
			<div id="profile" className="page">
				<Avatar template={user.avatar} type={Avatar.TYPE_BIG} />

				<ul id="info">
					<li>{user.name ? user.name : ''} [{user.screenName}]</li>
					{user.url ? <li dangerouslySetInnerHTML={{__html: user.url }} /> : ''}
					{user.description ? <li id="info-description">{user.description}</li> : ''}
					{user.location ? <li>{user.location}</li> : ''}
					{user.coords ? <Map coords={user.coords} /> : ''}
				</ul>
			</div>
		);
	}

	componentWillMount() {
		var page = this;
		var msgParams = { };

		if ('@' === this.props.params[0][0]) {
			msgParams.screenName = this.props.params[0].substr(1);
		} else {
			msgParams.id = this.props.params[0];
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
