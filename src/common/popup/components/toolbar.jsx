import React from 'react';

import './toolbar.styl';

const CLASSNAME = 'toolbar';

export default class Toolbar extends React.Component {
	render() {
		var classes = [CLASSNAME];

		switch (this.props.position) {
			case Toolbar.POSITION_TOP:
				classes.push([CLASSNAME, 'top'].join('-'));
				break;
			case Toolbar.POSITION_BOTTOM:
				classes.push([CLASSNAME, 'bottom'].join('-'));
				break;
		}

		return <div className={classes.join(' ')}>
			{this.props.children}
		</div>;
	}
}

Toolbar.POSITION_TOP = 0;
Toolbar.POSITION_BOTTOM = 1;

Toolbar.propTypes = {
	position: React.PropTypes.number
};

Toolbar.defaultProps = {
	position: Toolbar.POSITION_TOP
};
