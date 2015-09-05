import React, { Component, PropTypes } from 'react';

import styles from './tweet.styl';

import Avatar from 'client/ui/avatar';
import TimeAgo from 'client/ui/timeAgo';

import Gallery from './tweet/gallery';

import i18n from 'i18n';

import moment from '../moment';

export default class Tweet extends Component {
	render() {
		const classes = [styles.container];
		const tweet = this.props.data;
		const tweetData = tweet.retweeted ? tweet.retweeted : tweet;

		if (this.props.className) {
			classes.push(this.props.className);
		}

		// using tweetdata for link cause retweets are redirected to source
		const tweetLink = [
			'https://twitter.com',
			tweetData.user.screenName,
			'status',
			tweetData.id
		].join('/');

		let retweetInfo;
		let gallery;

		if (this.props.watcherId === tweet.user.id) {
			classes.push(styles.statusMy);
		}

		return (
			<article className={classes.join(' ')}>
				{tweet.retweeted ? this.renderRetweetInfo(tweet) : null}

				<a className="tweet-avatar" href={'#users/' + tweetData.user.id} title={'@' + tweetData.user.screenName}>
					<Avatar template={tweetData.user.avatar} border />
				</a>
				<div className="tweet-content">
					{tweetData.text
						? <div className="tweet-text" dangerouslySetInnerHTML={{ __html: tweetData.text }} />
						: null
					}

					{tweetData.additional && tweetData.additional.gallery
						? <Gallery items={tweetData.additional.gallery} />
						: null
					}

					<a href={tweetLink} className="tweet-time" target="_blank">
						{/* will show retweet date even if it is retweet */}
						<TimeAgo timestamp={tweet.createTime} moment={moment} />
					</a>
				</div>
				<div className="clearer" />
			</article>
		);
	}

	renderRetweetInfo(tweet) {
		const userLink = React.renderToStaticMarkup(
			<a href={['#users', tweet.user.id].join('/')}>{'@' + tweet.user.screenName}</a>
		);

		retweetInfo = (
			<div className="tweet-retweet-info">
				<i className="ei-retweet ei-retweet-dims" />
				<span
					dangerouslySetInnerHTML={{
						__html: i18n.translate('components.tweet.retweeted', userLink)
					}}
				/>
			</div>
		);
	}
}

Tweet.propTypes = {
	watcherId: PropTypes.string
};
