import './vendor/sprite.styl';
import styles from './index.styl';

import React from 'react';
import PureComponent from 'react-pure-render/component';

export default class Map extends PureComponent {
	render() {
		const coords = this.props.coords.join(',');
		const imageSource = 'https://maps.google.com/maps/api/staticmap?' + [
			'sensor=false',
			'zoom=14',
			'size=' + [this.props.width, this.props.height].join('x'),
			'maptype=roadmap',
			'center=' + encodeURIComponent(coords),
			'language=' + encodeURIComponent(this.props.locale),
			'scale=' + window.devicePixelRatio
		].join('&');

		return (
			<a href={'https://www.google.com/maps/@' + [coords, '15z'].join(',')} className={styles.map} target="_blank">
				<div className="marker">
					<i className="ei-location ei-location-dims" />
				</div>
				<img src={imageSource} />
			</a>
		);
	}
}

Map.propTypes = {
	locale: React.PropTypes.string,
	coords: React.PropTypes.array,
	width: React.PropTypes.number,
	height: React.PropTypes.number
};

Map.defaultProps = {
	locale: 'en_US',
	width: 380,
	height: 200
};
