import React from 'react';

import Message from '../../../message';

import TweetList from '../../components/tweetList';

export default class TimelinePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: undefined
		};
	}

	render() {
		return <TweetList tweets={this.state.data} />;
	}

	fetchTimeline(userId) {
		const page = this;

		const msg = new Message(Message.TYPE_TIMELINE, {
			userId
		});

		msg
			.send()
			.then(function(reply) {
				page.setState({
					data: reply
				});
			});
	}

	componentWillReceiveProps(nextProps) {
		this.fetchTimeline(nextProps.params[0]);
	}

	componentWillMount() {
		this.fetchTimeline(this.props.params[0]);
	}
}
