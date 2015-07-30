import React from 'react';

import './userInfo.styl';

import Avatar from 'client/ui/avatar';
import Map from 'client/ui/map';

import i18n from 'i18n';

export default class UserInfo extends React.Component {
	render() {
		const user = this.props.user;
		let url, description, location, map;

		let name = (
			<li>
				{user.name ? user.name : ''}
				{user.name !== user.screenName ? ' [' + user.screenName + ']' : ''}
			</li>
		);

		if (user.url) {
			url = <li dangerouslySetInnerHTML={{__html: user.url }} />;
		}

		if (user.description) {
			description = (
				<li id="info-description"
					dangerouslySetInnerHTML={{
						__html: user.description
					}}
				/>
			);
		}

		if (user.location) {
			location = <li>{user.location}</li>;
		}

		if (user.coords) {
			map = (
				<li className="map">
					<Map
						coords={user.coords}
						locale={chrome.app.getDetails().current_locale}
						width={380} height={200}
					/>
				</li>
			);
		}

		return (
			<div id="profile" className="page">
				<Avatar template={user.avatar} type={Avatar.TYPE_BIG} border />
				<div className="profile-badges">
					{user.isProtected // @todo move to ul
						&& <i className="ei-lock ei-lock-dims"
							title={i18n.translate('pages.user.protected')} />
					}
					{user.isVerified
						&& <i className="ei-check ei-check-dims"
							title={i18n.translate('pages.user.verified')} />
					}
				</div>

				<ul id="info">
					{name}
					{url}
					{description}
					{location}
					{map}
				</ul>
			</div>
		);
	}
}
