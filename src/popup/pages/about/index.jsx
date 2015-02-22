import React from 'react';
import Page from '../../page';

import './index.styl';

import ContributorList from './components/contributors';

import i18n from '../../../i18n';
import contributorList from '../../../vendor/contributors';

export default class AboutPage extends Page {
	render() {
		return (
			<div className="about">
				<h1>{i18n.translate('manifest.description')}</h1>
				<ContributorList list={contributorList} />
			</div>
		);
	}
}
