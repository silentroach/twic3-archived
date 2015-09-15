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

		if (this.props.watcherId) {
			if (this.props.watcherId === tweet.user.id) {
				classes.push(styles.statusMy);
			}

			if (tweetData.additional
				&& Array.isArray(tweetData.additional.mentionedIds)
				&& tweetData.additional.mentionedIds.indexOf(this.props.watcherId) >= 0
			) {
				classes.push(styles.statusMentioned);
			}
		}

		return (
			<article className={classes.join(' ')}>
				{this.renderRetweetInfo(tweet)}

				<div className={styles.row}>
					<div className={styles.header}>
						<a className={styles.userInfo} href={'#users/' + tweetData.user.id} title={'@' + tweetData.user.screenName}>
							<Avatar template={tweetData.user.avatar} border />
						</a>
					</div>

					{tweetData.text
						? <div className={styles.text} dangerouslySetInnerHTML={{ __html: tweetData.text }} />
						: null
					}
				</div>

				{this.renderAdditionalData(tweetData)}

				<div className={[styles.row, styles.time].join(' ')}>
					<a href={tweetLink} target="_blank">
						{/* will show retweet date even if it is retweet */}
						<TimeAgo timestamp={tweet.createTime} moment={moment} />
					</a>
				</div>

				<div className="clearer" />
			</article>
		);
	}

	renderGallery(data) {
		return (
			<div className={styles.row}>
				<Gallery items={data} />
			</div>
		);
	}

	renderAdditionalData(data) {
		if (!data.additional) {
			return null;
		}

		if (data.additional.gallery) {
			return this.renderGallery(data.additional.gallery);
		}
	}

	renderRetweetInfo(tweet) {
		if (!tweet.retweeted) {
			return null;
		}

		const userLink = React.renderToStaticMarkup(
			<a href={['#users', tweet.user.id].join('/')}>{'@' + tweet.user.screenName}</a>
		);

		return (
			<div className={[styles.row, styles.retweetInfo].join(' ')}>
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
