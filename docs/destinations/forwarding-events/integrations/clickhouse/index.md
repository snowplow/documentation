---
title: "Forward events to ClickHouse"
sidebar_label: "ClickHouse"
sidebar_position: 2.5
description: "Insert Snowplow events into a ClickHouse Cloud table in real time over the ClickHouse HTTPS interface, using a field mapping that matches your table's columns."
keywords: ["ClickHouse", "ClickHouse Cloud", "event forwarding", "real-time analytics", "columnar database"]
date: "2026-11-26"
content_type: integration
---

```mdx-code-block
import EventForwardingSchemaTable from '@site/src/components/EventForwardingSchemaTable';
import clickhouseSchema from '@site/src/components/EventForwardingSchemaTable/Schemas/clickhouse.json';
```

<IntegrationBadges id="forwarder-clickhouse" />

Send Snowplow events to a table in [ClickHouse Cloud](https://clickhouse.com/cloud) for real-time analytics with SQL. The forwarder inserts events in batches through the ClickHouse [HTTP interface](https://clickhouse.com/docs/en/interfaces/http), and each mapped field becomes a column in your table.

ClickHouse doesn't define a payload format for this integration. Instead, your table is the schema: you create the table, and you map Snowplow fields to its column names.

## Compatibility

The ClickHouse integration is in Preview. It works with ClickHouse Cloud services over HTTPS on port `8443`. Snowplow authenticates with a ClickHouse username and password.

Before you set up the forwarder in Console, you'll need:

- A ClickHouse Cloud service, and its HTTPS host and port from the **Connect** screen in the ClickHouse Cloud console.
- A table to receive events. Every field in your forwarder's mapping must have a column with the same name.
- A ClickHouse user with the `INSERT` privilege on that table.
- Network access from Snowplow to your service, if your service restricts connections with an IP access list.

### Preview limitation: one bad event fails its batch

The forwarder sends events in batches of up to 1,000. ClickHouse accepts or rejects each insert as a whole, so if one event in a batch can't be inserted, ClickHouse rejects the batch and every event in it becomes a [failed event](/docs/fundamentals/failed-events/index.md). For example, a value that doesn't fit its column's type causes this.

Snowplow doesn't drop these events silently. Each one is logged as a failed event with the ClickHouse error message, so you can find the cause and recover the events. To avoid this, give your columns types that accept every value your mapping produces. The column types suggested in the [schema reference](#schema-reference) accept any value from the default mapping.

## Connect

You'll create the table and user in ClickHouse first, then create the connection and forwarder in Console.

<Steps>

### Create the table

Create a table whose column names match the fields in your mapping. This example matches the default mapping:

```sql
CREATE DATABASE IF NOT EXISTS snowplow;

CREATE TABLE snowplow.snowplow_events (
  event_id          String,
  event_name        String,
  app_id            String,
  user_id           String,
  collector_tstamp  DateTime64(3),
  web_page_id       String,
  domain_userid     String,
  domain_sessionid  String
) ENGINE = MergeTree
ORDER BY (collector_tstamp, event_id);
```

Database and table names must contain only letters, digits, and underscores, and can't start with a digit.

The forwarder sends only the fields in your mapping. A column with no mapped field receives its default value, so you can add columns such as `inserted_at DateTime64(3) DEFAULT now64(3)` for your own use.

### Create a user for Snowplow

Create a dedicated user and grant it `INSERT` on the table:

```sql
CREATE USER snowplow_forwarder IDENTIFIED BY '<password>';
GRANT INSERT ON snowplow.snowplow_events TO snowplow_forwarder;
```

### Allow connections from Snowplow

ClickHouse Cloud services accept connections only from addresses on the service's IP access list. If your list doesn't allow all addresses, contact Snowplow Support for the IP addresses that your forwarder connects from, and add them to the service's IP access list in the ClickHouse Cloud console.

### Create the connection and forwarder

Follow the steps in [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md) and select **ClickHouse** as the connection type. Enter these values for the connection:

| Field | Value |
| --- | --- |
| **ClickHouse Endpoint Host** | Your service's host and port, without `https://`. For example, `abc123xyz.us-east-1.aws.clickhouse.cloud:8443`. |
| **Database** | The database that contains your table, for example `snowplow`. |
| **Table** | The table to insert events into, for example `snowplow_events`. |
| **Username** | The ClickHouse user you created for Snowplow. |
| **Password** | That user's password. |

Console tests the connection by sending a request that ClickHouse always rejects without inserting anything. The test passes when ClickHouse rejects the request because it isn't a valid row, which confirms that the host, credentials, database, and table are all correct. If the password is wrong, or the database or table doesn't exist, the test fails.

### Check that events arrive

Once the forwarder is running, send a test event and query your table for its `event_id`:

```sql
SELECT *
FROM snowplow.snowplow_events
WHERE event_id = '<event_id>'
FORMAT Vertical;
```

Run this query as a user with `SELECT` on the table, because the forwarder's user only has `INSERT`.

</Steps>

## Configure

The default mapping sends eight common Snowplow fields. You can add any other field, as long as your table has a column with the same name. To remove a field, delete it from the mapping. See [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md) for how to edit field mappings.

ClickHouse converts each value to its column's type when it inserts the row. Snowplow sends timestamps as ISO 8601 strings, which ClickHouse parses into `DateTime` and `DateTime64` columns. If a mapped field is missing or `null` for an event, the column gets its default value.

ClickHouse doesn't ignore unknown fields. If your mapping includes a field that has no matching column, ClickHouse rejects the batch. Add the column to your table before you add the field to your mapping.

### Schema reference

This table lists the fields in the default mapping, with a suggested ClickHouse column type for each and the default Snowplow mapping expression.

<EventForwardingSchemaTable schema={clickhouseSchema}/>

## Troubleshooting

The forwarder sorts ClickHouse errors into setup errors, which trigger [setup alerts](/docs/destinations/forwarding-events/event-forwarding-monitoring-and-troubleshooting/index.md#configuring-setup-alerts), and data errors, which create failed events. It retries when ClickHouse reports it's overloaded, for example with `TOO_MANY_PARTS` or `TOO_MANY_SIMULTANEOUS_QUERIES`. See [Monitoring and troubleshooting](/docs/destinations/forwarding-events/event-forwarding-monitoring-and-troubleshooting/index.md) for how to inspect failed events.

| Error | Cause | Fix |
| --- | --- | --- |
| `AUTHENTICATION_FAILED` | The username or password is wrong. | Update the connection with the correct credentials. |
| `ACCESS_DENIED` or `NOT_ENOUGH_PRIVILEGES` | The user can't insert into the table. | Grant `INSERT` on the table to the forwarder's user. |
| `UNKNOWN_DATABASE` or `UNKNOWN_TABLE` | The database or table name in the connection doesn't exist. | Check the names in the connection. Names are case-sensitive. |
| `INCORRECT_DATA` or `NO_SUCH_COLUMN_IN_TABLE` | A mapped field has no matching column. | Add the column to your table, or remove the field from the mapping. |
| `CANNOT_PARSE_...` or `TYPE_MISMATCH` | A value doesn't fit its column's type, for example a non-UUID string in a `UUID` column. | Change the column type, or change the mapping expression so it produces a valid value. The whole batch fails, as described in the [Preview limitation](#preview-limitation-one-bad-event-fails-its-batch). |
| Connection test fails or times out, and no events arrive | The service's IP access list blocks Snowplow, or the host is wrong. | Check the host against the **Connect** screen, and [allow connections from Snowplow](#allow-connections-from-snowplow). |
