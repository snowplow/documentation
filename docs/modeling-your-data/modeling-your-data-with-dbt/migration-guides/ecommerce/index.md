---
title: "Migration guide for Ecommerce"
sidebar_label: "Ecommerce"
sidebar_position: 30
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

### Upgrading to 0.6.0

Note the minimum `dbt-core` version now required is 1.5.0

Most upgrades and new features should be available automatically after the first run of the new version of the package, however there are a few breaking changes to manage before this first run. To enable any other new optional features or make use of the new configuration options, please see the [configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/ecommerce/index.mdx) page.


Both the quarantined sessions and the sessions lifecycle table have has a column renamed, please run the below statements to rename this column in your warehouse if not doing a full-refresh of the package.
```sql
alter table <your_schema>_snowplow_manifest.snowplow_ecommerce_base_sessions_lifecycle_manifest rename column session_id to session_identifier;
alter table <your_schema>_snowplow_manifest.snowplow_ecommerce_base_quarantined_sessions rename column session_id to session_identifier;
```


### Upgrading to 0.5.0

**This version requires a full refresh run if you have been using any previous versions.** You will not be able to upgrade and have the package work without doing a full refresh.

To enable modeling mobile events, set `snowplow__enable_mobile_events` to `true`.

### Upgrading to 0.4.2

Two of the derived tables need to be altered for existing Snowflake, Databricks or Redshift users. Please modify the below script to fit your schemas and apply them before running the upgraded package.

The other option is to do a [complete refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/full-or-partial-refreshes/index.md#complete-refresh-of-snowplow-package) of the package.

<details>
  <summary>SQL scripts</summary>
<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="snowflake" default>

```sql
alter table (your_schema)_derived.snowplow_ecommerce_cart_interactions alter column cart_total_value type decimal(9,2);
alter table (your_schema)_derived.snowplow_ecommerce_transaction_interactions alter column transaction_revenue type decimal(9,2), transaction_discount_amount type decimal(9,2), transaction_shipping type decimal(9,2), transaction_tax type decimal(9,2);
```

</TabItem>
<TabItem value="databricks" label="databricks">

```sql
create table (your_schema)_derived.snowplow_ecommerce_cart_interactions_new
(
    event_id               STRING,
    page_view_id           STRING,
    domain_sessionid       STRING,
    event_in_session_index INT,
    domain_userid          STRING,
    network_userid         STRING,
    user_id                STRING,
    ecommerce_user_id      STRING,
    derived_tstamp         TIMESTAMP,
    derived_tstamp_date    DATE,
    cart_id                STRING,
    cart_currency          STRING,
    cart_total_value       DECIMAL(9, 2),
    cart_created           BOOLEAN,
    cart_emptied           BOOLEAN,
    cart_transacted        BOOLEAN,
    ecommerce_action_type  STRING
);

insert into (your_schema)_derived.snowplow_ecommerce_cart_interactions_new  select * from (your_schema)_derived.snowplow_ecommerce_cart_interactions;
drop table (your_schema)_derived.snowplow_ecommerce_cart_interactions;
create table (your_schema)_derived.snowplow_ecommerce_cart_interactions select * from (your_schema)_derived.snowplow_ecommerce_cart_interactions_new;
drop table (your_schema)_derived.snowplow_ecommerce_cart_interactions_new;

create table (your_schema)_derived.snowplow_ecommerce_transaction_interactions_new
(
    event_id                    STRING,
    page_view_id                STRING,
    domain_sessionid            STRING,
    event_in_session_index      INT,
    domain_userid               STRING,
    network_userid              STRING,
    user_id                     STRING,
    ecommerce_user_id           STRING,
    derived_tstamp              TIMESTAMP,
    derived_tstamp_date         DATE,
    transaction_id              STRING,
    transaction_currency        STRING,
    transaction_payment_method  STRING,
    transaction_revenue         DECIMAL(9, 2),
    transaction_total_quantity  INT,
    transaction_credit_order    BOOLEAN,
    transaction_discount_amount DECIMAL(9, 2),
    transaction_discount_code   STRING,
    transaction_shipping        DECIMAL(9, 2),
    transaction_tax             DECIMAL(9, 2),
    ecommerce_user_email        STRING,
    ecommerce_user_is_guest     BOOLEAN,
    number_products             BIGINT
);

insert into (your_schema)_derived.snowplow_ecommerce_transaction_interactions_new    select * from (your_schema)_derived.snowplow_ecommerce_transaction_interactions;
drop table (your_schema)_derived.snowplow_ecommerce_transaction_interactions;
create table (your_schema)_derived.snowplow_ecommerce_transaction_interactions select * from (your_schema)_derived.snowplow_ecommerce_transaction_interactions_new ;
drop table (your_schema)_derived.snowplow_ecommerce_transaction_interactions_new;

```

</TabItem>
<TabItem value="redshift" label="redshift" default>

```sql
create table (your_schema)_derived.snowplow_ecommerce_cart_interactions_new
(
    event_id CHAR(36)   ENCODE lzo
    ,page_view_id VARCHAR(4096)   ENCODE lzo
    ,domain_sessionid CHAR(128)   ENCODE lzo
    ,event_in_session_index BIGINT   ENCODE az64
    ,domain_userid VARCHAR(128)   ENCODE lzo
    ,network_userid VARCHAR(128)   ENCODE lzo
    ,user_id VARCHAR(255)   ENCODE lzo
    ,ecommerce_user_id VARCHAR(128)   ENCODE lzo
    ,derived_tstamp TIMESTAMP WITHOUT TIME ZONE   ENCODE az64
    ,derived_tstamp_date DATE   ENCODE az64
    ,cart_id VARCHAR(4096)   ENCODE lzo
    ,cart_currency CHAR(3)   ENCODE lzo
    ,cart_total_value NUMERIC(9,2)   ENCODE az64
    ,cart_created BOOLEAN   ENCODE RAW
    ,cart_emptied BOOLEAN   ENCODE RAW
    ,cart_transacted BOOLEAN   ENCODE RAW
    ,ecommerce_action_type VARCHAR(16)   ENCODE lzo
)

insert into (your_schema)_derived.snowplow_ecommerce_cart_interactions_new  select * from (your_schema)_derived.snowplow_ecommerce_cart_interactions;
drop table (your_schema)_derived.snowplow_ecommerce_cart_interactions;
alter table (your_schema)_derived.snowplow_ecommerce_cart_interactions_new
rename to snowplow_ecommerce_cart_interactions;

create table (your_schema)_derived.snowplow_ecommerce_transaction_interactions_new
(
    event_id CHAR(36)   ENCODE lzo
    ,page_view_id VARCHAR(4096)   ENCODE lzo
    ,domain_sessionid CHAR(128)   ENCODE lzo
    ,event_in_session_index BIGINT   ENCODE az64
    ,domain_userid VARCHAR(128)   ENCODE lzo
    ,network_userid VARCHAR(128)   ENCODE lzo
    ,user_id VARCHAR(255)   ENCODE lzo
    ,ecommerce_user_id VARCHAR(128)   ENCODE lzo
    ,derived_tstamp TIMESTAMP WITHOUT TIME ZONE   ENCODE az64
    ,derived_tstamp_date DATE   ENCODE az64
    ,transaction_id VARCHAR(4096)   ENCODE lzo
    ,transaction_currency CHAR(3)   ENCODE lzo
    ,transaction_payment_method VARCHAR(128)   ENCODE lzo
    ,transaction_revenue NUMERIC(9,2)   ENCODE az64
    ,transaction_total_quantity INTEGER   ENCODE az64
    ,transaction_credit_order BOOLEAN   ENCODE RAW
    ,transaction_discount_amount NUMERIC(9,2)   ENCODE az64
    ,transaction_discount_code VARCHAR(99)   ENCODE lzo
    ,transaction_shipping NUMERIC(9,2)   ENCODE az64
    ,transaction_tax NUMERIC(9,2)   ENCODE az64
    ,ecommerce_user_email VARCHAR(256)   ENCODE lzo
    ,ecommerce_user_is_guest BOOLEAN   ENCODE RAW
    ,number_products BIGINT   ENCODE az64
)

insert into (your_schema)_derived.snowplow_ecommerce_transaction_interactions_new    select * from (your_schema)_derived.snowplow_ecommerce_transaction_interactions;
drop table (your_schema)_derived.snowplow_ecommerce_transaction_interactions;
alter table (your_schema)_derived.snowplow_ecommerce_transaction_interactions_new rename to snowplow_ecommerce_transaction_interactions;
```

</TabItem>
</Tabs>
</details>



### Upgrading to 0.4.0
- Version 1.4.0 of `dbt-core` now required
- You must add the following to the top level of your project yaml
    ```yml title="dbt_project.yml"
    dispatch:
      - macro_namespace: dbt
        search_order: ['snowplow_utils', 'dbt']
    ```
- Other changes required by [snowplow-utils version 0.14.0](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/utils/index.md#upgrading-to-0140)

### Upgrading to 0.3.0
- Version 1.3.0 of `dbt-core` now required
