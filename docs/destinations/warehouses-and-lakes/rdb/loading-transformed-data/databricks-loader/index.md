---
title: "Databricks loader"
date: "2022-05-27"
sidebar_position: 300
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Setting up Databricks

The following resources need to be created:

- [Databricks cluster](https://docs.databricks.com/clusters/create-cluster.html)
- [Databricks access token](https://docs.databricks.com/dev-tools/api/latest/authentication.html)

Also, `events` table needs to be created before starting the application for the first time:

<details>
  <summary>Statement for creating events table</summary>
  <CodeBlock language="sql">{
`CREATE TABLE IF NOT EXISTS snowplow.events (
  -- App
  app_id                      VARCHAR(255),
  platform                    VARCHAR(255),
  -- Date/time
  etl_tstamp                  TIMESTAMP,
  collector_tstamp            TIMESTAMP       NOT NULL,
  dvce_created_tstamp         TIMESTAMP,
  -- Event
  event                       VARCHAR(128),
  event_id                    VARCHAR(36)     NOT NULL,
  txn_id                      INTEGER,
  -- Namespacing and versioning
  name_tracker                VARCHAR(128),
  v_tracker                   VARCHAR(100),
  v_collector                 VARCHAR(100)    NOT NULL,
  v_etl                       VARCHAR(100)    NOT NULL,
  -- User and visit
  user_id                     VARCHAR(255),
  user_ipaddress              VARCHAR(128),
  user_fingerprint            VARCHAR(128),
  domain_userid               VARCHAR(128),
  domain_sessionidx           SMALLINT,
  network_userid              VARCHAR(128),
  -- Location
  geo_country                 VARCHAR(2),
  geo_region                  VARCHAR(3),
  geo_city                    VARCHAR(75),
  geo_zipcode                 VARCHAR(15),
  geo_latitude                DOUBLE,
  geo_longitude               DOUBLE,
  geo_region_name             VARCHAR(100),
  -- IP lookups
  ip_isp                      VARCHAR(100),
  ip_organization             VARCHAR(128),
  ip_domain                   VARCHAR(128),
  ip_netspeed                 VARCHAR(100),
  -- Page
  page_url                    VARCHAR(4096),
  page_title                  VARCHAR(2000),
  page_referrer               VARCHAR(4096),
  -- Page URL components
  page_urlscheme              VARCHAR(16),
  page_urlhost                VARCHAR(255),
  page_urlport                INTEGER,
  page_urlpath                VARCHAR(3000),
  page_urlquery               VARCHAR(6000),
  page_urlfragment            VARCHAR(3000),
  -- Referrer URL components
  refr_urlscheme              VARCHAR(16),
  refr_urlhost                VARCHAR(255),
  refr_urlport                INTEGER,
  refr_urlpath                VARCHAR(6000),
  refr_urlquery               VARCHAR(6000),
  refr_urlfragment            VARCHAR(3000),
  -- Referrer details
  refr_medium                 VARCHAR(25),
  refr_source                 VARCHAR(50),
  refr_term                   VARCHAR(255),
  -- Marketing
  mkt_medium                  VARCHAR(255),
  mkt_source                  VARCHAR(255),
  mkt_term                    VARCHAR(255),
  mkt_content                 VARCHAR(500),
  mkt_campaign                VARCHAR(255),
  -- Custom structured event
  se_category                 VARCHAR(1000),
  se_action                   VARCHAR(1000),
  se_label                    VARCHAR(4096),
  se_property                 VARCHAR(1000),
  se_value                    DOUBLE,
  -- Ecommerce
  tr_orderid                  VARCHAR(255),
  tr_affiliation              VARCHAR(255),
  tr_total                    DECIMAL(18,2),
  tr_tax                      DECIMAL(18,2),
  tr_shipping                 DECIMAL(18,2),
  tr_city                     VARCHAR(255),
  tr_state                    VARCHAR(255),
  tr_country                  VARCHAR(255),
  ti_orderid                  VARCHAR(255),
  ti_sku                      VARCHAR(255),
  ti_name                     VARCHAR(255),
  ti_category                 VARCHAR(255),
  ti_price                    DECIMAL(18,2),
  ti_quantity                 INTEGER,
  -- Page ping
  pp_xoffset_min              INTEGER,
  pp_xoffset_max              INTEGER,
  pp_yoffset_min              INTEGER,
  pp_yoffset_max              INTEGER,
  -- User Agent
  useragent                   VARCHAR(1000),
  -- Browser
  br_name                     VARCHAR(50),
  br_family                   VARCHAR(50),
  br_version                  VARCHAR(50),
  br_type                     VARCHAR(50),
  br_renderengine             VARCHAR(50),
  br_lang                     VARCHAR(255),
  br_features_pdf             BOOLEAN,
  br_features_flash           BOOLEAN,
  br_features_java            BOOLEAN,
  br_features_director        BOOLEAN,
  br_features_quicktime       BOOLEAN,
  br_features_realplayer      BOOLEAN,
  br_features_windowsmedia    BOOLEAN,
  br_features_gears           BOOLEAN,
  br_features_silverlight     BOOLEAN,
  br_cookies                  BOOLEAN,
  br_colordepth               VARCHAR(12),
  br_viewwidth                INTEGER,
  br_viewheight               INTEGER,
  -- Operating System
  os_name                     VARCHAR(50),
  os_family                   VARCHAR(50),
  os_manufacturer             VARCHAR(50),
  os_timezone                 VARCHAR(255),
  -- Device/Hardware
  dvce_type                   VARCHAR(50),
  dvce_ismobile               BOOLEAN,
  dvce_screenwidth            INTEGER,
  dvce_screenheight           INTEGER,
  -- Document
  doc_charset                 VARCHAR(128),
  doc_width                   INTEGER,
  doc_height                  INTEGER,
  -- Currency
  tr_currency                 VARCHAR(3),
  tr_total_base               DECIMAL(18, 2),
  tr_tax_base                 DECIMAL(18, 2),
  tr_shipping_base            DECIMAL(18, 2),
  ti_currency                 VARCHAR(3),
  ti_price_base               DECIMAL(18, 2),
  base_currency               VARCHAR(3),
  -- Geolocation
  geo_timezone                VARCHAR(64),
  -- Click ID
  mkt_clickid                 VARCHAR(128),
  mkt_network                 VARCHAR(64),
  -- ETL tags
  etl_tags                    VARCHAR(500),
  -- Time event was sent
  dvce_sent_tstamp            TIMESTAMP,
  -- Referer
  refr_domain_userid          VARCHAR(128),
  refr_dvce_tstamp            TIMESTAMP,
  -- Session ID
  domain_sessionid            VARCHAR(128),
  -- Derived timestamp
  derived_tstamp              TIMESTAMP,
  -- Event schema
  event_vendor                VARCHAR(1000),
  event_name                  VARCHAR(1000),
  event_format                VARCHAR(128),
  event_version               VARCHAR(128),
  -- Event fingerprint
  event_fingerprint           VARCHAR(128),
  -- True timestamp
  true_tstamp                 TIMESTAMP,
  -- Collector timestamp date for partitioning
  collector_tstamp_date       DATE GENERATED ALWAYS AS (DATE(collector_tstamp))
)
PARTITIONED BY (collector_tstamp_date, event_name);
`}</CodeBlock>
</details>


### Minimal Security Configuration (_optional_)

The security principal used by loader needs `Databricks SQL access` permission which can be enabled in the _Admin Console_.

Databricks does not have table access enabled by default. Enable it with the 
init script:
<details>
  <summary>Init script creation in scala notebook</summary>
  <CodeBlock language="scala">{
`
dbutils.fs.put("dbfs:/databricks/init/set_spark_params.sh","""
|#!/bin/bash
|
|cat << 'EOF' > /databricks/driver/conf/00-custom-table-access.conf
|[driver] {
|  "spark.databricks.acl.sqlOnly" = "true"
|}
|EOF
""".stripMargin, true)
`}</CodeBlock>
</details>

After adding the script, you need to restart the cluster. Verify that changes took effect by 
evaluating `spark.conf.get("spark.databricks.acl.sqlOnly")`, which should return `true`.


Start the loader so that it can create the tables. Now the cluster is ready to be configured:

```sql
-- Clean initial permissions from tables
REVOKE ALL PRIVILEGES ON TABLE <catalog>.<schema>.events FROM `<principal>`;
REVOKE ALL PRIVILEGES ON TABLE <catalog>.<schema>.manifest FROM `<principal>`;
REVOKE ALL PRIVILEGES ON TABLE <catalog>.<schema>.rdb_folder_monitoring FROM `<principal>`;

-- Clean initial permissions from schema
REVOKE ALL PRIVILEGES ON SCHEMA <catalog>.<schema> FROM `<principal>`;

-- Loader will run CREATE TABLE IF NOT EXISTS statements, so USAGE and CREATE and both required.
GRANT USAGE, CREATE ON SCHEMA <catalog>.<schema> TO `<principal>`;

-- COPY TO statement requires ANY FILE and MODIFY for the receiving table
GRANT SELECT ON ANY FILE TO `<principal>`;
GRANT MODIFY  ON TABLE  <catalog>.<schema>.events TO `<principal>`;

-- These tables are used to store internal loader state
GRANT MODIFY, SELECT ON TABLE  <catalog>.<schema>.manifest TO `<principal>`;
GRANT MODIFY, SELECT ON TABLE  <catalog>.<schema>.rdb_folder_monitoring TO `<principal>`;
```

### Downloading the artifact

The asset is published as a jar file attached to the [Github release notes](https://github.com/snowplow/snowplow-rdb-loader/releases) for each version.

<p>It's also available as a Docker image on Docker Hub under <code>{`snowplow/rdb-loader-databricks:${versions.rdbLoader}`}</code>.</p>


### Configuring `rdb-loader-databricks`

The loader takes two configuration files:

- a `config.hocon` file with application settings
- an `iglu_resolver.json` file with the resolver configuration for your [Iglu](https://github.com/snowplow/iglu) schema registry.

An example of the minimal required config for the Databricks loader can be found [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/aws/databricks.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/aws/databricks.config.reference.hocon). For details about each setting, see the [configuration reference](/docs/destinations/warehouses-and-lakes/rdb/loading-transformed-data/rdb-loader-configuration-reference/index.md).

See [here](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) for details on how to prepare the Iglu resolver file.

:::tip

All self-describing schemas for events processed by RDB Loader **must** be hosted on [Iglu Server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/index.md) 0.6.0 or above. [Iglu Central](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-central/index.md) is a registry containing Snowplow-authored schemas. If you want to use them alongside your own, you will need to add it to your resolver file. Keep it mind that it could override your own private schemas if you give it higher priority. For details on this see [here](https://discourse.snowplow.io/t/important-changes-to-iglu-centrals-api-for-schema-lists/5720#how-will-this-affect-my-snowplow-pipeline-3).

:::

### Running the Databricks loader

The two config files need to be passed in as base64-encoded strings:

<CodeBlock language="bash">{
`$ docker run snowplow/rdb-loader-databricks:${versions.rdbLoader} \\
--iglu-config $RESOLVER_BASE64 \\
--config $CONFIG_BASE64
`}</CodeBlock>

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Databricks Loader" since="5.0.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```
