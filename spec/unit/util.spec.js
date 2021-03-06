describe('util test suit', function() {
	const util = require('../../app/util');

	it('should return an absolute url', function*() {
		// Spoofing ctx
		const ctx = {
			protocol: 'http',
			host: 'localhost'
		};
		expect(util.toAbsoluteUrl(ctx, '/job')).toBe(ctx.protocol + '://' + ctx.host + '/job');
	});
});
