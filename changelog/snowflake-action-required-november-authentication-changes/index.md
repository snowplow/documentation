---
title: "[Snowflake] Action required: November authentication changes"
description: "Snowflake has announced that password authentication will no longer be supported starting November 2025."
date: "2025-05-12"
update_type:
  - "Maintenance notification"
components:
  - "Destinations"
  - "Data models"
  - "Console"
  - "Security"
platforms:
  - "Snowflake"
---
> **This notice only applies to Snowflake customers**

Snowflake has [announced](https://www.snowflake.com/en/blog/blocking-single-factor-password-authentification/) that password authentication will no longer be supported starting November 2025. Depending on your Snowplow setup, you might need to make changes to comply with this policy.

To review all your Snowplow-related Snowflake connections at a glance, head to the [Connections page](https://console.snowplowanalytics.com/connections) in the Console.

## Loading data to Snowflake

For loader connections, the last column of the [Connections page](https://console.snowplowanalytics.com/connections) will specify the type of loader deployed.

If you are using the **Streaming loader**, then you are already compliant with the new policy and do not need to make changes.

If you are using **RDB Loader**, you will need to migrate to the Streaming loader to use key-based authentication. The Streaming loader [was released more than a year ago](https://snowplow.io/blog/snowflake-streaming-loader) and has a number of advantages:

* Data is available in Snowflake in seconds, rather than 10–15 minutes
* The cost of loading data to Snowflake is several times lower
* Streaming loader [can also be used for failed events](/docs/monitoring/exploring-failed-events/) and is compatible with [Data Quality Dashboard](/changelog/announcing-data-quality-dashboard/)

The Streaming loader maintains the same data format and would be loading to the same table. To migrate, follow these steps:

* On the [Connections page](https://console.snowplowanalytics.com/connections), click “Set up connection”, then select “Loader connection” and Snowflake.
* Add connection details, including the authentication key. **Make sure to select the same role** that currently owns your atomic events table (in the “advanced options”).
* Once you test and create the connection, open a Support ticket to schedule migration.

## Data modeling

If you are using SQL Runner models, we strongly recommend migrating to our dbt models, which incorporate many improvements, are regularly maintained and support key-based authentication via existing dbt functionality. We will post an update on support for this in SQL Runner in a few weeks.

> UPDATE: Key-based authentication is supported in SQL Runner since May 15.

If you are using out of the box models, you will need to update the respective connections (via the [Connections page](https://console.snowplowanalytics.com/connections)) to use key-based authentication.

For [custom models](/docs/modeling-your-data/running-data-models-via-console/), please open a Support ticket so that we can adjust your configuration.

## Data visualizations

Snowplow-authored data visualizations (previously known as data apps) will support key-based authentication by November. We will post another update at a later point.

## In the meantime

For any Snowflake username that needs to use password authentication, follow the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/admin-user-management#label-user-management-types) to set the `TYPE` of that user to `LEGACY_SERVICE`.

In case of any doubts, please don’t hesitate to contact Snowplow Support.
