import React, { Component, PropTypes } from 'react';

import { Platforms } from 'core/device';

import './index.styl';

const classMap = {
	[Platforms.Windows]: 'windows',
	[Platforms.OSX]: 'osx',
	[Platforms.Linux]: 'linux'
};

export default class Platform extends Component {
	render() {
		return (
			<div className={classMap[this.props.platform]}>
				{this.props.children}
			</div>
		);
	}

	static propTypes = {
		platform: PropTypes.number.isRequired
	}
}
