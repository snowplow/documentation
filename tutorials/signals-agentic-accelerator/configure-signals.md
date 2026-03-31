---
title: "Configure Snowplow Signals behavioral attributes"
sidebar_label: "Configure Signals"
position: 3
description: "Define and publish behavioral attributes using Snowplow Signals to provide real-time user context to your AI agent."
keywords: ["Snowplow Signals", "behavioral attributes", "Profile API", "streaming engine", "personalization"]
date: "2026-03-27"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Users express intent through their browsing behavior - page views, filter interactions, content engagement - long before they type a message to an agent. In this step you define behavioral attributes using Snowplow Signals, publish them as a service, and validate that they compute correctly from raw events.

These attributes form a compact behavioral profile that the agent's `get_signals` tool fetches at runtime, enabling personalized responses without requiring the user to state their preferences manually.

## Set up your credentials

You need your Signals connection credentials. These are the same values you configured in the notebook's credentials cell:

<Tabs groupId="cloud" queryString>
  <TabItem value="cdi" label="CDI" default>

```python
API_URL = 'example.signals.snowplowanalytics.com'
API_KEY = ''
API_KEY_ID = ''
ORG_ID = ''
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

Run the notebook cell that defines the attributes. The notebook creates a series of attributes that represent different user preferences and behaviors based on these content tags:

```python
cultural_explorer_tags = ["culture", "history", "heritage", "ancient", "temples", "art", "traditional"]
modern_urbanite_tags = ["urban", "nightlife", "shopping", "modern", "architecture"]
tranquil_seeker_tags = ["nature", "peaceful", "wellness", "beaches", "mountains", "river", "wellness"]
family_fun_tags = ["family-friendly", "beaches", "nature", "food", "mountains", "culture"]
culinary_tourist_tags = ["food", "street food", "multicultural", "traditional", "urban", "shopping"]
```

The notebook defines these counter attributes:

* `page_view_count` - overall engagement level
* `destination_page_view_count` - interest in destination content
* `family_destination_count` - interactions with family destination content
* `cultural_explorer` - affinity for cultural/historical experiences
* `modern_urbanite` - affinity for urban/nightlife experiences
* `tranquil_seeker` - preference for nature and wellness
* `family_fun` - interest in family-friendly activities
* `culinary_tourist` - interest in food-related experiences
* `budget_conscious_count` - frequency of budget filtering
* `luxury_inclined_count` - frequency of luxury filtering

And these attributes with the `last` aggregation:

* `preferred_experience_length` - most recently selected experience duration
* `latest_schedule` - last itinerary schedule update

Running this cell defines the attributes locally but does not publish them yet.

:::note
These attributes are designed around specific Snowplow [events](/docs/fundamentals/events/) and [entities](/docs/fundamentals/entities/) (for example, `filter_tag_applied`, `destination_filter`, and the `content` entity). To use them on your own site, your tracking implementation must send the same events with matching schemas. You can adapt the attribute definitions to match your own event data instead.
:::

## Create an attribute group

Run the next notebook cell to define an attribute group. This creates a `StreamAttributeGroup` with `domain_sessionid` as the attribute key, meaning attributes are computed per browser session:

```python
session_attributes_group = StreamAttributeGroup(
    name="travel_view",
    version=1,
    attribute_key=domain_sessionid,
    attributes=[page_view_count, dest_page_view_count, family_destination_count,
                cultural_explorer, modern_urbanite, tranquil_seeker, family_fun,
                culinary_tourist, preferred_experience_length, budget_conscious,
                luxury_inclined, latest_schedule],
    owner='you@email.com',
)
```

## Create a service

Run the notebook cell that defines a service to expose the attribute group via the Profiles API:

```python
travel_service = Service(
    name="travel_service",
    description="Behavioral profile service for agent personalization.",
    attribute_groups=[session_attributes_group],
    owner='you@email.com'
)
```

The service name `travel_service` is what the agent's `get_signals` tool uses when querying the Profiles API.

## Publish to Signals

Run the cell that publishes the attribute group and service:

```python
response = sp_signals.publish([session_attributes_group, travel_service])
```

Signals will start processing attributes from your real-time event stream.

## Validate attribute computation

Run the notebook cells that send synthetic test events and retrieve the computed attributes. The Snowplow tracker sends events directly to your collector - no demo site or web application is needed. The `page_url` field is metadata used by the attribute criteria to match against URL patterns.

After sending the events, retrieve the results:

```python
response = sp_signals.get_service_attributes(
    name="travel_service",
    attribute_key="domain_sessionid",
    identifier=user_id,
)

print("Page view count:", response.get("page_view_count"))
```

You should see values across multiple attributes - for example, `page_view_count` of 10, `cultural_explorer` of 5, `budget_conscious_count` of 2, and `preferred_experience_length` of `half-day`. The exact counts depend on the test events sent.

:::tip
The `get_signals` tool uses the same Signals credentials you configured earlier in the notebook.
:::
