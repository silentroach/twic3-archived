import './avatar.styl';

import React from 'react';

import device from '../device';

/** sizes
normal => 48x48
bigger => 73x73
mini   => 24x24
{wo}   => original size
*/

// @todo do not show image until loaded, maybe loader is ok after some timeout

export default class Avatar extends React.Component {
	render() {
		var size = ''; // original
		var url;

		switch (this.props.type) {
			case Avatar.TYPE_ACCOUNT: // 64px
				if (!device.isRetina) {
					size = '_bigger';
				}
				break;
		}

		url = this.props.template.replace(/{size}/, size);

		return (
			<img className="avatar" src={url} />
		);
	}
}

Avatar.TYPE_DEFAULT = 0;
Avatar.TYPE_ACCOUNT = 1;

Avatar.propTypes = {
	template: React.PropTypes.string,
	type: React.PropTypes.number
};

Avatar.defaultProps = {
	type: Avatar.TYPE_DEFAULT
};
