---
title: "Custom SQL query enrichment"
sidebar_position: 14
sidebar_label: Custom SQL
description: "Query relational databases during enrichment to attach lookup data from MySQL, PostgreSQL, or other SQL databases."
keywords: ["SQL enrichment", "database lookup", "relational database enrichment"]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The SQL query enrichment lets you add data to a Snowplow event via your own MySQL or PostgreSQL relational database.

Supported database types:
- MySQL, plus variants which speak MySQL e.g. MariaDB, Amazon Aurora
- PostgreSQL, plus variants which speak PostgreSQL

We don't recommend using this enrichment with analytical databases such as Redshift. These databases are optimized for large analytical queries, not the high-frequency, low-latency per-event lookups this enrichment requires.

## Configuration

For historical reasons, the configuration uses terms that are no longer used elsewhere in Snowplow.

The enrichment takes these parameters:

| Parameter       | Required | Description                                                          |
| --------------- | -------- | -------------------------------------------------------------------- |
| `inputs`        | ✅        | Event values to substitute in SQL placeholders.                      |
| `database`      | ✅        | Defines access to the database.                                      |
| `query`         | ✅        | The SQL statement to query your database.                            |
| `output`        | ✅        | How to convert the returned rows into self-describing JSON entities. |
| `cache`         | ✅        | Whether to store retrieved rows.                                     |
| `ignoreOnError` | ❌        | Whether to make the event fail if the API request fails.             |

<Tabs groupId="deployment" queryString>
  <TabItem value="console" label="Console" default>

Configure the parameters in the Console enrichment editor. For example:

```json
{
  "inputs": [
    {
      "placeholder": 1,
      "pojo": {
        "field": "user_id"
      }
    },
    {
      "placeholder": 1,
      "json": {
        "field": "contexts",
        "schemaCriterion": "iglu:com.snowplowanalytics.snowplow/client_session/jsonschema/1-*-*",
        "jsonPath": "$.userId"
      }
    },
    {
      "placeholder": 2,
      "pojo": {
        "field": "app_id"
      }
    }
  ],
  "database": {
    "postgresql": {
      "host": "cluster01.redshift.acme.com",
      "port": 5439,
      "sslMode": true,
      "username": "snowplow_enrich_ro",
      "password": "1asIkJed",
      "database": "crm"
    }
  },
  "query": {
    "sql": "SELECT username, email_address, date_of_birth FROM tbl_users WHERE user = ? AND client = ? LIMIT 1"
  },
  "output": {
    "expectedRows": "AT_MOST_ONE",
    "json": {
      "schema": "iglu:com.acme/user/jsonschema/1-0-0",
      "describes": "ALL_ROWS",
      "propertyNames": "CAMEL_CASE"
    }
  },
  "cache": {
    "size": 3000,
    "ttl": 60
  },
  "ignoreOnError": false
}
```

  </TabItem>
  <TabItem value="self-hosted" label="Self-Hosted">

For Self-Hosted, [provide a complete JSON](/docs/pipeline/enrichments/managing-enrichments/terraform/index.md). For example:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/sql_query_enrichment_config/jsonschema/1-0-1",
  "data": {
    "vendor": "com.snowplowanalytics.snowplow.enrichments",
    "name": "sql_query_enrichment_config",
    "enabled": false,
    "parameters": {
      "inputs": [
        {
          "placeholder": 1,
          "pojo": {
            "field": "user_id"
          }
        },
        {
          "placeholder": 1,
          "json": {
            "field": "contexts",
            "schemaCriterion": "iglu:com.snowplowanalytics.snowplow/client_session/jsonschema/1-*-*",
            "jsonPath": "$.userId"
          }
        },
        {
          "placeholder": 2,
          "pojo": {
            "field": "app_id"
          }
        }
      ],
      "database": {
        "postgresql": {
          "host": "cluster01.redshift.acme.com",
          "port": 5439,
          "sslMode": true,
          "username": "snowplow_enrich_ro",
          "password": "1asIkJed",
          "database": "crm"
        }
      },
      "query": {
        "sql": "SELECT username, email_address, date_of_birth FROM tbl_users WHERE user = ? AND client = ? LIMIT 1"
      },
      "output": {
        "expectedRows": "AT_MOST_ONE",
        "json": {
          "schema": "iglu:com.acme/user/jsonschema/1-0-0",
          "describes": "ALL_ROWS",
          "propertyNames": "CAMEL_CASE"
        }
      },
      "cache": {
        "size": 3000,
        "ttl": 60
      },
      "ignoreOnError": false
    }
  }
}
```

  </TabItem>
</Tabs>

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

### `inputs`

The SQL statement you provide can include placeholders. These will be replaced with actual values from the event, called `inputs`.

The enrichment can use any property in the event as input data. The values can be extracted from:
- [Atomic event properties](/docs/fundamentals/canonical-event/index.md) such as `user_id`
- [Self-describing event](/docs/fundamentals/events/index.md#self-describing-events) fields
- [Entities](/docs/fundamentals/entities/index.md) attached by tracker SDKs
- Entities attached by other enrichments

Each input consists of a `placeholder` index and a source: `pojo` for atomic event fields, or `json` for JSON fields, whether event or entity.

The `placeholder` is the index of the `?` SQL placeholder which this input will populate. It must be an integer greater than or equal to 1.

For `json`, specify the field name as either `unstruct_event` for self-describing event fields, `contexts` for fields in entities added during tracking, or `derived_contexts` for fields in enrichment entities. Add two additional fields:
- `schemaCriterion` is the Iglu schema URI. You can specify all versions of the schema (`*-*-*`), or a specific major version (e.g. `1-*-*`), major plus minor (e.g. `1-1-*`) or a full major-minor-patch version (e.g. `1-1-1`)
- `jsonPath` is the [JSON Path statement](http://goessner.net/articles/JsonPath/) to navigate to the field inside the JSON that you want to use as the input.

The resolved values should be primitive types (string, number, or boolean).

As shown in the example configuration, you can have multiple inputs with the same placeholder index. The enrichment will use the last configured input for that index that resolves to a non-null value. This allows you to specify fallback inputs.

### `database`

Configure how the enrichment should access your database in the `database` section. Populate all properties in the `postgresql` or `mysql` configuration object:
- `host`: the hostname or IP address of the database server or cluster
- `port`: the port to connect to the database on
- `sslMode`: whether the database requires connections to use SSL
- `username`: the username for the database login
- `password`: the password for this username
- `database`: the name of the specific database to run the query against

:::tip[Minimal permissions]
We strongly recommend restricting the username to minimal read-only permissions on just the tables required to execute the SQL query.
:::

If your database server has additional authentication in place, such as IP allowlisting, configure it to permit access from the NAT gateway associated with the Snowplow pipeline.

### `query`

Consists of a single `sql` key with a SQL query in the form of prepared statement. It will run on your relational database to return rows to attach to this event as entities. Use `?` placeholders in the query to indicate where the input values should be substituted. Values will be inserted according to their type: strings will be quoted, numbers won’t.

If a placeholder index required in the `sql` prepared statement isn't found in any of the `inputs`, then the lookup won't proceed, but this will **not** be flagged as a failure.

A final `;` is optional.

:::warning[No validation]
This enrichment makes no attempt to sanitize the SQL statement, nor to verify that the SQL statement doesn't have harmful side effects such as SQL injection.
:::

### `output`

The enrichment adds the returned rows to the event as one or more entities. You'll need to specify the schema or data structure that the enrichment should use to define the retrieved data.

The `output` object has two keys: `expectedRows` and `json`. The `expectedRows` enum defines the expected SQL output:
- `EXACTLY_ONE`: exactly one row is expected. 0 or 2+ rows will throw an error, causing the entire event to fail processing.
- `AT_MOST_ONE`: either one or zero rows is expected. 2+ rows will throw an error.
- `AT_LEAST_ZERO`: between 0 and N rows are expected, i.e. an array of results.
- `AT_LEAST_ONE`: between 1 and N rows are expected, i.e. an array of results. 0 rows will throw an error.

Within the `json` key, use `schema` to specify the URI of the schema you want to attach to the event.

The `describes` field configures whether to add one entity containing all the returned rows, or one entity per returned row. This will depend on your schema definition. Supported options are:
- `ALL_ROWS` means that the added entity will contain all the returned rows
- `EVERY_ROW` means that one entity will be added per returned row

The `propertyNames` field supports reformatting of the returned columns to fit the schema. Supported options are:
- `AS_IS`: preserve the column names exactly as they are
- `CAMEL_CASE`: e.g. `date_of_birth` becomes `dateOfBirth`
- `PASCAL_CASE`: e.g. `date_of_birth` becomes `DateOfBirth`
- `SNAKE_CASE`: e.g. `dateOfBirth` becomes `date_of_birth`
- `LOWER_CASE`: changes all characters to lowercase
- `UPPER_CASE`: changes all characters to uppercase

You could also use column aliasing in your SQL statement to change individual column names.

### `cache`

An enrichment can run many millions of time per hour, effectively launching a DoS attack on a data source. The `cache` configuration attempts to minimize the number of lookups performed.

The cache is an LRU (least-recently used) cache, where less frequently accessed values are evicted to make space for new values. Configure the `cache` as follows:
- `size` is the maximum number of entries to hold in the cache at any one time. The minimum value is `1`.
- `ttl` is the number of seconds that an entry can stay in the cache before it is forcibly evicted. This is useful to prevent stale values from being retrieved in the case that your database can return different values for the same key over time.

### `ignoreOnError`

When set to `true`, if the enrichment fails for any reason, the event is still considered successfully enriched. It'll be loaded as usual, except without the entities added by the enrichment.

When set to `false`, the event will become a [failed event](/docs/fundamentals/failed-events/index.md) if the SQL query fails.

## Edge case handling

This enrichment uses a relational database to fetch data in JSON format. This table describes what will happen under different conditions:

| Scenario                                                         | Outcome                                                                                                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| A provided JSONPath is invalid.                                  | Failed event, unless `ignoreOnError` is set to `true`.                                                                               |
| More than one entity in the event matches the `schemaCriterion`. | The first matching entity is used.                                                                                                   |
| Multiple inputs share the same placeholder index.                | The last configured input is used.                                                                                                   |
| Any placeholder index has no value.                              | The SQL query won't run and no entities will be added. The event is otherwise processed as usual — not failed.                       |
| An input value is non-primitive (object or array), or `null`.    | Treated as not found. The SQL query won't run and no entities will be added. The event is otherwise processed as usual — not failed. |
| The database query failed for any reason, or timed out.          | Failed event, unless `ignoreOnError` is set to `true`.                                                                               |
| The database connection was lost.                                | Failed event, unless `ignoreOnError` is set to `true`.                                                                               |

If the database connection is lost, the enrichment will attempt to reestablish it on the next event.

## Output

This enrichment adds entities based on your configuration.

### Single row

With this configuration:

```json
...
  "query": {
    "sql": "SELECT username, date_of_birth FROM tbl_users WHERE user = ?"
  },
  "output": {
    "expectedRows": "AT_MOST_ONE",
    "json": {
      "schema": "iglu:com.acme/user/jsonschema/1-0-0",
      "describes": "ALL_ROWS",
      "propertyNames": "CAMEL_CASE"
    }
  },
...
```

And this query result:

```sql
SELECT username, date_of_birth FROM tbl_users WHERE user = 123;
| username | date_of_birth |
| -------- | ------------- |
| karl     | 1980-06-12    |
```

The enrichment would add this entity to your event:

```json
{
  "schema": "iglu:com.acme/user/jsonschema/1-0-0",
  "data": {
    "username": "karl",
    "dateOfBirth": "1980-06-12T00:00:00"
  }
}
```

If the query returned no rows, e.g.:

```sql
SELECT username, date_of_birth FROM tbl_users WHERE user = 123;
| username | date_of_birth |
| -------- | ------------- |
```

The enrichment won't add an entity, but the event would continue processing.

If the query returned more than one row, e.g.:

```sql
SELECT username, date_of_birth FROM tbl_users WHERE user = 123;
| username | date_of_birth |
| -------- | ------------- |
| karl     | 1980-06-12    |
| mary     | 1975-03-22    |
```

An error would be triggered, on account of the `AT_MOST_ONE` setting, and the event would become a failed event.

### Multiple rows

With this `ALL_ROWS` configuration:

```json
...
  "query": {
    "sql": "SELECT * FROM product WHERE category = ?"
  },
  "output": {
    "expectedRows": "AT_LEAST_ZERO",
    "json": {
      "schema": "iglu:com.acme/products/jsonschema/1-0-0",
      "describes": "ALL_ROWS",
      "propertyNames": "AS_IS"
    }
  },
...
```

And this query result:

```sql
SELECT * FROM product WHERE category = 'homeware';
| SKU | prod_name |
| --- | --------- |
| 123 | iPad      |
| 456 | Ray-Bans  |
```

The enrichment would add this entity to your event:

```json
{
  "schema": "iglu:com.acme/products/jsonschema/1-0-0",
  "data": [
    {
      "SKU": "123",
      "prod_name": "iPad"
    },
    {
      "SKU": "456",
      "prod_name": "Ray-Bans"
    }
  ]
}
```

If you change the configuration to `EVERY_ROW`:

```json
...
  "output": {
    "expectedRows": "AT_LEAST_ZERO",
    "json": {
      "schema": "iglu:com.acme/product/jsonschema/1-0-0",
      "describes": "EVERY_ROW",
      "propertyNames": "LOWER_CASE"
    }
  }
...
```

Then two entities would be added to your event, one per row:

```json
{
  "schema": "iglu:com.acme/product/jsonschema/1-0-0",
  "data": {
    "sku": "123",
    "prod_name": "iPad"
  }
},
{
  "schema": "iglu:com.acme/product/jsonschema/1-0-0",
  "data": {
    "sku": "456",
    "prod_name": "Ray-Bans"
  }
}
```
