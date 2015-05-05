import React from 'react';
import PureComponent from 'react-pure-render/component';

import './userNotFound.styl';

import i18n from '../../../../i18n';

export default class NotFound extends PureComponent {
	render() {
		return (
			<div id="profile-none">{i18n.translate('pages.user.not_found')}</div>
		);
	}
}
