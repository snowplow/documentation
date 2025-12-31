---
title: Define page view attributes for real-time prospect scoring
sidebar_label: Define attributes
position: 3
description: "Define behavioral data attributes in Snowplow Signals for prospect scoring, including page views, sessions, and conversion events."
keywords: ["signals python sdk", "page view attributes"]
---

To use Signals, you need to define which attributes to calculate, and then apply the configuration. Signals will calculate the attributes from your real-time event stream.

Let's imagine that for this use case our data science team came up with the following set of attributes. They'll be calculated against the `domain_userid` device attribute key. Choosing this attribute key allows Signals to calculate attributes from events across multiple sessions for each prospect.

| Feature name          | Description                                             | Type | Aggregation |
| --------------------- | ------------------------------------------------------- | ---- | ----------- |
| `num_page_views`      | Number of `page_view` events                            | int  | `counter`   |
| `num_pricing_views`   | Number of `page_view` events of the `/pricing` page     | int  | `counter`   |
| `num_customers_views` | Number of `page_view` events of the `*customers*` pages | int  | `counter`   |

## Install Signals Python SDK

Run `%pip install snowplow-signals`.

## Define attributes

Next, define the attributes to calculate.

```python
# Imports
from snowplow_signals import Attribute, Criteria, Criterion, AtomicProperty, EntityProperty

# Define an event
sp_page_view = Event(
    vendor="com.snowplowanalytics.snowplow",
    name="page_view",
    version="1-0-0"
)

# Define attributes
num_page_views = Attribute(
    name="num_page_views",
    type="int32",
    events=[sp_page_view],
    aggregation="counter"
)

num_pricing_views = Attribute(
    name="num_pricing_views",
    type="int32",
    events=[sp_page_view],
    aggregation="counter",
    criteria=Criteria(
        all=[
            Criterion.like(
                AtomicProperty(name="page_url"),
                "%pricing%"
            )
        ]
    )
)

num_customers_views = Attribute(
    name="num_customers_views",
    type="int32",
    events=[sp_page_view],
    aggregation="counter",
    criteria=Criteria(
        all=[
            Criterion.like(
                AtomicProperty(name="page_url"),
                "%customers%"
            )
        ]
    )
)
```

Group the attributes into an attribute group with the `domain_userid` device attribute key.

```python
from snowplow_signals import StreamAttributeGroup, domain_userid

user_attributes_group = StreamAttributeGroup(
    name='prospect_scoring_tutorial',
    owner='your_email@example.com',
    version=1,
    attribute_key=domain_userid,
    attributes=[
        num_page_views,
        num_pricing_views,
        num_customers_views,
    ],
)
```

Next, define a service for retrieving the calculated attributes. Again, provide your own email address for the `owner` field.

```python
from snowplow_signals import Service

prospect_scoring_tutorial_service = Service(
    name='prospect_scoring_tutorial_service',
    owner='your_email@example.com',
    attribute_groups=[user_attributes_group],
)
```

<details>
<summary>For Signals Customers: test attribute group on your warehouse data</summary>
If you're using Signals in the Console, you can test the attribute outputs on a subset of recent event data. The `test` command uses the last hour of data from your atomic events table. Here we're restricting the results to events with the application ID `website`. This filtering is optional.

```python
sp_signals_test = sp_signals.test(
    attribute_group=user_attribute_group,
    app_ids=["website"]
)
sp_signals_test
```

The result should look similar to this:

![](./images/signals_test_output.png)
</details>

## Deploy configuration to Signals

Apply the attribute group and service configurations to Signals.

```python
applied = sp_signals.publish([user_attribute_group, prospect_scoring_tutorial_service])

# This should print "2 objects applied"
print(f"{len(applied)} objects applied")
```

Signals will start populating your Profiles Store with attributes calculated from your real-time event stream.

## Look at your attributes

:::note
This section expects that you [integrated](/docs/sources/web-trackers/quick-start-guide/) `sp.js` into a website and have events flowing to the collector.
If you're using Signals Sandbox your collector URL for `sp.js` is next to the Signals token.
:::

Go to your website, and use the [Snowplow Inspector](/docs/data-product-studio/data-quality/snowplow-inspector/) browser plugin to find your own `domain_userid` in outbound web events.

![](./images/get_domain_userid.png)

Use your `domain_userid` to retrieve the attributes that Signals has calculated just now from your real-time event stream.

```python
sp_signals_result = sp_signals.get_service_attributes(
    name="prospect_scoring_tutorial_service",
    attribute_key="domain_userid",
    identifier="00000000-1111-2222-3333-444455556666", # UPDATE THIS
)
sp_signals_result
```

The result should look something like this:

```yaml
{
    'domain_userid': '00000000-1111-2222-3333-444455556666',
    'num_page_views': None,
    'num_pricing_views': None,
    'num_customers_views': None
}
 ```
