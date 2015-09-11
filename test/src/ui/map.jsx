import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Map from 'client/ui/map';

describe('UI', () => describe('Map', () => {

	it('should render correct link', function() {
		const component = TestUtils.renderIntoDocument(
			<Map coords={[10, 10]} />
		);

		assert.ok(component);

		const link = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
		assert.ok(link);
		assert.equal(link.target, '_blank');
	});

	it('should render correct image source', function() {
		const width = 50;
		const height = 50;
		const component = TestUtils.renderIntoDocument(
			<Map coords={[10, 10]} width={width} height={height} />
		);

		assert.ok(component);

		const img = TestUtils.findRenderedDOMComponentWithTag(component, 'img');
		assert.ok(img);

		assert.include(
			img.src, 'scale=' + window.devicePixelRatio,
			'Should user window.devicePixelRatio as scale param'
		);
		assert.include(
			img.src, 'size=' + [width, height].join('x'),
			'Should use width and height params as size'
		);
	});

	it('should use locale prop as map image param', function() {
		const locale = 'ru_RU';
		const component = TestUtils.renderIntoDocument(
			<Map coords={[10, 10]} locale={locale} />
		);

		assert.ok(component);

		const image = TestUtils.findRenderedDOMComponentWithTag(component, 'img');
		assert.ok(image);
		assert.include(image.src, 'language=' + locale);
	});

}));
