import React from 'react';

import styles from './toolbar.styl';

export default class Toolbar extends React.Component {
	render() {
		var classes = [styles.toolbar];

		switch (this.props.position) {
			case Toolbar.POSITION_TOP:
				classes.push(styles.positionTop);
				break;
			case Toolbar.POSITION_BOTTOM:
				classes.push(styles.positionBottom);
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
