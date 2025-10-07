---
title: Defining attributes in Signals
position: 3
---


## Using the Signals Python SDK

In order to personalize our site experience we need to define some attributes in Signals that capture user behavior and preferences. This will allow us to tailor the content and interactions on the site to better meet the needs of individual users.

We'll use the same attributes for both the on-site personalization and the conversational agent responses. This means that the attributes we define will be used to customize both the content displayed on the travel site as well as the responses provided by the agent when users ask questions.

To define these attributes, we'll use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/) in a Jupyter notebook to create a set of attributes that capture and aggregate user preferences.

To run this notebook you can either download it locally or alternately run it on Google Colab [here](https://colab.research.google.com/github/snowplow/documentation/blob/main/tutorials/signals-bdp/signals.ipynb) if you have a Google account.

## Setting up your credentials

You will need to set up your API credentials in order to use the Signals Python SDK. This includes your API URL, API key, API key ID, and organization ID for Signals BDP or the API URL and access token for Signals Sandbox.

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="bdp" label="BDP" default>

  <CodeBlock language="python">
API_URL = 'example.signals.snowplowanalytics.com'
API_KEY = 'YOUR_API_KEY'
API_KEY_ID = 'YOUR_API_KEY_ID'
ORG_ID = 'YOUR_ORG_ID'
</CodeBlock>
  </TabItem>
  <TabItem value="sandbox" label="Sandbox">
    <CodeBlock language="python">
API_URL = 'you.signals.snowplowanalytics.com'
ACCESS_TOKEN = ''
    </CodeBlock>
  </TabItem>
</Tabs>

## Defining attributes

The second code cell in the notebook defines a series of attributes that represent different user preferences and behaviors. These attributes include interests in various types of travel experiences (e.g., luxury, budget, adventure, culinary) as well as some information about scheduling.

Run this cell now to define these attributes - this command creates them locally but does not yet publish them to your Signals instance.

## Defining an attribute group

Next, we will define an attribute group that cohesively represents a user's session on the travel site. This group will aggregate the individual attributes we defined earlier, allowing us to capture a comprehensive view of user preferences during their visit and later retrieve these attributes using a single API call for personalization.

## Defining a service

Finally, we will define a service that represents the travel site itself. This service will be associated with the attribute group we just created, allowing us to link user sessions on the site with their corresponding preferences and behaviors. A service allows us to expose the attribute group via the API so we can fetch it in our travel site.



