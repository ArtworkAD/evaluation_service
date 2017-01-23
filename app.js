// Load environment variables
require('dotenv').config();

// Load libraries
const koa = require('koa');
const logger = require('koa-logger');
const body = require('koa-bodyparser');
const error = require('koa-json-error');
const cors = require('kcors');

// Setup database singleton
const database = module.exports.database = require('monk')(process.env.DB_HOST + '/' + process.env.DB_NAME);
// Router singleton
const router = module.exports.router = require('koa-router')();
// Load api
const evaluation_api = require('./app/evaluation_api.js');
// Create app
const app = module.exports.app = new koa();

// Setup app's middleware
app
	.use(error({
		format: err => {
			return {
				status: err.status,
				message: err.message
			}
		}
	}))
	.use(cors())
	.use(body())
	.use(logger())
	.use(router.routes())
	.use(router.allowedMethods());

router
	.get('job.get', '/job/:id', evaluation_api.job)
	.post('job.upload.random', '/job/:id/upload-random', evaluation_api.random)
	.post('job.evaluate', '/job/:id/evaluate', evaluation_api.evaluate);

app.listen(process.env.PORT || 3000);
