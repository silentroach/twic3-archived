import React from 'react';

import BaseApp from 'client/app';
import Message from '../message';
import i18n from 'i18n';
import device from 'app/device';

import Toolbar from './components/toolbar';
import ToolbarIcon from './components/toolbarIcon';

import Container from 'client/ui/container';
import AccountsPage from './pages/accounts';
import AboutPage from './pages/about';
import UserPage from './pages/user';
import TimelinePage from './pages/timeline';

import 'vendor/evil-icons/sprite.styl';
import './index.styl';

class App extends BaseApp {
	render() {
		var Page = this.state && this.state.page ? this.state.page : null;

		return (
			<Container platform={device.platform}>
				<div id="content" onClick={this.handleLinkClick.bind(this)}>
					<Toolbar>
						<ToolbarIcon href="#accounts" title="Accounts" />
						<ToolbarIcon href="#about" title={i18n.translate('toolbar.about')} />
					</Toolbar>
					{Page ? <Page params={this.state.pageParams} /> : ''}
				</div>
			</Container>
		);
	}

	getPageClassByName(pagename) {
		let PageClass;

		switch (pagename) {
			case 'about':
				PageClass = AboutPage;
				break;
			case 'users':
				PageClass = UserPage;
				break;
			case 'timeline':
				PageClass = TimelinePage;
				break;
			default:
				PageClass = AccountsPage;
				break;
		}

		return PageClass;
	}
}

React.render(<App />, document.body);
