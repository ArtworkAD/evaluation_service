// Load libraries
const request = require('request-promise');
const jsonexport = require('jsonexport');

module.exports = {
	/**
	 * Get information about the job
	 * @return {Request} request object
	 */
	async getJob() {
		return request({
			method: 'GET',
			url: process.env.CROWDFLOWER_API_URL + '/jobs/' + process.env.CROWDFLOWER_JOB_ID + '?key=' + process.env.CROWDFLOWER_API_KEY,
			headers: {
				'Accept': 'application/json'
			},
			json: true
		});
	},
	/**
	 * Uploads ideas to crowdflower
	 * @param {JSON} array of ideas
	 * @return {Response} some response from crowdflower
	 */
	async uploadIdeas(ideas) {
		jsonexport(ideas, function(err, csv) {
			if (err) return err;
			return request({
				method: 'GET',
				url: process.env.CROWDFLOWER_API_URL + '/jobs/' + process.env.CROWDFLOWER_JOB_ID + '/upload?key=' + process.env.CROWDFLOWER_API_KEY + '&force=true',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'text/csv'
				},
				body: csv
			});
		});
	}
};
