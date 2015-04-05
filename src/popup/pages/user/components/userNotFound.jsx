import React from 'react';

import './userNotFound.styl';

import i18n from '../../../../i18n';

export default class NotFound extends React.Component {
	render() {
		return (
			<div id="profile-none">{i18n.translate('pages.user.not_found')}</div>
		);
	}
}
