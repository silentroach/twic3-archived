import React from 'react';
window.React = React;

import Message from '../message';
import i18n from '../i18n';
import device from './device';

import Toolbar from './components/toolbar';

import AccountPage from './pages/accounts';

import 'normalize.stylus/index.styl';
import '../vendor/evil-icons/sprite.styl';
import './index.styl';

document.body.classList.add(device.platform);

class App extends React.Component {
	render() {
		return (
			<div>
				<Toolbar>
					<li>
						<a href="#about" title={i18n.translate('toolbar.about')}>
							{i18n.translate('toolbar.about')}
						</a>
					</li>
				</Toolbar>
				<AccountPage />
			</div>
		);
	}
}

React.render(<App />, document.body);
