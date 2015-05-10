import chai from 'chai';
const assert = chai.assert;

import Entities from '../../src/background/entities';

describe('Entities', function() {

	it('should render entities to text correctly', function() {
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

});
