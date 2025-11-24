---
title: "Migration guide for Unified Digital"
sidebar_label: "Unified Digital"
sidebar_position: 10
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

### Upgrading to 0.4.0

If you make use of the `conversion` module, and don't wish to do a full refresh, you will need to add the new column and update the existing records with the correct values for the model to run successfully incrementally.

<Tabs groupId="warehouse" queryString>
<TabItem value="redshift" label="Redshift" default>

```sql
ALTER TABLE your_schema_derived.snowplow_unified_conversions add column cv_id TEXT;

UPDATE your_schema_derived.snowplow_unified_conversions set cv_id = md5(cast(coalesce(cast(event_id as TEXT), '_dbt_utils_surrogate_key_null_') || '-' || coalesce(cast(cv_type as TEXT), '_dbt_utils_surrogate_key_null_') as TEXT))
where 1=1;
```

</TabItem>
<TabItem value="snowflake" label="Snowflake">

```sql
ALTER TABLE your_schema_derived.snowplow_unified_conversions add column cv_id TEXT;

UPDATE your_schema_derived.snowplow_unified_conversions set cv_id = md5(cast(coalesce(cast(event_id as TEXT), '_dbt_utils_surrogate_key_null_') || '-' || coalesce(cast(cv_type as TEXT), '_dbt_utils_surrogate_key_null_') as TEXT))
where 1=1;
```

</TabItem>
<TabItem value="bigquery" label="BigQuery">

```sql
ALTER TABLE your_schema_derived.snowplow_unified_conversions add column cv_id string;

UPDATE your_schema_derived.snowplow_unified_conversions set cv_id = to_hex(md5(cast(coalesce(cast(event_id as string), '_dbt_utils_surrogate_key_null_') || '-' || coalesce(cast(cv_type as string), '_dbt_utils_surrogate_key_null_') as string)))
where 1=1;
```

</TabItem>
<TabItem value="databricks" label="Databricks">

```sql
ALTER TABLE your_schema_derived.snowplow_unified_conversions add column cv_id string;

UPDATE your_schema_derived.snowplow_unified_conversions set cv_id = md5(cast(coalesce(cast(event_id as string), '_dbt_utils_surrogate_key_null_') || '-' || coalesce(cast(cv_type as string), '_dbt_utils_surrogate_key_null_') as string))
where 1=1;
```

</TabItem>
</Tabs>


### Upgrading to 0.3.0

- `snowplow__page_view_passthroughs` has been renamed to `snowplow__view_passthroughs`. Please rename this in your project yaml if you have set any.
- If you currently use `snowplow__allow_refresh` without also adding a `--full-refresh` flag in any script this is now required to ensure the manifest tables are fully refreshed.


### Upgrading to 0.2.0

The views table needs to be altered for existing Snowflake, Databricks or Redshift users as the data type of `engaged_time_in_s`, `absolute_time_in_s` have changed. Please modify the below script to fit your schemas and apply them before running the upgraded package.

The other option is to do a [complete refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/full-or-partial-refreshes/index.md#complete-refresh-of-snowplow-package) of the package.

#### Updates to the views table

* Changed type: `engaged_time_in_s`, `absolute_time_in_s`

<details>
  <summary>SQL scripts</summary>
<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="snowflake" default>

```sql
create or replace TRANSIENT TABLE (your_schema)_derived.snowplow_unified_views_new cluster by (to_date(start_tstamp))(
	VIEW_ID VARCHAR(16777216),
	EVENT_NAME VARCHAR(16777216),
	EVENT_ID VARCHAR(16777216),
	SESSION_IDENTIFIER VARCHAR(16777216),
	VIEW_IN_SESSION_INDEX NUMBER(18,0),
	VIEWS_IN_SESSION NUMBER(18,0),
	SESSION__PREVIOUS_SESSION_ID VARCHAR(36),
	USER_ID VARCHAR(16777216),
	USER_IDENTIFIER VARCHAR(16777216),
	STITCHED_USER_ID VARCHAR(16777216),
	NETWORK_USERID VARCHAR(16777216),
	DVCE_CREATED_TSTAMP TIMESTAMP_NTZ(9),
	COLLECTOR_TSTAMP TIMESTAMP_NTZ(9),
	DERIVED_TSTAMP TIMESTAMP_NTZ(9),
	START_TSTAMP TIMESTAMP_NTZ(9),
	END_TSTAMP TIMESTAMP_NTZ(9),
	MODEL_TSTAMP TIMESTAMP_NTZ(9),
	APP_ID VARCHAR(16777216),
	PLATFORM VARCHAR(16777216),
	DEVICE_IDENTIFIER VARCHAR(16777216),
	DEVICE_CATEGORY VARCHAR(16777216),
	DEVICE_SESSION_INDEX NUMBER(38,0),
	OS_VERSION VARCHAR(16777216),
	OS_TYPE VARCHAR(16777216),
	MOBILE__DEVICE_MANUFACTURER VARCHAR(16777216),
	MOBILE__DEVICE_MODEL VARCHAR(16777216),
	MOBILE__OS_TYPE VARCHAR(16777216),
	MOBILE__OS_VERSION VARCHAR(16777216),
	MOBILE__ANDROID_IDFA VARCHAR(16777216),
	MOBILE__APPLE_IDFA VARCHAR(16777216),
	MOBILE__APPLE_IDFV VARCHAR(16777216),
	MOBILE__CARRIER VARCHAR(16777216),
	MOBILE__OPEN_IDFA VARCHAR(16777216),
	MOBILE__NETWORK_TECHNOLOGY VARCHAR(16777216),
	MOBILE__NETWORK_TYPE VARCHAR(255),
	MOBILE__PHYSICAL_MEMORY NUMBER(38,0),
	MOBILE__SYSTEM_AVAILABLE_MEMORY NUMBER(38,0),
	MOBILE__APP_AVAILABLE_MEMORY NUMBER(38,0),
	MOBILE__BATTERY_LEVEL NUMBER(38,0),
	MOBILE__BATTERY_STATE VARCHAR(16777216),
	MOBILE__LOW_POWER_MODE BOOLEAN,
	MOBILE__AVAILABLE_STORAGE NUMBER(38,0),
	MOBILE__TOTAL_STORAGE NUMBER(38,0),
	MOBILE__IS_PORTRAIT BOOLEAN,
	MOBILE__RESOLUTION VARCHAR(16777216),
	MOBILE__SCALE FLOAT,
	MOBILE__LANGUAGE VARCHAR(16777216),
	MOBILE__APP_SET_ID VARCHAR(16777216),
	MOBILE__APP_SET_ID_SCOPE VARCHAR(16777216),
	OS_TIMEZONE VARCHAR(16777216),
	SCREEN_RESOLUTION VARCHAR(16777216),
	YAUAA__DEVICE_CLASS VARCHAR(16777216),
	YAUAA__DEVICE_VERSION VARCHAR(16777216),
	YAUAA__OPERATING_SYSTEM_VERSION VARCHAR(16777216),
	YAUAA__OPERATING_SYSTEM_CLASS VARCHAR(16777216),
	YAUAA__OPERATING_SYSTEM_NAME VARCHAR(16777216),
	YAUAA__OPERATING_SYSTEM_NAME_VERSION VARCHAR(16777216),
	GEO_COUNTRY VARCHAR(16777216),
	GEO_REGION VARCHAR(16777216),
	GEO_REGION_NAME VARCHAR(16777216),
	GEO_CITY VARCHAR(16777216),
	GEO_ZIPCODE VARCHAR(16777216),
	GEO_LATITUDE FLOAT,
	GEO_LONGITUDE FLOAT,
	GEO_TIMEZONE VARCHAR(16777216),
	USER_IPADDRESS VARCHAR(16777216),
	ENGAGED_TIME_IN_S DOUBLE,
	ABSOLUTE_TIME_IN_S DOUBLE,
	HORIZONTAL_PIXELS_SCROLLED NUMBER(38,0),
	VERTICAL_PIXELS_SCROLLED NUMBER(38,0),
	HORIZONTAL_PERCENTAGE_SCROLLED FLOAT,
	VERTICAL_PERCENTAGE_SCROLLED FLOAT,
	MKT_MEDIUM VARCHAR(16777216),
	MKT_SOURCE VARCHAR(16777216),
	MKT_TERM VARCHAR(16777216),
	MKT_CONTENT VARCHAR(16777216),
	MKT_CAMPAIGN VARCHAR(16777216),
	MKT_CLICKID VARCHAR(16777216),
	MKT_NETWORK VARCHAR(16777216),
	DEFAULT_CHANNEL_GROUP VARCHAR(25),
	PAGE_URL VARCHAR(16777216),
	PAGE_REFERRER VARCHAR(16777216),
	REFR_MEDIUM VARCHAR(16777216),
	REFR_SOURCE VARCHAR(16777216),
	REFR_TERM VARCHAR(16777216),
	PAGE_TITLE VARCHAR(16777216),
	CONTENT_GROUP VARCHAR(39),
	PAGE_URLSCHEME VARCHAR(16777216),
	PAGE_URLHOST VARCHAR(16777216),
	PAGE_URLPATH VARCHAR(16777216),
	PAGE_URLQUERY VARCHAR(16777216),
	PAGE_URLFRAGMENT VARCHAR(16777216),
	REFR_URLSCHEME VARCHAR(16777216),
	REFR_URLHOST VARCHAR(16777216),
	REFR_URLPATH VARCHAR(16777216),
	REFR_URLQUERY VARCHAR(16777216),
	REFR_URLFRAGMENT VARCHAR(16777216),
	BR_LANG VARCHAR(16777216),
	BR_VIEWWIDTH NUMBER(38,0),
	BR_VIEWHEIGHT NUMBER(38,0),
	BR_COLORDEPTH VARCHAR(16777216),
	BR_RENDERENGINE VARCHAR(16777216),
	DOC_WIDTH NUMBER(38,0),
	DOC_HEIGHT NUMBER(38,0),
	IAB__CATEGORY VARCHAR(16777216),
	IAB__PRIMARY_IMPACT VARCHAR(16777216),
	IAB__REASON VARCHAR(16777216),
	IAB__SPIDER_OR_ROBOT BOOLEAN,
	YAUAA__DEVICE_NAME VARCHAR(16777216),
	YAUAA__AGENT_CLASS VARCHAR(16777216),
	YAUAA__AGENT_NAME VARCHAR(16777216),
	YAUAA__AGENT_NAME_VERSION VARCHAR(16777216),
	YAUAA__AGENT_NAME_VERSION_MAJOR VARCHAR(16777216),
	YAUAA__AGENT_VERSION VARCHAR(16777216),
	YAUAA__AGENT_VERSION_MAJOR VARCHAR(16777216),
	YAUAA__LAYOUT_ENGINE_CLASS VARCHAR(16777216),
	YAUAA__LAYOUT_ENGINE_NAME VARCHAR(16777216),
	YAUAA__LAYOUT_ENGINE_NAME_VERSION VARCHAR(16777216),
	YAUAA__LAYOUT_ENGINE_NAME_VERSION_MAJOR VARCHAR(16777216),
	YAUAA__LAYOUT_ENGINE_VERSION VARCHAR(16777216),
	YAUAA__LAYOUT_ENGINE_VERSION_MAJOR VARCHAR(16777216),
	UA__DEVICE_FAMILY VARCHAR(16777216),
	UA__OS_VERSION VARCHAR(16777216),
	UA__OS_MAJOR VARCHAR(16777216),
	UA__OS_MINOR VARCHAR(16777216),
	UA__OS_PATCH VARCHAR(16777216),
	UA__OS_PATCH_MINOR VARCHAR(16777216),
	UA__USERAGENT_FAMILY VARCHAR(16777216),
	UA__USERAGENT_MAJOR VARCHAR(16777216),
	UA__USERAGENT_MINOR VARCHAR(16777216),
	UA__USERAGENT_PATCH VARCHAR(16777216),
	UA__USERAGENT_VERSION VARCHAR(16777216),
	SCREEN_VIEW__NAME VARCHAR(16777216),
	SCREEN_VIEW__PREVIOUS_ID VARCHAR(36),
	SCREEN_VIEW__PREVIOUS_NAME VARCHAR(16777216),
	SCREEN_VIEW__PREVIOUS_TYPE VARCHAR(16777216),
	SCREEN_VIEW__TRANSITION_TYPE VARCHAR(16777216),
	SCREEN_VIEW__TYPE VARCHAR(16777216),
	APP__BUILD VARCHAR(255),
	APP__VERSION VARCHAR(255),
	GEO__ALTITUDE FLOAT,
	GEO__ALTITUDE_ACCURACY FLOAT,
	GEO__BEARING FLOAT,
	GEO__LATITUDE FLOAT,
	GEO__LATITUDE_LONGITUDE_ACCURACY FLOAT,
	GEO__LONGITUDE FLOAT,
	GEO__SPEED FLOAT,
	SCREEN__FRAGMENT VARCHAR(16777216),
	SCREEN__TOP_VIEW_CONTROLLER VARCHAR(16777216),
	SCREEN__VIEW_CONTROLLER VARCHAR(16777216),
	USERAGENT VARCHAR(16777216),
	V_COLLECTOR VARCHAR(16777216),
	EVENT_ID2 VARCHAR(16777216),
	LAST_LIST_ITEM_INDEX NUMBER(38,0),
	LIST_ITEMS_COUNT NUMBER(38,0),
	LIST_ITEMS_PERCENTAGE_SCROLLED FLOAT
);

insert into (your_schema)_derived.snowplow_unified_views_new  select *, NULL AS LAST_LIST_ITEM_INDEX, NULL AS LIST_ITEMS_COUNT, NULL AS LIST_ITEMS_PERCENTAGE_SCROLLED from (your_schema)_derived.snowplow_unified_views;
drop table (your_schema)_derived.snowplow_unified_views;
create table (your_schema)_derived.snowplow_unified_views as select * from (your_schema)_derived.snowplow_unified_views_new;
drop table (your_schema)_derived.snowplow_unified_views_new;
```

</TabItem>
<TabItem value="databricks" label="databricks">

#### Updates to the views table

```sql
CREATE TABLE (your_schema)_derived.snowplow_unified_views_new (
  view_id STRING,
  event_name STRING,
  event_id STRING,
  session_identifier STRING,
  view_in_session_index INT,
  views_in_session INT,
  session__previous_session_id STRING,
  user_id STRING,
  user_identifier STRING,
  stitched_user_id STRING,
  network_userid STRING,
  dvce_created_tstamp TIMESTAMP,
  collector_tstamp TIMESTAMP,
  derived_tstamp TIMESTAMP,
  start_tstamp TIMESTAMP,
  end_tstamp TIMESTAMP,
  model_tstamp TIMESTAMP,
  app_id STRING,
  platform STRING,
  device_identifier STRING,
  device_category STRING,
  device_session_index INT,
  os_version STRING,
  os_type STRING,
  mobile__device_manufacturer STRING,
  mobile__device_model STRING,
  mobile__os_type STRING,
  mobile__os_version STRING,
  mobile__android_idfa STRING,
  mobile__apple_idfa STRING,
  mobile__apple_idfv STRING,
  mobile__carrier STRING,
  mobile__open_idfa STRING,
  mobile__network_technology STRING,
  mobile__network_type STRING,
  mobile__physical_memory INT,
  mobile__system_available_memory INT,
  mobile__app_available_memory INT,
  mobile__battery_level INT,
  mobile__battery_state STRING,
  mobile__low_power_mode BOOLEAN,
  mobile__available_storage BIGINT,
  mobile__total_storage BIGINT,
  mobile__is_portrait BOOLEAN,
  mobile__resolution STRING,
  mobile__scale FLOAT,
  mobile__language STRING,
  mobile__app_set_id STRING,
  mobile__app_set_id_scope STRING,
  screen_resolution STRING,
  geo_country STRING,
  geo_region BIGINT,
  geo_region_name BIGINT,
  geo_city BIGINT,
  geo_zipcode BIGINT,
  geo_latitude BIGINT,
  geo_longitude BIGINT,
  geo_timezone BIGINT,
  user_ipaddress STRING,
  engaged_time_in_s FLOAT,
  absolute_time_in_s FLOAT,
  horizontal_pixels_scrolled BIGINT,
  vertical_pixels_scrolled BIGINT,
  horizontal_percentage_scrolled FLOAT,
  vertical_percentage_scrolled FLOAT,
  last_list_item_index INT,
  list_items_count INT,
  list_items_percentage_scrolled FLOAT,
  mkt_medium STRING,
  mkt_source STRING,
  mkt_term STRING,
  mkt_content STRING,
  mkt_campaign STRING,
  mkt_clickid BIGINT,
  mkt_network BIGINT,
  default_channel_group STRING,
  page_url STRING,
  page_referrer STRING,
  refr_medium STRING,
  refr_source STRING,
  refr_term STRING,
  screen_view__name STRING,
  screen_view__previous_id STRING,
  screen_view__previous_name STRING,
  screen_view__previous_type STRING,
  screen_view__transition_type STRING,
  screen_view__type STRING,
  app__build STRING,
  app__version STRING,
  screen__fragment STRING,
  screen__top_view_controller STRING,
  screen__view_controller STRING,
  useragent STRING,
  v_collector STRING,
  event_id2 STRING,
  start_tstamp_date DATE)
USING delta
PARTITIONED BY (start_tstamp_date)
TBLPROPERTIES (
  'delta.autoOptimize.autoCompact' = 'true',
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.checkpoint.writeStatsAsJson' = 'false',
  'delta.checkpoint.writeStatsAsStruct' = 'true',
  'delta.minReaderVersion' = '1',
  'delta.minWriterVersion' = '2');

insert into (your_schema)_derived.snowplow_unified_views_new  select *, null as last_list_item_index, null as list_items_count, null as list_items_percentage_scrolled from (your_schema)_derived.snowplow_unified_views;
drop table (your_schema)_derived.snowplow_unified_views;
create table (your_schema)_derived.snowplow_unified_views as select * from (your_schema)_derived.snowplow_unified_views_new;
drop table (your_schema)_derived.snowplow_unified_views_new;
```

</TabItem>
<TabItem value="redshift" label="redshift" default>

#### Updates to the views table

```sql
CREATE TABLE IF NOT EXISTS (your_schema)_derived.snowplow_unified_views_new
(
	view_id VARCHAR(65535)   ENCODE lzo
	,event_name VARCHAR(22)   ENCODE lzo
	,event_id VARCHAR(36)   ENCODE lzo
	,session_identifier VARCHAR(36)   ENCODE lzo
	,view_in_session_index BIGINT   ENCODE az64
	,views_in_session BIGINT   ENCODE az64
	,session__previous_session_id VARCHAR(36)   ENCODE lzo
	,user_id VARCHAR(256)   ENCODE lzo
	,user_identifier VARCHAR(36)   ENCODE lzo
	,stitched_user_id VARCHAR(65535)   ENCODE lzo
	,network_userid VARCHAR(36)   ENCODE lzo
	,dvce_created_tstamp TIMESTAMP WITHOUT TIME ZONE   ENCODE az64
	,collector_tstamp TIMESTAMP WITHOUT TIME ZONE   ENCODE az64
	,derived_tstamp TIMESTAMP WITHOUT TIME ZONE   ENCODE az64
	,start_tstamp TIMESTAMP WITHOUT TIME ZONE   ENCODE RAW
	,end_tstamp TIMESTAMP WITHOUT TIME ZONE   ENCODE az64
	,model_tstamp TIMESTAMP WITHOUT TIME ZONE   ENCODE az64
	,app_id VARCHAR(256)   ENCODE lzo
	,platform VARCHAR(3)   ENCODE lzo
	,device_identifier VARCHAR(36)   ENCODE lzo
	,device_category VARCHAR(22)   ENCODE lzo
	,device_session_index INTEGER   ENCODE az64
	,os_version VARCHAR(3)   ENCODE lzo
	,os_type VARCHAR(25)   ENCODE lzo
	,mobile__device_manufacturer VARCHAR(7)   ENCODE lzo
	,mobile__device_model VARCHAR(37)   ENCODE lzo
	,mobile__os_type VARCHAR(25)   ENCODE lzo
	,mobile__os_version VARCHAR(3)   ENCODE lzo
	,mobile__android_idfa VARCHAR(36)   ENCODE lzo
	,mobile__apple_idfa VARCHAR(2)   ENCODE lzo
	,mobile__apple_idfv VARCHAR(2)   ENCODE lzo
	,mobile__carrier VARCHAR(7)   ENCODE lzo
	,mobile__open_idfa VARCHAR(2)   ENCODE lzo
	,mobile__network_technology VARCHAR(2)   ENCODE lzo
	,mobile__network_type VARCHAR(4)   ENCODE lzo
	,mobile__physical_memory INTEGER   ENCODE az64
	,mobile__system_available_memory INTEGER   ENCODE az64
	,mobile__app_available_memory INTEGER   ENCODE az64
	,mobile__battery_level INTEGER   ENCODE az64
	,mobile__battery_state VARCHAR(8)   ENCODE lzo
	,mobile__low_power_mode BOOLEAN   ENCODE RAW
	,mobile__available_storage INTEGER   ENCODE az64
	,mobile__total_storage BIGINT   ENCODE az64
	,mobile__is_portrait BOOLEAN   ENCODE RAW
	,mobile__resolution VARCHAR(9)   ENCODE lzo
	,mobile__scale DOUBLE PRECISION   ENCODE RAW
	,mobile__language VARCHAR(2)   ENCODE lzo
	,mobile__app_set_id VARCHAR(2)   ENCODE lzo
	,mobile__app_set_id_scope VARCHAR(2)   ENCODE lzo
	,screen_resolution VARCHAR(9)   ENCODE lzo
	,geo_country VARCHAR(256)   ENCODE lzo
	,geo_region INTEGER   ENCODE az64
	,geo_region_name INTEGER   ENCODE az64
	,geo_city INTEGER   ENCODE az64
	,geo_zipcode INTEGER   ENCODE az64
	,geo_latitude INTEGER   ENCODE az64
	,geo_longitude INTEGER   ENCODE az64
	,geo_timezone INTEGER   ENCODE az64
	,user_ipaddress VARCHAR(10)   ENCODE lzo
	,engaged_time_in_s DOUBLE PRECISION   ENCODE RAW
	,absolute_time_in_s DOUBLE PRECISION   ENCODE RAW
	,horizontal_pixels_scrolled INTEGER   ENCODE az64
	,vertical_pixels_scrolled INTEGER   ENCODE az64
	,horizontal_percentage_scrolled DOUBLE PRECISION   ENCODE RAW
	,vertical_percentage_scrolled DOUBLE PRECISION   ENCODE RAW
	,last_list_item_index INTEGER   ENCODE az64
	,list_items_count INTEGER   ENCODE az64
	,list_items_percentage_scrolled DOUBLE PRECISION   ENCODE RAW
	,mkt_medium VARCHAR(256)   ENCODE lzo
	,mkt_source VARCHAR(256)   ENCODE lzo
	,mkt_term VARCHAR(256)   ENCODE lzo
	,mkt_content VARCHAR(256)   ENCODE lzo
	,mkt_campaign VARCHAR(256)   ENCODE lzo
	,mkt_clickid INTEGER   ENCODE az64
	,mkt_network INTEGER   ENCODE az64
	,default_channel_group VARCHAR(25)   ENCODE lzo
	,page_url VARCHAR(256)   ENCODE lzo
	,page_referrer VARCHAR(256)   ENCODE lzo
	,refr_medium VARCHAR(256)   ENCODE lzo
	,refr_source VARCHAR(256)   ENCODE lzo
	,refr_term VARCHAR(256)   ENCODE lzo
	,screen_view__name VARCHAR(2)   ENCODE lzo
	,screen_view__previous_id VARCHAR(2)   ENCODE lzo
	,screen_view__previous_name VARCHAR(2)   ENCODE lzo
	,screen_view__previous_type VARCHAR(2)   ENCODE lzo
	,screen_view__transition_type VARCHAR(2)   ENCODE lzo
	,screen_view__type VARCHAR(2)   ENCODE lzo
	,app__build VARCHAR(2)   ENCODE lzo
	,app__version VARCHAR(2)   ENCODE lzo
	,screen__fragment VARCHAR(2)   ENCODE lzo
	,screen__top_view_controller VARCHAR(2)   ENCODE lzo
	,screen__view_controller VARCHAR(2)   ENCODE lzo
	,useragent VARCHAR(51)   ENCODE lzo
	,v_collector VARCHAR(28)   ENCODE lzo
	,event_id2 VARCHAR(36)   ENCODE lzo
)
DISTSTYLE KEY
 DISTKEY (view_id)
 SORTKEY (
	start_tstamp
	)
;

insert into (your_schema)_derived.snowplow_unified_views_new  select *, null as last_list_item_index, null as list_items_count, null as list_items_percentage_scrolled from (your_schema)_derived.snowplow_unified_views;
drop table (your_schema)_derived.snowplow_unified_views;
alter table (your_schema)_derived.snowplow_unified_views_new
rename to snowplow_unified_views;
```

</TabItem>
</Tabs>
</details>
