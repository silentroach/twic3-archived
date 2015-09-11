import React from 'react';
import ReactDOM from 'react-dom';

import 'client/ui/base.styl';
import './index.styl';

import device from 'app/device';

import Container from 'client/ui/container';
import Navigator from './ui/navigator';

class App extends React.Component {
	render() {
		return (
			<Container platform={device.platform}>
				<Navigator />
			</Container>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('content'));
