import React from 'react';

import './userInfo.styl';

import Avatar from '../../../components/avatar';
import Map from '../../../components/map';

export default class UserInfo extends React.Component {
	render() {
		const user = this.props.user;

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
}
