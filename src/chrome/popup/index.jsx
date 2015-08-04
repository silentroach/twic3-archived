import React from 'react';

import device from 'app/device';

import BaseApp from 'client/app';
import Container from 'client/ui/container';

import AccountsPage from './pages/accounts';

class App extends BaseApp {
	render() {
		const { PageClass, pageParams } = this.state;

		return (
			<Container platform={device.platform}>
				<div id="content" onClick={this.handleLinkClick.bind(this)}>
					{PageClass ? <PageClass params={pageParams} /> : ''}
				</div>
			</Container>
		);
	}

	getPageClassByName(pagename) {
		switch (pagename) {
			default:
				return AccountsPage;
		}
	}

	// hack to open links in background tab if modifier key is pressed
	handleLinkClick(event) {
		if (!event[device.modifierKey]) {
			return;
		}

		let target = event.target;
		if ('A' !== target.nodeName) {
			target = target.parentElement;
		}

		// @todo wtf? think about this
		if ('A' !== target.nodeName
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
}

React.render(<App />, document.body);
