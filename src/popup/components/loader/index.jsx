import './index.styl';

import React from 'react';
import PureComponent from 'react-pure-render/component';

import i18n from '../../../i18n';

export default class Avatar extends PureComponent {
	constructor(props) {
		super(props);

		this.timer = null;

		this.state = {
			waiting: true
		};
	}

	render() {
		const classes = ['loader'];

		if (this.state.waiting) {
			classes.push('loader-hidden');
		}

		return (
			<div className={classes.join(' ')} title={i18n.translate('components.loader.loading')}>
				<i className="ei-spinner ei-spinner-dims" />
			</div>
		);
	}

	componentWillMount() {
		this.timer = setTimeout(() => this.setState({
			waiting: false
		}), 150);
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}
}
