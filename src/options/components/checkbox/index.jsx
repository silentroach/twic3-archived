import React from 'react';

import './index.styl';

export default React.createClass({
	handleChange: function(event) {
		console.log(event.target);
	},
	render: function() {
		return (
			<div>
				<input type="checkbox" onChange={ this.handleChange } id={ this.props.id } />
				<label htmlFor={ this.props.id }>{ this.props.title }</label>
			</div>
		);
	}
});
