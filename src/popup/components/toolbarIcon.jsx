import React from 'react';

import './toolbarIcon.styl';

export default class ToolbarIcon extends React.Component {
	render() {
		return (
			<li>
				<a href={this.props.href}>
					{this.props.title}
				</a>
			</li>
		);
	}
}
