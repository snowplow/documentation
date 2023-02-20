---
title: "Snowplow Web Macros"
description: Reference for snowplow_web dbt macros developed by Snowplow
sidebar_position: 20
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export function DbtDetails(props) {
return <div className="dbt"><details>{props.children}</details></div>
}
```

:::caution

This page is auto-generated from our dbt packages, some information may be incomplete

:::
## Snowplow Web
### Snowplow Web Delete From Manifest {#macro.snowplow_utils.snowplow_web_delete_from_manifest}

<DbtDetails><summary>
<code>macros/utils/snowplow_delete_from_manifest.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/snowplow_delete_from_manifest.sql">(source)</a></summary>

```jinja2
{% macro snowplow_web_delete_from_manifest(models) %}

  {{ snowplow_utils.snowplow_delete_from_manifest(models, ref('snowplow_web_incremental_manifest')) }}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</DbtDetails>

### Allow Refresh {#macro.snowplow_web.allow_refresh}

<DbtDetails><summary>
<code>macros/allow_refresh.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/allow_refresh.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro allow_refresh() %}
  {{ return(adapter.dispatch('allow_refresh', 'snowplow_web')()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__allow_refresh() %}
  
  {% set allow_refresh = snowplow_utils.get_value_by_target(
                                    dev_value=none,
                                    default_value=var('snowplow__allow_refresh'),
                                    dev_target_name=var('snowplow__dev_target_name')
                                    ) %}

  {{ return(allow_refresh) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_value_by_target](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_quarantined_sessions)
- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)
- [model.snowplow_web.snowplow_web_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_incremental_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Filter Bots {#macro.snowplow_web.filter_bots}

<DbtDetails><summary>
<code>macros/filter_bots.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/filter_bots.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro filter_bots() %}
  {{ return(adapter.dispatch('filter_bots', 'snowplow_web')()) }}
{%- endmacro -%}


```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__filter_bots() %}
  and not regexp_contains(ev.useragent, '(bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt)')
{% endmacro %}
```
</TabItem>
<TabItem value="databricks" label="databricks">

```jinja2
{% macro databricks__filter_bots() %}
  and not rlike(ev.useragent, '.*(bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt).*')
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__filter_bots() %}
  and ev.useragent not similar to '%(bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt)%'
{% endmacro %}
```
</TabItem>
<TabItem value="redshift" label="redshift">

```jinja2
{% macro redshift__filter_bots() %}
  and ev.useragent not similar to '%(bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt)%'
{% endmacro %}
```
</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__filter_bots() %}
  and not rlike(ev.useragent, '.*(bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt).*')
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_page_view_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_view_events)
- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Iab Fields {#macro.snowplow_web.iab_fields}

<DbtDetails><summary>
<code>macros/bigquery/page_view_contexts.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/bigquery/page_view_contexts.sql">(source)</a></summary>

```jinja2
{% macro iab_fields() %}
  
  {% set iab_fields = [
      {'field':'category', 'dtype':'string'},
      {'field':'primary_impact', 'dtype':'string'},
      {'field':'reason', 'dtype':'string'},
      {'field':'spider_or_robot', 'dtype':'boolean'}
    ] %}

  {{ return(iab_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Stitch User Identifiers {#macro.snowplow_web.stitch_user_identifiers}

<DbtDetails><summary>
<code>macros/stitch_user_identifiers.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/stitch_user_identifiers.sql">(source)</a></summary>

```jinja2
{% macro stitch_user_identifiers(enabled, relation=this, user_mapping_relation=ref('snowplow_web_user_mapping')) %}

  {% if enabled and target.type not in ['databricks', 'spark'] | as_bool() %}

    -- Update sessions table with mapping
    update {{ relation }} as s
    set stitched_user_id = um.user_id
    from {{ user_mapping_relation }} as um
    where s.domain_userid = um.domain_userid;

  {% elif enabled and target.type in ['databricks', 'spark']  | as_bool() %}

    -- Update sessions table with mapping
    merge into {{ relation }} as s
    using {{ user_mapping_relation }} as um
    on s.domain_userid = um.domain_userid
    when matched then 
      update set s.stitched_user_id = um.user_id;

  {% endif %}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Ua Fields {#macro.snowplow_web.ua_fields}

<DbtDetails><summary>
<code>macros/bigquery/page_view_contexts.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/bigquery/page_view_contexts.sql">(source)</a></summary>

```jinja2
{% macro ua_fields() %}
  
  {% set ua_fields = [
      {'field': 'useragent_family', 'dtype': 'string'},
      {'field': 'useragent_major', 'dtype': 'string'},
      {'field': 'useragent_minor', 'dtype': 'string'},
      {'field': 'useragent_patch', 'dtype': 'string'},
      {'field': 'useragent_version', 'dtype': 'string'},
      {'field': 'os_family', 'dtype': 'string'},
      {'field': 'os_major', 'dtype': 'string'},
      {'field': 'os_minor', 'dtype': 'string'},
      {'field': 'os_patch', 'dtype': 'string'},
      {'field': 'os_patch_minor', 'dtype': 'string'},
      {'field': 'os_version', 'dtype': 'string'},
      {'field': 'device_family', 'dtype': 'string'}
    ] %}

  {{ return(ua_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Web Cluster By Fields Consent {#macro.snowplow_web.web_cluster_by_fields_consent}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/cluster_by_fields.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro web_cluster_by_fields_consent() %}

  {{ return(adapter.dispatch('web_cluster_by_fields_consent', 'snowplow_web')()) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__web_cluster_by_fields_consent() %}

  {{ return(snowplow_utils.get_cluster_by(bigquery_cols=["event_id","domain_userid"], snowflake_cols=["to_date(load_tstamp)"])) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_consent_log](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_log)

</TabItem>
</Tabs>
</DbtDetails>

### Web Cluster By Fields Page Views {#macro.snowplow_web.web_cluster_by_fields_page_views}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/cluster_by_fields.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro web_cluster_by_fields_page_views() %}

  {{ return(adapter.dispatch('web_cluster_by_fields_page_views', 'snowplow_web')()) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__web_cluster_by_fields_page_views() %}

  {{ return(snowplow_utils.get_cluster_by(bigquery_cols=["domain_userid","domain_sessionid"], snowflake_cols=["to_date(start_tstamp)"])) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_page_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views)

</TabItem>
</Tabs>
</DbtDetails>

### Web Cluster By Fields Sessions {#macro.snowplow_web.web_cluster_by_fields_sessions}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/cluster_by_fields.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro web_cluster_by_fields_sessions() %}

  {{ return(adapter.dispatch('web_cluster_by_fields_sessions', 'snowplow_web')()) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__web_cluster_by_fields_sessions() %}

  {{ return(snowplow_utils.get_cluster_by(bigquery_cols=["domain_userid"], snowflake_cols=["to_date(start_tstamp)"])) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Web Cluster By Fields Sessions Lifecycle {#macro.snowplow_web.web_cluster_by_fields_sessions_lifecycle}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/cluster_by_fields.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro web_cluster_by_fields_sessions_lifecycle() %}

  {{ return(adapter.dispatch('web_cluster_by_fields_sessions_lifecycle', 'snowplow_web')()) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__web_cluster_by_fields_sessions_lifecycle() %}

  {{ return(snowplow_utils.get_cluster_by(bigquery_cols=["session_id"], snowflake_cols=["to_date(start_tstamp)"])) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Web Cluster By Fields Users {#macro.snowplow_web.web_cluster_by_fields_users}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/cluster_by_fields.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro web_cluster_by_fields_users() %}

  {{ return(adapter.dispatch('web_cluster_by_fields_users', 'snowplow_web')()) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__web_cluster_by_fields_users() %}

  {{ return(snowplow_utils.get_cluster_by(bigquery_cols=["user_id","domain_userid"], snowflake_cols=["to_date(start_tstamp)"])) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users)

</TabItem>
</Tabs>
</DbtDetails>

### Yauaa Fields {#macro.snowplow_web.yauaa_fields}

<DbtDetails><summary>
<code>macros/bigquery/page_view_contexts.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/bigquery/page_view_contexts.sql">(source)</a></summary>

```jinja2
{% macro yauaa_fields() %}
  
  {% set yauaa_fields = [
      {'field': 'device_class', 'dtype': 'string'},
      {'field': 'agent_class', 'dtype': 'string'},
      {'field': 'agent_name', 'dtype': 'string'},
      {'field': 'agent_name_version', 'dtype': 'string'},
      {'field': 'agent_name_version_major', 'dtype': 'string'},
      {'field': 'agent_version', 'dtype': 'string'},
      {'field': 'agent_version_major', 'dtype': 'string'},
      {'field': 'device_brand', 'dtype': 'string'},
      {'field': 'device_name', 'dtype': 'string'},
      {'field': 'device_version', 'dtype': 'string'},
      {'field': 'layout_engine_class', 'dtype': 'string'},
      {'field': 'layout_engine_name', 'dtype': 'string'},
      {'field': 'layout_engine_name_version', 'dtype': 'string'},
      {'field': 'layout_engine_name_version_major', 'dtype': 'string'},
      {'field': 'layout_engine_version', 'dtype': 'string'},
      {'field': 'layout_engine_version_major', 'dtype': 'string'},
      {'field': 'operating_system_class', 'dtype': 'string'},
      {'field': 'operating_system_name', 'dtype': 'string'},
      {'field': 'operating_system_name_version', 'dtype': 'string'},
      {'field': 'operating_system_version', 'dtype': 'string'}
    ] %}

  {{ return(yauaa_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)

</TabItem>
</Tabs>
</DbtDetails>

