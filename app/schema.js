// Schema for parameters to be provided for random generator
module.exports.generator_random = {
	type: 'object',
	properties: {
		product: {
			type: 'string',
			minLength: 3,
		},
		number_of_ideas: {
			type: 'number'
		},
		number_of_components_per_idea: {
			type: 'number'
		}
	},
	required: ['product', 'number_of_ideas', 'number_of_components_per_idea'],
	additionalProperties: false
};

/**
 * CrowdflowerApi webhook schemas
 */

module.exports.crowdflower_webhook_payload = {
	type: 'object',
	properties: {
		job_id: {
			type: 'number'
		},
		data: {
			$ref: 'crowdflower_webhook_payload_data'
		},
		unit_data: {
			$ref: 'crowdflower_webhook_payload_unit_data'
		}
	},
	required: ['job_id', 'data', 'unit_data'],
	additionalProperties: true
};

module.exports.crowdflower_webhook_payload_unit_data = {
	type: 'object',
	properties: {
		_id: {
			type: 'string'
		}
	},
	required: ['_id'],
	additionalProperties: true
};

module.exports.crowdflower_webhook_payload_data = {
	type: 'object',
	properties: {
		evaluation: {
			type: 'string'
		}
	},
	required: ['evaluation'],
	additionalProperties: true
};

module.exports.crowdflower_webhook_event = {
	type: 'object',
	properties: {
		signal: {
			type: 'string'
		},
		payload: {
			type: 'array',
			items: {
				$ref: 'crowdflower_webhook_payload'
			}
		}
	},
	required: ['signal', 'payload'],
	additionalProperties: true
};
