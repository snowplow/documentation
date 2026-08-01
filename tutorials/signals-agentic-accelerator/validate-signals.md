---
title: "Validate what Signals computes"
sidebar_label: "Validate Signals"
position: 4
description: "Send synthetic test events from the notebook, then read back the profile attributes and the session activity narrative to confirm both compute correctly."
keywords: ["Snowplow Signals", "profile attributes", "agentic context", "validation", "test events", "narrative"]
date: "2026-07-31"
---

With the attribute group, service, and agentic context all published, you can confirm that Signals computes both kinds of context from raw events.

Run the notebook cells that send synthetic test events, then read back both kinds of context. The Snowplow tracker in the notebook sends events directly to your event Collector - no demo site or web application is needed. The `page_url` field is metadata used by the attribute criteria to match against URL patterns.

## Profile attributes

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

Attributes that no test event matched come back as `null`.

## Session activity

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

Compare the two responses. The counters say this user is engaged with cultural and family content. Only the narrative says they opened Siem Reap three times, moved on to Bali, then filtered for food and picked a half-day experience. The narrative lets the agent respond to the user's immediate journey rather than aggregate counts alone.
