### Compatibility

JSON Schema [iglu:com.snowplowanalytics.snowplow.enrichments/sql\_query\_enrichment\_config/jsonschema/1-0-0](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow.enrichments/sql_query_enrichment_config/jsonschema/1-0-0) Compatibility Batch: R83+ Real-time: R84+ Data provider Internal

### Overview

The SQL Query Enrichment lets you perform dimension widening on a Snowplow event via your own internal relational database. This is the field which this enrichment will augment:

- derived\_contexts

### Database support

Currently supported database types:

- MySQL, plus variants which speak MySQL (e.g. MariaDB, Amazon Aurora)
- PostgreSQL, plus variants which speak PostgreSQL

We **don’t recommend** to use this enrichment with analytical databases which support minimal (50-100) concurrent queries (e.g. Redshift).

### Example

Below you can see an example configuration using imaginary PostgreSQL database with CRM data, used to widen Snowplow event with context containing information about users. To find real-world example you can check our extensive tutorial on [How to enrich events with MySQL data using the SQL Query Enrichment](https://discourse.snowplowanalytics.com/t/how-to-enrich-events-with-mysql-data-using-the-sql-query-enrichment-tutorial/385).

{
  "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/sql\_query\_enrichment\_config/jsonschema/1-0-0",
  "data": {
    "name": "sql\_query\_enrichment\_config",
    "vendor": "com.snowplowanalytics.snowplow.enrichments",
    "enabled": true,
    "parameters": {
      "inputs": \[
        {
          "placeholder": 1,
          "pojo": {
            "field": "user\_id"
          }
        },
        {
          "placeholder": 1,
          "json": {
            "field": "contexts",
            "schemaCriterion": "iglu:com.snowplowanalytics.snowplow/client\_session/jsonschema/1-\*-\*",
            "jsonPath": "$.userId"
          }
        },
        {
          "placeholder": 2,
          "pojo": {
            "field": "app\_id"
          }
        }
      \],
      "database": {
        "postgresql": {
          "host": "rdms.intra.acme.com",
          "port": 5439,
          "sslMode": true,
          "username": "snowplow\_enrich\_ro",
          "password": "1asIkJed",
          "database": "crm"
        }
      },
      "query": {
        "sql": "SELECT username, email\_address, date\_of\_birth FROM tbl\_users WHERE user = ? AND application = ? LIMIT 1"
      },
      "output": {
        "expectedRows": "AT\_MOST\_ONE",
        "json": {
          "schema": "iglu:com.acme/user/jsonschema/1-0-0",
          "describes": "ALL\_ROWS",
          "propertyNames": "CAMEL\_CASE"
        }
      },
      "cache": {
        "size": 3000,
        "ttl": 60
      }
    }
  }
}

The configuration JSON for this enrichment contains four sub-objects:

1. `inputs` specifies the datapoint(s) from the Snowplow event to use as values to substitute placeholders in `query` when performing SQL query
2. `database` defines how the enrichment can access your relational database
3. `query` defines prepared SQL statement to query your database
4. `output` lets you tune how you convert the returned row(s) into one or more self-describing JSONs ready to be attached to your Snowplow event
5. `cache` improves the enrichment’s performance by storing rows retrieved from your relational database

### Configuration

To go through each of sub-objects in more detail:

#### `inputs`

Specify an array of `inputs` to put instead of placeholders in prepared statement. Each input consists of a `placeholder` and a source: either `pojo` if the datapoint comes from the Snowplow enriched event POJO, or `json` if the datapoint comes from a self-describing JSON inside one of the three JSON fields. The `placeholder` is the index of the `?` SQL placeholder which this input will be used to populate. It must be an integer greater than or equal to 1. For the `pojo` source, the field name must be specified. A field name which is not recognized as part of the POJO will be ignored by the enrichment. For the `json` source, you must specify the field name as either `unstruct_event`, `contexts` or `derived_contexts`. You must then provide two additional fields:

- `schemaCriterion` lets you specify the self-describing JSON you are looking for in the given JSON field. You can specify only the SchemaVer MODEL (e.g. `1-*-*`), MODEL plus REVISION (e.g. `1-1-*`) or a full MODEL-REVISION-ADDITION version (e.g. `1-1-1`)
- `jsonPath` lets you provide the [JSON Path statement](https://github.com/gatling/jsonpath#jsonpath) to navigate to the field inside the JSON that you want to use as the input

The lookup algorithm is short-circuiting: the first match for a given key will be used.

#### `database`

The `database` section lets you configure how the enrichment should access your relational database. At the moment `postgresql` and `mysql` are supported, with the same fields available for both. Please see the **Database support** section above for notes on compatibility. Populate all properties in the `postgresql` or `mysql` configuration object, as follows:

- `host`, the hostname or IP address of the database server or cluster
- `port`, the port to connect to the database on
- `sslMode`, whether the database requires connections to use SSL
- `username`, the username to login to the database using
- `password`, the password for this username
- `database`, the name of the specific database to run the query against

**We strongly recommend that the username have minimal read-only permissions on just the entities required to execute the SQL query.** If your database server has additional authentication in place, such as IP whitelisting, you will need to configure this security to permit access from all of your servers running the Snowplow Enrichment process.

#### `query`

Consists of a single `sql` key with SQL query in a form of prepared statement to run on your relational database to return row(s) to attach to this event. Form of a prepared statement means it can has placeholders (`?`), which will be replaced with actual values, extracted from `input`s corresponding to their indexes. Some notes on the behavior:

- If a placeholder index required in the `sql` prepared statement is not found in any of the `inputs`, then the lookup will not proceed, but this will **not** be flagged as a failure
- A final `;` is optional
- Values will be inserted into prepared statement according to their type: strings will be quoted, number won’t
- **This enrichment makes no attempt to sanitize the SQL statement, nor to verify that the SQL statement does not have harmful side effects (such as SQL injection)**

#### `output`

The enrichment adds the returned row(s) into the `derived_contexts` field within a Snowplow enriched event. Because all JSONs in the `derived_contexts` field must be self-describing JSONs, use the `schema` field to specify the Iglu schema URI that you want to attach to the event. The `expectedRows` enum defines expected SQL output and can take the following values:

- `EXACTLY_ONE` – exactly one row is expected. 0 or 2+ rows will throw an error, causing the entire event to fail processing
- `AT_MOST_ONE` – either one or zero rows is expected. 2+ rows will throw an error
- `AT_LEAST_ZERO` – between 0 and N rows are expected – in JSON terms we are dealing with an array of results
- `AT_LEAST_ONE` – between 1 and N rows are expected – i.e. an array of results. 0 rows will throw an error

It is on user’s behalf to make sure SQL query returns correct amount of rows. The `describes` property dictates whether the `schema` is the self-describing schema for all rows returned by the query, or whether the `schema` should be attached to each of the returned rows:

- `ALL_ROWS` means that the `schema` should box all returned rows – i.e. one context will always be added to `derived_contexts`, regardless of how many rows that schema contains
- `EVERY_ROW` means that the `schema` should be attached to each returned row – so e.g. if 3 rows are returned, 3 contexts with this same schema will be added to `derived_contexts`

The `propertyNames` property supports reformatting of the returned columns to fit the JSON Schema’s conventions better. Supported options are:

- `AS_IS` – preserve the column names exactly as they are
- `CAMEL_CASE` – so `date_of_birth` becomes `dateOfBirth`
- `PASCAL_CASE` – so `date_of_birth` becomes `DateOfBirth`
- `SNAKE_CASE` – so `dateOfBirth` becomes `date_of_birth`
- `LOWER_CASE` – changes all characters to lowercase
- `UPPER_CASE` – changes all characters to uppercase

If these options aren’t bespoke enough, remember that you can use column aliasing in your SQL statement to tweak individual column names.

#### `cache`

A Snowplow enrichment can run many millions of time per hour, effectively launching a DoS attack on a data source if we are not careful. The `cache` configuration attempts to minimize the number of lookups performed. The cache is an LRU (least-recently used) cache, where less frequently accessed values are evicted to make space for new values. For the cache key, we use a complex object with an underlying Indexed HashMap, consisting of placeholder numbers as keys and extracted values as HashMap values. You can configure the `cache` as follows:

- `size` is the maximum number of entries to hold in the cache at any one time
- `ttl` is the number of seconds that an entry can stay in the cache before it is forcibly evicted. This is useful to prevent stale values from being retrieved in the case that your DB can return different values for the same key over time

### Examples

#### Single row

With this configuration:

...
  "query": {
    "sql": "SELECT username, date\_of\_birth FROM tbl\_users WHERE user = ?"
  },
  "output": {
    "expectedRows": "AT\_MOST\_ONE",
    "json": {
      "schema": "iglu:com.acme/user/jsonschema/1-0-0",
      "describes": "ALL\_ROWS",
      "propertyNames": "CAMEL\_CASE"
    }
  },
...

And this query result:

SELECT username, date\_of\_birth FROM tbl\_users WHERE user = 123;
| username | date\_of\_birth |
|----------|---------------|
|     karl |    1980-06-12 |

This would be added to the `derived_contexts` array:

{
  "schema": "iglu:com.acme/user/jsonschema/1-0-0",
  "data": {
    "username": "karl",
    "dateOfBirth": "1980-06-12T00:00:00"
  }
}

With this query result:

SELECT username, date\_of\_birth FROM tbl\_users WHERE user = 123;
| username | date\_of\_birth |
|----------|---------------|

No context would be added to the `derived_contexts` array, but the event would continue processing. With this query result:

SELECT username, date\_of\_birth FROM tbl\_users WHERE user = 123;
| username | date\_of\_birth |
|----------|---------------|
|     karl |    1980-06-12 |
|     mary |    1975-03-22 |

An error would be triggered, on account of the `AT_MOST_ONE` setting, and the event would be rejected.

#### Multiple rows

With this configuration:

...
  "query": {
    "sql": "SELECT \* FROM product WHERE category = ?"
  },
  "output": {
    "expectedRows": "AT\_LEAST\_ZERO",
    "json": {
      "schema": "iglu:com.acme/products/jsonschema/1-0-0",
      "describes": "ALL\_ROWS",
      "propertyNames": "AS\_IS"
    }
  },
...

And this query result:

SELECT \* FROM product WHERE category = 'homeware';
| SKU | prod\_name |
|-----|-----------|
| 123 |      iPad |
| 456 |  Ray-Bans |

This single context would be added to the `derived_contexts` array:

{
  "schema": "iglu:com.acme/products/jsonschema/1-0-0",
  "data": \[
    {
      "SKU": "123",
      "prod\_name": "iPad"
    },
    {
      "SKU": "456",
      "prod\_name": "Ray-Bans"
    }    
  \]
}

If we change the configuration to:

...
  "output": {
    "expectedRows": "AT\_LEAST\_ZERO",
    "json": {
      "schema": "iglu:com.acme/product/jsonschema/1-0-0",
      "describes": "EVERY\_ROW",
      "propertyNames": "LOWER\_CASE"
    }
  }
...

Then two contexts would be added to the `derived_contexts` array:

{
  "schema": "iglu:com.acme/product/jsonschema/1-0-0",
  "data": {
    "sku": "123",
    "prod\_name": "iPad"
  }
}
{
  "schema": "iglu:com.acme/product/jsonschema/1-0-0",
  "data": {
    "sku": "456",
    "prod\_name": "Ray-Bans"
  }
}

### Data sources

The data source for this enrichment is the entire `enriched/good` event. More precisely input data can be accessed in any of four forms:

- Snowplow Plain Old Java Object produced during common enrichment process
- [Snowplow Unstructured event](https://github.com/snowplow/snowplow/wiki/Custom-events#unstructured-event)
- [Custom contexts](https://github.com/snowplow/snowplow/wiki/Custom-contexts) attached to event by tracking SDK
- Derived contexts attached to event by [other enrichments](https://github.com/snowplow/snowplow/wiki/Configurable-enrichments)

More precisely usage of these data sources described in inputs section.

### Algorithm

This enrichment uses any relational database to fetch data in JSON format. Here are some clues on how this enrichment will handle some exceptional cases:

- if provided JSONPath is invalid – all events attempted to being enriched will be sent to `enriched/bad`
- if more than one context (derived or custom) matches `schemaCriterion` – first one will be picked, no matter if following have higher SchemaVer
- if input’s value found more than in one sources – last one will be picked, so try to put more precise input last (for example to get longitude/latitude pair use data from IP Lookup enrichment first and GPS-derived longitude/latitude second)
- if any of input key wasn’t found – SQL query won’t be performed and new context won’t be derived, but event will be processed as usual
- if DB query wasn’t successful for any reason or timed-out – event will be sent to `enriched/bad` bucket
- if DB connection was lost – event will be sent to `enriched/bad` bucket, but on next event, enrichment will try to reestablish connection
- all non-primitive values (objects, arrays) and `null`s will be interpreted as not-found values

### Data generated

As during the SQL Query enrichment process the new context is added to `derived_contexts` of the enriched/good event, the data generated will end up in its own table determined by the custom `schema` key in `output` configuration sub-object.
