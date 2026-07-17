---
title: "Create ML training datasets"
sidebar_position: 32
sidebar_label: "ML training datasets"
description: "Build labeled, point-in-time correct training datasets for machine learning models using the Signals Python SDK. Define anchor events, generate SQL, and execute against your warehouse."
keywords: ["training datasets", "machine learning", "dataset builder", "anchors", "signals python sdk", "snowflake", "ML"]
date: "2026-07-15"
---

Training a machine learning model on behavioral data requires a labeled dataset where each row represents a moment in time, with features computed only from events that had occurred up to that point. Building these datasets manually is error-prone: it is easy to accidentally include future information (data leakage), which produces models that perform well in testing but fail in production.

The Signals dataset builder automates this process. You define the outcome you want to predict, and Signals generates SQL that scans your historical event data, identifies labeled anchor points, computes attribute values using only prior events, and assembles a ready-to-use training dataset. Because the dataset builder uses the same [attribute groups](/docs/signals/attributes/attribute-groups/index.md) that power your real-time Signals deployment, the features your model trains on are identical to the features it receives at inference time.

Start by [connecting to Signals](/docs/signals/connection/index.md) to create a `Signals` client object.

## Workflow

Building and using an ML training dataset follows this process:

1. [Define your attribute groups](/docs/signals/attributes/attribute-groups/index.md) with the features you want your model to learn from (e.g. `product_view_count`, `add_to_cart_count`)
2. Define anchors that specify what outcome you want to predict and over what time window
3. Generate the SQL bundle using the dataset builder
4. Execute the SQL against your warehouse to produce the training dataset
5. Train your model on the resulting DataFrame
6. Deploy your model, serving it the same attributes in real time via [Retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md)

## How it works

The dataset builder produces a training dataset in three stages:

1. Anchors: scan sessions within the training window and identify anchor points. Sessions where the goal event occurred produce positive anchors (label=1). Sessions without the goal produce negative anchors (label=0). Negative anchors are downsampled to avoid class imbalance.
2. Attributes: for each anchor, compute attribute values using only the events that preceded the anchor timestamp in that session. This enforces point-in-time correctness, so attributes reflect only what was known at the moment of the anchor.
3. Assembly: join anchors with their computed attribute values into a single labeled dataset, with one row per anchor and one column per attribute.

For example, if you define two attributes (`product_view_count` and `add_to_cart_count`) with a transaction goal, the final dataset looks like this:

| domain_sessionid | anchor_ts | label | product_view_count | add_to_cart_count |
| --- | --- | --- | --- | --- |
| `abc-123` | 2024-01-15 09:32:00 | 1 | 5 | 2 |
| `def-456` | 2024-01-15 10:01:00 | 0 | 3 | 0 |
| `ghi-789` | 2024-01-16 14:22:00 | 1 | 8 | 4 |

Each row captures the attribute values as they were at the anchor timestamp, not at the end of the session. A model trained on this data learns the same signal it will see when serving predictions in real time.

## Define anchors

Anchors are the labeled events that form the rows of your training dataset. Each anchor is a point in a session that receives a label: `1` if the user achieved the goal, `0` if they did not.

Use `SessionAnchors` when you want Signals to automatically identify anchor events from your raw event data. Use `UserSuppliedAnchors` when you already have a table of labeled events, for example from an existing ML pipeline or a manually curated dataset.

### Session anchors

Use `SessionAnchors` to automatically generate anchors from your event data. You specify a goal (the criteria that define a positive outcome) and a time window to scan. Signals scans all sessions in the training window, labels each based on whether the goal was achieved, and produces one anchor per qualifying session.

```python
from datetime import datetime, timezone

from snowplow_signals import (
    Criteria,
    Criterion,
    EventProperty,
    SessionAnchors,
    TrainingSpan,
)

anchors = SessionAnchors(
    goal_criteria=Criteria(
        any=[
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
| `goal_criteria` | Criteria that define a positive anchor (label=1) | `Criteria` | ✅ |
| `training_span` | Time window to scan for anchor events | `TrainingSpan` | ✅ |
| `min_events` | Minimum number of prior in-session events before an anchor is eligible. Increase this to ensure each anchor has enough behavioral signal for meaningful features. | `int` | Default: `1` |
| `max_anchors_per_session` | Maximum anchor events per session. `None` for unlimited. Set this to limit overrepresentation of long sessions. | `int` or `None` | Default: `None` |
| `max_negative_ratio` | Maximum ratio of negative to positive anchors. Negative anchors are downsampled to this ratio. Lower values produce more balanced datasets; higher values preserve more data. | `float` | Default: `5.0` |
| `excluded_events` | Events to exclude from anchor generation. By default, `page_ping` events are excluded because they do not represent meaningful user actions. | `list` | Default: `page_ping` events excluded |
| `output` | Override the output table location for the anchors table | `WarehouseTable` | Default: `None` |

### User-supplied anchors

If you already have a table of labeled anchor events, use `UserSuppliedAnchors` instead. Your table must contain the following columns:

| Column | Type | Description |
| --- | --- | --- |
| Attribute key column (e.g. `domain_sessionid`) | `VARCHAR` | The attribute key used by your attribute groups. The column name must match the attribute key name. |
| `anchor_ts` | `TIMESTAMP` | The timestamp of the anchor event |
| `label` | `INTEGER` | `1` for positive, `0` for negative. Only required when `has_label` is `True`. |

For example, if your attribute groups use `domain_sessionid` as the attribute key:

| domain_sessionid | anchor_ts | label |
| --- | --- | --- |
| `abc-123` | 2024-01-15 09:32:00 | 1 |
| `def-456` | 2024-01-15 10:01:00 | 0 |

```python
from snowplow_signals import UserSuppliedAnchors, WarehouseTable

anchors = UserSuppliedAnchors(
    source=WarehouseTable(
        database="analytics",
        schema="ml",
        table="my_anchor_events",
    ),
    has_label=True,
)
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `source` | Table containing your pre-built anchor events | `WarehouseTable` | ✅ |
| `has_label` | Whether the source table contains a `label` column. Set to `False` if your anchors are unlabeled. | `bool` | Default: `True` |

## Generate the SQL

The `build_dataset_sql()` method sends your attribute group definitions and anchor configuration to the Signals API, which returns a bundle of SQL files. This is a separate step from execution so you can review the generated SQL, save it to version control, or run it in a different environment.

```python
bundle = sp_signals.build_dataset_sql(
    attribute_groups=[my_attribute_group],
    anchors=anchors,
)
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `attribute_groups` | Attribute groups that provide the feature columns. Each attribute in these groups becomes a column in the final dataset. | `list[AttributeGroup]` | ✅ |
| `anchors` | Anchor configuration (`SessionAnchors` or `UserSuppliedAnchors`) | `Anchors` | ✅ |
| `attributes_database` | Database for the intermediate per-attribute-key tables created during execution | `str` | Default: warehouse default |
| `attributes_schema` | Schema for the intermediate per-attribute-key tables created during execution | `str` | Default: warehouse default |
| `attributes_table_prefix` | Prefix for intermediate table names. For example, with the default prefix and an attribute key of `domain_sessionid`, the table is named `signals_attributes_domain_sessionid`. | `str` | Default: `"signals_attributes"` |
| `dataset` | Override the output table location for the final assembled dataset | `WarehouseTable` | Default: `None` |
| `max_lookback_days` | How far back from each anchor timestamp to look for events when computing attributes. By default, this is derived from the longest period defined across your attributes. Override it to widen or narrow the event window. | `int` | Default: derived from attribute periods |

The returned `DatasetBundle` contains the generated SQL files. You can inspect them, save them to disk, or execute them directly.

### Save SQL to disk

Use `save_to()` to write the generated SQL files, a manifest, and a README to a directory. This is useful for reviewing the SQL before execution or committing it to version control.

```python
bundle.save_to("./dataset_output")
```

This creates:

- Individual SQL files for each stage (`signals_anchors.sql`, `signals_attributes_domain_sessionid.sql`, `signals_training_dataset.sql`)
- `manifest.json` with input configuration and output table mappings
- `README.md` documenting the execution order

## Execute against your warehouse

Once you have a `DatasetBundle`, execute the SQL against your warehouse to produce the training dataset. The warehouse connection is separate from your Signals API credentials because the SQL runs directly against your data warehouse, not through the Signals API.

### Snowflake

Snowflake supports key-pair authentication for programmatic access. Wrap your Snowflake connection in a `SnowflakeConnection` and pass it to `execute()`.

```python
import snowflake.connector
from snowplow_signals.execution.snowflake import SnowflakeConnection

sf_conn = SnowflakeConnection(
    snowflake.connector.connect(
        account=os.environ["SNOWFLAKE_ACCOUNT"],
        user=os.environ["SNOWFLAKE_USER"],
        warehouse=os.environ["SNOWFLAKE_WAREHOUSE"],
        private_key=private_key_der,
    )
)

result = bundle.execute(sf_conn)
```

The `execute()` method runs three stages in order:

1. Creates the anchors table (`signals_anchors`)
2. Creates one attribute table per attribute key (e.g. `signals_attributes_domain_sessionid`), joining each anchor with its point-in-time attribute values
3. Assembles the final training dataset (`signals_training_dataset`) by joining all tables together

If a stage fails, it raises an `ExecutionError` with details of the failed stage and a list of completed stages.

### Get results as a DataFrame

After execution, call `to_pandas()` to get the training dataset as a DataFrame, ready for model training.

```python
df = result.to_pandas()
```

The resulting DataFrame contains one row per anchor, with columns for the attribute key, anchor timestamp, label, and every attribute from your attribute groups:

| | domain_sessionid | anchor_ts | label | product_view_count | add_to_cart_count |
| --- | --- | --- | --- | --- | --- |
| 0 | abc-123 | 2024-01-15 09:32:00 | 1 | 5 | 2 |
| 1 | def-456 | 2024-01-15 10:01:00 | 0 | 3 | 0 |
| 2 | ghi-789 | 2024-01-16 14:22:00 | 1 | 8 | 4 |
