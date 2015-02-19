import React from 'react';

import './committers.styl';

export default class CommitterList extends React.Component {
	render() {
		return (
			<ul>
				{this.props.list.map(function(committer, idx) {
					var url = 'mailto:' + committer.email;

					return <li key={idx}>
						<a href={url}>{committer.name}</a>
					</li>;
				})}
			</ul>
		);
	}
}
