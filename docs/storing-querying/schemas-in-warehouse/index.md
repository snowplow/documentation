---
title: "How schema definitions translate to the warehouse"
sidebar_label: "Schemas in the warehouse"
sidebar_position: 4
description: "A detailed explanation of how Snowplow data is represented in Redshift, Postgres, BigQuery, Snowflake, Databricks and Synapse Analytics"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ParquetRecoveryColumns from '@site/docs/storing-querying/schemas-in-warehouse/_parquet-recovery-columns.md';
```

[Self-describing events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [entities](/docs/understanding-your-pipeline/entities/index.md) use [schemas](/docs/understanding-your-pipeline/schemas/index.md) to define which fields should be present, and of what type (e.g. string, number). This page explains what happens to this information in the warehouse.

## Location

Where can you find the data carried by a self-describing event or an entity?

<Tabs groupId="warehouse" queryString>
  <TabItem value="redshift/postgres" label="Redshift, Postgres" default>

Each type of self-describing event and each type of entity get their own dedicated tables. The name of such a table is composed of the schema vendor, schema name and its major version (more on versioning [later](#versioning)).

:::note

All characters are converted to lowercase and all symbols (like `.`) are replaced with an underscore.

:::

Examples:

| Kind | Schema | Resulting table |
|---|---|---|
| Self-describing event | `com.example/button_press/jsonschema/1-0-0` | `com_example_button_press_1` |
| Entity | `com.example/user/jsonschema/1-0-0` | `com_example_user_1` |

Inside the table, there will be columns corresponding to the fields in the schema. Their types are determined according to the logic described [below](#types).

:::note

The name of each column is the name of the schema field converted to snake case.

:::

:::caution

If an event or entity includes fields not defined in the schema, those fields will not be stored in the warehouse.

:::

For example, suppose you have the following field in the schema:

```json
"lastName": {
  "type": "string",
  "maxLength": 100
}
```

It will be translated into a column called `last_name` (notice the underscore), of type `VARCHAR(100)`.

  </TabItem>
  <TabItem value="databricks" label="Databricks, Spark SQL">

Each type of self-describing event and each type of entity get their own dedicated columns in the `events` table. The name of such a column is composed of the schema vendor, schema name and major schema version (more on versioning [later](#versioning)).

The column name is prefixed by `unstruct_event_` for self-describing events, and by `contexts_` for entities. _(In case you were wondering, those are the legacy terms for self-describing events and entities, respectively.)_

:::note

All characters are converted to lowercase and all symbols (like `.`) are replaced with an underscore.

:::

Examples:

| Kind | Schema | Resulting column |
|---|---|---|
| Self-describing event | `com.example/button_press/jsonschema/1-0-0` | `events.unstruct_event_com_example_button_press_1` |
| Entity | `com.example/user/jsonschema/1-0-0` | `events.contexts_com_example_user_1` |

For self-describing events, the column will be of a `STRUCT` type, while for entities the type will be `ARRAY` of `STRUCT` (because an event can have more than one entity attached).

Inside the `STRUCT`, there will be fields corresponding to the fields in the schema. Their types are determined according to the logic described [below](#types).

:::note

The name of each record field is the name of the schema field converted to snake case.

:::

:::caution

If an event or entity includes fields not defined in the schema, those fields will not be stored in the warehouse.

:::

For example, suppose you have the following field in the schema:

```json
"lastName": {
  "type": "string",
  "maxLength": 100
}
```

It will be translated into a field called `last_name` (notice the underscore), of type `STRING`.

  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

Each type of self-describing event and each type of entity get their own dedicated columns in the `events` table. The name of such a column is composed of the schema vendor, schema name and full schema version (more on versioning [later](#versioning)).

The column name is prefixed by `unstruct_event_` for self-describing events, and by `contexts_` for entities. _(In case you were wondering, those are the legacy terms for self-describing events and entities, respectively.)_

:::note

All characters are converted to lowercase and all symbols (like `.`) are replaced with an underscore.

:::

Examples:

| Kind | Schema | Resulting column |
|---|---|---|
| Self-describing event | `com.example/button_press/jsonschema/1-0-0` | `events.unstruct_event_com_example_button_press_1_0_0` |
| Entity | `com.example/user/jsonschema/1-0-0` | `events.contexts_com_example_user_1_0_0` |

For self-describing events, the column will be of a `RECORD` type, while for entities the type will be `REPEATED RECORD` (because an event can have more than one entity attached).

Inside the record, there will be fields corresponding to the fields in the schema. Their types are determined according to the logic described [below](#types).

:::note

The name of each record field is the name of the schema field converted to snake case.

:::

:::caution

If an event or entity includes fields not defined in the schema, those fields will not be stored in the warehouse.

:::

For example, suppose you have the following field in the schema:

```json
"lastName": {
  "type": "string",
  "maxLength": 100
}
```

It will be translated into a field called `last_name` (notice the underscore), of type `STRING`.

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

Each type of self-describing event and each type of entity get their own dedicated columns in the `events` table. The name of such a column is composed of the schema vendor, schema name and major schema version (more on versioning [later](#versioning)).

The column name is prefixed by `unstruct_event_` for self-describing events, and by `contexts_` for entities. _(In case you were wondering, those are the legacy terms for self-describing events and entities, respectively.)_

:::note

All characters are converted to lowercase and all symbols (like `.`) are replaced with an underscore.

:::

Examples:

| Kind | Schema | Resulting column |
|---|---|---|
| Self-describing event | `com.example/button_press/jsonschema/1-0-0` | `events.unstruct_event_com_example_button_press_1` |
| Entity | `com.example/user/jsonschema/1-0-0` | `events.contexts_com_example_user_1` |

For self-describing events, the column will be of an `OBJECT` type, while for entities the type will be an `ARRAY` of objects (because an event can have more than one entity attached).

Inside the object, there will be keys corresponding to the fields in the schema. The values for the keys will be of type `VARIANT`.

:::note

If an event or entity includes fields not defined in the schema, those fields will be included in the object. However, remember that you need to set `additionalProperties` to `true` in the respective schema for such events and entities to pass schema validation.

:::

For example, suppose you have the following field in the schema:

```json
"lastName": {
  "type": "string",
  "maxLength": 100
}
```

It will be translated into an object with a `lastName` key that points to a value of type `VARIANT`.

  </TabItem>
  <TabItem value="synapse" label="Synapse Analytics">

Each type of self-describing event and each type of entity get their own dedicated columns in the underlying data lake table. The name of such a column is composed of the schema vendor, schema name and major schema version (more on versioning [later](#versioning)).

The column name is prefixed by `unstruct_event_` for self-describing events, and by `contexts_` for entities. _(In case you were wondering, those are the legacy terms for self-describing events and entities, respectively.)_

:::note

All characters are converted to lowercase and all symbols (like `.`) are replaced with an underscore.

:::

Examples:

| Kind | Schema | Resulting column |
|---|---|---|
| Self-describing event | `com.example/button_press/jsonschema/1-0-0` | `events.unstruct_event_com_example_button_press_1` |
| Entity | `com.example/user/jsonschema/1-0-0` | `events.contexts_com_example_user_1` |

The column will be formatted as JSON — an object for self-describing events and an array of objects for entities (because an event can have more than one entity attached).

Inside the JSON object, there will be fields corresponding to the fields in the schema.

:::note

The name of each JSON field is the name of the schema field converted to snake case.

:::

:::caution

If an event or entity includes fields not defined in the schema, those fields will not be stored in the data lake, and will not be availble in Synapse.

:::

For example, suppose you have the following field in the schema:

```json
"lastName": {
  "type": "string",
  "maxLength": 100
}
```

It will be translated into a field called `last_name` (notice the underscore) inside the JSON object.

  </TabItem>
</Tabs>

## Versioning

What happens when you evolve your schema to a [new version](/docs/understanding-tracking-design/versioning-your-data-structures/index.md)?

<Tabs groupId="warehouse" queryString>
  <TabItem value="redshift" label="Redshift" default>

Because the table name for the self-describing event or entity includes the major schema version, each major version of a schema gets a new table:

| Schema | Resulting table |
|---|---|
| `com.example/button_press/jsonschema/1-0-0` | `com_example_button_press_1` |
| `com.example/button_press/jsonschema/1-2-0` | `com_example_button_press_1` |
| `com.example/button_press/jsonschema/2-0-0` | `com_example_button_press_2` |

When you evolve your schema within the same major version, (non-destructive) changes are applied to the existing table automatically. For example, if you change the `maxLength` of a `string` field, the limit of the `VARCHAR` column would be updated accordingly.

:::info Breaking changes

If you make a breaking schema change (e.g. change a type of a field from a `string` to a `number`) without creating a new major schema version, the loader will not be able to modify the table to accommodate the new data.

In this case, _upon receiving the first event with the offending schema_, the loader will instead create a new table, with a name like `com_example_button_press_1_0_1_recovered_9999999`, where:
* `1-0-1` is the version of the offending schema
* `9999999` is a hash code unique to the schema (i.e. it will change if the schema is overwritten with a different one)

To resolve this situation:
* Create a new schema version (e.g. `1-0-2`) that reverts the offending changes and is again compatible with the original table. The data for events with that `1-0-2` schema will start going to the original table as expected.
* You might also want to manually adapt the data in the `..._recovered_...` table and copy it to the original one.

Note that this behavior was introduced in RDB Loader 6.0.0. In older versions, breaking changes will halt the loading process.

:::

:::info Nullability

Once the loader creates a column for a given schema version as `NULLABLE` or `NOT NULL`, it will never alter the nullability constraint for that column. For example, if a field is nullable in schema version `1-0-0` and not nullable in version `1-0-1`, the column will remain nullable. (In this example, the Enrich application will still validate data according to the schema, accepting `null` values for `1-0-0` and rejecting them for `1-0-1`.)

:::

  </TabItem>
  <TabItem value="postgres" label="Postgres">

Because the table name for the self-describing event or entity includes the major schema version, each major version of a schema gets a new table:

| Schema | Resulting table |
|---|---|
| `com.example/button_press/jsonschema/1-0-0` | `com_example_button_press_1` |
| `com.example/button_press/jsonschema/1-2-0` | `com_example_button_press_1` |
| `com.example/button_press/jsonschema/2-0-0` | `com_example_button_press_2` |

When you evolve your schema within the same major version, (non-destructive) changes are applied to the existing table automatically. For example, if you change the `maxLength` of a `string` field, the limit of the `VARCHAR` column would be updated accordingly.

:::danger Breaking changes

If you make a breaking schema change (e.g. change a type of a field from a `string` to a `number`) without creating a new major schema version, the loader will not be able to adapt the table to receive new data. Your loading process will halt.

:::

:::info Nullability

Once the loader creates a column for a given schema version as `NULLABLE` or `NOT NULL`, it will never alter the nullability constraint for that column. For example, if a field is nullable in schema version `1-0-0` and not nullable in version `1-0-1`, the column will remain nullable. (In this example, the Enrich application will still validate data according to the schema, accepting `null` values for `1-0-0` and rejecting them for `1-0-1`.)

:::

  </TabItem>
  <TabItem value="databricks" label="Databricks, Spark SQL">

Because the column name for the self-describing event or entity includes the major schema version, each major version of a schema gets a new column:

| Schema | Resulting column |
|---|---|
| `com.example/button_press/jsonschema/1-0-0` | `unstruct_event_com_example_button_press_1` |
| `com.example/button_press/jsonschema/1-2-0` | `unstruct_event_com_example_button_press_1` |
| `com.example/button_press/jsonschema/2-0-0` | `unstruct_event_com_example_button_press_2` |

When you evolve your schema within the same major version, (non-destructive) changes are applied to the existing column automatically. For example, if you add a new optional field in the schema, a new optional field will be added to the `STRUCT`.

:::info Breaking changes

<ParquetRecoveryColumns/>

Note that this behavior was introduced in RDB Loader 5.3.0.

:::

  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

Because the column name for the self-describing event or entity includes the full schema version, each version of a schema gets a new column:

| Schema | Resulting column |
|---|---|
| `com.example/button_press/jsonschema/1-0-0` | `unstruct_event_com_example_button_press_1_0_0` |
| `com.example/button_press/jsonschema/1-2-0` | `unstruct_event_com_example_button_press_1_2_0` |
| `com.example/button_press/jsonschema/2-0-0` | `unstruct_event_com_example_button_press_2_0_0` |

If you are [modeling your data with dbt](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md), you can use [this macro](https://github.com/snowplow/dbt-snowplow-utils#combine_column_versions-source) to aggregate the data across multiple columns.

:::info Breaking changes

While our recommendation is to use major schema versions to indicate breaking changes (e.g. changing a type of a field from a `string` to a `number`), this is not particularly relevant for BigQuery. Indeed, each schema version gets its own column, so there is no difference between major and minor versions. That said, we believe sticking to our recommendation is a good idea:
* Breaking changes might affect downstream consumers of the data, even if they don’t affect BigQuery
* In the future, you might decide to migrate to a different data warehouse where our rules are stricter (e.g. Databricks)

:::

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

Because the column name for the self-describing event or entity includes the major schema version, each major version of a schema gets a new column:

| Schema | Resulting column |
|---|---|
| `com.example/button_press/jsonschema/1-0-0` | `unstruct_event_com_example_button_press_1` |
| `com.example/button_press/jsonschema/1-2-0` | `unstruct_event_com_example_button_press_1` |
| `com.example/button_press/jsonschema/2-0-0` | `unstruct_event_com_example_button_press_2` |

:::info Breaking changes

While our recommendation is to use major schema versions to indicate breaking changes (e.g. changing a type of a field from a `string` to a `number`), this is not particularly relevant for Snowflake. Indeed, the event or entity data is stored in the column as is in the `VARIANT` form, so Snowflake is not “aware” of the schema. That said, we believe sticking to our recommendation is a good idea:
* Breaking changes might affect downstream consumers of the data, even if they don’t affect Snowflake
* In the future, you might decide to migrate to a different data warehouse where our rules are stricter (e.g. Databricks)

Also, creating a new major version of the schema (and hence a new column) is the only way to indicate a change in semantics, where the data is in the same format but has different meaning (e.g. amounts in dollars vs euros).

:::

  </TabItem>
  <TabItem value="synapse" label="Synapse Analytics">

Because the column name for the self-describing event or entity includes the major schema version, each major version of a schema gets a new column:

| Schema | Resulting column |
|---|---|
| `com.example/button_press/jsonschema/1-0-0` | `unstruct_event_com_example_button_press_1` |
| `com.example/button_press/jsonschema/1-2-0` | `unstruct_event_com_example_button_press_1` |
| `com.example/button_press/jsonschema/2-0-0` | `unstruct_event_com_example_button_press_2` |

When you evolve your schema within the same major version, (non-destructive) changes are applied to the existing column automatically in the underlying data lake. That said, for the purposes of querying the data from Synapse Analytics, all fields are in JSON format, so these internal modifications are invisible — the new fields just appear in the JSON data.

:::info Breaking changes

<ParquetRecoveryColumns/>

:::

  </TabItem>
</Tabs>

## Types

How do schema types translate to the database types?

### Nullability

<Tabs groupId="warehouse" queryString>
  <TabItem value="redshift" label="Redshift, Postgres" default>

All non-required schema fields translate to nullable columns.

Required fields translate to `NOT NULL` columns:

```json
{
  "properties": {
    "myRequiredField": {"type": ...}
  },
  "required": [ "myRequiredField" ]
}
```

However, it is possible to define a required field where `null` values are allowed (the Enrich application will still validate that the field is present, even if it’s `null`):

```json
"myRequiredField": {
  "type": ["null", ...]
}
```

OR

```json
"myRequiredField": {
  "enum": ["null", ...]
}
```

In this case, the column will be nullable. It does not matter if `"null"` is in the beginning, middle or end of the list of types or enum values.

:::info

See also how [versioning](#versioning) affects this.

:::

  </TabItem>
  <TabItem value="databricks" label="Databricks, Spark SQL">

All schema fields, including the required ones, translate to nullable fields inside the `STRUCT`.

  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

All non-required schema fields translate to nullable `RECORD` fields.

Required schema fields translate to required `RECORD` fields:

```json
{
  "properties": {
    "myRequiredField": {"type": ...}
  },
  "required": [ "myRequiredField" ]
}
```

However, it is possible to define a required field where `null` values are allowed (the Enrich application will still validate that the field is present, even if it’s `null`):

```json
"myRequiredField": {
  "type": ["null", ...]
}
```

OR

```json
"myRequiredField": {
  "enum": ["null", ...]
}
```

In this case, the `RECORD` field will be nullable. It does not matter if `"null"` is in the beginning, middle or end of the list of types or enum values.

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

All fields are nullable (because they are stored inside the `VARIANT` type).

  </TabItem>
  <TabItem value="synapse" label="Synapse Analytics">

All fields are nullable (because they are stored inside the JSON-formatted column).

  </TabItem>
</Tabs>

### Types themselves

<Tabs groupId="warehouse" queryString>
  <TabItem value="redshift" label="Redshift, Postgres" default>

:::note

The row order in this table is important. Type lookup stops after the first match is found scanning from top to bottom.

:::

<table>
<thead>
<td>Json Schema</td>
<td>Redshift/Postgres Type</td>
</thead>
<tbody>
<tr>
<td>

```json
{
  "enum": [E1, E2, ...]
}
```

The `enum` can contain more than **one** JavaScript type: `string`, `number|integer`, `boolean`.
For the purposes of this  `number` and `integer` are the same.


`array`, `object`, `NaN` and other types in the `enum` will be cast as fallback `VARCHAR(4096)`.

_If content size is longer than 4096 it would be truncated when inserted into the Redshift._

</td>
<td>

`VARCHAR(M)`

`M` is the maximum size of `json.stringify(E*)`

</td>
</tr>
<tr>
<td>

```json
{
  "type": ["boolean", "integer"]
}
```

OR

```json
{
  "type": ["integer", "boolean"]
}
```

</td>
<td>

`VARCHAR(10)`

</td>
</tr>
<tr>
<td>

```json
{
  "type": [T1, T2, ...]
}
```

</td>
<td>

`VARCHAR(4096)`

_If content size is longer than 4096 it would be truncated when inserted into the Redshift._

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string",
  "format": "date-time"
}
```

</td>
<td>

`TIMESTAMP`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string",
  "format": "date"
}
```

</td>
<td>

`DATE`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "array"
}
```

</td>
<td>

`VARCHAR(65535)`

_Content is stringified and quoted._

_If content size is longer than 65535 it would be truncated when inserted into the Redshift._

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer",
  "maximum": M
}
```

- `M` &le; 32767

</td>
<td>

`SMALLINT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer",
  "maximum": M
}
```

- 32767 &lt; `M` &le; 2147483647

</td>
<td>

`INT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer",
  "maximum": M
}
```

- `M` &gt;2147483647

</td>
<td>

`BIGINT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer",
  "enum": [E1, E2, ...]
}
```

- Maximum `E*` &le; 32767

</td>
<td>

`SMALLINT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer",
  "enum": [E1, E2, ...]
}
```

- 32767 &lt; maximum `E*` &le; 2147483647

</td>
<td>

`INT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer",
  "enum": [E1, E2, ...]
}
```

- Maximum `E*` &gt; 2147483647

</td>
<td>

`BIGINT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer"
}
```

</td>
<td>

`BIGINT`

</td>
</tr>
<tr>
<td>

```json
{
  "multipleOf": B
}
```

</td>
<td>

`INT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number",
  "multipleOf": B
}
```

- Only works for `B`=0.01

</td>
<td>

`DECIMAL(36,2)`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number"
}
```

</td>
<td>

`DOUBLE`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "boolean"
}
```

</td>
<td>

`BOOLEAN`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string",
  "minLength": M,
  "maxLength": M
}
```

- `M` is the same in minLength and maxLength

</td>
<td>

`CHAR(M)`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string",
  "format": "uuid"
}
```

</td>
<td>

`CHAR(36)`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string",
  "format": "ipv6"
}
```

</td>
<td>

`VARCHAR(39)`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string",
  "format": "ipv4"
}
```

</td>
<td>

`VARCHAR(15)`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string",
  "format": "email"
}
```

</td>
<td>

`VARCHAR(255)`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string",
  "maxLength": M
}
```

- `enum` is not defined

</td>
<td>

`VARCHAR(M)`

</td>
</tr>
<tr>
<td>

```json
{
  "enum": ["E1"]
}
```

- `E1` is the only element

</td>
<td>

`CHAR(M)`

`M` is the size of `json.stringify("E1")`

</td>
</tr>
<tr>
<td>

If nothing matches above, this is a catch-all.

</td>
<td>

`VARCHAR(4096)`


_Values will be quoted as in JSON._

_If content size is longer than 4096 it would be truncated when inserted into the Redshift._

</td>
</tr>
</tbody>
</table>
</TabItem>

<TabItem value="databricks" label="Databricks, Spark SQL">

:::note

The row order in this table is important. Type lookup stops after the first match is found scanning from top to bottom.

:::

<table>
<thead>
<td>Json Schema</td>
<td>Databricks Type</td>
</thead>
<tbody>
<tr>
<td>

```json
{
  "type": "string",
  "format": "date-time"
}
```

</td>
<td>

`TIMESTAMP`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string",
  "format": "date"
}
```

</td>
<td>

`DATE`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "boolean"
}
```

</td>
<td>

`BOOLEAN`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string"
}
```

</td>
<td>

`STRING`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer",
  "minimum": N,
  "maximum": M
}
```

- `M` &le; 2147483647
- `N` &ge; -2147483648

</td>
<td>

`INT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer",
  "minimum": N,
  "maximum": M
}
```

- `M` &le; 9223372036854775807
- `N` &ge; -9223372036854775808

</td>
<td>

`BIGINT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer",
  "minimum": N,
  "maximum": M
}
```

- `M` &gt;1e38-1
- `N` &lt;-1e38

</td>
<td>

`DECIMAL(38,0)`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer",
  "minimum": N,
  "maximum": M
}
```

- `M` &lt; 1e38-1
- `N` &gt;-1e38

</td>
<td>

`DOUBLE`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer"
}
```

</td>
<td>

`BIGINT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number", // OR ["number", "integer"]
  "minimum": N,
  "maximum": M,
  "multipleOf": F
}
```

- `M` &le; 2147483647
- `N` &ge; -2147483648
- `F` is integer

</td>
<td>

`INT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number", // OR ["number", "integer"]
  "minimum": N,
  "maximum": M,
  "multipleOf": F
}
```

- `M` &le; 9223372036854775807
- `N` &ge; -9223372036854775808
- `F` is integer

</td>
<td>

`BIGINT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number", // OR ["number", "integer"]
  "minimum": N,
  "maximum": M,
  "multipleOf": F
}
```

- `M` &gt; 1e38-1
- `N` &lt; -1e38
- `F` is integer

</td>
<td>

`DECIMAL(38,0)`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number", // OR ["number", "integer"]
  "minimum": N,
  "maximum": M,
  "multipleOf": F
}
```

- `M` &lt; 1e38-1
- `N` &gt; -1e38
- `F` is integer

</td>
<td>

`DOUBLE`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number", // OR ["number", "integer"]
  "multipleOf": F
}
```

- `F` is integer

</td>
<td>

`BIGINT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number", // OR ["number", "integer"]
  "minimum": N,
  "maximum": M,
  "multipleOf": F
}
```

- `P` &le; 38, where `P` is the maximum precision (total number of digits) of `M` and `N`, adjusted for scale (number of digits after the `.`) of `F`.
- `S` is the maximum scale (number of digits after the `.`) in the enum list and it is greater than 0.

<details>
<summary>More details</summary>

`P` = `MAX`(`M.precision` - `M.scale` + `F.scale`,  `N.precision` - `N.scale` + `F.scale`)

`S` = `F.scale`

For example, `M=10.9999, N=-10, F=0.1` will be `DECIMAL(9,1)`. Calculation as follows:

`M` is `DECIMAL(6,4)`, `N` is `DECIMAL(2,0)`, `F` is `DECIMAL(2,1)`

`P` = `MAX`(6 - 4 + 1, 2 + 1) = 3, rounded up to 9

`S` = 1

result is `DECIMAL(9,1)`

</details>

</td>
<td>

`DECIMAL(P,S)`

_`P` is rounded up to either `9`, `18` or `38`._

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number", // OR ["number", "integer"]
  "minimum": N,
  "maximum": M,
  "multipleOf": F
}
```

- `P` &gt;38, where is the maximum precision (total number of digits) of `M` and `N`, adjusted for scale (number of digits after the `.`) of `F`.
- `S` is the maximum scale (number of digits after the `.`) in the enum list and it is greater than 0.

<details>
<summary>More details</summary>

`P` = `MAX`(`M.precision` - `M.scale` + `F.scale`,  `N.precision` - `N.scale` + `F.scale`)

For example, `M=10.9999, N=-1e50, F=0.1` will be `DOUBLE`. Calculation as follows:

`M` is `DECIMAL(6,4)`, `N` is `DECIMAL(2,0)`, `F` is `DECIMAL(2,1)`

`P` = `MAX`(6 - 4 + 1, 50 + 1) = 51 &gt;38
</details>

</td>
<td>

`DOUBLE`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number", // OR ["number", "integer"]
  "minimum": N,
  "maximum": M,
  "multipleOf": F
}
```

- `M` &lt; 1e38-1
- `N` &gt; -1e38
- `F` is integer

</td>
<td>

`DOUBLE`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number" // OR ["number", "integer"]
}
```

</td>
<td>

`DOUBLE`

</td>
</tr>
<tr>
<td >

```json
{
  "enum": [N1, I1, ...]
}
```

- All `Nx` and `Ix` are of types number or integer.
- Maximum scale (number of digits after the `.`) in the enum list is 0.
- Maximum absolute value of the enum list is lesser or equal than 2147483647.

</td>
<td>

`INT`

</td>
</tr>
<tr>
<td >

```json
{
  "enum": [N1, I1, ...]
}
```

- All `Nx` and `Ix` are of types number or integer.
- Maximum scale (number of digits after the `.`) in the enum list is 0.
- Maximum absolute value of the enum list is lesser or equal than 9223372036854775807.

</td>
<td>

`BIGINT`

</td>
</tr>
<tr>
<td >

```json
{
  "enum": [N1, I1, ...]
}
```

- All `Nx` and `Ix` are of types number or integer.
- Maximum scale (number of digits after the `.`) in the enum list is 0.
- Maximum absolute value of the enum list is greater than 9223372036854775807.

</td>
<td>

`BIGINT`

</td>
</tr>
<tr>
<td>

```json
{
  "enum": [N1, I1, ...]
}
```

- All `Nx` and `Ix` are of types number or integer.
- Absolute maximum value of the enum list and less than 1e38.
- `S` is the maximum scale (number of digits after the `.`) in the enum list and it is greater than 0.
- `P` is precision (total number of digits in `M`). Rounded up to `9`, `18` or `38`.

</td>
<td>

`DECIMAL(P,S)`

_`P` is rounded up to either `9`, `18` or `38`._

</td>
</tr>
<tr>
<td>

```json
{
  "enum": [S1, S2, ...]
}
```

- All `Sx` are string

</td>
<td>

`STRING`

</td>
</tr>
<tr>
<td >

```json
{
  "enum": [A1, A2, ...]
}
```

- `Ax` are a mix of different types

</td>
<td>

`STRING`

_Values will be quoted as in JSON._

</td>
</tr>
<tr>
<td>
If nothing matches above, this is a catch-all.
</td>
<td>

`STRING`

_Values will be quoted as in JSON._

</td>
</tr>
</tbody>
</table>
</TabItem>

<TabItem value="bigquery" label="BigQuery">

:::note

The row order in this table is important. Type lookup stops after the first match is found scanning from top to bottom.

:::

<table>
<thead>
<td>Json Schema</td>
<td>BigQuery Type</td>
</thead>
<tbody>
<tr>
<td>

```json
{
  "type": "object",
  "properties": {...}
}
```

If the `"properties"` key is missing, the type for the entire object will be `STRING` instead of `RECORD`.

Objects can be nullable. Nested fields can also be nullable (same rules as for everything else).

</td>
<td>

`RECORD`

</td>
</tr>

<tr>
<td>

```json
{
  "type": "array",
  "items": {...}
}
```

If the `"items"` key is missing, the type for the entire array will be `STRING` instead of `REPEATED`.

Arrays can be nullable. Nested fields can also be nullable (same rules as for everything else).

</td>
<td>

`REPEATED`

</td>
</tr>

<tr>
<td>

```json
{
  "type": "string",
  "format": "date-time"
}
```

</td>
<td>

`TIMESTAMP`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string",
  "format": "date"
}
```

</td>
<td>

`DATE`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "boolean"
}
```

</td>
<td>

`BOOLEAN`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "string"
}
```

</td>
<td>

`STRING`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "integer"
}
```

</td>
<td>

`INT`

</td>
</tr>
<tr>
<td>

```json
{
  "type": "number"
}
```

OR

```json
{
  "type": [ "integer", "number"]
}
```

</td>
<td>

`FLOAT`

</td>
</tr>
<tr>
<td >

```json
{
  "enum": [I1, I2, ...]
}
```

- All `Ix` are integer.

</td>
<td>

`INT`

</td>
</tr>
<tr>
<td >

```json
{
  "enum": [I1, N1, ...]
}
```

- All `Ix`, `Nx` are integer or number.

</td>
<td>

`FLOAT`

</td>
</tr>
<tr>
<td >

```json
{
  "enum": [A1, A2, ...]
}
```

- Any of `Ax`, `Ax` has a type other than integer or number.

</td>
<td>

`STRING`

_Values will be quoted as in JSON._

</td>
</tr>
<tr>
<td >
If nothing matches above, this is a catch-all.
</td>
<td>

`STRING`

_Values will be quoted as in JSON._

</td>
</tr>
</tbody>
</table>
</TabItem>
<TabItem value="snowflake" label="Snowflake">

All types are `VARIANT`.

</TabItem>
<TabItem value="synapse" label="Synapse Analytics">

All types are `NVARCHAR(4000)` when extracted with [`JSON_VALUE`](https://learn.microsoft.com/en-us/sql/t-sql/functions/json-value-transact-sql?view=azure-sqldw-latest#return-value).

With [`OPENJSON`](https://learn.microsoft.com/en-us/sql/t-sql/functions/openjson-transact-sql?view=azure-sqldw-latest), you can explicitly specify more precise types.

</TabItem>
</Tabs>
