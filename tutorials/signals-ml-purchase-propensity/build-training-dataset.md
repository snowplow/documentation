---
title: "Build the training dataset"
position: 3
sidebar_label: "Build the dataset"
description: "Use the Signals dataset builder to create a labeled, point-in-time correct purchase propensity training dataset in Snowflake."
keywords: ["dataset builder", "session anchors", "training dataset", "point-in-time correct", "snowflake"]
date: "2026-10-25"
---

In this step you'll ask Signals to build a labeled training table from your historical events, using the attribute group you just defined. Signals runs the queries in your Snowflake account and writes the result there.

## Understand what each row means

The dataset builder uses [session anchors](/docs/signals/ml-training-datasets/#session-anchors). It scans the sessions in a time window you choose, and treats each event in a session as a possible prediction moment:

* Events after a session's first purchase are dropped, because there's nothing left to predict
* The remaining events in a session that went on to buy get `label = 1`
* Events in sessions that never bought get `label = 0`, and are downsampled so there are at most five negatives for every positive

For each anchor, Signals computes every attribute using only the events in that session that happened before the anchor. A row for the third event of a session has the counts from the first two events. This is the same information the model will have when it scores a live session partway through.

## Submit the dataset run

Load the attribute group you published from Signals, so the dataset uses exactly the definition that Signals serves:

```python
propensity_group = sp_signals.get_attribute_group("purchase_propensity")
print(f"{propensity_group.name} v{propensity_group.version}")
```

Without a `version` argument, `get_attribute_group()` returns the latest version.

Define the goal and the training window, then submit the run:

```python
from datetime import datetime, timezone

from snowplow_signals import Criteria, Criterion, EventProperty, TrainingSpan, WarehouseTable

purchase = Criteria(
    all=[
        Criterion.eq(
            EventProperty(
                vendor="com.snowplowanalytics.snowplow.ecommerce",
                name="snowplow_ecommerce_action",
                major_version=1,
                path="type",
            ),
            "transaction",
        )
    ]
)

run = sp_signals.submit_dataset_run_with_session_anchors(
    attribute_groups=[propensity_group],
    goal_criteria=purchase,
    training_span=TrainingSpan(
        # UPDATE THIS to a window where you have ecommerce events
        start_time=datetime(2026, 8, 1, tzinfo=timezone.utc),
        end_time=datetime(2026, 10, 1, tzinfo=timezone.utc),
    ),
    dataset_table=WarehouseTable(table="purchase_propensity_dataset"),
)
print(run.id)
```

Choose a window long enough to contain at least a few thousand purchases. A longer window gives the model more examples, but takes longer to build. End the window at least a day in the past, so that every session in it has finished.

The dataset builder writes its tables to the output database and schema from your Signals warehouse connection. To write somewhere else, set `database` and `schema` on `WarehouseTable`.

## Wait for the run to finish

The run happens in the background. Poll until it succeeds:

```python
import time

from snowplow_signals import DatasetRunStatus

while True:
    status = sp_signals.get_dataset_run_status(run.id)
    if status.status == DatasetRunStatus.SUCCESS:
        break
    if status.status == DatasetRunStatus.FAILED:
        raise RuntimeError("Dataset run failed")
    time.sleep(30)

dataset = status.dataset
print(f"{dataset.database}.{dataset.schema_}.{dataset.table}")
```

Depending on the window and your event volume, this takes from a few minutes to over an hour. If you need to stop it, call `sp_signals.cancel_dataset_run(run.id)`.

## Load the dataset

Load the full table into pandas with the Snowflake connector. Don't use `get_dataset_run_preview()` for training: it returns the first rows of the table without sampling them, so it isn't a representative mix of positives and negatives.

```python
import snowflake.connector

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
df.head()
```

Use whichever Snowflake authentication method your account requires, such as key pair authentication, in place of a password.

The table has one row per anchor, with the attribute key, the anchor timestamp, the label, and one column per attribute:

| `domain_sessionid` | `anchor_ts` | `label` | `page_views` | `product_views` | `add_to_carts` | `remove_from_carts` | `checkout_steps` | `minutes_in_session` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `4f1c2e8a-6b0d-4c1e-9a7f-2d3b5e8c1a90` | 2026-08-03 10:12:44 | 1 | 3 | 2 | 1 | | 1 | 6.4 |
| `9a2e7d41-3c5f-4b8a-8e6d-1f0c9b7a4e23` | 2026-08-03 10:15:02 | 0 | 2 | 1 | | | | 1.9 |

Counters with no matching events are null rather than zero. Live attributes can also be null, for example before a session's first cart addition, so in the next step you'll fill them the same way for training and serving.

## Troubleshooting

* `400` with "requires a Snowflake warehouse connection": the dataset builder only runs on Snowflake. Check the warehouse connection in your Signals setup.
* The run status is `failed`: find the failed query in your Snowflake query history to see the error, for example a missing table or permission.
* The table has very few rows with `label = 1`: the training window contains few purchases, or the `transaction` action isn't tracked with `snowplow_ecommerce_action`. Widen the window, or check the goal criteria against your events.
* Every ecommerce counter is null: the `snowplow_ecommerce_action` version in the attribute group doesn't match the one your tracker sends.
* `KeyError: 'label'` or similar in pandas: lowercase the column names after loading, as in the example above.
