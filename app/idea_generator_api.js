// Load libraries
const request = require('request-promise');

module.exports = {
	/**
	 * Get random ideas from idea generator
	 * @param {String} product name
	 * @param {Number} number_of_ideas
	 * @param {Number} number_of_components_per_idea
	 * @return {Response} list with generated ideas
	 */
	async getRandomIdeas(product, number_of_ideas, number_of_components_per_idea) {
		return request({
			method: 'POST',
			url: process.env.IDEA_GENERATOR_API + '/generator/random',
			headers: {
				'Accept': 'application/json'
			},
			body: {
				product: product,
				number_of_ideas: number_of_ideas,
				number_of_components_per_idea: number_of_components_per_idea
			},
			json: true
		});
	}
};
