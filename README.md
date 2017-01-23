# Evaluation webservice

Stack: nodejs, mongodb. See package.json to see what frameworks are used.

## REST API

### Job

#### ```[GET]/job/:id```

Endpoint to display crowdflower job details. See https://success.crowdflower.com/hc/en-us/articles/201856229-CrowdFlower-API-API-Responses-and-Messaging#job_response for more details about jobs.

#### ```[POST]/job/:id/upload-random```

Upload random ideas to a specific crowdflower job. Following parameters must be provided as post body for random idea generation:

```
{
	"product": "SomeProduct",
	"number_of_ideas": 1,
	"number_of_components_per_idea": 2
}
```

#### ```[POST]/job/:id/evaluate```

Crowdflower will post data to this endpoint when interesting events, such as evaluations, happen. See https://success.crowdflower.com/hc/en-us/articles/201856249-CrowdFlower-Webhook-Basics for more details.

## ENV

 - PORT=somePortToRunOn
 - DB_HOST=someDbHost
 - DB_NAME=business_model_idea_generator
 - IDEA_GENERATOR_API=someUrl
 - CROWDFLOWER_API_KEY=yourKey
 - CROWDFLOWER_API_URL=https://api.crowdflower.com/v1
