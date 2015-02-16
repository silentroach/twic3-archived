import Page from '../page';

import committers from '../../vendor/committers';

export default class AboutPage extends Page {
	render() {
		return (
			<ul>
				{committers.map(function(committer, idx) {
					var url = 'mailto:' + committer.email;

					return <li key={idx}>
						<a href={url}>{committer.name}</a>
					</li>;
				})}
			</ul>
		);
	}
}
