import 'vendor/babel-helpers';

import DB from './db';
import Twitter from './twitter';
import Config from 'core/config';

import App from './app';

// @todo move db to app
const twitter = new Twitter(
	new DB()
);

const config = new Config(chrome.storage);

const app = new App(config, twitter);
app.start();
