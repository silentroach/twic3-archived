import React from 'react';
import Router from 'react-router';

import 'normalize.stylus/index.styl';
import '../vendor/evil-icons/sprite.styl';
import './index.styl';

import TabList from './components/tabList';
import OptionsGroup from './components/optionsGroup';
import Checkbox from './components/checkbox';

var Options = React.createClass({
	render: function() {
		return (
			<div>
				<TabList />

				<OptionsGroup title="Timeline avatar size">
					<span>лалки!</span>
				</OptionsGroup>

				<OptionsGroup title="Additional tweet info">
					<Checkbox title="Images" id="tweet-images" />
				</OptionsGroup>
			</div>
		);
	}
});

React.render(<Options />, document.body);
