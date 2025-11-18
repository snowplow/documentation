---
title: "Migration Guide for Legacy Web Data Model"
sidebar_position: 900
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

### Upgrading to 0.16.0

Note the minimum `dbt-core` version now required is 1.5.0

Most upgrades and new features should be available automatically after the first run of the new version of the package, however there are a few breaking changes to manage before this first run. To enable any other new optional features or make use of the new configuration options, please see the [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/legacy/web/index.mdx) page.

1. The seed files have been prefixed with `snowplow_web_` so you will need to re-run `dbt seed` if this is not part of your standard workflow (note this will not drop the existing tables)
2. Both the quarantined sessions and the sessions lifecycle table have has column(s) renamed, please run the below statements to rename this column in your warehouse if not doing a full-refresh of the package.
    ```sql
    alter table <your_schema>_snowplow_manifest.snowplow_web_base_sessions_lifecycle_manifest rename column session_id to session_identifier;
    alter table <your_schema>_snowplow_manifest.snowplow_web_base_quarantined_sessions rename column session_id to session_identifier;
    alter table <your_schema>_snowplow_manifest.snowplow_web_base_sessions_lifecycle_manifest rename column domain_userid to user_identifier;
    ```
3. For Redshift/Postgres users, the context variables are now just the table name, no need for the complicated `source` function if you had overwritten these previously.

### Upgrading to 0.15.1

For existing Snowflake and Databricks Core Web Vitals optional module users the derived table `snowplow_web_vitals` needs to be altered due to column data type change. Please run the below queries to migrate.
The other option is to do a [complete refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/full-or-partial-refreshes/index.md#complete-refresh-of-snowplow-package) of the package.

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

### Upgrading to 0.15.0

Some of the new fields that are added will contain nulls for existing records. To avoid failing out of the box tests please update your profiles.yml to disable those tests:

```yml
# dbt_project.yml
...

tests:
  snowplow_web:
    sessions:
      not_null_snowplow_web_sessions_is_engaged:
        +enabled: false
      not_null_snowplow_web_sessions_total_events:
        +enabled: false
```

- Consent enablement is now done via the `snowplow__enable_consent` variable instead of via the enable block. If you are using consent please set this variable to `true`
- Some seed files are now required to run the package, please run `dbt seed --select snowplow_web --full-refresh` to load these. The schema they are loaded to can be changed in your `dbt_project.yml`
- New columns will be auto-added to users, sessions, and page views tables, please be aware for any downstream queries/BI tools.

### Upgrading to 0.14.0

- Version 1.4.0 of `dbt-core` now required
- You must add the following to the top level of your project yaml
    ```yml title="dbt_project.yml"
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
