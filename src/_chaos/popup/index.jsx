import React from 'react';

import BaseApp from 'client';
import Message from '../message';
import i18n from 'i18n';
import device from 'app/device';

import AccountsPage from './pages/accounts';
import AboutPage from './pages/about';
import UserPage from './pages/user';
import TimelinePage from './pages/timeline';

import 'vendor/evil-icons/sprite.styl';
import './index.styl';

export default class App extends BaseApp {
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
