---
title: "6.0.0 upgrade guide"
sidebar_position: -20
---

```mdx-code-block
import License from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/reusable/license/_index.mdx"

<License/>
```

## [Redshift-only] New migration mechanism & recovery tables

### What is schema evolution?

One of Snowplow’s key features is the ability to [define custom schemas and validate events against them](/docs/fundamentals/schemas/index.md). Over time, users often evolve the schemas, e.g. by adding new fields or changing existing fields. To accommodate these changes, RDB loader automatically adjusts the database tables in the warehouse accordingly.

There are two main types of schema changes:

**Breaking**: The schema version has to be changed in a model way (`1-2-3` → `2-0-0`). In Redshift, each model schema version has its own table (`..._1`, `..._2`, etc, for example: `com_snowplowanalytics_snowplow_ad_click_1`).

**Non-breaking**: The schema version can be changed in a addition way (`1-2-3` → `1-3-0` or `1-2-3` → `1-2-4`). Data is stored in the same database table.

### How it used to work

In the past, the transformer would fetch all schemas for an entity (which conforms to the `vendor/name/model-*-*` criterion of the entity) from Iglu Server, merge them, extract properties from JSON, stringify using tab char as delimeter and put null char in case the property is missing. Then the loader would adjust the database table and load the file.

This logic relied on two assumptions:

1. **Old events compatible with new schemas.** Events with older schema versions, e.g. `1-0-0` and `1-0-1`, had to be valid against the newer ones, e.g. `1-0-2`. Those that were not valid would result in failed events.

2. **Old columns compatible with new schemas.** The corresponding Redshift table had to be migrated correctly from one version to another. Changes, such as altering the type of a field from `integer` to `string`, would fail. Loading would break with SQL errors and the whole batch would be stuck and hard to recover.

These assumptions were not always clear to the users, making the transformer and loader error-prone.

### What happens now?

Transformer and loader are now more robust, and the data is easy to recover if the schema was not evolved correctly.


First, we support schema evolution that’s not strictly backwards compatible (although we still recommend against it since it can confuse downstream consumers of the data). This is done by _merging_ multiple schemas so that both old and new events can coexist. For example, suppose we have these two schemas:

```json
{
   // 1-0-0
   "properties": {
      "a": {"type": "integer"}
   }
}
```

```json
{
   // 1-0-1
   "properties": {
      "b": {"type": "integer"}
   }
}
```

These would be merged into the following:
```json
{
   // merged
   "properties": {
      "a": {"type": "integer"},
      "b": {"type": "integer"}
   }
}
```


Second, the loader does not fail when it can’t modify the database table to store both old and new events. (As a reminder, an example would be changing the type of a field from `integer` to `string`.) Instead, it creates a table for the new data as an exception. The users can then run SQL statements to resolve this situation as they see fit. For instance, consider these two schemas:
```json
{
   // 1-0-0
   "properties": {
      "a": {"type": "integer"}
   }
}
```

```json
{
   // 1-0-1
   "properties": {
      "a": {"type": "string"}
   }
}
```

Because `1-0-1` events cannot be loaded into the same table with `1-0-0`, the data would be put in a separate table, e.g. `com_snowplowanalytics_ad_click_1_0_1_recovered_9999999`, where:
  - `1_0_1` is the version of the offending schema;
  - `9999999` is a hash code unique to the schema (i.e. it will change if the schema is overwritten with a different one).

If you create a new schema `1-0-2` that reverts the offending changes and is again compatible with `1-0-0`, the data for events with that schema will be written to the original table as expected.

### Identifying schemas that need patching

After upgrading RDB Loader, you might find out that events or entities with some of the old schemas land in recovery tables.

To avoid this, the offending older Iglu schemas must be patched to align with the latest.

You can use the latest version of `igluctl` to do this.

To illustrate, let's say we have schema versions `1-0-0` and `1-0-1` that differ in one field only:
* version `1-0-0`: `{ "type": "integer", "maximum": 100 }` - translates to `SMALLINT`. All is good.
* version `1-0-1`: `{ "type": "integer", "maximum": 1000000 }` - breaking change as it translates to `INT` and the loader can't migrate the column.

Since version `1-0-1` had a breaking change, loading must have broken with an older version of RDB Loader. To fix that, the user must have updated the warehouse manually (changing the column type to `INT`). After this manual intervention, events with the `1-0-1` schema would have been loaded successfully with older versions of RDB Loader. However, after an upgrade to RDB Loader 6.0.0, events with the `1-0-1` schema will start to land in the recovery table.

Let's see how we can use `igluctl` to solve this problem.

1) Run the `igluctl static generate` command. If a recovery table is to be created, it will show up as a warning message. Example:
```bash
mkdir <schemas_folder> <sql_folder>
igluctl static pull <schemas_folder> <iglu_url> <iglu_key>
igluctl static generate <schemas_folder> <sql_folder> 
# ...
# iglu:com.test/test/jsonschema/1-0-1 has a breaking change Incompatible types in column example_field old RedshiftSmallInt new RedshiftInteger
# ...
```

2) Run the `igluctl table-check` command to check if table structure is in line with the latest schema version that doesn't contain any breaking changes. With the example schemas above, this would be `1-0-0` because `1-0-1` contains a breaking change.
Example:
```bash
igluctl table-check \
        --server <iglu_url> \
        --apikey <iglu_key> \
        --host <redshift_host> \
        --port <redshift_port> \
        --username <username> \
        --password <password> \
        --dbname  <database> \
        --dbschema <schema>
# ...
# * Column doesn't match, expected: 'example_field SMALLINT', actual: 'example_field INT'
# ...   
```

We got the `Column doesn't match` output with the above example because the table column had been migrated manually from `SMALLINT` to `INT`. Since the latest schema version that doesn't contain any breaking change is `1-0-0`, `table-check` command expects to see `SMALLINT` in the table therefore it gives the `Column doesn't match` output.

In order to solve this problem, we should patch `1-0-0` with `{ "type": "integer", "maximum": 1000000 }`. In this case, there won't be any breaking change between versions `1-0-0` and `1-0-1`. RDB Loader 6.0.0+ will then successfully load events into the intended table as expected.

After identifying all the offending schemas, you should patch them to reflect the changes in the warehouse.

Schema casting rules could be found [here](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md?warehouse=redshift#types).

#### `$.featureFlags.disableRecovery` configuration

If you have older schemas with breaking changes and don’t want the loader to apply the new logic to them, you can use `$.featureFlags.disableRecovery` configuration. For the provided schema criterions only, RDB Loader will neither migrate the corresponding shredded table nor create recovery tables for breaking schema versions. Loader will attempt to load to the corresponding shredded table without migrating.

You can set it as follows:
```json
{
  ...
  "featureFlags": {
    "disableRecovery": [
      "iglu:com.example/myschema1/jsonschema/1-*-*",
      "iglu:com.example/myschema2/jsonschema/1-*-*"
    ]
  }
}
```
