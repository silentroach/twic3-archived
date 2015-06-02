import React from 'react/addons';

import Map from '../../../src/common/popup/components/map';

const TestUtils = React.addons.TestUtils;

describe('Components.Map', function() {

	it('should render correct link', function() {
		const component = TestUtils.renderIntoDocument(
			<Map coords={[10, 10]} />
		);

		assert.ok(component);

		const link = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
		assert.ok(link);

		const linkNode = link.getDOMNode();
		assert.equal(linkNode.target, '_blank');
	});

	it('should use locale prop as map image param', function() {
		const locale = 'ru_RU';
		const component = TestUtils.renderIntoDocument(
			<Map coords={[10, 10]} locale={locale} />
		);

		assert.ok(component);

		const image = TestUtils.findRenderedDOMComponentWithTag(component, 'img');
		assert.ok(image);

		const imageNode = image.getDOMNode();
		assert.include(imageNode.src, 'language=' + locale);
	});

});
