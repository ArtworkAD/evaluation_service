var app = require('../../app.js');
var request = require('supertest').agent(app.app.listen());

describe('evaluation rest api test suit', function() {

	it('should not show job when job id is missing', function*() {
		yield request
			.get('/job')
			.set('Accept', /application\/json/)
			.expect(404);
	});

  it('should show job when correct job id is provided', function*() {
		yield request
			.get('/job/983808')
			.set('Accept', /application\/json/)
      .expect('Content-Type', /application\/json/)
			.expect(200);
	});

  it('should send one idea to crowdflower', function*() {

    const params = {
      product: 'Foobar',
      number_of_ideas: 1,
      number_of_components_per_idea: 1
    };

		yield request
			.post('/job/983808/upload-random')
			.type('json')
			.send(params)
			.set('Accept', /application\/json/)
			.expect(204);
	});

  it('should fail to send one idea to crowdflower', function*() {

    const params = {};

		yield request
			.post('/job/983808/upload-random')
			.type('json')
			.send(params)
			.set('Accept', /application\/json/)
      .expect('Content-Type', /application\/json/)
			.expect(422);
	});

});
