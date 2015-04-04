import './map.styl';

import React from 'react';

import device from '../device';

export default class Map extends React.Component {
	render() {
		// @todo move locale to component property

		const coords = this.props.coords.join(',');
		const imageSource = 'https://maps.google.com/maps/api/staticmap?' + [
			'sensor=false',
			'zoom=14',
			'size=380x200',
			'maptype=roadmap',
			'center=' + encodeURIComponent(coords),
			'language=' + encodeURIComponent(chrome.app.getDetails().current_locale),
			'scale=' + (device.isRetina ? 2 : 1)
		].join('&');

		const imageLink = 'https://www.google.com/maps/@' + [
			this.props.coords.join(','),
			'15z'
		].join(',');

		return (
			<a className="map" href={imageLink} target="_blank">
				<div className="marker">
					<i className="ei-location ei-location-dims" />
				</div>
				<img src={imageSource} />
			</a>
		);
	}
}

Map.propTypes = {
	coords: React.PropTypes.array
};
