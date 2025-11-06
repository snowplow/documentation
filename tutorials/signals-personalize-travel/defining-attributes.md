---
title: "Create behavioral attributes"
position: 3
description: "Define behavioral attributes using the Snowplow Signals Python SDK to capture user preferences from website interactions."
keywords: ["Snowplow Signals", "attributes", "Python SDK", "behavioral data", "user preferences"]
date: "2025-01-21"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

You'll now define behavioral attributes that capture different types of travel preferences based on how users interact with the website. These attributes will serve as the foundation for both on-site content personalization and AI chatbot customization.

The attributes you create will track user engagement with different types of content, destinations, and features. For example, users who frequently view food-related content will have their culinary interest attribute incremented, while those who browse luxury destinations will see their luxury preference attribute increase.

## Open the Jupyter notebook

You'll use the Snowplow Signals Python SDK in a Jupyter notebook to define your attributes. You can run the notebook directly using Google Colab [here](https://colab.research.google.com/github/snowplow/documentation/blob/main/static/notebooks/signals-personalize-travel-demo.ipynb), or download it locally.

## Set up your credentials

You'll need the same connection credentials you used in the previous step:

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

## Define attributes

Run the notebook cell that defines the attributes. The notebook creates a series of attributes that represent different user preferences and behaviors, including interests in various types of travel experiences like luxury, budget, adventure, and culinary.

The attributes are based on these content tags:

```python
cultural_explorer_tags = ["culture", "history", "heritage", "ancient", "temples", "art", "traditional"]
modern_urbanite_tags = ["urban", "nightlife", "shopping", "modern", "architecture"]
tranquil_seeker_tags = ["nature", "peaceful", "wellness", "beaches", "mountains", "river", "wellness"]
family_fun_tags = ["family-friendly", "beaches", "nature", "food", "mountains", "culture"]
culinary_tourist_tags = ["food", "street food", "multicultural", "traditional", "urban", "shopping"]
```

The notebook defines these counter attributes:

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

And these attributes with the `last` aggregation:

* `preferred_experience_length`
* `latest_schedule`

Running this cell defines the attributes locally but doesn't yet publish them to your Signals instance.

## Create an attribute group

Run the next notebook cell to define an attribute group for your attributes. This creates a `StreamAttributeGroup` with `domain_sessionid` as the attribute key:

```python
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

## Create a service

Run the notebook cell that defines a service to expose the attribute group via the API:

```python
travel_service = Service(
    name="travel_service",
    description="A service for our travel demo website.",
    attribute_groups=[session_attributes_group],
    owner='you@email.com'
)
```

## Publish to Signals

Finally, run the cell that publishes the attribute group and service to your Signals instance:

```python
response = sp_signals.publish([session_attributes_group, travel_service])
print(response)
```

Signals will start processing attributes from your real-time event stream.
