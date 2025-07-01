---
title: "Batch calculations"
sidebar_position: 50
---

In addition to stream sources, Signals allows you to create attributes based on data stored in your warehouse. Batch sources are ideal for metrics calculated over longer periods of time, such as:

- Previous purchase history
- Number of site visits in the last 7 days
- Average session length

Batch sources can be defined in two ways:

1. Using existing tables in your warehouse.
2. Automatically generating tables via the dbt autogen CLI.

They are used for the Materialization Engine to know from where to sync the data to the Profiles Store.


## Using existing tables

### Defining a batch source
To use an existing table in your warehouse, first define the connection to the table. Here's an example:

```python
from snowplow_signals import BatchSource

data_source = BatchSource(
    name="ecommerce_transaction_interactions_source",
    database="SNOWPLOW_DEV1",
    schema="SIGNALS",
    table="SNOWPLOW_ECOMMERCE_TRANSACTION_INTERACTIONS_FEATURES",
    timestamp_field="UPDATED_AT",
    owner="user@company.com",
)
```

:::info
The timestamp_field should represent the last modified time of a record. It's used during materialization to identify which rows have changed since the last sync. Only those with a newer timestamp are sent to the Profiles Store. For performance and efficiency, it's best to use this with incremental or snapshot-based tables.
:::

### Defining a view

Once the `BatchSource` is defined, you can create a `View` by specifying the fields (columns) you want to use from the table. Make sure you set the `offline` parameter to `True`. This will indicate that you intend to use the batch_source you defined.

Here's an example:


```python
from snowplow_signals import View, domain_userid, Field

view = View(
    name="ecommerce_transaction_interactions_attributes",
    offline=True,
    version=1,
    entity=domain_userid,
    fields=[
        Field(
            name="TOTAL_TRANSACTIONS",
            type="int32",
        ),
        Field(
            name="TOTAL_REVENUE",
            type="int32",
        ),
        Field(
            name="AVG_TRANSACTION_REVENUE",
            type="int32",
        ),
    ],
    batch_source=data_source,
    owner="user@company.com",
)
```

### Apply the view

To register these changes, apply the View.

```python
sp_signals.apply([view])
```

### Start Materialization

Simply registering these sources is not enough for the sync to happen, you have to enable the Materialization process first.

The only thing to do is to set the `online` parameter to `True` and apply again:


```python
sp_signals.apply([view])
```

From that point onwards the sync will begin and look for new records to send to the Profiles Store at a given interval (defaults to 5 minutes) based on the `timestamp_field` and the last time the sync ran.

## Using the Batch Engine
Batch Sources also need to be defined as part of implementing a Batch Engine use case, where attribute computation is handled automatically. For more information on how to define Batch Sources, check out the [batch engine tutorial](/tutorials/snowplow-batch-engine/materialize-models/)
