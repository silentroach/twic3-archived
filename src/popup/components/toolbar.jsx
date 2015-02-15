import React from 'react';

import './toolbar.styl';

export default class Toolbar extends React.Component {
	render() {
		return <ul className="toolbar">
			{this.props.children}
		</ul>;
	}
}
