import chai from 'chai';
const assert = chai.assert;

import UrlEntities from '../../../src/background/entities/url';

describe('Model.Entities.Url', function() {

	it('should format urls', function() {
		const url = 'http://test.com/1';
		const displayUrl = 'test.com/test';
		const expandedUrl = 'http://test.com/test';
		const entities = [
			{
				url,
				'display_url': displayUrl,
				'expanded_url': expandedUrl
			}
		];

		const result = UrlEntities.processText(
			'testing url http://test.com/1 preparements',
			entities
		);

		assert.equal(
			result,
			`testing url <a href="${url}" class="tweet-link" title="${expandedUrl}" target="_blank">${displayUrl}</a> preparements`
		);
	});

	it('should replace same urls', function() {
		const url = 'http://test.com/1';
		const displayUrl = 'test.com/test';
		const expandedUrl = 'http://test.com/test';
		const entities = [
			{
				url,
				'display_url': displayUrl,
				'expanded_url': expandedUrl
			}
		];

		const result = UrlEntities.processText(
			'testing http://test.com/1 twice http://test.com/1',
			entities
		);

		assert.equal(
			result,
			`testing <a href="${url}" class="tweet-link" title="${expandedUrl}" target="_blank">${displayUrl}</a> twice <a href="${url}" class="tweet-link" title="${expandedUrl}" target="_blank">${displayUrl}</a>`
		);
	});

	it('should replace multiple entities', function() {
		const url = 'http://test.com/1';
		const displayUrl = 'test.com/test';
		const expandedUrl = 'http://test.com/test';

		const secondUrl = 'http://test.com/2';
		const secondDisplayUrl = 'test.com/testme';
		const secondExpandedUrl = 'http://test.com/testme';


		const entities = [
			{
				url,
				'display_url': displayUrl,
				'expanded_url': expandedUrl
			},
			{
				url: secondUrl,
				'display_url': secondDisplayUrl,
				'expanded_url': secondExpandedUrl
			}
		];

		const result = UrlEntities.processText(
			'testing http://test.com/2 multiple http://test.com/1',
			entities
		);

		assert.equal(
			result,
			`testing <a href="${secondUrl}" class="tweet-link" title="${secondExpandedUrl}" target="_blank">${secondDisplayUrl}</a> multiple <a href="${url}" class="tweet-link" title="${expandedUrl}" target="_blank">${displayUrl}</a>`
		);
	});

	it('should work with case insensitive data', function() {
		const url = 'http://test.com/1';
		const displayUrl = 'test.com/test';
		const expandedUrl = 'http://test.com/test';
		const entities = [
			{
				url,
				'display_url': displayUrl,
				'expanded_url': expandedUrl
			}
		];

		const result = UrlEntities.processText(
			'testing url http://TEST.com/1 preparements',
			entities
		);

		assert.equal(
			result,
			`testing url <a href="${url}" class="tweet-link" title="${expandedUrl}" target="_blank">${displayUrl}</a> preparements`
		);
	});

});

