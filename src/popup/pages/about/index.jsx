import Page from '../../page';

import committerList from '../../../vendor/committers';

import CommittersList from './components/committers';

export default class AboutPage extends Page {
	render() {
		return (
			<CommittersList list={committerList} />
		);
	}
}
