import chai from 'chai';
const assert = chai.assert;

import Entities from '../../src/background/entities';

describe('Entities', function() {

	it('should render entities to text with urls', function() {
		const text = 'Write markdown, extract metadata, commonmark-helpers is out! https://t.co/QjTIqiPqzs and article about release https://t.co/AY663NwHtW';
		const urlEntitiesData = [
			{
				indices: [61, 84],
				url: 'https://t.co/QjTIqiPqzs',
				'expanded_url': 'https://www.npmjs.com/package/commonmark-helpers',
				'display_url': 'npmjs.com/package/common…'
			},
			{
				indices: [111, 134],
				url: 'https://t.co/AY663NwHtW',
				'expanded_url': 'https://iamstarkov.com/commonmark-helpers-release/',
				'display_url': 'iamstarkov.com/commonmark-hel…'
			}
		];

		const entities = new Entities();

		entities
			.parseUrls(urlEntitiesData);

		const output = entities.processText(text);

		assert.equal(
			output,
			'Write markdown, extract metadata, commonmark-helpers is out! <a href="https://t.co/QjTIqiPqzs" class="tweet-link" title="https://www.npmjs.com/package/commonmark-helpers" target="_blank">npmjs.com/package/common…</a> and article about release <a href="https://t.co/AY663NwHtW" class="tweet-link" title="https://iamstarkov.com/commonmark-helpers-release/" target="_blank">iamstarkov.com/commonmark-hel…</a>'
		);
	});

	it('should render entities to text with hashes and mentions', function() {
		const text = 'RT @GoT_Dany: Jon Snow on Mother\'s Day. #HappyMothersDay';

		const hashEntitiesData = [
			{
				indices: [40, 56],
				text: 'HappyMothersDay'
			}
		];
		const mentionsEntitiesData = [
			{
				indices: [3, 12],
				'id_str': '543128024',
				name: 'Daenerys Targaryen',
				'screen_name': 'GoT_Dany'
			}
		];

		const entities = new Entities();

		entities
			.parseHashtags(hashEntitiesData)
			.parseMentions(mentionsEntitiesData);

		const output = entities.processText(text);

		assert.equal(
			output,
			'RT <a class="tweet-link-mention" href="#users/543128024" title="Daenerys Targaryen">@GoT_Dany</a>: Jon Snow on Mother\'s Day. <span class="tweet-link-hashtag">#HappyMothersDay</span>'
		);
	});

	it('should return merged additional data', function() {
		const url = 'http://t.co/sBOkw1ynch/test.jpg';
		const type = 'photo';
		const mediaEntities = [
			{
				indices: [10, 15],
				type,
				'media_url_https': url,
				url: 'http://t.co/sBOkw1ynch',
				sizes: {
					alias: {
						h: 10, w: 10, resize: 'fit'
					}
				}
			}
		];

		const entities = new Entities();

		entities
			.parseMedia(mediaEntities);

		const output = entities.getAdditionalData();

		assert.deepEqual(
			output,
			{
				gallery: [
					{
						url,
						sizes: {
							alias: [10, 10]
						},
						type
					}
				]
			}
		);
	});

});
