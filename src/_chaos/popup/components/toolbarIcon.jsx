import React from 'react';
import PureComponent from 'react-pure-render/component';

import './toolbarIcon.styl';

export default class ToolbarIcon extends PureComponent {
	render() {
		return (
			<a href={this.props.href}>
				{this.props.title}
			</a>
		);
	}
}
