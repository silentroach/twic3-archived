import React from 'react';

import './tweet.styl';

import Avatar from './avatar';

export default class Tweet extends React.Component {
	render() {
		const tweet = this.props.data;

		return (
			<li className="tweet">
				<a
					href={'#users/' + tweet.user.id}
					title={'@' + tweet.user.screenName}
				>
					<Avatar template={tweet.user.avatar} />
				</a>
				<span className="tweet-text" dangerouslySetInnerHTML={{__html: tweet.text }} />
			</li>
		);
	}
}
