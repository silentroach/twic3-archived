import React from 'react';
window.React = React;

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

var app;

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			page: AccountsPage
		};
	}

	render() {
		var Page = this.state.page;

		return (
			<div>
				<Toolbar>
					<ToolbarIcon href="#accounts" title="Тест" />
					<ToolbarIcon href="#about" title={i18n.translate('toolbar.about')} />
				</Toolbar>
				<Page />
			</div>
		);
	}

	handleHashChange(e) {
		var hashParts = e.newURL.split('#').pop().split('/');
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

		this.setState({
			page: page
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
