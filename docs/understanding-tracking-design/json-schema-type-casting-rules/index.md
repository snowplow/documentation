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

_The row order in this table is important.  Type lookup stops after first match is found scanning from top to bottom (with the single exception of "null" - first row in the table)_
<Tabs groupId="type-casting">
  <TabItem value="redshift" label="Redshift" default>

<table>
<thead>
<td>Json Schema</td>
<td>Redshift Type</td>
<td>Notes</td>
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
<td >
<code>NULLABLE</code>
</td>
<td><code>"null"</code> is not considered for type casting logic. Only for nullability constraint. Type lookup will continue down the table.
</td>
</tr>
<tr>
<td>

  ```json
{
    "enum": [E1, E2, ...]
}
```

</td>
<td><code>VARCHAR(M)</code></td>
<td> Where <code>M</code> is maximum size of <code>json.stringify(E*)</code><br/><br/>
The <code>enum</code> can contain more than <b>one</b> JavaScript type: <code>string</code>, <code>number|integer</code>, <code>boolean</code>.<br/>
For the purposes of this  <code>number</code> and <code>integer</code> are the same.<br/>
<br/>
<code>array</code>, <code>object</code>, <code>NaN</code> and other types in enum will be cast as fallback <code>VARCHAR(65535)</code>.   

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
<code>VARCHAR(10)</code>
</td>
<td>
Where <code>T1, T2, ..</code>. only contains <code>"boolean"</code> <b>and</b> <code>"integer"</code>
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
<code>VARCHAR(4096)</code>
</td>
<td></td>
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
<code>TIMESTAMP</code>
</td>
<td></td>
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
<code>DATE</code>
</td><td></td>
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
<code>VARCHAR(65535)</code>
</td><td></td>
</tr>
<tr>
<td>

  ```json
{
    "type": "integer",
    "maximum": M
}
```

</td>
<td>
<code>SMALLINT</code>
</td>
<td>
Where <code>M</code> &le; 32767
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

</td>
<td>
<code>INT</code>
</td>
<td>
Where 32767 &lt; <code>M</code> &le; 2147483647
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

</td>
<td>
<code>BIGINT</code>
</td>
<td>
Where <code>M</code> > 2147483647
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

</td>
<td>
<code>SMALLINT</code>
</td>
<td>
Where maximum <code>E*</code> &le; 32767
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

</td>
<td>
<code>INT</code>
</td>
<td>
32767 &lt; maximum <code>E*</code> &le; 2147483647
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

</td>
<td>
<code>BIGINT</code>
</td>
<td>
maximum <code>E*</code> &gt; 2147483647
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
<code>BIGINT</code>
</td><td></td>
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
<code>INT</code>
</td><td></td>
</tr>
<tr>
<td>

  ```json
{
    "type": "number",
    "multipleOf": B
}
```

</td>
<td>
<code>DECIMAL(36,2)</code>
</td>
<td>
Only works for <code>B</code>=2
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
<code>DOUBLE</code>
</td><td></td>
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
<code>DOUBLE</code>
</td><td></td>
</tr>
<tr>
<td>

  ```json
{
    "type": "boolean"
}
```

</td>
<td><code>BOOLEAN</code></td><td></td>
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

</td>
<td>
<code>CHAR(M)</code>
</td>
<td>
Where <code>M</code> is the same in minLength and maxLength
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
<code>CHAR(36)</code>
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
<code>VARCHAR(39)</code>
</td><td></td>
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
<code>VARCHAR(15)</code>
</td><td></td>
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
<code>VARCHAR(255)</code>
</td><td></td>
</tr>
<tr>
<td>

  ```json
{
    "type": "string",
    "maxLength": M
}
```

</td>
<td>
<code>VARCHAR(M)</code>
</td>
<td>
<code>enum</code> is not defined
</td>
</tr>
<tr>
<td>

  ```json
{
    "enum": ["E1"]
}
```

</td>
<td>
<code>CHAR(M)</code>
</td>
<td>
Where <code>M</code> is the size of json.stringify("E1"). <br/>
<code>E1</code> is only element
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
<code>VARCHAR(M)</code>
</td>
<td>Where <code>M</code> maximum size of <code>json.stringify("E*")</code></td>
</tr>
<tr>
<td>
fallback
</td>
<td>
<code>VARCHAR(65535)</code>
</td>
<td>
Values will be quoted.
Used when none of the rules above match.
</td>
</tr>
</tbody>
</table>
</TabItem>

 <TabItem value="databricks" label="Databricks" default>

All fields in databricks are `nullable`. Having `"null"` in the `"type"` or `"enum"` does not affect the warehouse type,
and ignored for the purposes of type casting as per the table below.

<table>
<thead>
<td>Json Schema</td>
<td>Databricks Type</td>
<td>Notes</td>
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
<code>TIMESTAMP</code>
</td>
<td></td>
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
<code>DATE</code>
</td><td></td>
</tr>
<tr>
<td>

  ```json
{
    "type": "boolean"
}
```

</td>
<td><code>BOOLEAN</code></td><td></td>
</tr>
<tr>
<td>

  ```json
{
    "type": "string"
}
```

</td>
<td><code>STRING</code></td><td></td>
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

</td>
<td>

`INT`

</td>
<td>

- `M` <= 2147483647
- `N` >= -2147483648

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

</td>
<td>

`BIGINT`

</td>
<td>

- `M` <= 9223372036854775807
- `N` >= -9223372036854775808

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

</td>
<td>

`DECIMAL(38,0)`

</td>
<td>

- `M` > 1e38-1
- `N` < -1e38

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

</td>
<td>

`DOUBLE`

</td>
<td>

- `M` < 1e38-1
- `N` > -1e38

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
<td></td>
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

</td>
<td>

`INT`

</td>
<td>

- `M` <= 2147483647
- `N` >= -2147483648
- `F` is integer

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

</td>
<td>

`BIGINT`

</td>
<td>

- `M` <= 9223372036854775807
- `N` >= -9223372036854775808
- `F` is integer

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

</td>
<td>

`DECIMAL(38,0)`

</td>
<td>

- `M` > 1e38-1
- `N` < -1e38
- `F` is integer

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

</td>
<td>

`DOUBLE`

</td>
<td>

- `M` < 1e38-1
- `N` > -1e38
- `F` is integer

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

</td>
<td>

`BIGINT`

</td>
<td>

`F` is integer

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

</td>
<td>

`DECIMAL(P,S)`

</td>
<td>

- `P` <= 38

Where `P` is maximum precision of `M` and `N`, adjusted for scale of `F`.

`P` = `MAX`(`M.precision` - `M.scale` + `F.scale`,  `N.precision` - `N.scale` + `F.scale`)

`S` = `F.scale`

For example, `M=10.9999, N=-10, F=0.1` will be `DECIMAL(3,1)`. Calculation as follows:

`M` is `DECIMAL(6,4)`, `N` is `DECIMAL(2,0)`, `F` is `DECIMAL(2,1)`

`P` = `MAX`(6 - 4 + 1, 2 + 1) = 3

`S` = 1
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

</td>
<td>

`DOUBLE`

</td>
<td>

-`P` > 38

Where `P` is maximum precision of `M` and `N`, adjusted for scale of `F`.

`P` = `MAX`(`M.precision` - `M.scale` + `F.scale`,  `N.precision` - `N.scale` + `F.scale`)

For example, `M=10.9999, N=-1e50, F=0.1` will be `DECIMAL(3,1)`. Calculation as follows:

`M` is `DECIMAL(6,4)`, `N` is `DECIMAL(2,0)`, `F` is `DECIMAL(2,1)`

`P` = `MAX`(6 - 4 + 1, 50 + 1) = 51
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

</td>
<td>

`DOUBLE`

</td>
<td>

- `M` < 1e38-1
- `N` > -1e38
- `F` is integer

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
<td></td>
</tr>
<tr>
<td >

```json
{
    "enum": [N1, I1, ...]
}
```
</td>
<td>

`INT`

</td>
<td>

- **`S` = 0**
- **All** `Nx` and `Ix` are of types number or integer.
- `M` < 2147483647

Where:
- `S` is maximum scale (number of digits after the `.`) in the enum list.
- `M` is maximum absolute value of the enum list.

</td>
</tr>
<tr>
<td >

```json
{
    "enum": [N1, I1, ...]
}
```
</td>
<td>

`BIGINT`

</td>
<td>

- **`S` = 0**
- **All** `Nx` and `Ix` are of types number or integer.
- `M` <= 9223372036854775807

Where:
- `S` is maximum scale (number of digits after the `.`) in the enum list.
- `M` is maximum absolute value of the enum list.

</td>
</tr>
<tr>
<td >

```json
{
    "enum": [N1, I1, ...]
}
```
</td>
<td>

`BIGINT`

</td>
<td>

- **`S` = 0**
- **All** `Nx` and `Ix` are of types number or integer.
- `M` <= 9223372036854775807

Where:
- `S` is maximum scale (number of digits after the `.`) in the enum list.
- `M` is maximum absolute value of the enum list.

</td>
</tr>
<tr>
<td >

```json
{
    "enum": [N1, I1, ...]
}
```
</td>
<td>

`DECIMAL(P,S)`

</td>
<td>

- `S` > 0
- **All** `Nx` and `Ix` are of types number or integer.
- `M` < 1e38

Where:
- `S` is maximum scale (number of digits after the `.`) in the enum list.
- `M` is maximum absolute value of the enum list.
- `P` is precision (total number of digits in `M`).

</td>
</tr>
<tr>
<td >

```json
{
    "enum": [S1, S2, ...]
}
```
</td>
<td>

`STRING`

</td>
<td>

**All** `Sx` are string

</td>
</tr>
<tr>
<td >

```json
{
    "enum": [A1, A2, ...]
}
```
</td>
<td>

`STRING`

</td>
<td>

- `Ax` are mix of different types.

*Values will be quoted.*



</td>
</tr>
</tbody>
</table>
</TabItem>
</Tabs>