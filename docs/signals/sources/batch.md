---
title: "Batch Sources"
sidebar_position: 30
description: "Batch Sources."
sidebar_label: "Batch Sources"
---

In addition to stream sources, Signals allows you to create attributes based on data stored in your warehouse. Batch sources are ideal for metrics calculated over longer periods of time, such as:

- Previous purchase history
- Number of site visits in the last 7 days
- Average session length

Batch sources can be defined in two ways:

1. Using existing tables in your warehouse.  
2. Automatically generating tables via the dbt autogen CLI.


## Using Existing Tables

### Defining a Batch Source
To use an existing table in your warehouse, first define the connection to the table. Here's an example:

```python
data_source = BatchSource(
    name="ecommerce_transaction_interactions_source",
    database="SNOWPLOW_DEV1",
    schema="SIGNALS",
    table="SNOWPLOW_ECOMMERCE_TRANSACTION_INTERACTIONS_FEATURES",
    timestamp_field="UPDATED_AT",
)
```

### Defining a View

Once the `BatchSource` is defined, you can create a `View` by specifying the fields (columns) you want to use from the table. Here's an example:


```python
from snowplow_signals import View, domain_userid, Field

view = View(
    name="ecommerce_transaction_interactions_attributes",
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

### Apply the View

Finally, apply the View to make the attributes available to your app

```python
sp_signals.apply([view])
```

Once applied, the attributes defined in the `View` will be available for use in your app.

