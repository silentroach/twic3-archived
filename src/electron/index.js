import 'vendor/babel-helpers';

import app from 'app';
import path from 'path';

import Window from './window';

import application from 'application';

const resourcesPath = 'production' === process.env.NODE_ENV
	? path.resolve(__dirname) : path.resolve('./build/electron');

let wnd;

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

function showMainWindow() {
	if (!wnd) {
		wnd = new Window(
			'file://' + path.resolve(resourcesPath, 'mainwindow/index.html'),
			{
				width: 350,
				height: 600
			}
		);

		wnd.on('closed', function() {
			wnd = null;
		});
	} else {
		wnd.show();
	}

	if ('production' !== process.env.NODE_ENV) {
		wnd.openDevTools();
	}
}

app.on('ready', showMainWindow);
app.on('activate-with-no-open-windows', showMainWindow);
