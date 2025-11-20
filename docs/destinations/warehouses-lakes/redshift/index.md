---
title: "Redshift"
sidebar_position: 40
description: "Send Snowplow data to Amazon Redshift for analytics and data warehousing"
---

```mdx-code-block
import SetupInstructions from '../_setup-instructions.mdx';
import HowLoadingWorks from '../_how-loading-works.mdx';
```

:::info Cloud availability

The Redshift integration is available for Snowplow pipelines running on **AWS** only.

:::

The Snowplow Redshift integration allows you to load enriched event data directly into your Redshift cluster (including Redshift serverless) for analytics, data modeling, and more.

## What you will need

Connecting to a destination always involves configuring cloud resources and granting permissions. It's a good idea to make sure you have sufficient priviliges before you begin the setup process.

:::tip

The list below is just a heads up. The Snowplow Console will guide you through the exact steps to set up the integration.

:::

Keep in mind that you will need to be able to:

* Provide your Redshift cluster endpoint and connection details
* Allow-list Snowplow IP addresses
* Specify the desired database and schema names
* Create a user and a role with the following permissions:
  * Schema ownership (`CREATE SCHEMA ... AUTHORIZATION`)
  * `SELECT` on system tables (`svv_table_info`, `svv_interleaved_columns`, `stv_interleaved_counts`) — this is required for maintenance jobs

## Getting started

You can add a Redshift destination through the Snowplow Console. (For self-hosted customers, please refer to the [Loader API reference](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) instead.)

<SetupInstructions destinationName="Redshift" connectionType="Redshift" noFailedEvents />

## How loading works

<HowLoadingWorks/>

For more details on the loading flow, see the [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) reference page, where you will find additional information and diagrams.

## Snowplow data format in Redshift

The event data is split across multiple tables.

The main table (`events`) contains the [atomic fields](/docs/fundamentals/canonical-event/index.md), such as `app_id`, `user_id` and so on:

| app_id | collector_tstamp | ... | event_id | ... | user_id | ... |
| ------ | ---------------- | --- | -------- | --- | ------- | --- |
| website | 2025-05-06 12:30:05.123 | ... | c6ef3124-b53a-4b13-a233-0088f79dcbcb | ... | c94f860b-1266-4dad-ae57-3a36a414a521 | ... |

Snowplow data also includes customizable [self-describing events](/docs/fundamentals/events/index.md#self-describing-events) and [entities](/docs/fundamentals/entities/index.md). These use [schemas](/docs/fundamentals/schemas/index.md) to define which fields should be present, and of what type (e.g. string, number).

For each type of self-describing event and entity, there are additional tables that can be joined with the main table:

<details>
<summary>unstruct_event_com_acme_button_press_1</summary>

| root_id | root_tstamp | button_name | button_color | ... |
| ------- | ----------- | ----------- | ------------ | --- |
| c6ef3124-b53a-4b13-a233-0088f79dcbcb | 2025-05-06 12:30:05.123 | Cancel | red | ... |

</details>

<details>
<summary>contexts_com_acme_product_1</summary>

| root_id | root_tstamp | name | price | ... |
| ------- | ----------- | ---- |------ | --- |
| c6ef3124-b53a-4b13-a233-0088f79dcbcb | 2025-05-06 12:30:05.123 | Salt | 2.60 | ... |
| c6ef3124-b53a-4b13-a233-0088f79dcbcb | 2025-05-06 12:30:05.123 | Pepper | 3.10 | ... |

</details>

Note:
* "unstruct\[ured\] event" and "context" are the legacy terms for self-describing events and entities, respectively
* the `_1` suffix represents the major version of the schema (e.g. `1-x-y`)

You can learn more [in the API reference section](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md).

:::tip

Check this [guide on querying](/docs/destinations/warehouses-lakes/querying-data/index.md?warehouse=redshift) Snowplow data.

:::
