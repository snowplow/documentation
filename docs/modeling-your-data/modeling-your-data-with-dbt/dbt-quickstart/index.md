---
title: "Quick Start"
date: "2022-10-05"
sidebar_position: 200
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The quickstart instructions for each package can be found on their indivi

## Installation

Check [dbt Hub](https://hub.getdbt.com/snowplow/snowplow_web/latest/) for the latest installation instructions, or read the [dbt docs](https://docs.getdbt.com/docs/building-a-dbt-project/package-management) for more information on installing packages. If you are using multiple packages you may need to up/downgrade a specific package to ensure compatibility, especially when using the web and media player packages together.

:::caution

When using multiple dbt packages you must be careful to specify which scope a variable or configuration is defined within. In general, always specify each value in your `dbt_project.yml` nested under the specific package e.g.

```yml
# dbt_project.yml
...
vars:
  snowplow_web:
    snowplow__atomic_schema: schema_with_snowplow_web_events
  snowplow_mobile:
    snowplow__atomic_schema: schema_with_snowplow_mobile_events
```

You can read more about variable scoping in dbt's docs around [variable precedence](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/using-variables#variable-precedence).

:::
