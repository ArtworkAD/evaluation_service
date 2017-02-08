// Load libraries
const request = require('request-promise');
const jsonexport = require('jsonexport');

module.exports = {
  /**
   * Get information about the job. See https://success.crowdflower.com/hc/en-us/articles/201856229-CrowdFlower-API-API-Responses-and-Messaging#job_response
   * for more details about the job object.
   * @param {String} jobId
   * @return {Promise} Promise will resolve a job
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
   * Uploads ideas to crowdflower in csv format.
   * @param {JSON} array of ideas
   * @param {String} jobId
   * @return {Promise} Promise will resolve an empty response
   */
  async uploadIdeas(ideas, jobId) {
    jsonexport(ideas, function (err, csv) {
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
   * Updates the webhook of a crowdflower job.
   * @param {String} webhook
   * @param {String} jobId
   * @return {Promise} Promise will resolve an empty response
   */
  async updateWebhook(webhook, jobId) {
    return request({
      method: 'PUT',
      url: process.env.CROWDFLOWER_API_URL + '/jobs/' + jobId + '?key=' + process.env.CROWDFLOWER_API_KEY + '&job[webhook_uri]=' + webhook + '&job[send_judgments_webhook]=true',
      headers: {
        'Accept': 'application/json'
      }
    });
  }
};
