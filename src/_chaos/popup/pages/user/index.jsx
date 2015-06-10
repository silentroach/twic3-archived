import React from 'react';

import Message from '../../../message';

import UserNotFound from './components/userNotFound';
import UserInfo from './components/userInfo';
import Loader from 'ui/loader';

import i18n from 'i18n';

export default class UserPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: null,
			loading: true
		};
	}

	render() {
		if (this.state.loading) {
			return <Loader title={i18n.translate('components.loader.loading')} />;
		} else
		if (!this.state.data) {
			return <UserNotFound />;
		} else {
			return <UserInfo user={this.state.data} />;
		}
	}

	fetchUserInfo(user) {
		const page = this;
		const msgParams = { };

		this.setState({
			loading: true
		});

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
					data: reply,
					loading: false
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
