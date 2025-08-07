---
title: Upload sample data
position: 2
---

In this section you'll load the sample Snowplow media player data to your warehouse. There are different options available depending on your warehouse platform.

## Snowflake

We have provided a public S3 bucket where we store the sample data in CSV format: `https://snowplow-demo-datasets.s3.eu-central-1.amazonaws.com/media_player/snowplow_media_player_sample_events_snowflake.csv`

You can load this file to your Snowflake warehouse with a few simple steps.

### Create the ATOMIC schema

If the ATOMIC schema doesn't exist, create it in your target database.

```sql
CREATE SCHEMA IF NOT EXISTS TARGET_DB.ATOMIC
```

### Create the SAMPLE_EVENTS_MEDIA_PLAYER_BASE table

This is where you will load the sample data to. You will need to modify the TARGET_DB according to your own database.

```sql
CREATE OR REPLACE TABLE TARGET_DB.ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER_BASE (
	APP_ID VARCHAR(255),
	PLATFORM VARCHAR(255),
	ETL_TSTAMP TIMESTAMP_NTZ(9),
	COLLECTOR_TSTAMP TIMESTAMP_NTZ(9),
	DVCE_CREATED_TSTAMP TIMESTAMP_NTZ(9),
	EVENT VARCHAR(128),
	EVENT_ID VARCHAR(36),
	TXN_ID NUMBER(38,0),
	NAME_TRACKER VARCHAR(128),
	V_TRACKER VARCHAR(100),
	V_COLLECTOR VARCHAR(100),
	V_ETL VARCHAR(100),
	USER_ID VARCHAR(255),
	USER_IPADDRESS VARCHAR(128),
	USER_FINGERPRINT VARCHAR(128),
	DOMAIN_USERID VARCHAR(128),
	DOMAIN_SESSIONIDX NUMBER(38,0),
	NETWORK_USERID VARCHAR(128),
	GEO_COUNTRY VARCHAR(2),
	GEO_REGION VARCHAR(3),
	GEO_CITY VARCHAR(75),
	GEO_ZIPCODE VARCHAR(15),
	GEO_LATITUDE FLOAT,
	GEO_LONGITUDE FLOAT,
	GEO_REGION_NAME VARCHAR(100),
	IP_ISP VARCHAR(100),
	IP_ORGANIZATION VARCHAR(128),
	IP_DOMAIN VARCHAR(128),
	IP_NETSPEED VARCHAR(100),
	PAGE_URL VARCHAR(4096),
	PAGE_TITLE VARCHAR(2000),
	PAGE_REFERRER VARCHAR(4096),
	PAGE_URLSCHEME VARCHAR(16),
	PAGE_URLHOST VARCHAR(255),
	PAGE_URLPORT NUMBER(38,0),
	PAGE_URLPATH VARCHAR(3000),
	PAGE_URLQUERY VARCHAR(6000),
	PAGE_URLFRAGMENT VARCHAR(3000),
	REFR_URLSCHEME VARCHAR(16),
	REFR_URLHOST VARCHAR(255),
	REFR_URLPORT NUMBER(38,0),
	REFR_URLPATH VARCHAR(6000),
	REFR_URLQUERY VARCHAR(6000),
	REFR_URLFRAGMENT VARCHAR(3000),
	REFR_MEDIUM VARCHAR(25),
	REFR_SOURCE VARCHAR(50),
	REFR_TERM VARCHAR(255),
	MKT_MEDIUM VARCHAR(255),
	MKT_SOURCE VARCHAR(255),
	MKT_TERM VARCHAR(255),
	MKT_CONTENT VARCHAR(500),
	MKT_CAMPAIGN VARCHAR(255),
	SE_CATEGORY VARCHAR(1000),
	SE_ACTION VARCHAR(1000),
	SE_LABEL VARCHAR(1000),
	SE_PROPERTY VARCHAR(1000),
	SE_VALUE FLOAT,
	TR_ORDERID VARCHAR(255),
	TR_AFFILIATION VARCHAR(255),
	TR_TOTAL NUMBER(18,2),
	TR_TAX NUMBER(18,2),
	TR_SHIPPING NUMBER(18,2),
	TR_CITY VARCHAR(255),
	TR_STATE VARCHAR(255),
	TR_COUNTRY VARCHAR(255),
	TI_ORDERID VARCHAR(255),
	TI_SKU VARCHAR(255),
	TI_NAME VARCHAR(255),
	TI_CATEGORY VARCHAR(255),
	TI_PRICE NUMBER(18,2),
	TI_QUANTITY NUMBER(38,0),
	PP_XOFFSET_MIN NUMBER(38,0),
	PP_XOFFSET_MAX NUMBER(38,0),
	PP_YOFFSET_MIN NUMBER(38,0),
	PP_YOFFSET_MAX NUMBER(38,0),
	USERAGENT VARCHAR(1000),
	BR_NAME VARCHAR(50),
	BR_FAMILY VARCHAR(50),
	BR_VERSION VARCHAR(50),
	BR_TYPE VARCHAR(50),
	BR_RENDERENGINE VARCHAR(50),
	BR_LANG VARCHAR(255),
	BR_FEATURES_PDF BOOLEAN,
	BR_FEATURES_FLASH BOOLEAN,
	BR_FEATURES_JAVA BOOLEAN,
	BR_FEATURES_DIRECTOR BOOLEAN,
	BR_FEATURES_QUICKTIME BOOLEAN,
	BR_FEATURES_REALPLAYER BOOLEAN,
	BR_FEATURES_WINDOWSMEDIA BOOLEAN,
	BR_FEATURES_GEARS BOOLEAN,
	BR_FEATURES_SILVERLIGHT BOOLEAN,
	BR_COOKIES BOOLEAN,
	BR_COLORDEPTH VARCHAR(12),
	BR_VIEWWIDTH NUMBER(38,0),
	BR_VIEWHEIGHT NUMBER(38,0),
	OS_NAME VARCHAR(50),
	OS_FAMILY VARCHAR(50),
	OS_MANUFACTURER VARCHAR(50),
	OS_TIMEZONE VARCHAR(255),
	DVCE_TYPE VARCHAR(50),
	DVCE_ISMOBILE BOOLEAN,
	DVCE_SCREENWIDTH NUMBER(38,0),
	DVCE_SCREENHEIGHT NUMBER(38,0),
	DOC_CHARSET VARCHAR(128),
	DOC_WIDTH NUMBER(38,0),
	DOC_HEIGHT NUMBER(38,0),
	TR_CURRENCY VARCHAR(3),
	TR_TOTAL_BASE NUMBER(18,2),
	TR_TAX_BASE NUMBER(18,2),
	TR_SHIPPING_BASE NUMBER(18,2),
	TI_CURRENCY VARCHAR(3),
	TI_PRICE_BASE NUMBER(18,2),
	BASE_CURRENCY VARCHAR(3),
	GEO_TIMEZONE VARCHAR(64),
	MKT_CLICKID VARCHAR(128),
	MKT_NETWORK VARCHAR(64),
	ETL_TAGS VARCHAR(500),
	DVCE_SENT_TSTAMP TIMESTAMP_NTZ(9),
	REFR_DOMAIN_USERID VARCHAR(128),
	REFR_DVCE_TSTAMP TIMESTAMP_NTZ(9),
	DOMAIN_SESSIONID VARCHAR(128),
	DERIVED_TSTAMP TIMESTAMP_NTZ(9),
	EVENT_VENDOR VARCHAR(1000),
	EVENT_NAME VARCHAR(1000),
	EVENT_FORMAT VARCHAR(128),
	EVENT_VERSION VARCHAR(128),
	EVENT_FINGERPRINT VARCHAR(128),
	TRUE_TSTAMP TIMESTAMP_NTZ(9),
	LOAD_TSTAMP TIMESTAMP_NTZ(9),
	CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_WEB_PAGE_1 ARRAY,
	CONTEXTS_COM_SNOWPLOWANALYTICS_MOBILE_SCREEN_1 ARRAY,
	CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_CLIENT_SESSION_1 ARRAY,
	CONTEXTS_ORG_WHATWG_VIDEO_ELEMENT_1 ARRAY,
	CONTEXTS_ORG_WHATWG_MEDIA_ELEMENT_1 ARRAY,
	CONTEXTS_COM_YOUTUBE_YOUTUBE_1 ARRAY,
	CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_PLAYER_1 ARRAY,
	CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_PLAYER_2 ARRAY,
	CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_SESSION_1 ARRAY,
	CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_AD_1 ARRAY,
	CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_AD_BREAK_1 ARRAY,
	UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_PLAYER_EVENT_1 OBJECT,
	UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_AD_QUARTILE_EVENT_1 OBJECT
);
```

### Create stage

```sql
CREATE OR REPLACE STAGE snowplow_sample_media_player_events_stage
URL = 'https://snowplow-demo-datasets.s3.eu-central-1.amazonaws.com/media_player/snowplow_media_player_sample_events_snowflake.csv'
FILE_FORMAT = (TYPE=CSV FIELD_DELIMITER=',' SKIP_HEADER=1, FIELD_OPTIONALLY_ENCLOSED_BY='"')
```

### Copy into base table from stage

```sql
COPY INTO TARGET_DB.ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER_BASE
FROM @snowplow_sample_media_player_events_stage
```

### Create the ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER table

```sql
CREATE OR REPLACE TABLE TARGET_DB.ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER AS (
SELECT
    APP_ID,
    PLATFORM,
    ETL_TSTAMP,
    COLLECTOR_TSTAMP,
    DVCE_CREATED_TSTAMP,
    EVENT,
    EVENT_ID,
    TXN_ID,
    NAME_TRACKER,
    V_TRACKER,
    V_COLLECTOR,
    V_ETL,
    USER_ID,
    USER_IPADDRESS,
    USER_FINGERPRINT,
    DOMAIN_USERID,
    DOMAIN_SESSIONIDX,
    NETWORK_USERID,
    GEO_COUNTRY,
    GEO_REGION,
    GEO_CITY,
    GEO_ZIPCODE,
    GEO_LATITUDE,
    GEO_LONGITUDE,
    GEO_REGION_NAME,
    IP_ISP,
    IP_ORGANIZATION,
    IP_DOMAIN,
    IP_NETSPEED,
    PAGE_URL,
    PAGE_TITLE,
    PAGE_REFERRER,
    PAGE_URLSCHEME,
    PAGE_URLHOST,
    PAGE_URLPORT,
    PAGE_URLPATH,
    PAGE_URLQUERY,
    PAGE_URLFRAGMENT,
    REFR_URLSCHEME,
    REFR_URLHOST,
    REFR_URLPORT,
    REFR_URLPATH,
    REFR_URLQUERY,
    REFR_URLFRAGMENT,
    REFR_MEDIUM,
    REFR_SOURCE,
    REFR_TERM,
    MKT_MEDIUM,
    MKT_SOURCE,
    MKT_TERM,
    MKT_CONTENT,
    MKT_CAMPAIGN,
    SE_CATEGORY,
    SE_ACTION,
    SE_LABEL,
    SE_PROPERTY,
    SE_VALUE,
    TR_ORDERID,
    TR_AFFILIATION,
    TR_TOTAL,
    TR_TAX,
    TR_SHIPPING,
    TR_CITY,
    TR_STATE,
    TR_COUNTRY,
    TI_ORDERID,
    TI_SKU,
    TI_NAME,
    TI_CATEGORY,
    TI_PRICE,
    TI_QUANTITY,
    PP_XOFFSET_MIN,
    PP_XOFFSET_MAX,
    PP_YOFFSET_MIN,
    PP_YOFFSET_MAX,
    USERAGENT,
    BR_NAME,
    BR_FAMILY,
    BR_VERSION,
    BR_TYPE,
    BR_RENDERENGINE,
    BR_LANG,
    BR_FEATURES_PDF,
    BR_FEATURES_FLASH,
    BR_FEATURES_JAVA,
    BR_FEATURES_DIRECTOR,
    BR_FEATURES_QUICKTIME,
    BR_FEATURES_REALPLAYER,
    BR_FEATURES_WINDOWSMEDIA,
    BR_FEATURES_GEARS,
    BR_FEATURES_SILVERLIGHT,
    BR_COOKIES,
    BR_COLORDEPTH,
    BR_VIEWWIDTH,
    BR_VIEWHEIGHT,
    OS_NAME,
    OS_FAMILY,
    OS_MANUFACTURER,
    OS_TIMEZONE,
    DVCE_TYPE,
    DVCE_ISMOBILE,
    DVCE_SCREENWIDTH,
    DVCE_SCREENHEIGHT,
    DOC_CHARSET,
    DOC_WIDTH,
    DOC_HEIGHT,
    TR_CURRENCY,
    TR_TOTAL_BASE,
    TR_TAX_BASE,
    TR_SHIPPING_BASE,
    TI_CURRENCY,
    TI_PRICE_BASE,
    BASE_CURRENCY,
    GEO_TIMEZONE,
    MKT_CLICKID,
    MKT_NETWORK,
    ETL_TAGS,
    DVCE_SENT_TSTAMP,
    REFR_DOMAIN_USERID,
    REFR_DVCE_TSTAMP,
    DOMAIN_SESSIONID,
    DERIVED_TSTAMP,
    EVENT_VENDOR,
    EVENT_NAME,
    EVENT_FORMAT,
    EVENT_VERSION,
    EVENT_FINGERPRINT,
    TRUE_TSTAMP,
    LOAD_TSTAMP,
    PARSE_JSON(EV.CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_WEB_PAGE_1) AS CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_WEB_PAGE_1,
    PARSE_JSON(EV.CONTEXTS_COM_SNOWPLOWANALYTICS_MOBILE_SCREEN_1) AS CONTEXTS_COM_SNOWPLOWANALYTICS_MOBILE_SCREEN_1,
    PARSE_JSON(EV.CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_CLIENT_SESSION_1) AS CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_CLIENT_SESSION_1,
    PARSE_JSON(EV.CONTEXTS_ORG_WHATWG_VIDEO_ELEMENT_1) AS CONTEXTS_ORG_WHATWG_VIDEO_ELEMENT_1,
    PARSE_JSON(EV.CONTEXTS_ORG_WHATWG_MEDIA_ELEMENT_1) AS CONTEXTS_ORG_WHATWG_MEDIA_ELEMENT_1,
    PARSE_JSON(EV.CONTEXTS_COM_YOUTUBE_YOUTUBE_1) AS CONTEXTS_COM_YOUTUBE_YOUTUBE_1,
    PARSE_JSON(EV.CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_PLAYER_1) AS CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_PLAYER_1,
    PARSE_JSON(EV.CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_PLAYER_2) AS CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_PLAYER_2,
    PARSE_JSON(EV.CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_SESSION_1) AS CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_SESSION_1,
    PARSE_JSON(EV.CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_AD_1) AS CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_AD_1,
    PARSE_JSON(EV.CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_AD_BREAK_1) AS CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_AD_BREAK_1,
    PARSE_JSON(EV.UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_PLAYER_EVENT_1) AS UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_PLAYER_EVENT_1,
    PARSE_JSON(EV.UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_AD_QUARTILE_EVENT_1) AS UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_MEDIA_AD_QUARTILE_EVENT_1
FROM ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER_BASE EV
);
```

### Clean up

```sql
DROP TABLE TARGET_DB.ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER_BASE
```

## Databricks

We have provided a public S3 bucket where we store the sample data in CSV format: `https://snowplow-demo-datasets.s3.eu-central-1.amazonaws.com/media_player/snowplow_media_player_sample_events.csv`

You can load the sample data to the warehouse using your Databricks Workspace as described in the steps below. For more details please check out the official [Databricks documentation](https://docs.databricks.com/ingestion/add-data/index.html).

### Create the ATOMIC schema

If the ATOMIC schema doesn't exist, create it in your target database.

```sql
CREATE SCHEMA IF NOT EXISTS ATOMIC
```

### Upload the CSV file

1. Navigate to the Catalog Explorer page
2. Select +Add → Add data to get started
3. Under From local files click Create or modify table and drop in the snowplow_media_player_sample_events.csv file. It should take a minute or two to load
4. Once you see the preview, specify the catalog, the schema (atomic) and change the name to **sample_events_media_player_base**
5. Under Advanced attributes tick Rows span multiple lines
6. Click create table

### Create the ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER table

The Snowplow pipeline creates context fields as arrays but uploading the test data can be achieved through string/varchar data type first. Run the below DDL statement in your SQL editor to create the `sample_events_media_player` table from the base table including the necessary conversions:

*Note: The full SQL for Databricks has been truncated here for readability - use the complete conversion script from the original file.*

### Clean up

```sql
DROP TABLE ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER_BASE
```

## BigQuery

We have provided a public S3 bucket where we store the sample data in CSV format: `https://snowplow-demo-datasets.s3.eu-central-1.amazonaws.com/media_player/snowplow_media_player_sample_events.csv`

You can load the sample data to the warehouse using your [Google Cloud console](https://console.cloud.google.com/) as described in the steps below. For more details please check out the official [BigQuery documentation](https://cloud.google.com/bigquery/docs/batch-loading-data#console).

### Create the ATOMIC schema

If the ATOMIC schema doesn't exist, create it in your target database.

```sql
CREATE SCHEMA IF NOT EXISTS ATOMIC
```

### Upload the CSV file

1. Open the BigQuery page in the [Google Cloud console](https://console.cloud.google.com/)
2. In the Explorer panel, expand your project and select the atomic schema/dataset. You should see the details panel open, if not, expand the Actions option (click on the three vertical dots) and click Open
3. In the Details panel, click Create table
4. On the Create table page fill out the sections:
   - **Source section**: For Create table from, select Upload. For Select file, click Browse. Navigate to the snowplow_media_player_sample_events.csv and open it. Make sure CSV is selected for File format
   - **Destination section**: For Project, choose the appropriate project (should be auto-populated). For Dataset make sure it is atomic (should be auto-populated). In the Table field put: `SAMPLE_EVENTS_MEDIA_PLAYER_BASE`. Verify that Table type is set to Native table
   - **Schema section**: Click Auto-detect
   - **Advanced options**: Put 1 for Header rows to skip. Tick Quoted newlines
5. Click Create table. Wait for a minute or two and the table should be created

### Create the ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER table

The Snowplow pipeline creates context fields as REPEATED fields but uploading the test data can be achieved through string/varchar data type first. Run the DDL statement in your SQL editor to create the `SAMPLE_EVENTS_MEDIA_PLAYER` table from the base table including the necessary conversions.

*Note: The full SQL for BigQuery has been truncated here for readability - use the complete conversion script from the original file.*

### Clean up

```sql
DROP TABLE ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER_BASE
```

You will now have the `ATOMIC.SAMPLE_EVENTS_MEDIA_PLAYER` created and loaded with sample data.
