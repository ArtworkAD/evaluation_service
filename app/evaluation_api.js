// Load libraries
const app = require('../app.js');
const schema = require('./schema');
const util = require('./util.js');

const CrowdflowerApi = require('./crowdflower_api.js');
const IdeaGeneratorApi = require('./idea_generator_api.js');

const router = app.router;
const ideas = app.database.get('ideas');

/**
 * We use this module to validate inputs agains the json schema.
 * removeAdditional: true will remove all fields that are not specified in the schema.
 */
const validator = require("ajv")({
	removeAdditional: true
});

// Load schemas
validator.addSchema(schema.generator_random, 'generator_random');
validator.addSchema(schema.crowdflower_webhook_payload_data, 'crowdflower_webhook_payload_data');
validator.addSchema(schema.crowdflower_webhook_payload_unit_data, 'crowdflower_webhook_payload_unit_data');
validator.addSchema(schema.crowdflower_webhook_payload, 'crowdflower_webhook_payload');
validator.addSchema(schema.crowdflower_webhook_event, 'crowdflower_webhook_event');

module.exports.job = async ctx => {
	ctx.body = await CrowdflowerApi.getJob(ctx.params.id);
};

module.exports.random = async ctx => {
	if (validator.validate('generator_random', ctx.request.body)) {

		const params = ctx.request.body;
		await CrowdflowerApi.updateWebhook(util.toAbsoluteUrl(ctx, router.url('job.evaluate', ctx.params.id)), ctx.params.id);
		const randomIdeas = await IdeaGeneratorApi.getRandomIdeas(params.product, params.number_of_ideas, params.number_of_components_per_idea);
		ctx.body = await CrowdflowerApi.uploadIdeas(randomIdeas, ctx.params.id);

	} else {
		ctx.throw(422, validator.errorsText());
	}
};

module.exports.evaluate = async ctx => {
	const body = ctx.request.body;

	if (validator.validate('crowdflower_webhook_event', body)) {

		var updates = [];

		if (body.signal === 'new_judgments') {

			for (let judgment of body.payload) {

				updates.push(ideas.update({
					_id: judgment.unit_data._id
				}, {
					$set: {
						evaluation: parseInt(judgment.data.evaluation)
					}
				}));
			}
		}
		ctx.body = await Promise.all(updates);
	} else {
		ctx.throw(422, validator.errorsText());
	}
};
