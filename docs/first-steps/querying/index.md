---
title: "Querying your first events"
sidebar_position: 4
sidebar_label: "Querying data"
description: "Inspecting the events you tracked"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Once you’ve tracked some events, you will want to look at them in your data warehouse or database. The exact steps will depend on your choice of storage and the Snowplow offering.

## Connection details

<Tabs groupId="offering" queryString>
  <TabItem value="enterprise" label="BDP Enterprise" default>

Use the connection details you provided when setting up BDP Enterprise.

  </TabItem>
  <TabItem value="cloud" label="BDP Cloud">

You can find the connection details in the [Console](https://console.snowplowanalytics.com/destinations/catalog), under the destination you’ve selected.

  </TabItem>
  <TabItem value="try" label="Try Snowplow">

You can find the connection details in the [Try Snowplow UI](https://try.snowplowanalytics.com/access-data): hostname, port, database, username and password (request credentials in the UI if you haven’t done so).

For a step-by-step guide on how to query data in Try Snowplow, see [this tutorial](/docs/recipes/querying-try-data/index.md).

  </TabItem>
  <TabItem value="opensource" label="Open Source">

<Tabs groupId="warehouse" queryString>
  <TabItem value="postgres" label="Postgres" default>

You can connect to the database using the username and password you provided when creating the pipeline, along with the `db_address` and `db_port` you noted down after the pipeline was created. (If you need to reset your username or password, you can follow [these steps](https://aws.amazon.com/premiumsupport/knowledge-center/reset-master-user-password-rds/).)

Your database will contain two schemas:
* `atomic` — the validated events
* `atomic_bad` — the [failed events](/docs/understanding-your-pipeline/failed-events/index.md)

See [the AWS RDS documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html) for more details on how to connect.

  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

The database will be called `<prefix>_snowplow_db`, where `<prefix>` is the prefix you picked in your Terraform variables file. It will contain an `atomic` schema with your validated events.

You can access the database via the [BigQuery UI](https://console.cloud.google.com/bigquery).

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

There are two different ways to login to the database:
* The first option is to login using the same credentials as the loader. The user name is in the `snowflake_loader_user` output of the Snowflake Terraform module. The password is the one you’ve passed as `snowflake_loader_password` in your Terraform variables.
* The second option is to grant the loader’s role to an existing user. The role name is in the `snowflake_loader_role` output of the Snowflake Terraform module.

By default, the database will be called `<prefix>_database`, where `<prefix>` is the prefix you picked in your Terraform variables file (any special characters are replaced with underscores). It will contain an `atomic` schema with your validated events.

To connect, you can use either Snowflake dashboard or [SnowSQL](https://docs.snowflake.com/en/user-guide/snowsql.html).

  </TabItem>
</Tabs>

  </TabItem>
</Tabs>

## Writing queries

Follow [our querying guide](/docs/storing-querying/querying-data/index.md) for more information.
