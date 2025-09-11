---
title: Configure Signals attributes
position: 3
description: "Define behavioral data attributes in Snowplow Signals for prospect scoring, including page views, sessions, and conversion events."
---

To use Signals, you need to define which attributes to calculate, and then apply the configuration. Signals will calculate the attributes from your real-time event stream.

For this prospect scoring use case, use the following set of attributes. They'll be calculated against the `domain_userid` device attribute key. Choosing this attribute key allows Signals to calculate attributes from events across multiple sessions for each prospect.

Some attributes are calculated for two different time windows. We've chosen 7 and 30 days to cover both short- and long-term user behavior on the website.

Since the attributes will be calculated in stream, those with a defined `period` will be limited to the [last 100 relevant events](/docs/signals/define-attributes/attribute-groups/). For our marketing website, these attributes are unlikely to ever reach 100, but this may be something to be aware of for your site.

| Feature name                 | Description                                                                                     | Type   | Aggregation    |
| ---------------------------- | ----------------------------------------------------------------------------------------------- | ------ | -------------- |
| `latest_app_id`              | Current `app_id` value                                                                          | string | `last`         |
| `latest_device_class`        | Current YAUAA device class                                                                      | string | `last`         |
| `num_sessions_l7d/l30d`      | Number of unique sessions in the last 7 or 30 days                                              | int    | `unique_list`* |
| `num_apps_l7d/l30d`          | Number of unique `app_id`s engaged in the last 7 or 30 days                                     | int    | `unique_list`* |
| `num_page_views_l7d/l30d`    | Number of `page_view` events in the last 7 or 30 days                                           | int    | `counter`      |
| `num_page_pings_l7d/l30d`    | Number of `page_ping` events in the last 7 or 30 days, representing time on the site            | int    | `counter`      |
| `num_pricing_views_l7d/l30d` | Number of `page_view` events of the `/pricing` page in the last 7 or 30 days                    | int    | `counter`      |
| `num_conversions_l7d/30d`    | Number of recent `submit_form` events in the last 7 or 30 days                                  | int    | `counter`      |
| `num_form_engagements_l7d`   | Number of recent form engagements, e.g., `focus_form`, `change_form` events, in the last 7 days | int    | `counter`      |
| `num_media_events_l30d`      | Engagements with media events in the last 30 days                                               | int    | `counter`      |
| `first_refr_medium_l30d`     | First referrer medium in the last 30 days                                                       | string | `first`        |
| `first_mkt_medium_l30d`      | First `utm_medium` in the last 30 days                                                          | string | `first`        |
| `num_engaged_campaigns_l30d` | Number of distinct engaged `utm_campaign`s in the last 30 days                                  | int    | `unique_list`* |

:::note Count distinct
Signals doesn't have a "count distinct" aggregation. For "count distinct" features like `num_sessions_l7d` or `num_engaged_campaigns_l30d`, we'll use Signal's `unique_list` aggregation, and count the number of distinct elements later, in the intermediary API.
:::

With the exception of `num_media_events_l30d`, the attributes will be based on standard Snowplow web events such as `page_view`, `page_ping`, or `submit_form`. If you aren't tracking Snowplow media events, the `num_media_events_l30d` attribute value will just stay at 0.

## Install Signals Python SDK

Run `pip install snowplow-signals`.

## Define reusable variables

Let's prepare the imports and useful variables. We'll reuse the variables multiple times, and this makes the code concise and clear.

```python
# Imports
from snowplow_signals import Event
from datetime import timedelta

# Standard Snowplow events
sp_page_view = Event(
    vendor="com.snowplowanalytics.snowplow",
    name="page_view",
    version="1-0-0"
)
sp_page_ping = Event(
    vendor="com.snowplowanalytics.snowplow",
    name="page_ping",
    version="1-0-0"
)
sp_submit_form = Event(
    vendor="com.snowplowanalytics.snowplow",
    name="submit_form",
    version="1-0-0"
)
sp_focus_form = Event(
    vendor="com.snowplowanalytics.snowplow",
    name="focus_form",
    version="1-0-0"
)
sp_change_form = Event(
    vendor="com.snowplowanalytics.snowplow",
    name="change_form",
    version="1-0-0"
)
sp_media_events = Event(
    # This will match any event for this vendor
    # because no event name or version are defined
    vendor="com.snowplowanalytics.snowplow.media"
)

# Reusable time periods
l7d=timedelta(days=7)
l30d=timedelta(days=30)
```

## Define attributes

Next, define the attributes to calculate.

```python
from snowplow_signals import Attribute, Criteria, Criterion, AtomicProperty

# Latest page_view behavior
latest_app_id = Attribute(
    name="latest_app_id",
    type="string",
    events=[sp_page_view],
    aggregation="last",
    property=AtomicProperty(name="app_id")
)

latest_device_class = Attribute(
    name="latest_device_class",
    type="string",
    events=[sp_page_view],
    aggregation="last",
    property=EntityProperty(
        vendor="nl.basjes",
        name="yauaa_context",
        major_version=1,
        path="deviceClass"
    )
)

# Behavior over the last 7 days
num_sessions_l7d = Attribute(
    name="num_sessions_l7d",
    type="string_list",
    events=[sp_page_view],
    period=l7d,
    aggregation="unique_list",
    property=AtomicProperty(name="domain_sessionid")
)

num_apps_l7d = Attribute(
    name="num_apps_l7d",
    type="string_list",
    events=[sp_page_view],
    period=l7d,
    aggregation="unique_list",
    property=AtomicProperty(name="app_id")
)

num_page_views_l7d = Attribute(
    name="num_page_views_l7d",
    type="int32",
    events=[sp_page_view],
    period=l7d,
    aggregation="counter"
)

num_page_pings_l7d = Attribute(
    name="num_page_pings_l7d",
    type="int32",
    events=[sp_page_ping],
    period=l7d,
    aggregation="counter"
)

num_pricing_views_l7d = Attribute(
    name="num_pricing_views_l7d",
    type="int32",
    events=[sp_page_view],
    period=l7d,
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
num_conversions_l7d = Attribute(
    name="num_conversions_l7d",
    type="int32",
    events=[sp_submit_form],
    period=l7d,
    aggregation="counter"
)

num_form_engagements_l7d = Attribute(
    name="num_form_engagements_l7d",
    type="int32",
    events=[sp_focus_form, sp_change_form],
    period=l7d,
    aggregation="counter"
)

# Behavior over the last 30 days
num_sessions_l30d = Attribute(
    name="num_sessions_l30d",
    type="string_list",
    events=[sp_page_view],
    period=l30d,
    aggregation="unique_list",
    property=AtomicProperty(name="domain_sessionid")
)

num_apps_l30d = Attribute(
    name="num_apps_l30d",
    type="string_list",
    events=[sp_page_view],
    period=l30d,
    aggregation="unique_list",
    property=AtomicProperty(name="app_id")
)

num_page_views_l30d = Attribute(
    name="num_page_views_l30d",
    type="int32",
    events=[sp_page_view],
    period=l30d,
    aggregation="counter"
)

num_page_pings_l30d = Attribute(
    name="num_page_pings_l30d",
    type="int32",
    events=[sp_page_ping],
    period=l30d,
    aggregation="counter"
)

num_pricing_views_l30d = Attribute(
    name="num_pricing_views_l30d",
    type="int32",
    events=[sp_page_view],
    period=l30d,
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
num_conversions_l30d = Attribute(
    name="num_conversions_l30d",
    type="int32",
    events=[sp_submit_form],
    period=l30d,
    aggregation="counter"
)

num_media_events_l30d = Attribute(
    name="num_media_events_l30d",
    type="int32",
    events=[sp_media_events],
    period=l30d,
    aggregation="counter"
)

first_refr_medium_l30d = Attribute(
    name="first_refr_medium_l30d",
    type="string",
    events=[sp_page_view],
    period=l30d,
    aggregation="first",
    property=AtomicProperty(name="refr_medium")
)

first_mkt_medium_l30d = Attribute(
    name="first_mkt_medium_l30d",
    type="string",
    events=[sp_page_view],
    period=l30d,
    aggregation="first",
    property=AtomicProperty(name="mkt_medium")
)

num_engaged_campaigns_l30d = Attribute(
    name="num_engaged_campaigns_l30d",
    type="string_list",
    events=[sp_page_view],
    period=l30d,
    aggregation="unique_list",
    property=AtomicProperty(name="mkt_campaign")
)
```

Group the attributes into an attribute group with the `domain_userid` device attribute key. You'll need to provide your own email address for the `owner` field.

```python
from snowplow_signals import StreamAttributeGroup, domain_userid

user_attribute_group = StreamAttributeGroup(
    name="prospect_scoring_tutorial",
    version=1,
    attribute_key=domain_userid,
    owner="YOUR EMAIL HERE", # UPDATE THIS
    attributes=[
        latest_app_id,
        latest_device_class,
        num_sessions_l7d,
        num_apps_l7d,
        num_page_views_l7d,
        num_page_pings_l7d,
        num_pricing_views_l7d,
        num_conversions_l7d,
        num_form_engagements_l7d,
        num_sessions_l30d,
        num_apps_l30d,
        num_page_views_l30d,
        num_page_pings_l30d,
        num_pricing_views_l30d,
        num_conversions_l30d,
        num_media_events_l30d,
        first_refr_medium_l30d,
        first_mkt_medium_l30d,
        num_engaged_campaigns_l30d,
    ],
)
```

Test the attribute outputs on a subset of recent event data. The `test` command uses the last hour of data from your atomic events table. Here we're restricting the results to events with the application ID `website`. This filtering is optional.

```python
sp_signals_test = sp_signals.test(
    attribute_group=user_attribute_group,
    app_ids=["website"]
)

sp_signals_test
```

The result should look similar to this:

![](./images/signals_test_output.png)

## Define a service

Next, define a service for retrieving the calculated attributes. Again, provide your own email address for the `owner` field.

```python
from snowplow_signals import Service

prospect_scoring_tutorial_service = Service(
    name='prospect_scoring_tutorial_service',
    owner="YOUR EMAIL HERE", # UPDATE THIS
    attribute_group=[user_attribute_group],
)
```

## Deploy configuration to Signals

Apply the attribute group and service configurations to Signals.

```python
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=ENV_SP_API_URL,
    api_key=ENV_SP_API_KEY,
    api_key_id=ENV_SP_API_KEY_ID,
    org_id=ENV_SP_ORG_ID
)

applied = sp_signals.publish([user_attribute_group, prospect_scoring_tutorial_service])

# This should print "2 objects applied"
print(f"{len(applied)} objects applied")
```

Signals will start populating your Profiles Store with attributes calculated from your real-time event stream.

## Look at your attributes

Go to your website, and use the [Snowplow Inspector](/docs/data-product-studio/data-quality/snowplow-inspector/) browser plugin to find your own `domain_userid` in outbound web events.

![](./images/get_domain_userid.png)

Use your `domain_userid` to retrieve the attributes that Signals has calculated just now from your real-time event stream.

```python
sp_signals_result = sp_signals.get_service_attributes(
    name="prospect_scoring_tutorial_service",
    attribute_key="domain_userid",
    identifier="8e554b10-4fcf-49e9-a0d8-48b6b6458df3", # UPDATE THIS
)
sp_signals_result
```

The result should look something like this:

```yaml
{'domain_userid': '8e554b10-4fcf-49e9-a0d8-48b6b6458df3',
 'num_form_engagements_l7d': None,
 'num_sessions_l30d': ['d100158b-c1f9-4833-9211-1f7d2c2ae5ec',
  '2bea2e3e-abb8-4e81-bf8e-28cd0d5ddb34'],
 'num_pricing_views_l7d': None,
 'first_refr_medium_l30d': 'internal',
 'latest_device_class': 'Desktop',
 'first_mkt_medium_l30d': None,
 'num_sessions_l7d': ['d100158b-c1f9-4833-9211-1f7d2c2ae5ec',
  '2bea2e3e-abb8-4e81-bf8e-28cd0d5ddb34'],
 'num_media_events_l30d': None,
 'num_pricing_views_l30d': None,
 'num_page_pings_l30d': 64,
 'num_page_views_l7d': 9,
 'num_apps_l7d': ['website'],
 'num_page_pings_l7d': 64,
 'num_page_views_l30d': 9,
 'latest_app_id': 'website',
 'num_apps_l30d': ['website'],
 'num_conversions_l30d': None,
 'num_conversions_l7d': None,
 'num_engaged_campaigns_l30d': None}
 ```
