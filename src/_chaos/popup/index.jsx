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
import UserPage from './pages/user';
import TimelinePage from './pages/timeline';

import 'normalize.stylus/index.styl';
import 'vendor/evil-icons/sprite.styl';
import './index.styl';

class App extends React.Component {
	render() {
		var Page = this.state && this.state.page ? this.state.page : null;

		return (
			<div id="content">
				<Toolbar>
					<ToolbarIcon href="#accounts" title="Тест" />
					<ToolbarIcon href="#about" title={i18n.translate('toolbar.about')} />
				</Toolbar>
				{Page ? <Page params={this.state.pageParams} /> : ''}
			</div>
		);
	}

	handleHashChange(event) {
		const url = event ? event.newURL : window.location.href;
		const hashPos = url.indexOf('#');
		const hash = hashPos ? url.substr(hashPos) : '';
		const hashParts = hash.split('/');
		const pageName = (hashParts.shift() || '').substr(1);
		let page;

		console.info('Handling page change to', pageName || 'default', hashParts);

		switch (pageName) {
			case 'about':
				page = AboutPage;
				break;
			case 'users':
				page = UserPage;
				break;
			case 'timeline':
				page = TimelinePage;
				break;
			default:
				page = AccountsPage;
				break;
		}

		this.setState({
			page: page,
			pageParams: hashParts
		});
	}

	// hack to open links in background tab if modifier key is pressed
	handleLinkClick(event) {
		const target = event.target;

		if ('A' !== target.nodeName
			|| !event[device.modifierKey]
			|| '_blank' !== target.getAttribute('target')
		) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		chrome.tabs.create({
			url: target.getAttribute('href'),
			active: false
		});
	}

	componentDidMount() {
		this.handleHashChange();
	}

	componentWillUnmount() {
		window.onhashchange = null;
		document.onclick = null;
	}

	componentWillMount() {
		window.onhashchange = this.handleHashChange.bind(this);
		document.onclick = this.handleLinkClick.bind(this);
	}
}

document.body.classList.add(device.platform);

React.render(<App />, document.body);
