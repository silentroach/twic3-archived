import React from 'react';

import { Platforms } from 'core/device';

import styles from './index.styl';

const classMap = {
	[Platforms.Windows]: styles.windows,
	[Platforms.OSX]: styles.osx,
	[Platforms.Linux]: styles.linux
};

export default class Container extends React.Component {
	render() {
		return (
			<div className={classMap[this.props.platform]}>
				{this.props.children}
			</div>
		);
	}

	static propTypes = {
		platform: React.PropTypes.number.isRequired
	}
}
