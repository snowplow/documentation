---
title: "Overridable macros in dbt package mechanics"
sidebar_label: "Overridable macros"
sidebar_position: 20
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Many of our packages are built using [macros](https://docs.getdbt.com/docs/build/jinja-macros) to allow easier support of multiple warehouses. Some of these macros are designed to be overridable to give an easy route to customization for the user. You can find a list of the overridable macros for each package in the [package details](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/index.md) pages.

The easiest way to to override any given macro is to create a `default__` version within your dbt project, for example, to change the `filter_bots` macro in the `unified` package you would have:

```jinja2 title="your_dbt_project/macros/filter_bots.sql"
{% macro default__filter_bots(table_alias = none) %}
    and {% if table_alias %}{{table_alias~'.'}}{% endif %}useragent not similar to '%(YOUR_CUSTOM_PATTERN|bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt)%'
{% endmacro %}
```

:::tip

Make sure to check the source code for the macro to understand what arguments are required and make sure you start from the version applicable to your warehouse.

:::
