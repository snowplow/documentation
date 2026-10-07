---
title: "Run a dataset build"
sidebar_position: 30
sidebar_label: "Run a build"
description: "Build a Signals dataset as a managed run in your warehouse, or generate the SQL and run it yourself. Check status, preview rows, and query the result."
keywords: ["dataset builder", "managed run", "sql bundle", "snowflake", "signals python sdk"]
date: "2026-10-07"
---

Once you have chosen your anchors and the context and outcomes for each row, you can build the dataset in two ways: submit a managed run where Signals executes the queries in your warehouse, or generate the SQL and run it yourself.

## Submit a managed run

The `submit_dataset_run_with_*()` methods have Signals build the dataset in your warehouse. They return a `DatasetRunResponse` immediately while the dataset is built in the background:

- `submit_dataset_run_with_session_anchors()`
- `submit_dataset_run_with_event_anchors()`
- `submit_dataset_run_with_trigger_anchors()`
- `submit_dataset_run_with_custom_anchors()`

### Check run status

Use `get_dataset_run_status()` to check whether the run has finished. The `status` field is one of `pending`, `success`, or `failed`. When a run fails, `error` contains the warehouse error message.

```python
status = sp_signals.get_dataset_run_status(run.id)
print(status.status)  # "pending", "success", or "failed"
```

To wait for completion in a notebook or script:

```python
import time
from snowplow_signals import DatasetRunStatus

while True:
    status = sp_signals.get_dataset_run_status(run.id)
    if status.status == DatasetRunStatus.SUCCESS:
        break
    if status.status == DatasetRunStatus.FAILED:
        raise RuntimeError(f"Dataset run failed: {status.error}")
    time.sleep(5)
```

### Preview results

Once the run status is `success`, call `get_dataset_run_preview()` to fetch rows of the completed dataset. By default it returns up to 100 rows, configurable up to 10,000 with the `limit` parameter. The rows aren't ordered, so a preview of a larger dataset is an arbitrary subset. For evaluation, sample sessions so the whole dataset fits within the limit, or query the table directly.

```python
preview = sp_signals.get_dataset_run_preview(run.id, limit=10000)
df = preview.to_pandas()
```

The resulting DataFrame contains one row per anchor, with columns for the attribute keys, the anchor timestamp, the label if there is one, every attribute, agentic context, and outcome, and any extra columns from user-supplied anchors.

### Query the full dataset

The complete dataset is written to your warehouse at the table location stored in `run.dataset`. Datasets can contain millions of rows, so for model training you should query this table directly in your warehouse rather than loading it into memory.

```python
dataset_location = run.dataset
print(f"{dataset_location.database}.{dataset_location.schema_}.{dataset_location.table}")
# e.g. "analytics.ml.signals_training_dataset"
```

### Cancel a run

To cancel a dataset build that is still in progress:

```python
sp_signals.cancel_dataset_run(run.id)
```

## Build and execute SQL yourself

If you want to review or customize the SQL before running it, use the `build_dataset_with_*()` methods, which take the same arguments as the managed runs. They generate the SQL files without executing them, so you can inspect, modify, or run them on your own schedule.

```python
bundle = sp_signals.build_dataset_with_event_anchors(
    attribute_groups=[session_attributes],
    criteria=product_view,
    training_span=span,
)

bundle.save_to("./dataset_output")
```

This creates:

- Individual SQL files for each stage, for example `signals_anchors.sql`, `signals_attributes_domain_sessionid.sql`, and `signals_training_dataset.sql`
- `manifest.json` with the input configuration and output table mappings
- `README.md` documenting the execution order

Run the SQL files in the order specified in `README.md` against your warehouse to produce the dataset.

## Customize output tables

By default, the dataset builder creates tables in the output database and schema from your [Signals warehouse connection](/docs/signals/setup/index.md). Each build writes three kinds of table, and a new build with the same names replaces them. Give each build its own table names when you want to keep several, for example to compare context variants on the same anchors.

| Argument | Description | Type | Default |
| --- | --- | --- | --- |
| `anchors_table` | Output location for the anchors table. Only `table` is required. Not used with user-supplied anchors. | `WarehouseTable` | `signals_anchors` |
| `attributes_table` | Output location for the intermediate attribute tables, one per attribute key, such as `signals_attributes_domain_sessionid`. Supports `database`, `schema`, and `table_prefix`. | `AttributesWarehouseTable` | `signals_attributes` prefix |
| `dataset_table` | Output location for the final dataset. Only `table` is required. | `WarehouseTable` | `signals_training_dataset` |
| `max_lookback_days` | How far back from each anchor to look for events when computing attributes. By default, derived from the longest period across your attributes. | `int` | Derived from attribute periods |

```python
from snowplow_signals import WarehouseTable

run = sp_signals.submit_dataset_run_with_session_anchors(
    ...
    dataset_table=WarehouseTable(
        table="my_training_dataset",   # required
        database="analytics",          # optional, defaults to Signals connection
        schema="ml",                   # optional, defaults to Signals connection
    ),
)
```
