import React from 'react';

import './tweetList.styl';

import Tweet from './tweet';

export default class TweetList extends React.Component {
	render() {
		// @todo why tweets can be null?
		const list = (this.props.tweets || []).map(tweet => <Tweet data={tweet} />);

		return (
			<ul className="tweetlist">
				{
					(this.props.tweets || []).map(tweet =>
						<Tweet data={tweet} key={tweet.id} />
					)
				}
			</ul>
		);
	}
}

TweetList.propTypes = {
	tweets: React.PropTypes.array
};

TweetList.defaultProps = {
	tweets: []
};
