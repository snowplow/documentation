---
title: Upload sample data
position: 2
---

In this section we're going to load the sample Snowplow data to your warehouse. We have provided sample hybrid app data that includes both native mobile events and web view events.

The sample data demonstrates the unified tracking approach where events from both native code and web views share the same session and user identifiers.

## Snowflake

We have provided a public S3 bucket where we store the sample data in CSV format through [this link](https://snowplow-demo-datasets.s3.eu-central-1.amazonaws.com/Hybrid_Apps/Hybrid_sample_events.csv).

### Create the ATOMIC schema

If the ATOMIC schema doesn't exist, create it in your target database.

```sql
CREATE SCHEMA IF NOT EXISTS TARGET_DB.ATOMIC
```

### Create the ATOMIC.SAMPLE_EVENTS_HYBRID_BASE table

This is where you will load the sample data to. You will need to modify the TARGET_DB according to your own database.

```sql
CREATE OR REPLACE TABLE TARGET_DB.ATOMIC.SAMPLE_EVENTS_HYBRID_BASE (
	APP_ID VARCHAR(255),
	PLATFORM VARCHAR(255),
	ETL_TSTAMP TIMESTAMP_NTZ(9),
	COLLECTOR_TSTAMP TIMESTAMP_NTZ(9) NOT NULL,
	DVCE_CREATED_TSTAMP TIMESTAMP_NTZ(9),
	EVENT VARCHAR(128),
	EVENT_ID VARCHAR(36) NOT NULL,
	TXN_ID NUMBER(38,0),
	NAME_TRACKER VARCHAR(128),
	V_TRACKER VARCHAR(100),
	V_COLLECTOR VARCHAR(100) NOT NULL,
	V_ETL VARCHAR(100) NOT NULL,
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
	SE_LABEL VARCHAR(4096),
	SE_PROPERTY VARCHAR(1000),
	SE_VALUE FLOAT,
	-- Additional fields truncated for brevity - see full schema in source
	CONTEXTS_COM_SNOWPLOWANALYTICS_MOBILE_SCREEN_1 VARCHAR,
	CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_CLIENT_SESSION_1 VARCHAR,
	CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_GEOLOCATION_CONTEXT_1 VARCHAR,
	CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MOBILE_CONTEXT_1 VARCHAR,
	CONTEXTS_COM_SNOWPLOWANALYTICS_MOBILE_APPLICATION_1 VARCHAR,
	UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_MOBILE_SCREEN_VIEW_1 VARCHAR,
	constraint EVENT_ID_PK primary key (EVENT_ID)
);
```

*Note: The full table schema has been truncated here for readability. Use the complete schema from the original source.*

### Create stage

```sql
CREATE OR REPLACE STAGE snowplow_hybrid_sample_stage
url = 's3://snowplow-demo-datasets/Hybrid_Apps/Hybrid_sample_events.csv'
file_format = (TYPE=csv field_delimiter=',' skip_header=1, FIELD_OPTIONALLY_ENCLOSED_BY='"')
```

### Copy into base table from stage

```sql
COPY INTO TARGET_DB.ATOMIC.SAMPLE_EVENTS_HYBRID_BASE
FROM @snowplow_hybrid_sample_stage
```

### Create the final ATOMIC.SAMPLE_EVENTS_HYBRID table

```sql
CREATE OR REPLACE TABLE TARGET_DB.ATOMIC.SAMPLE_EVENTS_HYBRID AS (
SELECT
    -- All standard fields
    APP_ID,
    PLATFORM,
    ETL_TSTAMP,
    COLLECTOR_TSTAMP,
    -- ... other fields ...
    
    -- Parse JSON context fields
    PARSE_JSON(CONTEXTS_COM_SNOWPLOWANALYTICS_MOBILE_SCREEN_1) as CONTEXTS_COM_SNOWPLOWANALYTICS_MOBILE_SCREEN_1,
    PARSE_JSON(CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_CLIENT_SESSION_1) as CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_CLIENT_SESSION_1,
    PARSE_JSON(CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_GEOLOCATION_CONTEXT_1) as CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_GEOLOCATION_CONTEXT_1,
    PARSE_JSON(CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MOBILE_CONTEXT_1) as CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_MOBILE_CONTEXT_1,
    PARSE_JSON(CONTEXTS_COM_SNOWPLOWANALYTICS_MOBILE_APPLICATION_1) as CONTEXTS_COM_SNOWPLOWANALYTICS_MOBILE_APPLICATION_1,
    PARSE_JSON(UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_MOBILE_SCREEN_VIEW_1) as UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_MOBILE_SCREEN_VIEW_1
FROM ATOMIC.SAMPLE_EVENTS_HYBRID_BASE
);
```

### Clean up

```sql
DROP TABLE TARGET_DB.ATOMIC.SAMPLE_EVENTS_HYBRID_BASE
```

## Databricks

For Databricks, use the tab-separated version: [Hybrid_sample_events_tab_separated.csv](https://snowplow-demo-datasets.s3.eu-central-1.amazonaws.com/Hybrid_Apps/Hybrid_sample_events_tab_separated.csv).

1. Create the ATOMIC schema if it doesn't exist
2. Upload the CSV file through the Databricks UI (New -> File upload)
3. Set the column delimiter to "tab" in advanced attributes
4. Create the final table with proper JSON parsing for context fields

## BigQuery

For BigQuery, download the CSV file locally and upload through the Google Cloud Console.

1. Create the ATOMIC schema if it doesn't exist
2. Upload via BigQuery console with auto-detect schema
3. Create the final table with proper ARRAY and STRUCT conversions for repeated fields

You will now have the `ATOMIC.SAMPLE_EVENTS_HYBRID` table created and loaded with sample data that demonstrates both native mobile events and web view events tracked with unified session information.
