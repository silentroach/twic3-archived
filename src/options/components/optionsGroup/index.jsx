import React from 'react';

import './index.styl';

export default React.createClass({
	render: function() {
		return <section>
			<h1>{this.props.title}</h1>
			{this.props.children}
		</section>
	}
});
