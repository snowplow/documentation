---
title: "Configure Snowplow Signals"
sidebar_label: "Configure Signals"
position: 3
description: "Define and publish profile attributes and an agentic context using Snowplow Signals to provide real-time user context to your AI agent."
keywords: ["Snowplow Signals", "behavioral attributes", "agentic context", "Profile API", "streaming engine", "personalization"]
date: "2026-07-30"
---

Users express intent through their browsing behavior - page views, filter interactions, content engagement - long before they type a message to an agent. In this step, you'll set up two complementary kinds of real-time context in Snowplow Signals, and validate that both compute correctly from raw events:

* An [attribute group](/docs/signals/attributes/attribute-groups/) and [service](/docs/signals/applications/services/) that compute and serve profile attributes: aggregate metrics that describe the session, such as how many destination pages the user has viewed
* An [agentic context](/docs/signals/agentic-contexts/) that captures recent session activity: the user's latest events, readable as an LLM-ready narrative

The two work together. Attributes tell your agent what the session adds up to, while the agentic context tells it what the user has just been doing, event by event. Both are scoped to the same `domain_sessionid` attribute key, so the agent can fetch both using the session ID it already has: the `get_signals` tool reads the attributes, and `get_session_activity` reads the narrative.

## Set up your credentials

You need your Signals connection credentials. If you haven't set these up yet, see [connecting to Signals](/docs/signals/connection/). These are the same values you configured in the notebook's credentials cell:

```python
API_URL = 'example.signals.snowplowanalytics.com'
API_KEY = ''
API_KEY_ID = ''
ORG_ID = ''
```

## Define attributes

Run the notebook cell that defines the attributes. The notebook creates a series of attributes that represent different user preferences and behaviors based on these content tags:

```python
cultural_explorer_tags = ["culture", "history", "heritage", "ancient", "temples", "art", "traditional"]
modern_urbanite_tags = ["urban", "nightlife", "shopping", "modern", "architecture"]
tranquil_seeker_tags = ["nature", "peaceful", "wellness", "beaches", "mountains", "river", "wellness"]
family_fun_tags = ["family-friendly", "beaches", "nature", "food", "mountains", "culture"]
culinary_tourist_tags = ["food", "street food", "multicultural", "traditional", "urban", "shopping"]
```

The notebook defines these `counter` attributes:

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

:::note[Snowplow schemas]
These attributes are designed around specific Snowplow [events](/docs/fundamentals/events/) and [entities](/docs/fundamentals/entities/) (for example, `filter_tag_applied`, `destination_filter`, and the `content` entity). To use them on your own site, your tracking implementation must send the same events with matching schemas. You can adapt the attribute definitions to match your own event data instead.
:::

## Create an attribute group

Run the next notebook cell to define an [attribute group](/docs/signals/attributes/attribute-groups/). This creates a `StreamAttributeGroup` with `domain_sessionid` as the attribute key, meaning attributes are computed per browser session:

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

Run the notebook cell that defines a [service](/docs/signals/applications/services/) to manage the attribute group:

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

## Define an agentic context

The service you just published serves computed aggregates. To also give the agent a play-by-play of what the user is doing right now, [define an agentic context](/docs/signals/agentic-contexts/): a rolling record of the user's recent events that Signals can return as a plain-language narrative, ready to drop into a prompt.

Run the next notebook cell. It captures the three events that reveal what a user is exploring, keeping a few properties from each:

| Event | Properties kept | Why |
| :---- | :-------------- | :-- |
| `page_view` | `event_name`, `page_urlpath`, and the `content` entity's `primary_tag` | Which destination pages the user opened, and what kind of content they hold |
| `filter_tag_applied` | `event_name`, `tag_name` | Which interests the user filtered for |
| `experience_filter` | `event_name`, `filter_value` | How long an experience the user wants |

The `event_name` and `page_urlpath` atomic properties feed the narrative's dedicated event and URL columns. Any other property you select appears in its `event_context` column.

```python
travel_agent_activity = EventLog(
    name="travel_agent_activity",
    description="Recent session activity for the travel agent.",
    owner="you@email.com",
    prompt=(
        "You are a travel assistant for a Southeast Asia travel site. "
        "Use this recent activity to understand what the user is exploring "
        "right now, and tailor your recommendations to it."
    ),
    attribute_key=domain_sessionid,
    max_events=50,
    max_age_seconds=1800,
    events=[
        EventSelection(
            event=EventLogEvent(
                name="page_view",
                vendor="com.snowplowanalytics.snowplow",
                version="1-0-0",
            ),
            properties=[
                EventLogAtomicProperty(name="event_name"),
                EventLogAtomicProperty(name="page_urlpath"),
                EventLogEntityProperty(
                    vendor=travel_vendor,
                    name="content",
                    major_version=1,
                    path="primary_tag",
                ),
            ],
        ),
        EventSelection(
            event=EventLogEvent(
                name="filter_tag_applied",
                vendor=travel_vendor,
                version="1-0-0",
            ),
            properties=[
                EventLogAtomicProperty(name="event_name"),
                EventLogEventProperty(
                    vendor=travel_vendor,
                    name="filter_tag_applied",
                    major_version=1,
                    path="tag_name",
                ),
            ],
        ),
        EventSelection(
            event=EventLogEvent(
                name="experience_filter",
                vendor=travel_vendor,
                version="1-0-0",
            ),
            properties=[
                EventLogAtomicProperty(name="event_name"),
                EventLogEventProperty(
                    vendor=travel_vendor,
                    name="experience_filter",
                    major_version=1,
                    path="filter_value",
                ),
            ],
        ),
    ],
)
```

The buffer holds the most recent 50 events from the last 30 minutes. Leave high-frequency events like page pings out of a selection like this: heartbeats crowd out the meaningful activity.

Run the next cell to publish it:

```python
response = sp_signals.publish([travel_agent_activity])
```

The `prompt` text travels with the agentic context. Signals hands it to your agent alongside the captured activity, so you can refine those instructions later without touching your agent code.

:::note[Defining agentic contexts in Console]
This accelerator defines everything from the notebook, but you can create and publish agentic contexts in Console instead. See [defining agentic contexts](/docs/signals/agentic-contexts/) for the Console walkthrough.
:::

## Validate what Signals computes

Run the notebook cells that send synthetic test events, then read back both kinds of context. The Snowplow tracker in the notebook sends events directly to your event Collector - no demo site or web application is needed. The `page_url` field is metadata used by the attribute criteria to match against URL patterns.

### Profile attributes

After sending the events, retrieve the results:

```python
response = sp_signals.get_service_attributes(
    name="travel_service",
    attribute_key="domain_sessionid",
    identifier=user_id,
)

print(response)
```

You should see a response similar to the following (exact counts depend on the test events sent):

```json
{
  "budget_conscious_count": 2,
  "culinary_tourist": 2,
  "cultural_explorer": 5,
  "destination_page_view_count": 10,
  "family_destination_count": 3,
  "family_fun": 5,
  "latest_schedule": null,
  "luxury_inclined_count": null,
  "modern_urbanite": null,
  "page_view_count": 10,
  "preferred_experience_length": "half-day",
  "tranquil_seeker": 1
}
```

Attributes that no test event matched come back as `null`. The synthetic events never sort by price descending or touch luxury and urban content, so `luxury_inclined_count` and `modern_urbanite` stay empty, and `latest_schedule` stays empty because the notebook sends no `schedule_update` event.

### Session activity

Run the cell that reads the same session back as a narrative. This is exactly what the agent's `get_session_activity` tool returns:

```python
narrative = sp_signals.get_agentic_context(
    name="travel_agent_activity",
    identifier=user_id,
    format="narrative",
)

print(narrative)
```

With `format="narrative"`, Signals returns the prompt you configured, followed by a block delimited by `[START CONTEXT]` and `[END CONTEXT]`. For the test events above, that looks like:

```text
You are a travel assistant for a Southeast Asia travel site. Use this recent activity to understand what the user is exploring right now, and tailor your recommendations to it.
[START CONTEXT]
Last activity 90 seconds ago. Session started 102 seconds ago. Based on last 50 recorded events for the last 1800 seconds.
## Real-time user behaviour
Events are ordered from oldest to most recent.
seconds_since_start_of_session, event, url, event_context
0, page_view, /destinations, {}
0, page_view, /destinations, {}
0, page_view, /destinations, {}
0, page_view, /destinations, {}
0, page_view, /destinations, {}
0, page_view, /destinations/siem-reap, {primary_tag: 'culture'}
1, page_view, /destinations/siem-reap, {primary_tag: 'history'}
2, page_view, /destinations/siem-reap, {primary_tag: 'temples'}
3, page_view, /destinations/bali, {primary_tag: 'family-friendly'}
4, page_view, /destinations/bali, {primary_tag: 'beaches'}
6, filter_tag_applied, , {tag_name: 'culture'}
7, filter_tag_applied, , {tag_name: 'temples'}
8, filter_tag_applied, , {tag_name: 'food'}
9, filter_tag_applied, , {tag_name: 'street food'}
11, experience_filter, , {filter_value: 'half-day'}
[END CONTEXT]
```

Signals generates the opening summary and the event table from the events you selected, so there's no formatting code to write. You can also read the same activity as structured JSON by leaving `format` at its default: see [retrieving agentic contexts](/docs/signals/applications/agentic-contexts/).

Compare the two responses. The counters say this user is engaged with cultural and family content. Only the narrative says they opened Siem Reap three times, moved on to Bali, then filtered for food and picked a half-day experience. That sequence is what makes a recommendation feel like it follows the conversation the user is already having with your site.

:::tip
Both tools use the same Signals credentials you configured earlier in the notebook.
:::
