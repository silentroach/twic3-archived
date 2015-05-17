import React from 'react';

import './gallery.styl';

export default class Gallery extends React.Component {
	render() {
		console.log(this.props.items);

		return (
			<ul className="gallery">
				{
					this.props.items.map(item => {
						return (
							<a className="gallery-item" target="_blank" href={item.url}>
								<img src={item.imageUrl + ':thumb'} />
							</a>
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
