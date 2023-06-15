---
title: "Databricks"
sidebar_position: 1
---

# Databricks

## Naming resources in Databricks

:::caution

We advise to use the default resource names in the setup script provided in Console. If you need to follow your own naming convention however, please follow the guidelines below and provide Snowplow with the resource names you used through the Databricks setup in BDP Console.

:::

### `HTTP path`

[Databricks compute resources URL](https://docs.databricks.com/integrations/jdbc-odbc-bi.html#building-the-connection-url-for-the-databricks-driver).

For more details, see [Configure the Databricks JDBC drivers](https://docs.databricks.com/integrations/jdbc-odbc-bi.html).

### `Schema name`

Default name: `snowplow`

[Specifies the identifier for the schema](https://docs.databricks.com/sql/language-manual/sql-ref-names.html#schema-name); must be unique for the database in which the schema is created.

The schema identifier needs to follow these rules:
- begin with a letter, number or underscore character
- subsequent characters can be alphanumeric characters, underscores, or dollar signs

For more details, see [Identifier Requirements](https://docs.databricks.com/sql/language-manual/sql-ref-identifiers.html).