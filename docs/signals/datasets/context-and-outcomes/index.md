---
title: "Add context and outcomes to a dataset"
sidebar_position: 20
sidebar_label: "Add context and outcomes"
description: "Add point-in-time attribute values, agentic contexts, and outcome columns to each row of a Signals dataset."
keywords: ["dataset builder", "point-in-time", "agentic context", "outcomes", "labels", "dataset columns"]
date: "2026-10-07"
---

Each row in a dataset holds the context your application would have read at the anchor, and optionally what happened afterwards. Context comes from your attribute groups and agentic contexts. What happened afterwards comes from labels on the anchors or from outcome columns.

## Attributes at each anchor

Every attribute in the `attribute_groups` you pass becomes a column. Signals computes each value from the events for that attribute key before the anchor, looking back as far as the longest period across your attributes. Use `max_lookback_days` to override that window.

Whether the anchor event itself is included depends on the anchor type:

| Anchor type | Includes the anchor event |
| --- | --- |
| Session anchors | No |
| Event anchors | Only with `include_anchor_event=True` |
| Trigger anchors | Yes, because the trigger fires after the event updates the attributes |
| User-supplied anchors | No |

The attribute groups don't need to be published. You can pass a draft definition to test it before it goes live.

## Agentic contexts at each anchor

Pass [agentic context](/docs/signals/agentic-contexts/index.md) definitions as `event_logs` to add one column per agentic context. Each column holds an array of the entries the streaming engine would have buffered at that anchor, oldest first, in the same shape as the JSON returned when you [retrieve an agentic context](/docs/signals/applications/agentic-contexts/index.md).

```python
agentic_context = sp_signals.get_event_log(name="recent_activity")

run = sp_signals.submit_dataset_run_with_event_anchors(
    attribute_groups=[session_attributes],
    criteria=product_view,
    training_span=span,
    event_logs=[agentic_context],
)
```

The entries follow the agentic context's configuration:

- Only events that match its event selections are included, with the properties it projects, plus `event_id`, `event_name`, `page_urlpath`, and `derived_tstamp`.
- Entries older than `max_age_seconds` before the newest entry are dropped, and only the newest `max_events` are kept.
- If no matching event arrived within `max_age_seconds` before the anchor, the column holds an empty array.

Agentic contexts in datasets require Snowflake. Event selections that use an event specification ID are not supported yet.

## Outcomes

Outcomes are boolean columns that record whether something happened after each anchor, for example whether the user purchased later in the session. Use them to check a model's answers against what users did next, or as labels for training. Outcomes never select or filter anchors, so they work with every anchor type.

```python
from snowplow_signals import AtomicProperty, Criteria, Criterion, DatasetOutcome

purchase = Criteria(
    all=[Criterion.eq(AtomicProperty(name="event_name"), "transaction")]
)

run = sp_signals.submit_dataset_run_with_event_anchors(
    attribute_groups=[session_attributes, user_attributes],
    criteria=product_view,
    training_span=span,
    outcomes=[
        DatasetOutcome(name="purchased_later", criteria=purchase),
        DatasetOutcome(
            name="purchased_within_7_days",
            criteria=purchase,
            attribute_key="domain_userid",
            within_seconds=7 * 24 * 3600,
        ),
    ],
)
```

An outcome is `true` when an event matching `criteria` has a later collector timestamp than the anchor, has the anchor's value of `attribute_key`, and occurs within `within_seconds` of the anchor if set.

| Field | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | Name of the outcome column. Must not match another column in the dataset. | `str` | ✅ |
| `criteria` | Events that count as the outcome happening. Same format as event anchor criteria. | `Criteria` | ✅ |
| `attribute_key` | Attribute key the outcome follows. Only events with the anchor's value of this key count. Must be the key of one of the dataset's attribute groups. | `str` | Default: `"domain_sessionid"` |
| `within_seconds` | Only count events up to this many seconds after the anchor. Required for any attribute key other than `domain_sessionid`. Without it, an outcome on `domain_sessionid` covers the rest of the session. | `int` | Default: `None` |

## Example row

A dataset with event anchors, two session attributes, a `recent_activity` agentic context, and a `purchased_later` outcome has rows like this:

| domain_sessionid | anchor_ts | product_views | cart_adds | recent_activity | purchased_later |
| --- | --- | --- | --- | --- | --- |
| `abc-123` | 2026-01-05 19:25:22 | 4 | 1 | `[{"event_name": "page_view", "page_title": "Apparel", ...}, ...]` | `true` |
| `def-456` | 2026-01-05 19:31:08 | 1 | | `[{"event_name": "page_view", "page_title": "Home", ...}]` | `false` |

Attributes with no value at the anchor, such as a counter with no matching events yet, are empty.
