---
title: "Advanced Operation"
date: "2022-10-05"
sidebar_position: 999
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Asynchronous Runs

You may wish to run the modules asynchronously, for instance run the screen views module hourly but the sessions and users modules daily. You would assume this could be achieved using e.g.:

```bash
dbt run --select +snowplow_mobile.screen_views
```

Currently however it is not possible during a dbt jobs start phase to deduce exactly what models are due to be executed from such a command. This means the package is unable to select the subset of models from the manifest. Instead all models from the standard and custom modules are selected from the manifest and the package will attempt to synchronize all models. This makes the above command unsuitable for asynchronous runs.

However we can leverage dbt's `ls` command in conjunction with shell substitution to explicitly state what models to run, allowing a subset of models to be selected from the manifest and thus run independently.

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

To run just the page views module asynchronously:

```bash
dbt run --select +snowplow_web.page_views --vars "{'models_to_run': '$(dbt ls --m  +snowplow_web.page_views --output name)'}"
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

To run just the screen views module asynchronously:

```bash
dbt run --select +snowplow_mobile.screen_views --vars "{'models_to_run': '$(dbt ls --m  +snowplow_mobile.screen_views --output name)'}"
```

</TabItem>
</Tabs>


## Cluster Keys

All the incremental models in the Snowplow packages have recommended cluster keys applied to them. Depending on your specific use case, you may want to change or disable these all together. This can be achieved by overriding the following macros with your own version within your project:

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

- `web_cluster_by_fields_sessions_lifecycle()`
- `web_cluster_by_fields_page_views()`
- `web_cluster_by_fields_sessions()`
- `web_cluster_by_fields_users()`


</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

- `mobile_cluster_by_fields_sessions_lifecycle()`
- `mobile_cluster_by_fields_screen_views()`
- `mobile_cluster_by_fields_sessions()`
- `mobile_cluster_by_fields_users()`

</TabItem>

</Tabs>

## Overriding Macros

The cluster key macros (see above), the `allow_refresh()` and the `filter_bots` macro can be overridden. These are all [dispatched macros](https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch) and can be overridden by creating your own version of the macro and setting a project level dispatch config. More details can be found in [dbt's docs](https://docs.getdbt.com/reference/dbt-jinja-functions/dispatch#overriding-package-macros)

``` yaml
# Your_dbt_project/macros/filter_bots.sql
{% macro default__filter_bots() %}
and ev.useragent not similar to '%(YOUR_CUSTOM_PATTERN|bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt)%'
{% endmacro %}
```


