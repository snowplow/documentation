---
title: "Choose dataset anchors"
sidebar_position: 10
sidebar_label: "Choose anchors"
description: "Choose the moments that become rows in a Signals dataset: session goals, matching events, replayed attribute triggers, or your own table of moments."
keywords: ["anchors", "dataset builder", "session anchors", "event anchors", "trigger anchors", "user-supplied anchors"]
date: "2026-10-07"
---

Anchors are the moments that become rows in your dataset. Each anchor has a key, such as `domain_sessionid`, and a timestamp, `anchor_ts`. Signals computes the context for each anchor from events before that timestamp.

Choose the anchor type that matches how your model is used:

| Anchor type | Rows are | Use it to |
| --- | --- | --- |
| [Session anchors](#session-anchors) | Labeled points in sessions, positive at a goal event | Train a model that predicts a goal, such as a purchase |
| [Event anchors](#event-anchors) | Every event that matches criteria | Evaluate a model your application calls in response to an event |
| [Trigger anchors](#trigger-anchors) | Moments when a rule over attributes holds | Evaluate a model called when a condition over attributes is met |
| [User-supplied anchors](#user-supplied-anchors) | Rows of a table you provide | Use your own labels, or logs of past model calls |

Session, event, and trigger anchors require an attribute group with the `domain_sessionid` attribute key.

## Session anchors

Use `submit_dataset_run_with_session_anchors()` to generate labeled anchors from your event data for model training. You specify a goal, the criteria that define a positive outcome, and a time window to scan. Signals scans all sessions in the window and labels each based on whether the goal was achieved. For positive sessions, anchors are placed at the goal event itself. For negative sessions, anchors are placed at randomly selected events within the session. Negative anchors are then downsampled according to `max_negative_ratio` to avoid class imbalance.

The `goal_criteria` argument uses the same `Criteria` and `Criterion` classes as [attribute criteria](/docs/signals/attributes/attributes/index.md). You can filter on atomic fields, properties of [self-describing events](/docs/fundamentals/events/index.md#self-describing-events), or properties of [entities](/docs/fundamentals/entities/index.md).

To match on an event name (an atomic field):

```python
from datetime import datetime, timezone

from snowplow_signals import (
    AtomicProperty,
    Criteria,
    Criterion,
    TrainingSpan,
)

run = sp_signals.submit_dataset_run_with_session_anchors(
    attribute_groups=[my_attribute_group],
    goal_criteria=Criteria(
        all=[
            Criterion.eq(AtomicProperty(name="event"), "transaction"),
        ]
    ),
    training_span=TrainingSpan(
        start_time=datetime(2024, 1, 1, tzinfo=timezone.utc),
        end_time=datetime(2024, 4, 1, tzinfo=timezone.utc),
    ),
)
```

To filter on a property within a self-describing event:

```python
from snowplow_signals import Criteria, Criterion, EventProperty, TrainingSpan

run = sp_signals.submit_dataset_run_with_session_anchors(
    attribute_groups=[my_attribute_group],
    goal_criteria=Criteria(
        all=[
            Criterion.eq(
                EventProperty(
                    vendor="com.snowplowanalytics.snowplow.ecommerce",
                    name="snowplow_ecommerce_action",
                    major_version=1,
                    path="type",
                ),
                "transaction",
            ),
        ]
    ),
    training_span=TrainingSpan(
        start_time=datetime(2024, 1, 1, tzinfo=timezone.utc),
        end_time=datetime(2024, 4, 1, tzinfo=timezone.utc),
    ),
)
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `attribute_groups` | Attribute groups that provide the feature columns. Each attribute in these groups becomes a column in the final dataset. | `list[AttributeGroup]` | ✅ |
| `goal_criteria` | Criteria that define a positive anchor (label=1) | `Criteria` | ✅ |
| `training_span` | Time window to scan for anchor events | `TrainingSpan` | ✅ |
| `min_events` | Minimum number of prior in-session events before an anchor is eligible. Increase this to filter out anchors with too little behavioral signal, for example set to `5` to ensure each anchor has at least five prior events. | `int` | Default: `1` |
| `max_anchors_per_session` | Maximum anchor events per session. `None` for unlimited. Set this to limit overrepresentation of long sessions, for example set to `1` to ensure each session contributes at most one training example. | `int` or `None` | Default: `None` |
| `max_negative_ratio` | Maximum ratio of negative to positive anchors. Negative anchors are downsampled to this ratio. Lower values produce more balanced datasets; higher values preserve more data. For example, set to `1.0` for a balanced 1:1 dataset. | `float` | Default: `5.0` |
| `excluded_events` | Events to exclude from anchor generation. By default, `page_ping` events are excluded because they do not represent meaningful user actions. | `list` | Default: `page_ping` events excluded |

All anchor methods also accept the output, context, and outcome arguments described in [Add context and outcomes](/docs/signals/datasets/context-and-outcomes/index.md) and [Run a dataset build](/docs/signals/datasets/run/index.md).

## Event anchors

Use `submit_dataset_run_with_event_anchors()` to create one anchor for every event that matches criteria. This matches an application that calls a model in response to an event, for example on a product page view or an add to cart. The criteria use the same `Criteria` and `Criterion` classes as session goals. Events in the same session that share a `collector_tstamp` become one anchor.

```python
from snowplow_signals import (
    Criteria,
    Criterion,
    EventProperty,
    SessionSample,
    TrainingSpan,
)

product_view = Criteria(
    all=[
        Criterion.eq(
            EventProperty(
                vendor="com.snowplowanalytics.snowplow.ecommerce",
                name="snowplow_ecommerce_action",
                major_version=1,
                path="type",
            ),
            "product_view",
        ),
    ]
)

run = sp_signals.submit_dataset_run_with_event_anchors(
    attribute_groups=[session_attributes],
    criteria=product_view,
    training_span=TrainingSpan(
        start_time=datetime(2026, 1, 1, tzinfo=timezone.utc),
        end_time=datetime(2026, 1, 22, tzinfo=timezone.utc),
    ),
    max_per_session=2,
    pick="random",
    sample=SessionSample(max_sessions=5000, seed="eval-v1"),
)
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `attribute_groups` | Attribute groups that provide the attribute columns. Must include a group with the `domain_sessionid` attribute key. | `list[AttributeGroup]` | ✅ |
| `criteria` | Events to anchor on | `Criteria` | ✅ |
| `training_span` | Time window to take events from | `TrainingSpan` | ✅ |
| `max_per_session` | Maximum anchors per session. `None` makes every matching event an anchor. | `int` or `None` | Default: `None` |
| `pick` | Which events to keep when a session has more than `max_per_session`: `"first"` for the earliest, or `"random"` for a random choice | `str` | Default: `"first"` |
| `seed` | Seed for the random pick. The same seed picks the same events. | `str` | Default: `"signals"` |
| `include_anchor_event` | Whether attributes and agentic contexts include the anchor event itself. Leave this `False` when your application calls the model as the event happens, before Signals has processed it. Set it to `True` when the call happens after the event has been processed. | `bool` | Default: `False` |
| `sample` | Use a deterministic sample of sessions. See [Sample sessions](#sample-sessions). | `SessionSample` | Default: all sessions |

## Trigger anchors

Use `submit_dataset_run_with_trigger_anchors()` to create anchors at the moments a rule over attribute values would have held, for a model that your application calls when a condition is met.

Each trigger is a rule built from `AttributeCriterion` conditions, combined with `AttributeCriteriaAll`, `AttributeCriteriaAny`, or `AttributeCriteriaNone`. A condition references an attribute as `attribute_group:attribute` and compares it with one of these operators:

| Operator | Holds when the attribute |
| --- | --- |
| `=`, `!=`, `<`, `>`, `<=`, `>=` | Compares as stated with `value` |
| `like`, `not like` | Matches, or doesn't match, a SQL `LIKE` pattern |
| `rlike`, `not rlike` | Contains, or doesn't contain, a match for a regular expression |
| `in`, `not in` | Is, or isn't, one of a list of values. With a single value and a list attribute, contains it, or doesn't. |
| `is null`, `is not null` | Has no value, or has one |
| `changed` | Has a different value after the event than before it |

A condition on an attribute with no value holds only for `is null`, or for `changed` if the attribute had a value before the event.

Signals replays the rule the way the streaming engine evaluates it:

- Every event that updates one of the dataset's attributes is a candidate moment.
- The criteria are evaluated against the attribute values after that event, so attributes and agentic contexts in the dataset include the triggering event. `changed` compares the values just before and just after the event.
- The evaluation policy keeps the first moment per session where the rule holds, then each next one at least `cooldown_seconds` later, up to `max_per_session` per session.

```python
from snowplow_signals import (
    AgenticAttributeEvaluationPolicy,
    AttributeCriteriaAll,
    AttributeCriterion,
    CriteriaTrigger,
    SessionSample,
    TrainingSpan,
)

run = sp_signals.submit_dataset_run_with_trigger_anchors(
    attribute_groups=[session_attributes],
    triggers=[
        CriteriaTrigger(
            criteria=AttributeCriteriaAll(
                all=[
                    AttributeCriterion(
                        attribute="session_attributes:product_views",
                        operator=">=",
                        value=3,
                    ),
                    AttributeCriterion(
                        attribute="session_attributes:cart_adds",
                        operator="is null",
                    ),
                ]
            )
        )
    ],
    training_span=TrainingSpan(
        start_time=datetime(2026, 1, 1, tzinfo=timezone.utc),
        end_time=datetime(2026, 1, 22, tzinfo=timezone.utc),
    ),
    evaluation_policy=AgenticAttributeEvaluationPolicy(
        cooldown_seconds=600,
        max_per_session=2,
    ),
    sample=SessionSample(max_sessions=5000, seed="eval-v1"),
)
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `attribute_groups` | Attribute groups that provide the attribute columns. Must include every attribute the triggers reference, and a group with the `domain_sessionid` attribute key. | `list[AttributeGroup]` | ✅ |
| `triggers` | One to five criteria triggers. An anchor is created when any of them holds. Attributes are referenced as `attribute_group:attribute`. | `list[CriteriaTrigger]` | ✅ |
| `training_span` | Time window to replay | `TrainingSpan` | ✅ |
| `evaluation_policy` | `cooldown_seconds` between anchors in a session (10 to 86400) and `max_per_session` (1 to 100) | `AgenticAttributeEvaluationPolicy` | Default: 600 seconds, three per session |
| `sample` | Replay a deterministic sample of sessions. See [Sample sessions](#sample-sessions). | `SessionSample` | Default: all sessions |

Trigger anchors compute the referenced attributes at every candidate event before applying the criteria. For long time windows on large sites, use `sample` to limit the work.

## User-supplied anchors

If you already have a table of anchors, use `submit_dataset_run_with_custom_anchors()`. The table must contain the following columns:

| Column | Type | Description |
| --- | --- | --- |
| Attribute key column (e.g. `domain_sessionid`) | `VARCHAR` | The attribute key used by your attribute groups. The column name must match the attribute key name. |
| `anchor_ts` | `TIMESTAMP` | The timestamp of the anchor |
| `label` | `INTEGER` | `1` for positive, `0` for negative. Omit the column and set `has_label=False` for tables without labels. |

Any other columns in the table are carried into the dataset unchanged. Use this to keep identifiers, labels from another system, or the answers a model gave at the time. A table of past model calls, with the session ID and the time of each call, is the most faithful way to rebuild the moments your application called a model.

For example, if your attribute groups use `domain_sessionid` as the attribute key:

| domain_sessionid | anchor_ts | label |
| --- | --- | --- |
| `abc-123` | 2024-01-15 09:32:00 | 1 |
| `def-456` | 2024-01-15 10:01:00 | 0 |

```python
from snowplow_signals import WarehouseTable

run = sp_signals.submit_dataset_run_with_custom_anchors(
    attribute_groups=[my_attribute_group],
    anchors_table=WarehouseTable(
        database="analytics",
        schema="ml",
        table="my_anchor_events",
    ),
)
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `attribute_groups` | Attribute groups that provide the attribute columns. Each attribute in these groups becomes a column in the final dataset. | `list[AttributeGroup]` | ✅ |
| `anchors_table` | Table containing your anchors | `WarehouseTable` | ✅ |
| `has_label` | Whether the table has a `label` column | `bool` | Default: `True` |

With user-supplied anchors, attributes and agentic contexts include only events before `anchor_ts`.

## Sample sessions

Event and trigger anchors accept a `SessionSample` to use only part of the sessions in the time window. Signals ranks the sessions with events in the window by a hash of the seed and the session ID, and keeps the first `max_sessions`. The same seed and time window always select the same sessions, and a smaller `max_sessions` with the same seed selects a subset of a larger one.

```python
from snowplow_signals import SessionSample

sample = SessionSample(max_sessions=5000, seed="eval-v1")
```

| Field | Description | Type | Required? |
| --- | --- | --- | --- |
| `max_sessions` | Maximum number of sessions to use | `int` | ✅ |
| `seed` | Seed for the session hash. Change it to draw a different sample. | `str` | Default: `"signals"` |
