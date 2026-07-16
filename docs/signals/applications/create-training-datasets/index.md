---
title: "Create training datasets from Signals attributes"
sidebar_position: 40
sidebar_label: "Create training datasets"
description: "Build labeled training datasets from your Signals attributes using the Python SDK. Define anchor events, generate SQL, and execute against your warehouse."
keywords: ["training datasets", "machine learning", "dataset builder", "anchors", "signals python sdk", "snowflake"]
date: "2026-07-15"
---

Use the Signals Python SDK to build labeled training datasets from your [attribute groups](/docs/signals/attributes/attribute-groups/index.md). The dataset builder generates SQL that computes attribute values over historical data and joins them with labeled anchor events, producing a dataset ready for model training.

Start by [connecting to Signals](/docs/signals/connection/index.md) to create a `Signals` client object.

## How it works

The dataset builder produces a training dataset in three stages:

1. **Anchors** - identify moments in historical sessions where a user either achieved a goal (positive label) or did not (negative label)
2. **Attributes** - compute attribute values for each anchor event using only the events that preceded it in the session
3. **Assembly** - join anchors with their computed attribute values into a single labeled dataset

This approach enforces point-in-time correctness: each row in the training dataset reflects only information that would have been available at the moment of the anchor event. This prevents data leakage, where a model trains on information it would not have at prediction time.

You define what constitutes a positive outcome (the goal), the time window to scan, and which attribute groups provide the features. The SDK generates the SQL for all three stages, which you can inspect, save to disk, or execute directly against your warehouse.

## Define anchors

Anchors are the labeled events that form the rows of your training dataset. Each anchor is a point in a session that receives a label: `1` if the user achieved the goal, `0` if they did not.

Use `SessionAnchors` when you want Signals to automatically identify anchor events from your raw event data. Use `UserSuppliedAnchors` when you already have a table of labeled events, for example from an existing ML pipeline or a manually curated dataset.

### Session anchors

Use `SessionAnchors` to automatically generate anchors from your event data. You specify a goal - the criteria that define a positive outcome - and a time window to scan.

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
| `min_events` | Minimum prior in-session events before a point is eligible as an anchor | `int` | Default: `1` |
| `max_anchors_per_session` | Maximum anchor events per session. `None` for unlimited | `int` or `None` | Default: `None` |
| `max_negative_ratio` | Ratio of negative to positive anchors for downsampling | `float` | Default: `5.0` |
| `excluded_events` | Events to exclude from anchor generation | `list` | Default: page_ping events excluded |
| `output` | Override the output table location for anchors | `WarehouseTable` | Default: `None` |

### User-supplied anchors

If you already have a table of labeled anchor events, use `UserSuppliedAnchors` instead.

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
| `has_label` | Whether the source table contains a label column | `bool` | Default: `True` |

## Build the dataset

Call `build_dataset_sql()` on your `Signals` client to generate the SQL bundle. Pass the attribute groups that provide your features and the anchors you defined.

```python
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=os.environ["SIGNALS_DEPLOYED_URL"],
    api_key_id=os.environ["CONSOLE_API_KEY_ID"],
    api_key=os.environ["CONSOLE_API_KEY"],
    org_id=os.environ["CONSOLE_ORG_ID"],
)

bundle = sp_signals.build_dataset_sql(
    attribute_groups=[my_attribute_group],
    anchors=anchors,
)
```

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `attribute_groups` | Attribute groups that provide the feature columns | `list[AttributeGroup]` | ✅ |
| `anchors` | Anchor configuration (`SessionAnchors` or `UserSuppliedAnchors`) | `Anchors` | ✅ |
| `attributes_database` | Database for intermediate attribute tables | `str` | Default: warehouse default |
| `attributes_schema` | Schema for intermediate attribute tables | `str` | Default: warehouse default |
| `attributes_table_prefix` | Prefix for intermediate attribute table names | `str` | Default: `"signals_attributes"` |
| `dataset` | Override the output table location for the final dataset | `WarehouseTable` | Default: `None` |
| `max_lookback_days` | Override the lookback window in days | `int` | Default: derived from attribute periods |

The returned `DatasetBundle` contains the generated SQL files and metadata. You can inspect the files, save them to disk, or execute them against your warehouse.

### Save SQL to disk

Use `save_to()` to write the generated SQL files, a manifest, and a README to a directory.

```python
bundle.save_to("./dataset_output")
```

This creates individual SQL files for each stage (anchors, attributes, assembly), a `manifest.json` with input configuration and output table mappings, and a `README.md` documenting the execution order.

## Execute against your warehouse

Execute the generated SQL directly against your warehouse to produce the training dataset.

### Snowflake

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

The `execute()` method runs each stage in order: creating the anchors table, computing attribute tables, and assembling the final dataset. If a stage fails, it raises an `ExecutionError` with details of the failed stage and a list of completed stages.

### Get results as a DataFrame

After execution, convert the result to a pandas DataFrame for analysis or model training.

```python
df = result.to_pandas()
print(f"Dataset: {len(df)} rows, {len(df.columns)} columns")
print(df.head())
```

You can also inspect the execution stages:

```python
for stage in result.stages:
    print(f"[{stage.status}] {stage.stage}: {stage.table.table}")
```
