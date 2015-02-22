import Page from '../../page';

import './index.styl';

import CommittersList from './components/committers';

import i18n from '../../../i18n';
import committerList from '../../../vendor/committers';

export default class AboutPage extends Page {
	render() {
		return (
			<div className="about">
				<h1>{i18n.translate('manifest.description')}</h1>
				<CommittersList list={committerList} />
			</div>
		);
	}
}
