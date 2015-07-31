import 'vendor/babel-helpers';

import App from 'background/app.js'; // temporary pointing to chaos

import config from './config';

const app = new App(config);

app
	.start()
	.then(() => app.listen());
