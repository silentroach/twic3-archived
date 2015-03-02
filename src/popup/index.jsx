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

import 'normalize.stylus/index.styl';
import '../vendor/evil-icons/sprite.styl';
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

	handleHashChange() {
		var hashParts = window.location.href.split('#').pop().split('/');
		var pageName = hashParts.shift();
		var page;

		console.info('Handling page change to', pageName, hashParts);

		switch (pageName) {
			case 'about':
				page = AboutPage;
				break;
			case 'user':
				page = UserPage;
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

	componentDidMount() {
		this.handleHashChange();
	}

	componentWillUnmount() {
		window.removeEventListener('hashchange', this.handleHashChange.bind(this));
	}

	componentWillMount() {
		window.addEventListener('hashchange', this.handleHashChange.bind(this));
	}
}

document.body.classList.add(device.platform);

/*eslint-disable*/ /* @todo until react clases support */
React.render(<App />, document.body);
