import React from 'react';

import './gallery.styl';

import device from '../../device';

const MAX_WIDTH = 100 * (device.isRetina ? 2 : 1);

export default class Gallery extends React.Component {
	render() {
		const classNames = ['gallery'];
		const classCount = this.props.items.length < 5 ? this.props.items.length : 5;

		classNames.push('gallery-' + classCount);

		return (
			<ul className={classNames.join(' ')}>
				{
					this.props.items.map((item, key) => {
						let minSize, minSizeAlias;

						for (let alias of Object.keys(item.sizes)) {
							let sizes = item.sizes[alias];

							if (sizes[0] >= MAX_WIDTH
								&& (sizes[0] < minSize
									|| undefined === minSize
								)
							) {
								minSize = sizes[0];
								minSizeAlias = alias;
							}
						}

						return (
							<li className="gallery-item" key={key}>
								<a target="_blank" href={item.url} key={key}>
									<img src={item.imageUrl + (minSizeAlias ? ':' + minSizeAlias : '')} />
								</a>
							</li>
						);
					})
				}
			</ul>
		);
	}
}

Gallery.propTypes = {
	items: React.PropTypes.array
};

Gallery.defaultProps = {
	items: []
};
