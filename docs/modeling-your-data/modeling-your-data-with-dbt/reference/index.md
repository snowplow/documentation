---
title: "Reference"
sidebar_position: 9999
description: Reference information relating to dbt models and macros
---

:::info

The following pages are reference documents used mostly for developers and advanced users of the packages. 

Due to supporting multiple adaptors, as well as offering flexibility with source tables via variables, the generated data by dbt that is used as the source for this is sometimes incomplete. Most of note is for disabled models they do not generate model dependencies, which means for models used only in a particular warehouse implementation these links may be missing/incomplete - this issue mostly exists for redshift where additional tables are used.

For complete accuracy, always refer the code in the package itself and/or [build the docs locally](https://docs.getdbt.com/reference/commands/cmd-docs) for the warehouse you are working with.

:::

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
