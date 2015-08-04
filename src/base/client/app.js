import React from 'react';

if ('production' !== process.env.NODE_ENV) {
	window.React = React;
}

import 'normalize.stylus/index.styl';
import './ui/base.styl';

const handleChange = Symbol('handleChange');

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			PageClass: null
		};
	}

	[handleChange](event) {
		const url = event ? event.newURL : window.location.href;
		const hashPos = url.indexOf('#');
		const hash = hashPos ? url.substr(hashPos) : '';
		const hashParts = hash.split('/');
		const pageName = (hashParts.shift() || '').substr(1);

		console.info('Handling page change to', pageName || 'default', hashParts);

		const PageClass = this.getPageClassByName(pageName);

		if (!PageClass) {
			if ('production' !== process.env.NODE_ENV) {
				throw new Error('Can\'t found page class');
			}
		}

		this.setState({
			PageClass,
			pageParams: hashParts
		});
	}

	getPageClassByName(pagename) {
		return null;
	}

	componentDidMount() {
		this[handleChange]();
	}

	componentWillUnmount() {
		window.onhashchange = null;
	}

	componentWillMount() {
		window.onhashchange = this[handleChange].bind(this);
	}
}
