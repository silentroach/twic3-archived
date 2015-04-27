import React from 'react';

import './tweet.styl';

import Avatar from './avatar';
import TimeAgo from './timeAgo';

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

					<a href={ // using tweetdata for link cause retweets are redirected to source
						[
							'https://twitter.com',
							tweetData.user.screenName,
							'status',
							tweetData.id
						].join('/')
					} className="tweet-time" target="_blank">
						{/* will show retweet date even if it is retweet */}
						<TimeAgo timestamp={tweet.createTime} />
					</a>
				</div>
			</article>
		);
	}
}
