---
title: "Choose dataset anchors"
sidebar_position: 10
sidebar_label: "Choose anchors"
description: "Choose the moments that become rows in a Signals dataset: session goals, matching events, or your own table of moments."
keywords: ["anchors", "dataset builder", "session anchors", "event anchors", "user-supplied anchors"]
date: "2026-10-07"
content_type: how-to
---

Anchors are the moments that become rows in your dataset. Each anchor has a key, such as `domain_sessionid`, and a timestamp, `anchor_ts`. Signals computes the context for each anchor from events before that timestamp.

Choose the anchor type that matches how your model is used:

| Anchor type | Rows are | Use it to |
| --- | --- | --- |
| [Session anchors](#session-anchors) | Labeled points in sessions, positive at a goal event | Train a model that predicts a goal, such as a purchase |
| [Event anchors](#event-anchors) | Every event that matches criteria | Evaluate a model your application calls in response to an event |
| [User-supplied anchors](#user-supplied-anchors) | Rows of a table you provide | Use your own labels, or logs of past model calls |

Session and event anchors are counted per session, so the dataset always has a `domain_sessionid` column with them, even when none of your attribute groups uses that key. Events without a `domain_sessionid`, such as server-side events that only have a `user_id`, never become session or event anchors.

## Session anchors

Use `submit_dataset_run_with_session_anchors()` to generate labeled anchors from your event data for model training. You specify a goal, the criteria that define a positive outcome, and a time window to scan. Signals scans all sessions in the window and treats each event in a session as a candidate anchor, except for excluded events such as `page_ping`. Anchors stop at the first goal event: the goal event itself and any events after it are dropped, so each anchor represents a moment before the outcome is known. Every anchor in a session that later reaches the goal gets `label = 1`, and every anchor in a session that never reaches it gets `label = 0`. Negative anchors are then downsampled according to `max_negative_ratio` to avoid class imbalance.

Because a session contributes one anchor per eligible event, long sessions produce more rows than short ones. When you split the dataset for training and evaluation, keep all the anchors from a session on the same side of the split.

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

# sp_signals: the client from Connect to Signals
# my_attribute_group: the attribute group that provides the features
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
from datetime import datetime, timezone

from snowplow_signals import Criteria, Criterion, EventProperty, TrainingSpan

# sp_signals and my_attribute_group: as in the previous example
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
| `max_anchors_per_session` | Maximum anchors per session. `None` for unlimited. Set this to limit overrepresentation of long sessions. Signals keeps the earliest anchors that pass every other filter, so setting it to `1` keeps each session's first eligible anchor. | `int` or `None` | Default: `None` |
| `anchor_criteria` | Only events that match these criteria become anchors, for example events from the app where your application will read the prediction. The goal is still found among all events, and all events still count toward `min_events`. | `Criteria` | Default: any event |
| `max_negative_ratio` | Maximum ratio of negative to positive anchors. Negative anchors are downsampled to this ratio. Lower values produce more balanced datasets; higher values preserve more data. For example, set to `1.0` for a balanced 1:1 dataset. | `float` | Default: `5.0` |
| `excluded_events` | Events to exclude from anchor generation. By default, `page_ping` events are excluded because they do not represent meaningful user actions. | `list` | Default: `page_ping` events excluded |

All anchor methods also accept the output, context, and outcome arguments described in [Add context and outcomes](/docs/signals/datasets/context-and-outcomes/index.md) and [Run a dataset build](/docs/signals/datasets/run/index.md).

## Event anchors

Use `submit_dataset_run_with_event_anchors()` to create one anchor for every event that matches criteria. This matches an application that calls a model in response to an event, for example on a product page view or an add to cart. The criteria use the same `Criteria` and `Criterion` classes as session goals. Events in the same session that share a `collector_tstamp` become one anchor, at that timestamp.

Attributes and agentic contexts at an event anchor include only the events before it, not the anchor event itself. This matches an application that calls the model as the event happens, before Signals has processed it.

```python
from datetime import datetime, timezone

from snowplow_signals import Criteria, Criterion, EventProperty, TrainingSpan

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

# sp_signals: the client from Connect to Signals
# session_attributes: the attribute group your application reads
run = sp_signals.submit_dataset_run_with_event_anchors(
    attribute_groups=[session_attributes],
    criteria=product_view,
    training_span=TrainingSpan(
        start_time=datetime(2026, 1, 1, tzinfo=timezone.utc),
        end_time=datetime(2026, 1, 22, tzinfo=timezone.utc),
    ),
    max_per_session=2,
)
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `attribute_groups` | Attribute groups that provide the attribute columns | `list[AttributeGroup]` | ✅ |
| `criteria` | Events to anchor on | `Criteria` | ✅ |
| `training_span` | Time window to take events from | `TrainingSpan` | ✅ |
| `max_per_session` | Maximum anchors per session. Signals keeps the earliest. `None` makes every matching event an anchor. | `int` or `None` | Default: `None` |

## User-supplied anchors

If you already have a table of anchors, use `submit_dataset_run_with_custom_anchors()`. The table must contain the following columns:

| Column | Type | Description |
| --- | --- | --- |
| Attribute key column (e.g. `domain_sessionid`) | `VARCHAR` | The attribute key used by your attribute groups. The column name must match the attribute key name. |
| `anchor_ts` | `TIMESTAMP` | The timestamp of the anchor |
| `label` | `INTEGER` | `1` for positive, `0` for negative. Omit the column and set `has_label=False` for tables without labels. A table with `has_label=False` must not have a `label` column. |

Any other columns in the table are carried into the dataset unchanged. Use this to keep identifiers, labels from another system, or the answers a model gave at the time. A table of past model calls, with the session ID and the time of each call, is the most faithful way to rebuild the moments your application called a model.

Because the columns are copied into the dataset, none of them can share a name with an attribute, agentic context, or outcome in the dataset. A managed run checks the table before it starts and rejects a clash. Column names are compared case-insensitively.

For example, if your attribute groups use `domain_sessionid` as the attribute key:

| domain_sessionid | anchor_ts | label |
| --- | --- | --- |
| `abc-123` | 2024-01-15 09:32:00 | 1 |
| `def-456` | 2024-01-15 10:01:00 | 0 |

```python
from snowplow_signals import WarehouseTable

# sp_signals and my_attribute_group: as in the session anchor examples
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
