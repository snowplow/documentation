---
title: Serving recommendations
position: 6
---

As an AWS service, AWS Personalize requires some AWS credentials in order to interact with its APIs and get recommendations.

The API is roughly split into 3 parts:

- Personalize: the main API for dealing with the service itself and its resources, we mostly used this in the last section when creating infrastructure
- Personalize Runtime: used to talk to Recommenders and get actual personalization results from our models
- Personalize Events: for ingesting real-time events _back_ into our Recommenders; we'll use this later

A list of recommenders can be obtained with the following Python code:

```py
import os
import boto3
from pprint import pprint

region = 'us-east-2' # Replace here with your own region
try:
  region = os.environ['AWS_REGION']
except userdata.SecretNotFoundError:
  pass

session = boto3.Session(
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    region_name=region,
)

personalize = session.client('personalize')
runtime = session.client('personalize-runtime')

recommender_list = personalize.list_recommenders()

recommenders = { r["name"]: r["recommenderArn"] for r in recommender_list["recommenders"] }
pprint(recommenders)
```

You'll need the ARN of the Recommender to request recommendations. Each Recommender is tied to a specific model and has its own requirements for what is needed in the request for recommendations.

One of these recommenders, `most_viewed`, can serve recommendations with the additional logic:

```py
# `runtime` was declared previously

recs = runtime.get_recommendations(
    recommenderArn=recommenders["most_viewed"],
    userId="776f1a6e-bccd-46ff-ad79-1319a3f833b7", # domain user id picked randomly from our dataset
)

pprint(recs)
```

The Recommender has returned a list of recommended items, and a `recommendationId` can be used for impression tracking.

Since it's not recommended to expose this API and credentials to visitors to our site, a service of some kind will be required, that can take requests from visitors to our site, talk to the Recommender on their behalf, and return the recommendations to the user for display on the site. [The Terraform example found in the corresponding accelerator repository](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/blob/main/terraform_utilities/aws_personalize_module/app_module/lambda/lambda.tf) contains the deployment of [an AWS Lambda app](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/blob/main/aws_personalize_utilities/lambda_app.py) that shelters the API logic plus sensitive environment variables. Once deployed, it should work as demonstrated below:

```py
import requests
from pprint import pprint

resp = requests.post("https://your-lambda-instance.execute-api.your-aws-region.amazonaws.com/", json={
    "method": "get_recommendations",
    "user_id": "776f1a6e-bccd-46ff-ad79-1319a3f833b7", # domain user id picked randomly from our dataset
    "recommender": "most_viewed",
})

recs = resp.json()
pprint(recs)
```
