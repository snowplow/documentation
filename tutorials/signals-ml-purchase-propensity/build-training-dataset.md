---
title: "Build the training dataset"
position: 3
sidebar_label: "Build the dataset"
description: "Use the Signals dataset builder to create a labeled, point-in-time correct purchase propensity training dataset in Snowflake."
keywords: ["dataset builder", "session anchors", "training dataset", "point-in-time correct", "snowflake"]
date: "2026-10-25"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

In this step you'll get a labeled training table built by the Signals dataset builder from the attribute group you defined. With your own data, Signals runs the queries in your Snowflake account and writes the result there. With the sample data, you'll download a table that was built the same way.

## Understand what each row means

The dataset builder uses [session anchors](/docs/signals/ml-training-datasets/#session-anchors). It scans the sessions in a time window you choose, and treats each event in a session as a possible prediction moment:

* Events after a session's first purchase are dropped, because there's nothing left to predict
* The remaining events in a session that went on to buy get `label = 1`
* Events in sessions that never bought get `label = 0`, and are downsampled so there are at most five negatives for every positive

For each anchor, Signals computes every attribute using only the events in that session that happened before the anchor. A row for the third event of a session has the counts from the first two events. This is the same information the model will have when it scores a live session partway through.

## Build the dataset

<Tabs groupId="data-source" queryString>
  <TabItem value="own" label="Your own data" default>

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

End the window at least a day in the past, so that every session in it has finished. A longer window gives the model more examples, but takes longer to build.

Before you submit, check how many sessions in the window include a purchase. Run this in Snowflake, with your own table and window:

```sql
SELECT
    COUNT(DISTINCT domain_sessionid) AS sessions,
    COUNT(DISTINCT CASE
        WHEN unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type::STRING = 'transaction'
        THEN domain_sessionid
    END) AS purchasing_sessions
FROM atomic.events
WHERE collector_tstamp >= '2026-08-01'
  AND collector_tstamp < '2026-10-01'
```

The model learns what purchasing sessions have in common, and you'll hold out 20% of sessions to evaluate it. Aim for a few hundred purchasing sessions or more, so that the held-out set has enough purchases for the metrics to be stable. If you have fewer, widen the window.

The dataset builder writes its tables to the output database and schema from your Signals warehouse connection. To write somewhere else, set `database` and `schema` on `WarehouseTable`.

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

  </TabItem>
  <TabItem value="sample" label="Sample data">

The sample table was built with this call, using the `purchase_propensity` attribute group from the previous step. It ran against the [Google Analytics 4 Merchandise Store sample](https://developers.google.com/analytics/bigquery/web-ecommerce-demo-dataset), converted to Snowplow events. You don't need to run it: it needs a Snowflake warehouse connection, and the result is ready to download in the next section.

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
    attribute_groups=[sp_signals.get_attribute_group("purchase_propensity")],
    goal_criteria=purchase,
    training_span=TrainingSpan(
        start_time=datetime(2020, 11, 1, tzinfo=timezone.utc),
        end_time=datetime(2021, 2, 1, tzinfo=timezone.utc),
    ),
    dataset_table=WarehouseTable(table="purchase_propensity_dataset"),
)
```

To keep the file small, the published table keeps a random 14% of sessions, with every row of each session it keeps, so the balance of positives and negatives is unchanged. It has about 300,000 rows from about 47,000 sessions, of which 659 include a purchase. The session IDs are replaced with random UUIDs.

Two columns behave differently from data tracked with Snowplow:

* `page_views` is higher than on a typical Snowplow site, because the GA4 export often records the same page view more than once
* `remove_from_carts` is always empty, because the sample has no cart removals

  </TabItem>
</Tabs>

## Load the dataset

<Tabs groupId="data-source" queryString>
  <TabItem value="own" label="Your own data" default>

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

  </TabItem>
  <TabItem value="sample" label="Sample data">

Load the sample table straight from GitHub:

```python
import pandas as pd

df = pd.read_csv(
    "https://raw.githubusercontent.com/snowplow/documentation/main/static/tutorial-assets/signals-ml-purchase-propensity/purchase_propensity_sample.csv.gz",
    parse_dates=["anchor_ts"],
)
df.head()
```

  </TabItem>
</Tabs>

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
