---
title: "Redshift"
sidebar_position: 2
---

# Redshift

## Naming resources in Redshift

:::caution

We advise to use the default resource names in the setup script provided in Console. If you need to follow your own naming convention however, please follow the guidelines below and provide Snowplow with the resource names you used through the Redshift setup in BDP Console.

:::

### `Loader user`

Default name: `SNOWPLOW_LOADER_USER`

[Identifier for the loader user](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_USER.html); must be unique for your account.  

The user name is a standard SQL identifier and it must:
- begin with an alphabetic character or underscore character, or a UTF-8 multibyte character two to four bytes long
- subsequent characters can be alphanumeric characters, underscores, or dollar signs, or UTF-8 multibyte characters two to four bytes long
- be between 1 and 127 bytes in length, not including quotation marks for delimited identifiers
- contain no quotation marks and no spaces
- not be a reserved SQL key word
- not be `PUBLIC`

For more details, see [Identifier Requirements](https://docs.aws.amazon.com/redshift/latest/dg/r_names.html).

### `Schema`

Default name: `atomic`

[Specifies the identifier for the schema](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_SCHEMA.html); must be unique for the database in which the schema is created.

The schema identifier is a standard SQL identifier and it must:
- begin with an alphabetic character or underscore character, or a UTF-8 multibyte character two to four bytes long
- subsequent characters can be alphanumeric characters, underscores, or dollar signs, or UTF-8 multibyte characters two to four bytes long
- be between 1 and 127 bytes in length, not including quotation marks for delimited identifiers
- contain no quotation marks and no spaces
- not be a reserved SQL key word
- not be `PUBLIC`

For more details, see [Identifier Requirements](https://docs.aws.amazon.com/redshift/latest/dg/r_names.html).