import React from 'react';

import 'ui/base.styl';
import './index.styl';

import device from 'device';

import Navigator from './ui/navigator';

class App extends React.Component {
	render() {
		return <Navigator />;
	}
}

document.body.classList.add(device.platform);

React.render(<App />, document.body);
