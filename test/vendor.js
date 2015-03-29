import chai from 'chai';
const assert = chai.assert;

describe('Vendor modules', function() {

	describe('Twitter Text', function() {

		it('module should be loaded correctly', function() {
			assert.doesNotThrow(function() {
				require('../src/vendor/twitter-text');
			});
		});

		it('should extract correct regexps', function() {
			const tt = require('twitter-text');
			const generated = require('../src/vendor/twitter-text');

			assert.equal(tt.regexen.extractUrl.source, generated.url.source);
			assert.equal(tt.regexen.validHashtag.source, generated.hash.source);
			assert.equal(tt.regexen.validMentionOrList.source, generated.mention.source);
		});

	});

});
