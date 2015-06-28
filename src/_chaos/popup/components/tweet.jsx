import React from 'react';

import './tweet.styl';

import Avatar from 'ui/avatar';
import TimeAgo from 'ui/timeAgo';

import Gallery from './tweet/gallery';

import i18n from 'i18n';

import moment from '../moment';

export default class Tweet extends React.Component {
	render() {
		const classes = ['tweet'];
		const tweet = this.props.data;
		const tweetData = tweet.retweeted ? tweet.retweeted : tweet;

		// using tweetdata for link cause retweets are redirected to source
		const tweetLink = [
			'https://twitter.com',
			tweetData.user.screenName,
			'status',
			tweetData.id
		].join('/');

		let retweetInfo;
		let gallery;
		let tweetText;

		if (tweetData.text) {
			tweetText = <div className="tweet-text" dangerouslySetInnerHTML={{ __html: tweetData.text }} />;
		}

		if (this.props.watcherId === tweet.user.id) {
			classes.push('tweet-me');
		}

		if (tweet.retweeted) {
			// @todo + tweet-retweet class?

			// @todo userlink component?
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

		if (tweetData.additional) {
			if (tweetData.additional.gallery) {
				gallery = <Gallery items={tweetData.additional.gallery} />;
			}
		}

		return (
			<article className={classes.join(' ')}>
				{retweetInfo}

				<a className="tweet-avatar" href={'#users/' + tweetData.user.id} title={'@' + tweetData.user.screenName}>
					<Avatar template={tweetData.user.avatar} border />
				</a>
				<div className="tweet-content">
					{tweetText}
					{gallery}

					<a href={tweetLink} className="tweet-time" target="_blank">
						{/* will show retweet date even if it is retweet */}
						<TimeAgo timestamp={tweet.createTime} moment={moment} />
					</a>
				</div>
				<div className="clearer" />
			</article>
		);
	}
}

Tweet.propTypes = {
	watcherId: React.PropTypes.string
};
