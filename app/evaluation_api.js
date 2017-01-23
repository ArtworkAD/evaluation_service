// Load libraries
const database = require('monk')('localhost/material');

// Load own packages
const app = require('../app.js');
const router = app.router;
const colors = database.get('ideas');
const schema = require('./schema');
const util = require('./util.js');

const CrowdflowerApi = require('./crowdflower_api.js');
const IdeaGeneratorApi = require('./idea_generator_api.js');

/**
 * We use this module to validate inputs agains the json schema.
 * removeAdditional: true will remove all fields that are not specified in the schema.
 */
const validator = require("ajv")({
	removeAdditional: true
});

// Load schemas
validator.addSchema(schema.generator_random, 'generator_random');

module.exports.job = async ctx => {
	ctx.body = await CrowdflowerApi.getJob(ctx.params.id);
};

module.exports.random = async ctx => {
	if (validator.validate('generator_random', ctx.request.body)) {
		const params = ctx.request.body;
		await CrowdflowerApi.updateWebhook(util.toAbsoluteUrl(ctx, router.url('job.evaluate', ctx.params.id)), ctx.params.id);
		const ideas = await IdeaGeneratorApi.getRandomIdeas(params.product, params.number_of_ideas, params.number_of_components_per_idea);
		ctx.body = await CrowdflowerApi.uploadIdeas(ideas, ctx.params.id);
	} else {
		ctx.throw(422, validator.errorsText());
	}
};

module.exports.evaluate = async ctx => {
	console.log(ctx.request.body);
	ctx.status = 200;
	ctx.body = {};
};
