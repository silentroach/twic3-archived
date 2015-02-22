import React from 'react';

if ('production' !== process.env.NODE_ENV) {
	window.React = React;
}

import Message from '../message';
import i18n from '../i18n';
import device from './device';

import Toolbar from './components/toolbar';
import ToolbarIcon from './components/toolbarIcon';

import AccountsPage from './pages/accounts';
import AboutPage from './pages/about';

import 'normalize.stylus/index.styl';
import '../vendor/evil-icons/sprite.styl';
import './index.styl';

function getPageByUrl(url) {
	var hashParts = url.split('#').pop().split('/');
	var pageName = hashParts.shift();
	var page;

	console.info('Handling page change to', pageName, hashParts);

	switch (pageName) {
		case 'about':
			page = AboutPage;
			break;
		default:
			page = AccountsPage;
			break;
	}

	return page;
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			page: getPageByUrl(window.location.href)
		};
	}

	render() {
		var Page = this.state.page;

		return (
			<div id="content">
				<Toolbar>
					<ToolbarIcon href="#accounts" title="Тест" />
					<ToolbarIcon href="#about" title={i18n.translate('toolbar.about')} />
				</Toolbar>
				<Page />
			</div>
		);
	}

	handleHashChange(e) {
		this.setState({
			page: getPageByUrl(window.location.href)
		});
	}

	componentWillUnmount() {
		window.removeEventListener('hashchange', this.handleHashChange.bind(this));
	}

	componentWillMount() {
		window.addEventListener('hashchange', this.handleHashChange.bind(this));
	}
}

document.body.classList.add(device.platform);

React.render(<App />, document.body);
