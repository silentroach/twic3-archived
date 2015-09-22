import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Avatar from 'client/ui/avatar';

describe('UI', () => describe('Avatar', () => {

	it('should render avatar to img with correct src', function() {
		const pathTemplate = 'file://somepath{size}.jpg';
		const component = TestUtils.renderIntoDocument(
			<Avatar template={pathTemplate} />
		);

		assert.ok(component);

		const img = TestUtils.findRenderedDOMComponentWithTag(component, 'img');
		assert.ok(img);

		assert.include(img.src, 'somepath');
		assert.notInclude(img.src, '{size}', 'size component replace');
	});

	it('should be bordered if property is set', function() {
		const pathTemplate = 'file://somepath{size}.jpg';
		const component = TestUtils.renderIntoDocument(
			<Avatar template={pathTemplate} border />
		);

		assert.ok(component);

		const img = TestUtils.findRenderedDOMComponentWithTag(component, 'img');
		assert.ok(img);

		assert.include(img.getAttribute('class'), 'border');
	});

}));
