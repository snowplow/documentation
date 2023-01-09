---
title: "How schemas translate to database types"
date: "2021-12-30"
sidebar_position: 100
hide_table_of_contents: true
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```


<Tabs groupId="type-casting">
  <TabItem value="redshift" label="Redshift and Postgres" default>

:::note

The row order in this table is important.  Type lookup stops after first match is found scanning from top to bottom (with the single exception of "null" — the first row in the table)

:::

<table>
<thead>
<td>Json Schema</td>
<td>Redshift/Postgres Type</td>
</thead>
<tbody>
<tr>
<td >

  ```json
{
    "type": ["null", T1, ...]
}
```

OR

  ```json
{
    "enum": ["null", E1, ...]
}
```

`"null"` is not considered for type casting logic, only for the nullability constraint. Type lookup will continue down the table.

</td>
<td>

`NULLABLE`

</td>
</tr>
<tr>
<td>

  ```json
{
    "enum": [E1, E2, ...]
}
```

The `enum` can contain more than **one** JavaScript type: `string`, `number|integer`, `boolean`.
For the purposes of this  `number` and `integer` are the same.


`array`, `object`, `NaN` and other types in the `enum` will be cast as fallback `VARCHAR(65535)`.

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
    "type": [T1, T2, ...]
}
```

- `T1, T2, ..`. only contains `"boolean"` **and** `"integer"`

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

_Content is strigified and quoted._

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

- Only works for `B`=2

</td>
<td>

`DECIMAL(36,2)`

</td>
</tr>
<tr>
<td>

  ```json
{
    "type": ["number", "integer"]
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

  ```json
{
    "enum": ["E1", "E2"]
}
```

</td>
<td>

`VARCHAR(M)`

`M` is the maximum size of `json.stringify("E*")`

</td>
</tr>
<tr>
<td>

If nothing matches above, this is a catch-all.

</td>
<td>

`VARCHAR(65535)`


_Values will be quoted as in JSON._

</td>
</tr>
</tbody>
</table>
</TabItem>

<TabItem value="databricks" label="Databricks" default>

:::note

All fields in databricks are `nullable`. Having `"null"` in the `"type"` or `"enum"` does not affect the warehouse type,
and is ignored for the purposes of type casting as per the table below.

The row order in this table is important.  Type lookup stops after first match is found scanning from top to bottom (with the single exception of "null" — the first row in the table)

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
- `P` is rounded up to `9`, `18` or `38`.
- `S` is the maximum scale (number of digits after the `.`) in the enum list and it is greater than 0.

<details>
<summary>The formulas</summary>

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

_`P` could only be 9, 18 or 38_

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
<summary>The formulas</summary>

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
- Maximum absolute value of the enum list is lesser or equal than 2147483647

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
- Maximum absolute value of the enum list is lesser or equal than 9223372036854775807

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
- Maximum absolute value of the enum list is greater than 9223372036854775807

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

- **All** `Nx` and `Ix` are of types number or integer.
- Absolute maximum value of the enum list and less than 1e38.
- `S` is the maximum scale (number of digits after the `.`) in the enum list and it is greater than 0.
- `P` is precision (total number of digits in `M`). Rounded up to `9`, `18` or `38`.

</td>
<td>

`DECIMAL(P,S)`

_`P` could only be 9, 18 or 38_

</td>
</tr>
<tr>
<td>

```json
{
    "enum": [S1, S2, ...]
}
```

- **All** `Sx` are string

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
If nothing matches above, this is a catch all.`
</td>
<td>

`STRING`

_Values will be quoted as in JSON._

</td>
</tr>
</tbody>
</table>
</TabItem>

<TabItem value="bigquery" label="BigQuery" default>

:::note

The row order in this table is important.  Type lookup stops after first match is found scanning from top to bottom (with the single exception of "null" — the first row in the table).

:::

<table>
<thead>
<td>Json Schema</td>
<td>BigQuery Type</td>
</thead>
<tbody>
<tr>
<td >

  ```json
{
    "type": ["null", T1, ...]
}
```

OR

  ```json
{
    "enum": ["null", E1, ...]
}
```

</td>
<td>

`NULLABLE`


_`"null"` is not considered for type casting logic. Only for nullability constraint. Type lookup will continue down the table._

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
<TabItem value="snowflake" label="Snowflake" default>

All types are `JSON`.

</TabItem>
<TabItem value="elastic" label="Elastic" default>

When loading enriched events, the resulting JSONs are like the [Snowplow Canonical Event model](/docs/understanding-your-pipeline/canonical-event/index.md) with the following changes:

### Boolean fields reformatted

All boolean fields like `br_features_java` are either `"0"` or `"1"` in the canonical event model. The JSON converts these values to `false` and `true`.

### New `geo_location` field

The `geo_latitude` and `geo_longitude` fields are combined into a single `geo_location` field of Elasticsearch's ["geo_point" type](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-point.html).

### Unstructured events

Unstructured events are expanded into full JSONs. For example, the event

```json
{
    "schema": "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1",
    "data": {
        "targetUrl": "http://snowplowanalytics.com/analytics/index.html",
        "elementId": "action",
        "elementClasses": [],
        "elementTarget": ""
	}
}
```

would be converted to the field

```json
{
    "unstruct_com_snowplowanalytics_snowplow_link_click_1": {
        "targetUrl": "http://snowplowanalytics.com/analytics/index.html",
        "elementId": "action",
        "elementClasses": [],
        "elementTarget": ""
    }
}
```

### Custom contexts

Each custom context in an array is similarly expanded to a JSON with its own field. For example, the array

```json
[
    {
        "schema": "iglu:com.acme/contextOne/jsonschema/1-0-0",
        "data": {
            "key": "value"
        }
    }
    {
        "schema": "iglu:com.acme/contextTwo/jsonschema/3-0-0",
        "data": {
            "name": "second"
        }
    }
]
```

would be converted to

```json
{
    "contexts_com_acme_context_one_1": {
        "key": "value"
    },
    "contexts_com_acme_context_two_3": {
        "name": "second"
    }
}
```

</TabItem>
</Tabs>