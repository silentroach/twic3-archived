// lazy move
import React from 'react';
import ReactDOM from 'react-dom';

import App from '../../_chaos/popup/index';

import Container from 'client/ui/container';
import Toolbar from 'popup/components/toolbar';
import ToolbarIcon from 'popup/components/toolbarIcon';

import i18n from 'i18n';
import device from 'app/device';

import styles from './index.styl';

window.ReactDOM = ReactDOM;

export default class ChromePopup extends App {
	render() {
		const Page = this.state && this.state.page ? this.state.page : null;

		return (
			<Container platform={device.platform}>
				<div className={styles.wrapper} onClick={this.handleLinkClick.bind(this)}>
					<Toolbar>
						<ToolbarIcon href="#accounts" title="Accounts" />
						<ToolbarIcon href="#about" title={i18n.translate('toolbar.about')} />
					</Toolbar>

					{Page
						? <Page className={styles.page} params={this.state.pageParams} />
						: ''
					}
				</div>
			</Container>
		);
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

ReactDOM.render(<ChromePopup />, document.getElementById('content'));
