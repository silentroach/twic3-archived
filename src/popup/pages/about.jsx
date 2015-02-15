import React from 'react';

import committers from '../../vendor/committers';

export default React.createClass({
	render: function() {
		return <ul>
			{committers.map(function(committer, idx) {
				var url = 'mailto:' + committer.email;

				return <li key={idx}>
					<a href={url}>{committer.name}</a>
				</li>;
			})}
		</ul>;
	}
});
