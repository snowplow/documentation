---
title: "Forward events to ClickHouse"
sidebar_label: "ClickHouse"
description: "Send Snowplow events to ClickHouse for real-time analytics, inserting events into a table you define through the ClickHouse HTTP interface."
sidebar_position: 4
keywords: ["clickhouse", "event forwarding", "real-time analytics", "database", "columnar"]
date: "2026-07-07"
---

```mdx-code-block
import EventForwardingSchemaTable from '@site/src/components/EventForwardingSchemaTable';
import clickhouseSchema from '@site/src/components/EventForwardingSchemaTable/Schemas/clickhouse.json';
```

Send Snowplow events to ClickHouse to store behavioral data in a fast, column-oriented database for real-time analytics. The integration inserts events into a table you define using ClickHouse's [HTTP interface](https://clickhouse.com/docs/en/interfaces/http).

## Prerequisites

Before setting up the forwarder in Console, you'll need the following from your ClickHouse Cloud service:

- **Endpoint host**: your ClickHouse Cloud HTTPS endpoint, including the port (usually `8443`), found under **Connect** in the ClickHouse Cloud console. Enter it as `host:port`, without the `https://` scheme.
- **Database**: the database containing your destination table.
- **Table**: the table to insert events into. You must create this table before forwarding, as described below.
- **Username** and **Password**: a ClickHouse user with `INSERT` privileges on the table.

## Getting started

Set up your ClickHouse table first, then create the connection and forwarder in Console.

### Create the destination table

ClickHouse does not create or alter tables for you, so create the destination table before forwarding. Each field you map must match a column in the table: a mapped field with no matching column fails the insert rather than being silently dropped.

The default field mapping targets the eight columns below. A table that matches it looks like this:

```sql
CREATE TABLE default.snowplow_events
(
    event_id String,
    event_name String,
    app_id String,
    user_id String,
    collector_tstamp DateTime64(3),
    web_page_id String,
    domain_userid String,
    domain_sessionid String
)
ENGINE = MergeTree
ORDER BY (collector_tstamp, event_id)
```

Timestamp fields are sent as ISO 8601 strings and parsed by ClickHouse, so `DateTime` and `DateTime64` columns accept them directly.

Database and table names must be valid ClickHouse identifiers: they start with a letter or underscore and contain only letters, digits, and underscores (matching `^[A-Za-z_][A-Za-z0-9_]*$`). Names containing dots, dashes, spaces, or other characters are not supported.

### Configure the destination

To create the connection and forwarder, follow the steps in [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md).

When configuring the connection, select **ClickHouse** for the connection type and enter your endpoint host, database, table, username, and password. When configuring the forwarder, map each field to a column in your table, using the default mapping in the schema reference below as a starting point.

### Validate the integration

You can confirm events are arriving by querying the table from the ClickHouse Cloud SQL console or any ClickHouse client:

```sql
SELECT count() FROM default.snowplow_events
```

To inspect recent rows:

```sql
SELECT * FROM default.snowplow_events ORDER BY collector_tstamp DESC LIMIT 10
```

## Delivery and deduplication

Event forwarding delivers events at least once. When a request fails transiently and is retried, a batch that ClickHouse already inserted can be written again, which produces duplicate rows. Design your table and queries to tolerate duplicates, keyed on `event_id`:

- Deduplicate at query time, for example with `SELECT ... FROM snowplow_events GROUP BY event_id` or by selecting the latest row per `event_id`
- Use a [`ReplacingMergeTree`](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/replacingmergetree) engine ordered by `event_id` so duplicate rows collapse during background merges. Merges run asynchronously, so use `FINAL` or query-time deduplication when you need duplicate-free results immediately.

## Identity management

ClickHouse is a database rather than an identity-resolution destination, so there is no identify or alias concept. Identity is whichever identifier columns you map. The default mapping includes `user_id` (business identifier), `domain_userid` (first-party device cookie), and `domain_sessionid` (session identifier), and `event_id` serves as the natural deduplication key. Map whichever identifier columns match your table.

## Schema reference

This section contains the fields the default mapping sends to ClickHouse, including field names, data types, and default Snowplow mapping expressions. All fields are optional and fully configurable: remove any field your table does not define, and add columns for any other fields you want to forward.

<EventForwardingSchemaTable schema={clickhouseSchema}/>
