import React from 'react';

import './tweet.styl';

import Avatar from './avatar';

export default class Tweet extends React.Component {
	render() {
		const tweet = this.props.data;
		const tweetData = tweet.retweeted ? tweet.retweeted : tweet;

		return (
			<article className="tweet">
				<a className="tweet-avatar" href={'#users/' + tweetData.user.id} title={'@' + tweetData.user.screenName}>
					<Avatar template={tweetData.user.avatar} />
				</a>
				<div className="tweet-content">
					<div className="tweet-text" dangerouslySetInnerHTML={{ __html: tweetData.text }} />
				</div>
			</article>
		);
	}
}
