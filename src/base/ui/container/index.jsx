import React from 'react';

import { Platforms } from 'core/device';

import styles from './index.styl';

const classMap = {
	[Platforms.Windows]: styles.windows,
	[Platforms.OSX]: styles.osx,
	[Platforms.Linux]: styles.linux
};

export default class Platform extends React.Component {
	render() {
		return (
			<div className={classMap[this.props.platform]}>
				{this.props.children}
			</div>
		);
	}
}

Platform.propTypes = {
	platform: React.PropTypes.number.isRequired
};
