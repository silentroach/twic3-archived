import text from '../../../src/common/background/twitter/text';

describe('Twitter.Text', function() {

	describe('line breaks processor', function() {

		it('should replace \\r and \\n to <br />', function() {
			assert.equal(
				text.processLineBreaks(
					'test\rme\nnow'
				),
				'test<br />me<br />now'
			);
		});

		it('should trim output', function() {
			assert.equal(
				text.processLineBreaks(
					'\rtest me now\n  '
				),
				'test me now'
			);
		});

		it('should replace 3+ breaks to 2', function() {
			assert.equal(
				text.processLineBreaks(
					'test\r\rme\n\n\n\nnow\r\n\rlalala'
				),
				'test<br /><br />me<br /><br />now<br /><br />lalala'
			);
		});

	});

	// it('should extract urls', function() {
	// 	const links = [
	// 		'http://stackoverflow.com/questions/29272754/complex-regex-extraction-in-node-io',
	// 		'https://github.com/silentroach'
	// 	];

	// 	const extracted = text.extractUrls(
	// 		`somelink here - ${links[0]} to test and another - ${links[1]}`
	// 	);

	// 	assert.deepEqual(links, extracted);
	// });

} );
