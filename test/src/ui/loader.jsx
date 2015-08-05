import React from 'react/addons';

import Loader from 'client/ui/loader';

const TestUtils = React.addons.TestUtils;

describe('UI', () => describe('Loader', () => {

	let component;

	beforeEach(() => component = TestUtils.renderIntoDocument(<Loader />));
	afterEach(() => React.unmountComponentAtNode(React.findDOMNode(component).parentNode));

	it('should be hidden by default and visible after some timeout', function(done) {
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
