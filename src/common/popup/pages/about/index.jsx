import React from 'react';
import PureComponent from 'react-pure-render/component';

import './index.styl';

import ContributorList from './components/contributors';

import i18n from '../../../i18n';
import contributorList from '../../../vendor/contributors';

export default class AboutPage extends PureComponent {
	render() {
		return (
			<div id="about" className="page">
				<h1>{i18n.translate('manifest.description')}</h1>
				<ContributorList list={contributorList} />
			</div>
		);
	}
}
