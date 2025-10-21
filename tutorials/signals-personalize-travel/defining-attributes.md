---
title: "Define behavioral attributes"
position: 3
description: "Create behavioral attributes using the Snowplow Signals Python SDK to capture user preferences and interests from website interactions."
keywords: ["Snowplow Signals", "attributes", "Python SDK", "behavioral data", "user preferences"]
date: "2025-01-21"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

In this section, you'll define behavioral [attributes](/docs/signals/concepts/#attribute-groups) that capture different types of travel preferences based on how users interact with the website. These attributes will serve as the foundation for both on-site content personalization and AI chatbot customization.

The attributes you create will track user engagement with different types of content, destinations, and features. For example, users who frequently view food-related content will have their culinary interest attribute incremented, while those who browse luxury destinations will see their luxury preference attribute increase.

To define these attributes, you'll use the Snowplow Signals Python SDK in a Jupyter notebook. We've created a notebook for you to use. You can run it directly using Google Colab [here](https://colab.research.google.com/github/snowplow/documentation/blob/main/tutorials/signals-bdp/signals.ipynb), if you have a Google account, or download it locally ADD LINK.

## Connecting to Signals

You'll need the same credentials you used on the last page.

<Tabs groupId="cloud" queryString lazy>
  <TabItem value="cdi" label="CDI" default>

```python
API_URL = 'example.signals.snowplowanalytics.com'
API_KEY = 'YOUR_API_KEY'
API_KEY_ID = 'YOUR_API_KEY_ID'
ORG_ID = 'YOUR_ORG_ID'
```

  </TabItem>
  <TabItem value="sandbox" label="Sandbox">

```python
API_URL = 'you.signals.snowplowanalytics.com'
ACCESS_TOKEN = ''
```

  </TabItem>
</Tabs>

## Defining attributes

The notebook defines a series of attributes that represent different user preferences and behaviors. These attributes include interests in various types of travel experiences e.g., luxury, budget, adventure, or culinary, as well as some information about scheduling.

The attributes are based on these tags:

```python
cultural_explorer_tags = ["culture", "history", "heritage", "ancient", "temples", "art", "traditional"]
modern_urbanite_tags = ["urban", "nightlife", "shopping", "modern", "architecture"]
tranquil_seeker_tags = ["nature", "peaceful", "wellness", "beaches", "mountains", "river", "wellness"]
family_fun_tags = ["family-friendly", "beaches", "nature", "food", "mountains", "culture"]
culinary_tourist_tags = ["food", "street food", "multicultural", "traditional", "urban", "shopping"]
```

The notebook contains the following `counter` attribute definitions:
* `page_view_count`
* `dest_page_view_count`
* `family_destination_count`
* `cultural_explorer`
* `modern_urbanite`
* `tranquil_seeker`
* `family_fun`
* `culinary_tourist`
* `budget_conscious`
* `luxury_inclined`

As well as two attributes with the `last` aggregation:
* `preferred_experience_length`
* `latest_schedule`

Run the notebook cell to define attributes. This doesn't yet publish them to your Signals instance.

## Defining an attribute group

Next, [define the attribute group](/docs/signals/define-attributes/using-python-sdk/attribute-groups) for your attributes. Create a `StreamAttributeGroup` with `domain_sessionid` as the attribute key.

```python
from snowplow_signals import StreamAttributeGroup, domain_sessionid

session_attributes_group = StreamAttributeGroup(
    name="travel_view",
    version=1,
    attribute_key=domain_sessionid,
    attributes=[page_view_count, dest_page_view_count, family_destination_count, cultural_explorer,
                modern_urbanite, tranquil_seeker, family_fun, culinary_tourist,
                preferred_experience_length, budget_conscious, luxury_inclined, latest_schedule],
    owner = 'you@email.com',
)
```

## Defining a service

Define a service to expose the attribute group via the API, so you can fetch it in your travel site.

```python
from snowplow_signals import Service

travel_service = Service(
    name="travel_service",
    description="A service for our travel demo website.",
    attribute_groups=[session_attributes_group],
    owner='you@email.com'
)
```

## Publishing the definitions to Signals

Finally, publish the attribute group and service to your Signals instance:

```python
response = sp_signals.publish([session_attributes_group, travel_service])
print(response)
```

Signals will start processing attributes from your real-time event stream.
