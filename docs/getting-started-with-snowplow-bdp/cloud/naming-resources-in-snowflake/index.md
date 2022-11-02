---
title: "Naming resources in Snowflake"
sidebar_position: 2
---

# Naming resources in Snowflake

:::caution

We advise to use the default resource names in the setup script provided in Console. If you need to follow your own naming convention however, please follow the guidelines below and provide Snowplow with the resource names you used through the Snowflake setup in BDP Console.

:::

### `warehouse_for_loading`

Default name: `SNOWPLOW_WAREHOUSE`

[Identifier for the virtual warehouse](https://docs.snowflake.com/en/sql-reference/sql/create-warehouse.html); must be unique for your account.

In addition, the identifier must start with an alphabetic character and cannot contain spaces or special characters unless the entire identifier string is enclosed in double quotes (e.g. "My object"). Identifiers enclosed in double quotes are also case-sensitive.

For more details, see [Identifier Requirements](https://docs.snowflake.com/en/sql-reference/identifiers-syntax.html).

### `snowflake_database`

Default name: `SNOWPLOW`

[Specifies the identifier for the database](https://docs.snowflake.com/en/sql-reference/sql/create-database.html); must be unique for your account.

In addition, the identifier must start with an alphabetic character and cannot contain spaces or special characters unless the entire identifier string is enclosed in double quotes (e.g. "My object"). Identifiers enclosed in double quotes are also case-sensitive.

For more details, see [Identifier Requirements](https://docs.snowflake.com/en/sql-reference/identifiers-syntax.html).

### `snowflake_schema`

Default name: `ATOMIC`

[Specifies the identifier for the schema](https://docs.snowflake.com/en/sql-reference/sql/create-schema.html); must be unique for the database in which the schema is created.

In addition, the identifier must start with an alphabetic character and cannot contain spaces or special characters unless the entire identifier string is enclosed in double quotes (e.g. "My object"). Identifiers enclosed in double quotes are also case-sensitive.

For more details, see [Identifier Requirements](https://docs.snowflake.com/en/sql-reference/identifiers-syntax.html).

### `loader_role_name`

Default name: `SNOWPLOW_LOADER_ROLE`

[Identifier for the role](https://docs.snowflake.com/en/sql-reference/sql/create-role.html); must be unique for your account.

The identifier must start with an alphabetic character and cannot contain spaces or special characters unless the entire identifier string is enclosed in double quotes (e.g. "My object"). Identifiers enclosed in double quotes are also case-sensitive.

For more details, see [Identifier Requirements](https://docs.snowflake.com/en/sql-reference/identifiers-syntax.html).

### `loader_user`

Default name: `SNOWPLOW_LOADER_USER`

[Identifier for the user](https://docs.snowflake.com/en/sql-reference/sql/create-user.html); must be unique for your account.

The identifier must start with an alphabetic character and cannot contain spaces or special characters unless the entire identifier string is enclosed in double quotes (e.g. "My object"). Identifiers enclosed in double quotes are also case-sensitive.

For more details, see [Identifier Requirements](https://docs.snowflake.com/en/sql-reference/identifiers-syntax.html).