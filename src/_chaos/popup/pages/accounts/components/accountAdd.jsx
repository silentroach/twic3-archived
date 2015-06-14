import React from 'react';
import PureComponent from 'react-pure-render/component';

import i18n from 'i18n';
import Message from '../../../../message.js';
import connection from 'core/connection';

import './accountAdd.styl';

export default class AccountAdd extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			disabled: !connection.connected
		};
	}

	clickHandler() {
		this.setState({
			loading: true
		});

		(new Message(Message.TYPE_AUTH)).send();

		// @todo loader
		setTimeout(function() {
			window.close();
		}, 1000);
	}

	handleConnectionChange() {
		this.setState({
			disabled: !connection.connected
		});
	}

	componentWillMount() {
		connection.on('change', this.handleConnectionChange.bind(this));
	}

	componentWillUnmount() {
		connection.off('change', this.handleConnectionChange.bind(this));
	}

	render() {
		var title = this.state.disabled
			? i18n.translate('pages.accounts.errors.connection')
			: i18n.translate('pages.accounts.add');

		return (
			<a onClick={this.clickHandler.bind(this)} title={title}>
				{i18n.translate('pages.accounts.add')}
			</a>
		);
	}
}
