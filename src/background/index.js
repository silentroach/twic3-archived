import '../vendor/babel-helpers';

import DB from './db';
import Twitter from './twitter';
import Config from '../config';

import App from './app';

const twitter = new Twitter(
	new DB()
);

const config = new Config(chrome.storage);

const app = new App(config, twitter);
app.start();
