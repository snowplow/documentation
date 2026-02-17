There are two kinds of schema changes:
- **Non-breaking** - a non-breaking change is backward compatible with historical data and increments the `patch` number i.e. `1-0-0` -> `1-0-1`, or the middle digit i.e. `1-0-0` -> `1-1-0`.
- **Breaking** - a breaking change is not backwards compatible with historical data and increments the `model` number i.e. `1-0-0` -> `2-0-0`.

Different data warehouses handle schema evolution slightly differently. Use the table below as a guide for incrementing the schema version appropriately.

|                                              | Redshift     | Snowflake, BigQuery, Databricks |
| -------------------------------------------- | ------------ | ------------------------------- |
| **Add / remove / rename an optional field**  | Non-breaking | Non-breaking                    |
| **Add / remove / rename a required field**   | Breaking     | Breaking                        |
| **Change a field from optional to required** | Breaking     | Breaking                        |
| **Change a field from required to optional** | Breaking     | Non-breaking                    |
| **Change the type of an existing field**     | Breaking     | Breaking                        |
| **Change the size of an existing field**     | Non-breaking | Non-breaking                    |

:::warning Size changes

In Redshift and Databricks, changing _size_ may also mean _type_ change. For example, changing the `maximum` integer from `30000` to `100000`. See our documentation on [how schemas translate to database types](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md).

:::
