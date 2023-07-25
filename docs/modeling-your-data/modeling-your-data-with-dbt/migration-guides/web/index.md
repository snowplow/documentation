---
title: "Web"
sidebar_position: 101
---

### Upgrading to 0.15.1

For existing Snowflake and Databricks Core Web Vitals optional module users the derived table `snowplow_web_vitals` needs to be altered due to column data type change. Please run the below queries to migrate.
The other option is to do a [complete refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#complete-refresh-of-snowplow-package) of the package.

<details>
  <summary>SQL scripts</summary>
<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="snowflake" default>

```sql
create table (your_schema)_derived.snowplow_web_vitals_new
(

    event_id               STRING,
    event_name             STRING,
    app_id                 STRING,
    platform               STRING,
    domain_userid          STRING,
    user_id                STRING,
    page_view_id           STRING,
    domain_sessionid       STRING,
    collector_tstamp       TIMESTAMP,
    derived_tstamp         TIMESTAMP,
    load_tstamp            TIMESTAMP,
    geo_country            STRING,
    page_url               STRING,
    url_group              STRING,
    page_title             STRING,
    useragent              STRING,
    device_class           STRING,
    device_name            STRING,
    agent_name             STRING,
    agent_version          STRING,
    operating_system_name  STRING,
    lcp                    DECIMAL(14, 4),
    fcp                    DECIMAL(14, 4),
    fid                    DECIMAL(14, 4),
    cls                    DECIMAL(14, 4),
    inp                    DECIMAL(14, 4),
    ttfb                   DECIMAL(14, 4),
    navigation_type        STRING,
    dedupe_index           INT,
    lcp_result             STRING,
    fid_result             STRING,
    cls_result             STRING,
    ttfb_result            STRING,
    inp_result             STRING

);

insert into (your_schema)_derived.snowplow_web_vitals_new  select * from (your_schema)_derived.snowplow_web_vitals;
drop table (your_schema)_derived.snowplow_web_vitals;
alter table (your_schema)_derived.snowplow_web_vitals_new rename to (your_schema)_derived.snowplow_web_vitals;
```

</TabItem>
<TabItem value="databricks" label="databricks">

```sql
create table (your_schema)_derived.snowplow_web_vitals_new
(

    event_id               STRING,
    event_name             STRING,
    app_id                 STRING,
    platform               STRING,
    domain_userid          STRING,
    user_id                STRING,
    page_view_id           STRING,
    domain_sessionid       STRING,
    collector_tstamp       TIMESTAMP,
    derived_tstamp         TIMESTAMP,
    load_tstamp            TIMESTAMP,
    geo_country            STRING,
    page_url               STRING,
    url_group              STRING,
    page_title             STRING,
    useragent              STRING,
    device_class           STRING,
    device_name            STRING,
    agent_name             STRING,
    agent_version          STRING,
    operating_system_name  STRING,
    lcp                    DECIMAL(14, 4),
    fcp                    DECIMAL(14, 4),
    fid                    DECIMAL(14, 4),
    cls                    DECIMAL(14, 4),
    inp                    DECIMAL(14, 4),
    ttfb                   DECIMAL(14, 4),
    navigation_type        STRING,
    dedupe_index           INT,
    lcp_result             STRING,
    fid_result             STRING,
    cls_result             STRING,
    ttfb_result            STRING,
    inp_result             STRING

);

insert into (your_schema)_derived.snowplow_web_vitals_new  select * from (your_schema)_derived.snowplow_web_vitals;
drop table (your_schema)_derived.snowplow_web_vitals;
create table (your_schema)_derived.snowplow_web_vitals select * from (your_schema)_derived.snowplow_web_vitals_new;
drop table (your_schema)_derived.snowplow_web_vitals_new;

```
</TabItem>
</Tabs>
</details>


### Upgrading to 0.14.0

- Consent enablement is now done via the `snowplow__enable_consent` variable instead of via the enable block. If you are using consent please set this variable to `true`
- Some seed files are now required to run the package, please run `dbt seed --select snowplow_web --full-refresh` to load these. The schema they are loaded to can be changed in your `dbt_project.yml`
- New columns will be auto-added to users, sessions, and page views tables, please be aware for any downstream queries/BI tools.

### Upgrading to 0.14.0

- Version 1.4.0 of `dbt-core` now required
- You must add the following to the top level of your project yaml
    ```yml
    # dbt_project.yml
    ...
    dispatch:
      - macro_namespace: dbt
        search_order: ['snowplow_utils', 'dbt']
    ```
- Other changes required by [snowplow-utils version 0.14.0](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/utils/index.md#upgrading-to-0140)

- **Redshift/Postgres users**: The deduplication logic has changed as a result of which any downstream joins on context and custom event tables will have to be deduped. Previously duplicate events were removed right in the base module to avoid any complications but this meant that the data could have been incomplete unlike in case of other data warehouses. These events will now arrive complete and deduped but they will likely have duplicate counterparts in their respective context tables as well, hence the warning.

    In case you have any custom models, please check them and make sure that deduplication logic is applied on them when they are joined to the main events table. We have provided a macro - `get_sde_or_context()` - for you to use for this purpose in the latest v0.14.0 snowplow-utils package. Check out the [package documentation](https://snowplow.github.io/dbt-snowplow-utils/#!/overview/snowplow_utils) on how to use it.

### Upgrading to 0.13.0
- RDB Loader 4.0.0 or BigQuery Loader 1.0.0. If using postgres loader or older versions set `snowplow__enable_load_tstamp` to `false` in your project yaml and you will not be able to use the consent models.


### Upgrading to 0.12.0
- Version 1.3.0 of `dbt-core` now required
