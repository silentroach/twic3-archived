import React from 'react';

import Message from '../../../message';

import UserNotFound from './components/userNotFound';
import UserInfo from './components/userInfo';

export default class UserPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: null
		};
	}

	render() {
		var user = this.state.data;

		if (!user) {
			return <UserNotFound />;
		} else {
			return <UserInfo user={user} />;
		}
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
