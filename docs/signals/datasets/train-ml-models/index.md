---
title: "Build a training dataset for a machine learning model"
sidebar_position: 35
sidebar_label: "Train ML models"
description: "Build a labeled, point-in-time correct training dataset with the Signals dataset builder, train a machine learning model on it, and serve the same attributes to the model in real time."
keywords: ["training datasets", "machine learning", "ML", "dataset builder", "session anchors", "labels", "signals python sdk"]
date: "2026-11-23"
content_type: how-to
---

<NotebookLinks path="snowplow/documentation/blob/main/static/notebooks/signals-dataset-builder.ipynb" />

This page shows how to build a labeled training dataset for a model that predicts a goal, such as a purchase in the current session. The features are the attributes from your Signals attribute groups, computed at each moment from the events before it. Your application reads the same attributes from Signals when it calls the model, so the model is scored on the same inputs it was trained on.

For a full walkthrough with sample data, including feature preparation, evaluation metrics, and a prediction endpoint, follow [Train and serve a purchase propensity model](/tutorials/signals-ml-purchase-propensity/introduction).

## Before you begin

You'll need:

* A [Signals client](/docs/signals/connection/index.md), called `sp_signals` in the examples below
* Your events in Snowflake, and a [Signals warehouse connection](/docs/signals/setup/index.md) for managed runs
* A published stream [attribute group](/docs/signals/attributes/attribute-groups/index.md) with the attributes you want as features

## Build the labeled dataset

Load the attribute group from Signals, so the dataset uses the same definition that Signals serves:

```python
propensity_group = sp_signals.get_attribute_group("purchase_propensity")
```

Submit a run with [session anchors](/docs/signals/datasets/anchors/index.md#session-anchors). `goal_criteria` defines the event that counts as a positive outcome:

```python
from datetime import datetime, timezone

from snowplow_signals import (
    AtomicProperty,
    Criteria,
    Criterion,
    TrainingSpan,
    WarehouseTable,
)

# sp_signals and propensity_group: as in the previous block
run = sp_signals.submit_dataset_run_with_session_anchors(
    attribute_groups=[propensity_group],
    goal_criteria=Criteria(
        all=[Criterion.eq(AtomicProperty(name="event"), "transaction")]
    ),
    training_span=TrainingSpan(
        start_time=datetime(2026, 8, 1, tzinfo=timezone.utc),
        end_time=datetime(2026, 10, 1, tzinfo=timezone.utc),
    ),
    dataset_table=WarehouseTable(table="purchase_propensity_dataset"),
)
```

Signals treats each event in a session as a candidate moment to predict from, up to the session's first goal event. Moments in sessions that reach the goal get `label = 1`, and moments in sessions that don't get `label = 0`. Negative rows are downsampled to at most five for every positive by default. To change how many rows each session contributes, which events can become rows, or the class balance, see the [session anchor arguments](/docs/signals/datasets/anchors/index.md#session-anchors).

End the training span at least a day in the past, so that every session in it has finished.

## Wait for the run and load the table

The run builds the dataset in your warehouse in the background. Poll until it finishes:

```python
import time

from snowplow_signals import DatasetRunStatus

# sp_signals and run: as in Build the labeled dataset
while True:
    status = sp_signals.get_dataset_run_status(run.id)
    if status.status == DatasetRunStatus.SUCCESS:
        break
    if status.status == DatasetRunStatus.FAILED:
        raise RuntimeError(f"Dataset run failed: {status.error}")
    time.sleep(5)

dataset = status.dataset
```

Load the full table from your warehouse for training, for example with the Snowflake connector. Don't train on `get_dataset_run_preview()`: it returns an arbitrary subset of at most 10,000 rows.

```python
import os

import snowflake.connector

# dataset: as in the previous block
conn = snowflake.connector.connect(
    account=os.environ["SNOWFLAKE_ACCOUNT"],
    user=os.environ["SNOWFLAKE_USER"],
    password=os.environ["SNOWFLAKE_PASSWORD"],
    warehouse=os.environ["SNOWFLAKE_WAREHOUSE"],
)
cursor = conn.cursor()
cursor.execute(f"SELECT * FROM {dataset.database}.{dataset.schema_}.{dataset.table}")
df = cursor.fetch_pandas_all()
conn.close()

# Snowflake returns unquoted column names in uppercase
df.columns = df.columns.str.lower()
```

The table has one row per moment, with `domain_sessionid`, `anchor_ts`, `label`, and one column per attribute.

## Split by session and train

Each session contributes several rows, and rows from the same session are similar. Keep every session's rows on the same side of the split, or the held-out score will be higher than the model achieves in production. Holding out the most recent sessions also tests the model on traffic it hasn't seen:

```python
from sklearn.ensemble import HistGradientBoostingClassifier

# df: as in the previous block
features = [c for c in df.columns if c not in ("domain_sessionid", "anchor_ts", "label")]

session_start = df.groupby("domain_sessionid")["anchor_ts"].transform("min")
cutoff = session_start.quantile(0.8)
train = df[session_start < cutoff]
test = df[session_start >= cutoff]

model = HistGradientBoostingClassifier(random_state=42)
model.fit(train[features], train["label"])
scores = model.predict_proba(test[features])[:, 1]
```

The tutorial's [Train the model](/tutorials/signals-ml-purchase-propensity/train-model) step covers preparing features so training and serving share the same code, and choosing evaluation metrics.

## Serve the model with the same attributes

In production, read the attributes for the current session from Signals and pass them to the model. See [Retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md). The attribute names match the dataset columns, because both come from the same attribute group.

To add more to each row, such as outcome columns or agentic contexts, see [Add context and outcomes](/docs/signals/datasets/context-and-outcomes/index.md). To run the generated SQL yourself instead of a managed run, see [Run a dataset build](/docs/signals/datasets/run/index.md#build-and-execute-sql-yourself).
