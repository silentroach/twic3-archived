import './avatar.styl';

import React from 'react';
import PureComponent from 'react-pure-render/component';

import device from '../device';

/** sizes
normal => 48x48
bigger => 73x73
mini   => 24x24
{wo}   => original size
*/

// @todo do not show image until loaded, maybe loader is ok after some timeout

export default class Avatar extends PureComponent {
	render() {
		let size = ''; // original
		let classes = ['avatar'];

		if (this.props.border) {
			classes.push('avatar-bordered');
		}

		switch (this.props.type) {
			case Avatar.TYPE_BIG: // 73px
				classes.push('avatar-big');

				if (!device.isRetina) {
					size = '_bigger';
				}
				break;
			default:
				size = device.isRetina ? '_bigger' : '_normal';
				break;
		}

		return (
			<img
				className={classes.join(' ')}
				src={this.props.template.replace(/{size}/, size)}
			/>
		);
	}
}

Avatar.TYPE_DEFAULT = 0;
Avatar.TYPE_BIG = 1;

Avatar.propTypes = {
	template: React.PropTypes.string,
	type: React.PropTypes.number,
	border: React.PropTypes.bool
};

Avatar.defaultProps = {
	type: Avatar.TYPE_DEFAULT,
	border: false
};
