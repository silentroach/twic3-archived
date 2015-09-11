import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import Loader from 'client/ui/loader';

describe('UI', () => describe('Loader', () => {

	let component;

	beforeEach(() => component = TestUtils.renderIntoDocument(<Loader />));
	afterEach(() => ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component).parentNode));

	it('should be hidden by default and visible after some timeout', function(done) {
		assert.ok(component);

		const div = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
		assert.ok(div);

		assert(div.classList.contains('loader-hidden'), 'not hidden');

		setTimeout(function() {
			assert(!div.classList.contains('loader-hidden'), 'not visible after timeout');
			done();
		}, 250);
	});

}));
