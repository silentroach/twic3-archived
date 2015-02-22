import React from 'react';

import './committers.styl';

import i18n from '../../../../i18n';

export default class CommitterList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			compact: true
		}
	}

	handleExpand(e) {
		e.preventDefault();

		this.setState({
			compact: false
		});
	}

	render() {
		if (this.state.compact) {
			return (
				<a href="#" onClick={this.handleExpand.bind(this)}>
					{i18n.translate('pages.about.contributors')}
				</a>
			);
		}

		return (
			<div>
				<h2>{i18n.translate('pages.about.contributors')}</h2>
				<ul className="committerList">
					{this.props.list.map(function(committer, idx) {
						var url = 'mailto:' + committer.email;

						return <li key={idx}>
							<a href={url}>{committer.name}</a>
						</li>;
					})}
				</ul>
			</div>
		);
	}
}
