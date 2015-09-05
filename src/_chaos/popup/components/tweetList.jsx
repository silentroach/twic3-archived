import React from 'react';

import styles from './tweetList.styl';

import Tweet from './tweet';

export default class TweetList extends React.Component {
	render() {
		const list = (this.props.tweets || []).map(tweet => <Tweet data={tweet} />);

		return (
			<section className={styles.wrapper}>
				{
					(this.props.tweets || []).map(tweet =>
						<Tweet className={styles.tweet} data={tweet} watcherId={this.props.ownerId} key={tweet.id} />
					)
				}
			</section>
		);
	}
}

TweetList.propTypes = {
	ownerId: React.PropTypes.string,
	tweets: React.PropTypes.array
};

TweetList.defaultProps = {
	tweets: []
};
