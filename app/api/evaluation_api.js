// Load libraries
const app = require('../../app.js');
const schema = require('../share/schema');
const util = require('../share/util.js');

// Load services
const EvaluationService = require('../service/evaluation_service.js');
const IdeaGeneratorService = require('../service/idea_generator_service.js');

const router = app.router;
const ideas = app.database.get('ideas');

// Setup validation
const validator = require("ajv")({
  removeAdditional: true
});

// Load schemas
validator.addSchema(schema.generator_random, 'generator_random');

// Show job meta information
module.exports.job = async ctx => {
  ctx.body = await EvaluationService.getJob(ctx.params.id);
};

/**
 * This generates random ideas using the idea generator and
 * sends the ideas to the crowdflower job. The parameters have to
 * be send using POST. A webhook will be registered to recieve
 * job events.
 */
module.exports.random = async ctx => {
  if (validator.validate('generator_random', ctx.request.body)) {
    await EvaluationService.updateWebhook(util.toAbsoluteUrl(ctx, router.url('job.evaluate', ctx.params.id)), ctx.params.id);
    const randomIdeas = await IdeaGeneratorService.getRandomIdeas(ctx.request.body.product, ctx.request.body.number_of_ideas, ctx.request.body.number_of_components_per_idea);
    ctx.body = await EvaluationService.uploadIdeas(randomIdeas, ctx.params.id);
  } else {
    ctx.throw(422, validator.errorsText());
  }
};

/**
 * This is a webhook called by crowdflower. We receive evaluations here and
 * save them in the database. The data is comming in via POST request. For details
 * about the data see https://success.crowdflower.com/hc/en-us/articles/201856249-CrowdFlower-Webhook-Basics
 */
module.exports.evaluate = async ctx => {
  const body = ctx.request.body;
  if (body.signal === 'new_judgments') {
    var updates = [];
    body.payload = JSON.parse(body.payload);
    for (let judgment of body.payload) {
      updates.push(ideas.update({
        _id: judgment.unit_data._id
      }, {
        $set: {
          evaluation: parseInt(judgment.data.evaluation)
        }
      }));
    }
    ctx.body = await Promise.all(updates);
  } else if (body.signal === 'job_complete') {
    ctx.body = await IdeaGeneratorService.ideasEvaluated();
  }
  ctx.body = {};
};
