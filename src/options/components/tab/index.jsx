import React from 'react';

import './index.styl';

export default React.createClass({
	render: function() {
		return <li role="tab">{ this.props.name }</li>;
	}
});
