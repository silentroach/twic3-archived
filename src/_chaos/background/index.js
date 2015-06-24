import 'vendor/babel-helpers';

import Config from 'core/config';
import App from './app';

const app = new App(
	new Config(chrome.storage)
);

app
	.start()
	.then(() => app.listen());
