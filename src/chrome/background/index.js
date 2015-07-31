import 'vendor/babel-helpers';

import App from './app';

import config from './config';

const app = new App(config);

app
	.start()
	.then(() => app.listen());
