import React from 'react/addons';

import Loader from 'client/ui/loader';

const TestUtils = React.addons.TestUtils;

describe('UI', () => describe('Loader', () => {

	it('should be hidden by default and visible after some timeout', function(done) {
		const component = TestUtils.renderIntoDocument(
			<Loader />
		);

		assert.ok(component);

		const div = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
		assert.ok(div);

		const node = div.getDOMNode();

		assert(node.classList.contains('loader-hidden'), 'not hidden');

		setTimeout(function() {
			assert(!node.classList.contains('loader-hidden'), 'not visible after timeout');
			done();
		}, 250);
	});

}));
