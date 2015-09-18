import React from 'react';
import PureComponent from 'react-pure-render/component';

import styles from './gallery.styl';

const MAX_WIDTH = 100 * window.devicePixelRatio;

export default class Gallery extends PureComponent {
	render() {
		const classNames = [styles.container];
		const classCount = this.props.items.length < 5 ? this.props.items.length : 5;

		classNames.push([styles.container, 'count', classCount].join('-'));

		// @todo try to calculate gallery images sizes

		return (
			<ul className={classNames.join(' ')}>
				{
					this.props.items.map((item, key) => {
						let info;

						item.preview
							.sort((a, b) => a.size[0] - b.size[0])
							.reverse()
							.forEach(previewElement => {
								if (undefined === info
									|| previewElement.size[0] >= MAX_WIDTH
										&& previewElement.size[0] < info.size[0]
								) {
									info = previewElement;
								}
							});

						return (
							<li key={key}>
								<a target="_blank" href={item.url} key={key}>
									<img src={info.url} />
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
