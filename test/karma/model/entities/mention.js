import chai from 'chai';
const assert = chai.assert;

import MentionEntities from '../../../../src/background/model/entities/mention';

describe('Model.Entities.Mention', function() {

	it('should transform mentions to urls', function() {
		const id = '12345';
		const name = 'Twitter minimalist client';
		const screenName = 'twic';
		const entities = [
			{
				'id_str': String(id),
				name,
				'screen_name': screenName
			}
		];

		const result = MentionEntities.processText(
			'say hello to @twic',
			entities
		);

		assert.equal(
			result,
			`say hello to <a href="#user/${id}" class="tweet-mention" title="${name}">${screenName}</a>`
		);
	});

});
