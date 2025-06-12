---
title: Define Signals Attributes
position: 3
---

### Overview of Prospect Attributes

For this prospect scoring use case, we will work on the following set of prospect attributes.

These will be calculated on the `domain_userid` level across multiple prospect's sessions.

Feature Name | Type | Description
-------------|------|-------------
`latest_app_id` | string | current `app_id` value
`latest_device_class` | string | current YAUAA device class
`num_sessions_l7d/l30d` | int | number of unique sessions in the last 7/30 days
`num_apps_l7d/l30d` | int | number of unique `app_id`s engaged in the last 7/30 days
`num_page_views_l7d/l30d` | int | number of `page_view` events in the last 7/30 days
`num_page_pings_l7d/l30d` | int | number of `page_ping` events in the last 7/30 days, time on site
`num_pricing_views_l7d/l30d` | int | number of `page_view` events of the `/pricing` page in the last 7/30 days
`had_conversions_l7d/30d` | int | number of recent `submit_form` events in the last 7/30 days
`num_form_engagements_l7d` | int | number of recent form engagements, e.g., `focus_form, change_form` events in the last 7 days
`num_media_events_l30d` | int | engagements with media events in the last 30 days
`first_refr_medium_l30d` | string | first referrer medium in the last 30 days
`first_mkt_medium_l30d` | string | first `utm_medium` in the last 30 days
`num_engaged_campaigns_l30d` | int | number of distinct engaged `utm_campaign`s in the last 30 days

These attributes use default Snowplow web events like `page_view, page_ping, submit_form`, and others.

:::note
For "count distinct" cases like `num_sessions_l7d, num_engaged_campaigns_l30d`, we will rely on Signal's `aggregation="unique_list"` approach and will calculate the number of distinct elements in the intermediary API.
:::

### Configure Real-Time Attributes

First, let's prepare imports and useful variables: the events and time deltas.
We will reuse them multiple times, and this makes the code concise and clear.


```python
# Imports
from snowplow_signals import Attribute, Criteria, Criterion, Event, View, user_entity
from datetime import datetime, timedelta

# View Name
DEMO_VIEW_NAME = "demo_landing_page"
view_version = int(datetime.now().timestamp())

# Define Standard Events
sp_page_view = Event(vendor="com.snowplowanalytics.snowplow", name="page_view", version="1-0-0")
sp_page_ping = Event(vendor="com.snowplowanalytics.snowplow", name="page_ping", version="1-0-0")
sp_submit_form = Event(vendor="com.snowplowanalytics.snowplow", name="submit_form", version="1-0-0")
sp_focus_form = Event(vendor="com.snowplowanalytics.snowplow", name="focus_form", version="1-0-0")
sp_change_form = Event(vendor="com.snowplowanalytics.snowplow", name="change_form", version="1-0-0")
sp_media_events = Event(vendor="com.snowplowanalytics.snowplow.media") # This line shows how one can define "any vendor's event" selector.

l7d=timedelta(days=7)
l30d=timedelta(days=30)
```

Second, let's define the Attributes that we want to track.
The code below showcases multiple ways to define different common attributes.

```python
# Attributes - Latest page_view behaviour
latest_app_id = Attribute(name="latest_app_id", type="string", events=[sp_page_view], aggregation="last", property="app_id")
latest_device_class = Attribute(name="latest_device_class", type="string", events=[sp_page_view], aggregation="last", property="contexts_nl_basjes_yauaa_context_1[0].deviceClass")

# Attributes - Behaviour over the last 7d
num_sessions_l7d = Attribute(name="num_sessions_l7d", type="string_list", events=[sp_page_view], period=l7d, aggregation="unique_list", property="domain_sessionid") # We will convert this into a count on our side
num_apps_l7d = Attribute(name="num_apps_l7d", type="string_list", events=[sp_page_view], period=l7d, aggregation="unique_list", property="app_id")
num_page_views_l7d = Attribute(name="num_page_views_l7d", type="int32", events=[sp_page_view], period=l7d, aggregation="counter")
num_page_pings_l7d = Attribute(name="num_page_pings_l7d", type="int32", events=[sp_page_ping], period=l7d, aggregation="counter")
num_pricing_views_l7d = Attribute(name="num_pricing_views_l7d", type="int32", events=[sp_page_view], period=l7d, aggregation="counter",
    criteria=Criteria(all=[Criterion(property="page_url", operator="like", value="%pricing%")]))
num_conversions_l7d = Attribute(name="num_conversions_l7d", type="int32", events=[sp_submit_form], period=l7d, aggregation="counter") # We will convert this to boolean as ">0"
num_form_engagements_l7d = Attribute(name="num_form_engagements_l7d", type="int32", events=[sp_focus_form, sp_change_form], period=l7d, aggregation="counter")

# Attributes - Behaviour over the last 30d
...define the same l7d attributes using l30d time window
first_refr_medium_l30d = Attribute(name="first_refr_medium_l30d", type="string", events=[sp_page_view], period=l30d, aggregation="first", property="refr_medium")
first_mkt_medium_l30d = Attribute(name="first_mkt_medium_l30d", type="string", events=[sp_page_view], period=l30d, aggregation="first", property="mkt_medium")
num_engaged_campaigns_l30d = Attribute(name="num_engaged_campaigns_l30d", type="string_list", events=[sp_page_view], period=l30d, aggregation="unique_list", property="mkt_campaign")
```

Third, let's wrap these all into a single View.

```python
# Wrap attributes into a view
user_attributes_view = View(
    name=DEMO_VIEW_NAME,
    version=view_version,
    entity=user_entity,
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

### Deploy Attribute View To Signals Registry

Now that our View is ready, we can apply it to Signals and test the outputs on a subset of recent event data.

```python
# Apply view to the Signals API
from snowplow_signals import Signals
sp_signals = Signals(api_url=SIGNALS_API_ENDPOINT,
                     api_key=userdata.get('SP_API_KEY'),
                     api_key_id=userdata.get('SP_API_KEY_ID'),
                     org_id=userdata.get('SP_ORG_ID'))
applied = sp_signals.apply([user_attributes_view])
print(f"{len(applied)} objects applied")

# Test view on the Signals API on the last one hour of data from the atomic events table
sp_signals_test = sp_signals.test(view=user_attributes_view, app_ids=["website"])
sp_signals_test
```

If everything went well, the result should look similar to this:

![](./screenshots/signals_test_output.png)
