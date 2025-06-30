---
title: "Batch Engine"
sidebar_position: 50
description: "In depth explanation on how the Batch Engine works."
sidebar_label: "Batch Engine"
---

While many `Attributes` can be computed in stream, there are cases where they should be created "offline" in the warehouse. We call them `Batch Attributes`.

One advantage of computing batch attributes over stream is that the computation can go back in history based on what you have already available in the atomic events dataset.

The entity here is typically the user, which may be the `domain_userid` or other Snowplow identifier fields, such as the logged in `user_id`.

Examples of `Batch Attributes` are typically:
- customer lifetime values
- specific transactions that have or have not happened in the last X number of days
- first or last events a specific user generated or any properties associated to these events

You may already have tables in your warehouse that contain such computed values, in which case you only have to register them as a batch source to be used by Signals. However, if you don't have them, we have developed a tool called the **`Batch Engine`** to efficiently generate these `Attributes` for you, with the help of a few CLI commands. This way you can avoid having to build complex data models to avoid recalculating the values each time over a very large table, which over time may even be impossible to do, not just costly.

## How it works
What you need to do first is to define a set of `Attributes` and register them as a `View` through the Python Signals SDK. Then you can use the optional CLI functionality of the SDK to generate a dbt project which will ultimately produce a view-specific attribute table. Then all that's left is to materialize the table, which will mean that Signals will regularly fetch the values from your warehouse table and sends it through the Profiles API.

## Defining batch attributes
Syntactically speaking, defining batch and stream attributes work the same way. For a general overview of how to do that please refer to the [attributes](/docs/signals/configuration/attributes/index.md) section.

There are 4 main types of attributes that you may likely want to define for batch processing:
1. `Time Windowed Attributes`: Actions that happened in the `last_x_number of days`. Period needs to be defined as timedelta in days.

2. `Lifetime Attributes`: Calculated over all the available data for the entity. Period needs to be left as None.

3. `First Touch Attributes`: Events (or properties) that happened for the first time for a given entity. Period needs to be left as None.

4. `Last Touch Attributes`: Events (or properties) that happened for the last time for a given entity. Period needs to be left as None.

We have illustrated each of these 4 types with an example block below.

1. `products_added_to_cart_last_7_days`: This attribute calculates the number of add to cart ecommerce events in the last 7 days

2. `total_product_price_clv`: This attribute is calculated across the customer lifetime

3. `first_mkt_source`: This attribute takes the first page_view event and reads the mkt_source property for a specific entity (e.g. domain_userid)

4. `last_device_class`: This attribute takes the first page_view event and extracts and retrieves the yauaa deviceClass property for a specific entity

<details>
<summary>Example batch attribute definitions</summary>

Each block creates a single attribute definition including the logic how it should be calculated (its filters and aggregation).

```python
from snowplow_signals import (
    Attribute,
    Criteria,
    Criterion,
    Event,
)
from datetime import timedelta

products_added_to_cart_last_7_days = Attribute(
    name="products_added_to_cart_last_7_days",
    type="string_list",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="snowplow_ecommerce_action",
            version="1-0-2",
        )
    ],
    aggregation="unique_list",
    property="contexts_com_snowplowanalytics_snowplow_ecommerce_product_1[0].name",
    criteria=Criteria(
        all=[
            Criterion(
                property="unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type",
                operator="=",
                value="add_to_cart",
            ),
        ],
    ),
    period=timedelta(days=7),
)

total_product_price_clv = Attribute(
    name="total_product_price_clv",
    type="float",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="snowplow_ecommerce_action",
            version="1-0-2",
        )
    ],
    aggregation="sum",
    property="contexts_com_snowplowanalytics_snowplow_ecommerce_product_1[0].price",
    criteria=Criteria(
        all=[
            Criterion(
                property="unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type",
                operator="=",
                value="add_to_cart"
            )
        ]
    ),
)

first_mkt_source = Attribute(
    name="first_mkt_source",
    type="string",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation="first",
    property="mkt_source",
)

last_device_class = Attribute(
    name="last_device_class",
    type="string",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation="last",
    property="contexts_nl_basjes_yauaa_context_1[0]:deviceClass",
)
```
</details>

## Defining a batch view
The key difference between a standard view and one meant for batch processing is the `offline=True` parameter. This flag indicates that the view’s attributes are computed in the data warehouse.

```python
from snowplow_signals import View, user_entity

view = View(
    name="batch_ecommerce_attributes",
    version=1,
    entity=user_entity,
    offline=True,
    attributes=[
        products_added_to_cart_last_7_days,
        total_product_price_clv,
        first_mkt_source,
        last_device_class
    ],
    owner="user@company.com"
)
```
## Generating the dbt project
Here we assume you already defined your View(s) related to custom Batch Attributes, you want the Batch Engine to help generate for you.

It is best to follow our step-by-step tutorial, please check it out [here](/tutorials/snowplow-batch-engine/start/).

## Understanding the autogenerated data models
The Signals Batch Engine-generated dbt models process the events for Attribute generation, to help you save resources by avoiding unnecessary processing. In each incremental run, only the data that has been loaded since the last time the data models ran get processed and deduplicated. Only the relevant events and properties that are part of the Attribute definition (defined in the same View) are used to create a `filtered_events_table`. Upon successful run, the `snowplow_incremental_manifest` is updated to keep records of where each run left off.

:::info
For those familiar with existing Snowplow dbt packages, it is worth to note that the incrementalization follows a completely different logic, based on newly loaded data and not by reprocessing sessions as a whole.
:::

There is a second layer of incremental processing logic dictated by the `daily_aggregation_manifest` table. After the `filtered_events` table is created or updated, the `daily_aggregates` table gets updated with the help of this manifest. It is needed due to late arriving data, which may mean that some days will need to be reprocessed as a whole. For optimization purposes there are variables to fine-tune how this works such as the `snowplow__reprocess_days` and the `snowplow__min_rows_to_process`.

Finally, the `Attributes` table is generated which is a drop and recompute table, fully updated each time an incremental update runs. This is cost-effective as the data is already pre-aggregated on a daily level.
![](../../../images/batch_engine_data_models.png)

## Variables

```yml title="dbt_project.yml"
snowplow__start_date: '2025-01-01' # date from where it starts looking for events based on both load and derived_tstamp
snowplow__app_id: [] # already gets applied in base_events_this_run
snowplow__backfill_limit_days: 1 # limit backfill increments for the filtered_events_table
snowplow__late_event_lookback_days: 5 # the number of days to allow for late arriving data to be reprocessed fully in the daily aggregate table
snowplow__min_late_events_to_process: 1 # the number of total daily events that have been skipped in previous runs, if it falls within the late_event_lookback_days, if the treshold is reached, those events will be processed in the daily aggregate model
snowplow__allow_refresh: false # if true, the snowplow_incremental_manifest will be dropped when running with a --full-refresh flag
snowplow__dev_target_name: dev
snowplow__databricks_catalog: "hive_metastore"
snowplow__atomic_schema: 'atomic' # Only set if not using 'atomic' schema for Snowplow events data
snowplow__database: # Only set if not using target.database for Snowplow events data -- WILL BE IGNORED FOR DATABRICKS
snowplow__events_table: "events" # Only set if not using 'events' table for Snowplow events data
```
