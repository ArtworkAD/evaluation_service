// Load libraries
const request = require('request-promise');
const jsonexport = require('jsonexport');

module.exports = {
	/**
	 * Get information about the job
	 * @param {String} jobId
	 * @return {Request} request object
	 */
	async getJob(jobId) {
		return request({
			method: 'GET',
			url: process.env.CROWDFLOWER_API_URL + '/jobs/' + jobId + '?key=' + process.env.CROWDFLOWER_API_KEY,
			headers: {
				'Accept': 'application/json'
			},
			json: true
		});
	},
	/**
	 * Uploads ideas to crowdflower
	 * @param {JSON} array of ideas
	 * @param {String} jobId
	 * @return {Response} some response from crowdflower
	 */
	async uploadIdeas(ideas, jobId) {
		jsonexport(ideas, function(err, csv) {
			if (err) return err;
			return request({
				method: 'GET',
				url: process.env.CROWDFLOWER_API_URL + '/jobs/' + jobId + '/upload?key=' + process.env.CROWDFLOWER_API_KEY + '&force=true',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'text/csv'
				},
				body: csv
			});
		});
	},
	/**
	 * Update webhook of a job
	 * @param {String} webhook
	 * @param {String} jobId
	 * @return {Request} request object
	 */
	async updateWebhook(webhook, jobId) {
		return request({
			method: 'PUT',
			url: process.env.CROWDFLOWER_API_URL + '/jobs/' + jobId + '?key=' + process.env.CROWDFLOWER_API_KEY + '&job[webhook_uri]=' + webhook,
			headers: {
				'Accept': 'application/json'
			}
		});
	}
};
