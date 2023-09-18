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

Your database will be named according to the `postgres_db_name` Terraform variable. It will contain two schemas:
* `atomic` — the validated events
* `atomic_bad` — the [failed events](/docs/understanding-your-pipeline/failed-events/index.md)

You can connect to the database using the credentials you provided for the loader in the Terraform variables (`postgres_db_username` and `postgres_db_password`), along with the `postgres_db_address` and `postgres_db_port` Terraform outputs.

:::tip

If you need to reset your username or password, you can follow [these steps](https://aws.amazon.com/premiumsupport/knowledge-center/reset-master-user-password-rds/).

:::

See [the AWS RDS documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html) for more details on how to connect.

:::note

If you opted for the `secure` option, you will first need to create a tunnel into your VPC to be able to connect to your RDS instance and be able to query the data. A common solution to this issue is to configure a bastion host as described [here](https://repost.aws/knowledge-center/rds-connect-using-bastion-host-linux).

:::


  </TabItem>
  <TabItem value="redshift" label="Redshift">

The database name and the schema name will be defined by the `redshift_database` and `redshift_schema` variables in Terraform.

There are two different ways to login to the database:
* The first option is to use the credentials you configured for the loader in the Terraform variables (`redshift_loader_user` and `redshift_loader_password`)
* The second option is to grant `SELECT` permissions on the schema to an existing user

To connect, you can use the Redshift UI or something like [`psql`](https://www.postgresql.org/docs/current/app-psql.html).

  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

The database will be called `<prefix>_snowplow_db`, where `<prefix>` is the prefix you picked in your Terraform variables file. It will contain an `atomic` schema with your validated events.

You can access the database via the [BigQuery UI](https://console.cloud.google.com/bigquery).

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

The database name and the schema name will be defined by the `snowflake_database` and `snowflake_schema` variables in Terraform.

There are two different ways to login to the database:
* The first option is to use the credentials you configured for the loader in the Terraform variables (`snowflake_loader_user` and `snowflake_loader_password`)
* The second option is to grant `SELECT` permissions on the schema to an existing user

To connect, you can use either Snowflake dashboard or [SnowSQL](https://docs.snowflake.com/en/user-guide/snowsql.html).

  </TabItem>
  <TabItem value="databricks" label="Databricks">

The database name and the schema name will be defined by the `databricks_database` and `databricks_schema` variables in Terraform.

There are two different ways to login to the database:
* The first option is to use the credentials you configured for the loader in the Terraform variables (`databricks_loader_user` and `databricks_loader_password`, or alternatively the `databricks_auth_token`)
* The second option is to grant `SELECT` permissions on the schema to an existing user

See the [Databricks tutorial](https://docs.databricks.com/getting-started/quick-start.html) for more details on how to connect. The documentation on [Unity Catalog](https://docs.databricks.com/data-governance/unity-catalog/queries.html) is also useful.

  </TabItem>
</Tabs>

  </TabItem>
</Tabs>

## Writing queries

Follow [our querying guide](/docs/storing-querying/querying-data/index.md) for more information.
