---
title: "Snowplow Mobile Models"
description: Reference for snowplow_mobile dbt models developed by Snowplow
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';

export function DbtDetails(props) {
return <div className="dbt"><details>{props.children}</details></div>
}
```

:::caution

This page is auto-generated from our dbt packages, some information may be incomplete

:::
## Snowplow Mobile
### Snowplow Mobile App Errors {#model.snowplow_mobile.snowplow_mobile_app_errors}

<DbtDetails><summary>
<code>models/optional_modules/app_errors/snowplow_mobile_app_errors.sql</code>
</summary>

#### Description
This derived table contains all app errors and should be the end point for any analysis or BI tools looking to investigate app errors. This is an optional table that will be empty if the `app_errors` module is not enabled.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| event_id | A UUID for each event e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| app_id | Application ID e.g. `angry-birds` is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. production versus dev. |
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| device_user_id | Unique device user id. |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. `ecdff4d0-9175-40ac-a8bb-325c49733607`. |
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| session_index | A visit / session index e.g. `3`. |
| previous_session_id | A previous visit / session index e.g. `3`. |
| session_first_event_id | A first visit / session index e.g. `3`. |
| dvce_created_tstamp | Timestamp event was recorded on the client device e.g. `2013-11-26 00:03:57.885`. |
| collector_tstamp | Time stamp for the event recorded by the collector e.g. `2013-11-26 00:02:05`. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. `2013-11-26 00:02:04`. |
| model_tstamp | The current timestamp when the model processed this row. |
| platform | Platform e.g. `web`. |
| dvce_screenwidth | Screen width in pixels e.g. `1900`. |
| dvce_screenheight | Screen height in pixels e.g. `1024`. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| os_version | Operation system full version. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| open_idfa | Identifier for Vendors for Open devices. |
| screen_id | A UUID for each screen e.g. `738f1fbc-5298-46fa-9474-bc0a65f014ab`. |
| screen_name | The name set for a specific screen, e.g. `DemoScreenName`. |
| screen_activity | The name of the Activity element in the screen. |
| screen_fragment | The name of the screen fragment (also known as an anchor). |
| screen_top_view_controller | The name of the root view controller. |
| screen_type | The type of screen that was viewed. |
| screen_view_controller | The name of the view controller. |
| device_latitude | Latitude coordinates for device location. |
| device_longitude | Longitude coordinates for device location. |
| device_latitude_longitude_accuracy | Accuracy of Latitude and Longitude coordinates for device location. |
| device_altitude | Altitude coordinates for device location. |
| device_altitude_accuracy | Accuracy of device altitude coordinates. |
| device_bearing | Horizontal angle between device and true north. |
| device_speed | Mobile device speed. |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. `GB`, `US`. |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. `I9`, `TX`. |
| geo_city | City the visitor is in e.g. `New York`, `London`. |
| geo_zipcode | Postcode the visitor is in e.g. `94109`. |
| geo_latitude | Visitor location latitude e.g. `37.443604`. |
| geo_longitude | Visitor location longitude e.g. `-122.4124`. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| geo_timezone | Visitor timezone name e.g. `Europe/London`. |
| user_ipaddress | User IP address e.g. `92.231.54.234`. |
| useragent | Raw useragent. |
| carrier | Carrier serivce provider used within device. |
| network_technology | technology used by the network provider of the device. |
| network_type | Type of network eg. `3G`. |
| build | The build of the application. |
| version | The application version. |
| event_index_in_session | A session index of the event. |
| message | The error message that the application showed when the app error occurred. |
| programming_language | The name of the programming language used in which the app error occured. |
| class_name | The name of the class where the app error occurred. |
| exception_name | The name of the exception encountered in the app error. |
| is_fatal | A boolean to describe whether the app error was fatal or not. |
| line_number | The line number in the code where the app error occured. |
| stack_trace | The full stack trace that was presented when the app error occured. |
| thread_id | The ID of the thread in which the app error occurred. |
| thread_name | The name of the process that ran the thread when the app error occurred. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/optional_modules/app_errors/snowplow_mobile_app_errors.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='event_id',
    upsert_date_key='derived_tstamp',
    sort='derived_tstamp',
    dist='event_id',
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
      "field": "derived_tstamp",
      "data_type": "timestamp"
    }, databricks_partition_by='derived_tstamp_date'),
    cluster_by=snowplow_mobile.cluster_by_fields_app_errors(),
    tags=["derived"],
    enabled=var("snowplow__enable_app_errors_module", false),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}


select *
  {% if target.type in ['databricks', 'spark'] -%}
   , DATE(derived_tstamp) as derived_tstamp_date
   {%- endif %}
from {{ ref('snowplow_mobile_app_errors_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_mobile') }} --returns false if run doesn't contain new events.
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_mobile.cluster_by_fields_app_errors](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.cluster_by_fields_app_errors)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile App Errors This Run {#model.snowplow_mobile.snowplow_mobile_app_errors_this_run}

<DbtDetails><summary>
<code>models/optional_modules/app_errors/scratch/&lt;adaptor&gt;/snowplow_mobile_app_errors_this_run.sql</code>
</summary>

#### Description
This staging table contains all the app errors for the given run of the Mobile model. This is an optional table that will not be generated if the `app_errors` module is not enabled.

#### File Paths
<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery" >

`models/optional_modules/app_errors/scratch/bigquery/snowplow_mobile_app_errors_this_run.sql`
</TabItem>
<TabItem value="databricks" label="databricks" >

`models/optional_modules/app_errors/scratch/databricks/snowplow_mobile_app_errors_this_run.sql`
</TabItem>
<TabItem value="redshift/postgres" label="redshift/postgres" >

`models/optional_modules/app_errors/scratch/redshift_postgres/snowplow_mobile_app_errors_this_run.sql`
</TabItem>
<TabItem value="snowflake" label="snowflake" >

`models/optional_modules/app_errors/scratch/snowflake/snowplow_mobile_app_errors_this_run.sql`
</TabItem>
</Tabs>


#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| event_id | A UUID for each event e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| app_id | Application ID e.g. `angry-birds` is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. production versus dev. |
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| device_user_id | Unique device user id. |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. `ecdff4d0-9175-40ac-a8bb-325c49733607`. |
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| session_index | A visit / session index e.g. `3`. |
| previous_session_id | A previous visit / session index e.g. `3`. |
| session_first_event_id | A first visit / session index e.g. `3`. |
| dvce_created_tstamp | Timestamp event was recorded on the client device e.g. `2013-11-26 00:03:57.885`. |
| collector_tstamp | Time stamp for the event recorded by the collector e.g. `2013-11-26 00:02:05`. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. `2013-11-26 00:02:04`. |
| model_tstamp | The current timestamp when the model processed this row. |
| platform | Platform e.g. `web`. |
| dvce_screenwidth | Screen width in pixels e.g. `1900`. |
| dvce_screenheight | Screen height in pixels e.g. `1024`. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| os_version | Operation system full version. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| open_idfa | Identifier for Vendors for Open devices. |
| screen_id | A UUID for each screen e.g. `738f1fbc-5298-46fa-9474-bc0a65f014ab`. |
| screen_name | The name set for a specific screen, e.g. `DemoScreenName`. |
| screen_activity | The name of the Activity element in the screen. |
| screen_fragment | The name of the screen fragment (also known as an anchor). |
| screen_top_view_controller | The name of the root view controller. |
| screen_type | The type of screen that was viewed. |
| screen_view_controller | The name of the view controller. |
| device_latitude | Latitude coordinates for device location. |
| device_longitude | Longitude coordinates for device location. |
| device_latitude_longitude_accuracy | Accuracy of Latitude and Longitude coordinates for device location. |
| device_altitude | Altitude coordinates for device location. |
| device_altitude_accuracy | Accuracy of device altitude coordinates. |
| device_bearing | Horizontal angle between device and true north. |
| device_speed | Mobile device speed. |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. `GB`, `US`. |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. `I9`, `TX`. |
| geo_city | City the visitor is in e.g. `New York`, `London`. |
| geo_zipcode | Postcode the visitor is in e.g. `94109`. |
| geo_latitude | Visitor location latitude e.g. `37.443604`. |
| geo_longitude | Visitor location longitude e.g. `-122.4124`. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| geo_timezone | Visitor timezone name e.g. `Europe/London`. |
| user_ipaddress | User IP address e.g. `92.231.54.234`. |
| useragent | Raw useragent. |
| carrier | Carrier serivce provider used within device. |
| network_technology | technology used by the network provider of the device. |
| network_type | Type of network eg. `3G`. |
| build | The build of the application. |
| version | The application version. |
| event_index_in_session | A session index of the event. |
| message | The error message that the application showed when the app error occurred. |
| programming_language | The name of the programming language used in which the app error occured. |
| class_name | The name of the class where the app error occurred. |
| exception_name | The name of the exception encountered in the app error. |
| is_fatal | A boolean to describe whether the app error was fatal or not. |
| line_number | The line number in the code where the app error occured. |
| stack_trace | The full stack trace that was presented when the app error occured. |
| thread_id | The ID of the thread in which the app error occurred. |
| thread_name | The name of the process that ran the thread when the app error occurred. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/optional_modules/app_errors/scratch/bigquery/snowplow_mobile_app_errors_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"],
    enabled=(var("snowplow__enable_app_errors_module", false) and target.type == 'bigquery' | as_bool())
  )
}}

select
  e.event_id,

  e.app_id,

  e.user_id,
  e.device_user_id,
  e.network_userid,

  e.session_id,
  e.session_index,
  e.previous_session_id,
  e.session_first_event_id,

  e.dvce_created_tstamp,
  e.collector_tstamp,
  e.derived_tstamp,
  {{ snowplow_utils.current_timestamp_in_utc() }} AS model_tstamp,

  e.platform,
  e.dvce_screenwidth,
  e.dvce_screenheight,
  e.device_manufacturer,
  e.device_model,
  e.os_type,
  e.os_version,
  e.android_idfa,
  e.apple_idfa,
  e.apple_idfv,
  e.open_idfa,

  e.screen_id,
  e.screen_name,
  e.screen_activity,
  e.screen_fragment,
  e.screen_top_view_controller,
  e.screen_type,
  e.screen_view_controller,

  e.device_latitude,
  e.device_longitude,
  e.device_latitude_longitude_accuracy,
  e.device_altitude,
  e.device_altitude_accuracy,
  e.device_bearing,
  e.device_speed,
  e.geo_country,
  e.geo_region,
  e.geo_city,
  e.geo_zipcode,
  e.geo_latitude,
  e.geo_longitude,
  e.geo_region_name,
  e.geo_timezone,

  e.user_ipaddress,
  e.useragent,

  e.carrier,
  e.network_technology,
  e.network_type,

  e.build,
  e.version,
  e.event_index_in_session,

  -- app error events
  {{ snowplow_utils.get_optional_fields(
      enabled=true,
      fields=app_error_context_fields(),
      col_prefix='unstruct_event_com_snowplowanalytics_snowplow_application_error_1_',
      relation=ref('snowplow_mobile_base_events_this_run'),
      relation_alias='e') }}

from {{ ref('snowplow_mobile_base_events_this_run') }} as e

where e.event_name = 'application_error'
```
</TabItem>
<TabItem value="databricks" label="databricks" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/optional_modules/app_errors/scratch/databricks/snowplow_mobile_app_errors_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"],
    enabled=(var("snowplow__enable_app_errors_module", false) and target.type in ['databricks', 'spark'] | as_bool())
  )
}}

select
  e.event_id,

  e.app_id,

  e.user_id,
  e.device_user_id,
  e.network_userid,

  e.session_id,
  e.session_index,
  e.previous_session_id,
  e.session_first_event_id,

  e.dvce_created_tstamp,
  e.collector_tstamp,
  e.derived_tstamp,
  {{ snowplow_utils.current_timestamp_in_utc() }} AS model_tstamp,

  e.platform,
  e.dvce_screenwidth,
  e.dvce_screenheight,
  e.device_manufacturer,
  e.device_model,
  e.os_type,
  e.os_version,
  e.android_idfa,
  e.apple_idfa,
  e.apple_idfv,
  e.open_idfa,

  e.screen_id,
  e.screen_name,
  e.screen_activity,
  e.screen_fragment,
  e.screen_top_view_controller,
  e.screen_type,
  e.screen_view_controller,

  e.device_latitude,
  e.device_longitude,
  e.device_latitude_longitude_accuracy,
  e.device_altitude,
  e.device_altitude_accuracy,
  e.device_bearing,
  e.device_speed,

  e.geo_country,
  e.geo_region,
  e.geo_city,
  e.geo_zipcode,
  e.geo_latitude,
  e.geo_longitude,
  e.geo_region_name,
  e.geo_timezone,

  e.user_ipaddress,

  e.useragent,

  e.carrier,
  e.network_technology,
  e.network_type,

  e.build,
  e.version,
  e.event_index_in_session,

      --Error details
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1.message::STRING AS message,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1.programming_language::STRING AS programming_language,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1.class_name::STRING AS class_name,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1.exception_name::STRING AS exception_name,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1.is_fatal::BOOLEAN AS is_fatal,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1.line_number::INT AS line_number,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1.stack_trace::STRING AS stack_trace,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1.thread_id::INT AS thread_id,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1.thread_name::STRING AS thread_name

from {{ ref('snowplow_mobile_base_events_this_run') }} as e
where e.event_name = 'application_error'
```
</TabItem>
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/optional_modules/app_errors/scratch/redshift_postgres/snowplow_mobile_app_errors_this_run.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    sort='derived_tstamp',
    dist='event_id',
    tags=["this_run"],
    enabled=(var("snowplow__enable_app_errors_module", false) and target.type in ['redshift', 'postgres'] | as_bool())
  ) 
}}
{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(
                                      ref('snowplow_mobile_base_events_this_run'),
                                      'collector_tstamp',
                                      'collector_tstamp') %}

with app_errors_events as (
  select
      ae.root_id,
      ae.root_tstamp,
      ae.message,
      ae.programming_language,
      ae.class_name,
      ae.exception_name,
      ae.is_fatal,
      ae.line_number,
      ae.stack_trace,
      ae.thread_id,
      ae.thread_name

  from {{ var('snowplow__app_errors_table') }} ae

  where ae.root_tstamp between {{ lower_limit }} and {{ upper_limit }}
)

, app_error_base_events as (
  select *

  from {{ ref('snowplow_mobile_base_events_this_run') }} as ac

  where ac.event_name = 'application_error'
)
select 

  abe.event_id,

  abe.app_id,

  abe.user_id,
  abe.device_user_id,
  abe.network_userid,

  abe.session_id,
  abe.session_index,
  abe.previous_session_id,
  abe.session_first_event_id,

  abe.dvce_created_tstamp,
  abe.collector_tstamp,
  abe.derived_tstamp,
  CURRENT_TIMESTAMP AS model_tstamp,

  abe.platform,
  abe.dvce_screenwidth,
  abe.dvce_screenheight,
  abe.device_manufacturer,
  abe.device_model,
  abe.os_type,
  abe.os_version,
  abe.android_idfa,
  abe.apple_idfa,
  abe.apple_idfv,
  abe.open_idfa,

  abe.screen_id,
  abe.screen_name,
  abe.screen_activity,
  abe.screen_fragment,
  abe.screen_top_view_controller,
  abe.screen_type,
  abe.screen_view_controller,

  abe.device_latitude,
  abe.device_longitude,
  abe.device_latitude_longitude_accuracy,
  abe.device_altitude,
  abe.device_altitude_accuracy,
  abe.device_bearing,
  abe.device_speed,
  abe.geo_country,
  abe.geo_region,
  abe.geo_city,
  abe.geo_zipcode,
  abe.geo_latitude,
  abe.geo_longitude,
  abe.geo_region_name,
  abe.geo_timezone,

  abe.user_ipaddress,
  abe.useragent,

  abe.carrier,
  abe.network_technology,
  abe.network_type,

  abe.build,
  abe.version,
  abe.event_index_in_session,

  ae.message,
  ae.programming_language,
  ae.class_name,
  ae.exception_name,
  ae.is_fatal,
  ae.line_number,
  ae.stack_trace,
  ae.thread_id,
  ae.thread_name    

from app_error_base_events as abe
inner join app_errors_events ae
on abe.event_id = ae.root_id
and abe.collector_tstamp = ae.root_tstamp
```
</TabItem>
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/optional_modules/app_errors/scratch/snowflake/snowplow_mobile_app_errors_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"],
    enabled=(var("snowplow__enable_app_errors_module", false) and target.type == 'snowflake' | as_bool()),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

select
  e.event_id,

  e.app_id,

  e.user_id,
  e.device_user_id,
  e.network_userid,

  e.session_id,
  e.session_index,
  e.previous_session_id,
  e.session_first_event_id,

  e.dvce_created_tstamp,
  e.collector_tstamp,
  e.derived_tstamp,
  {{ snowplow_utils.current_timestamp_in_utc() }} AS model_tstamp,

  e.platform,
  e.dvce_screenwidth,
  e.dvce_screenheight,
  e.device_manufacturer,
  e.device_model,
  e.os_type,
  e.os_version,
  e.android_idfa,
  e.apple_idfa,
  e.apple_idfv,
  e.open_idfa,

  e.screen_id,
  e.screen_name,
  e.screen_activity,
  e.screen_fragment,
  e.screen_top_view_controller,
  e.screen_type,
  e.screen_view_controller,

  e.device_latitude,
  e.device_longitude,
  e.device_latitude_longitude_accuracy,
  e.device_altitude,
  e.device_altitude_accuracy,
  e.device_bearing,
  e.device_speed,

  e.geo_country,
  e.geo_region,
  e.geo_city,
  e.geo_zipcode,
  e.geo_latitude,
  e.geo_longitude,
  e.geo_region_name,
  e.geo_timezone,

  e.user_ipaddress,

  e.useragent,

  e.carrier,
  e.network_technology,
  e.network_type,

  e.build,
  e.version,
  e.event_index_in_session,

      --Error details
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1:message::VARCHAR() AS message,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1:programmingLanguage::VARCHAR() AS programming_language,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1:className::VARCHAR() AS class_name,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1:exceptionName::VARCHAR() AS exception_name,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1:isFatal::BOOLEAN AS is_fatal,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1:lineNumber::INT AS line_number,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1:stackTrace::VARCHAR() AS stack_trace,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1:threadId::INT AS thread_id,
  e.unstruct_event_com_snowplowanalytics_snowplow_application_error_1:threadName::VARCHAR() AS thread_name

from {{ ref('snowplow_mobile_base_events_this_run') }} as e
where e.event_name = 'application_error'
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_mobile.app_error_context_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.app_error_context_fields)
- [macro.snowplow_utils.current_timestamp_in_utc](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.current_timestamp_in_utc)
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)
- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Base App Context {#model.snowplow_mobile.snowplow_mobile_base_app_context}

<DbtDetails><summary>
<code>models/base/scratch/&lt;adaptor&gt;/contexts/snowplow_mobile_base_app_context.sql</code>
</summary>

#### Description
** This table only exists when working in a Redshift or Postgres warehouse. **

This optional table provides extra context on an event level and brings in data surrounding the application's build and version.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| root_id | The corresponding UUID used in the root table. |
| root_tstamp | The timestamp for when this event was produced. |
| build | The build of the application. |
| version | The application version. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/redshift_postgres/contexts/snowplow_mobile_base_app_context.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    enabled=(var("snowplow__enable_application_context", false) 
      and target.type in ['redshift','postgres'] | as_bool()),
    dist='root_id',
    sort='root_tstamp'
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(
                                      ref('snowplow_mobile_base_events_this_run_limits'),
                                      'lower_limit',
                                      'upper_limit') %}
select
  ac.root_id,
  ac.root_tstamp,
  ac.build,
  ac.version

from {{ var("snowplow__application_context") }} ac

where ac.root_tstamp between {{ lower_limit }} and {{ upper_limit }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Base Events This Run {#model.snowplow_mobile.snowplow_mobile_base_events_this_run}

<DbtDetails><summary>
<code>models/base/scratch/&lt;adaptor&gt;/snowplow_mobile_base_events_this_run.sql</code>
</summary>

#### Description
For any given run, this table contains all required events to be consumed by subsequent nodes in the Snowplow dbt mob package. This is a cleaned, de-duped dataset, containing all columns from the raw events table as well as having various optional contexts joined-on/unpacked.

**Note: This table should be used as the input to any custom modules that require event level data, rather than selecting straight from `atomic.events`**

#### File Paths
<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery" >

`models/base/scratch/bigquery/snowplow_mobile_base_events_this_run.sql`
</TabItem>
<TabItem value="databricks" label="databricks" >

`models/base/scratch/databricks/snowplow_mobile_base_events_this_run.sql`
</TabItem>
<TabItem value="redshift/postgres" label="redshift/postgres" >

`models/base/scratch/redshift_postgres/snowplow_mobile_base_events_this_run.sql`
</TabItem>
<TabItem value="snowflake" label="snowflake" >

`models/base/scratch/snowflake/snowplow_mobile_base_events_this_run.sql`
</TabItem>
</Tabs>


#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| screen_id | A UUID for each screen e.g. `738f1fbc-5298-46fa-9474-bc0a65f014ab`. |
| screen_name | The name set for a specific screen, e.g. `DemoScreenName`. |
| screen_activity | The name of the Activity element in the screen. |
| screen_fragment | The name of the screen fragment (also known as an anchor). |
| screen_top_view_controller | The name of the root view controller. |
| screescreen_top_view_controllern_type | The type of screen that was viewed. |
| screen_view_controller | The name of the view controller. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| os_version | Operation system full version. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| carrier | Carrier serivce provider used within device. |
| open_idfa | Identifier for Vendors for Open devices. |
| network_technology | technology used by the network provider of the device. |
| network_type | Type of network eg. `3G`. |
| device_latitude | Latitude coordinates for device location. |
| device_longitude | Longitude coordinates for device location. |
| device_latitude_longitude_accuracy | Accuracy of Latitude and Longitude coordinates for device location. |
| device_aldevice_latitude_longitude_accuracytitude | Altitude coordinates for device location. |
| device_altitude_accuracy | Accuracy of device altitude coordinates. |
| device_bearing | Horizontal angle between device and true north. |
| device_speed | Mobile device speed. |
| build | The build of the application. |
| version | The application version. |
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| session_index | A visit / session index e.g. `3`. |
| previous_session_id | A previous visit / session index e.g. `3`. |
| device_user_id | Unique device user id. |
| session_first_event_id | A first visit / session index e.g. `3`. |
| app_id | Application ID e.g. `angry-birds` is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. production versus dev. |
| platform | Platform e.g. `web`. |
| etl_tstamp | Timestamp event began ETL e.g. `2017-01-26 00:01:25.292`. |
| collector_tstamp | Time stamp for the event recorded by the collector e.g. `2013-11-26 00:02:05`. |
| dvce_created_tstamp | Timestamp event was recorded on the client device e.g. `2013-11-26 00:03:57.885`. |
| event | The type of event recorded e.g. `page_view`. |
| event_id | A UUID for each event e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| name_tracker | Tracker namespace e.g. `sp1`. |
| v_tracker | Tracker version e.g. `js-3.0.0`. |
| v_collector | Collector version e.g. `ssc-2.1.0-kinesis`. |
| v_etl | ETL version e.g. `snowplow-micro-1.1.0-common-1.4.2`. |
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| user_ipaddress | User IP address e.g. `92.231.54.234`. |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. `ecdff4d0-9175-40ac-a8bb-325c49733607`. |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. `GB`, `US`. |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. `I9`, `TX`. |
| geo_city | City the visitor is in e.g. `New York`, `London`. |
| geo_zipcode | Postcode the visitor is in e.g. `94109`. |
| geo_latitude | Visitor location latitude e.g. `37.443604`. |
| geo_longitude | Visitor location longitude e.g. `-122.4124`. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| ip_isp | Visitor's ISP e.g. `FDN Communications`. |
| ip_organization | Organization associated with the visitor's IP address - defaults to ISP name if none is found e.g. `Bouygues Telecom`. |
| ip_domain | Second level domain name associated with the visitor's IP address e.g. `nuvox.net`. |
| ip_netspeed | Visitor's connection type e.g. `Cable/DSL`. |
| se_category | Category of event e.g. `ecomm`, `video`. |
| se_action | Action performed / event name e.g. `add-to-basket`, `play-video`. |
| se_label | The object of the action e.g. the ID of the video played or SKU of the product added-to-basket e.g. `pbz00123`. |
| se_property | A property associated with the object of the action e.g. `HD`, `large`. |
| se_value | A value associated with the event / action e.g. the value of goods added-to-basket e.g. `9.99`. |
| tr_orderid | Order ID e.g. `#134`. |
| tr_affiliation | Transaction affiliation (e.g. store where sale took place) e.g. `web`. |
| tr_total | Total transaction value e.g. `12.99`. |
| tr_tax | Total tax included in transaction value e.g. `3.00`. |
| tr_shipping | Delivery cost charged e.g. `0.00`. |
| tr_city | Delivery address, city e.g. `London`. |
| tr_state | Delivery address, state e.g. `Washington`. |
| tr_country | Delivery address, country e.g. `France`. |
| ti_orderid | Order ID e.g. `#134`. |
| ti_sku | Product SKU e.g. `pbz00123`. |
| ti_name | Product name e.g. `Cone pendulum`. |
| ti_category | Product category e.g. `New Age`. |
| ti_price | Product unit price e.g. `9.99`. |
| ti_quantity | Number of product in transaction e.g. `2`. |
| useragent | Raw useragent. |
| dvce_screenwidth | Screen width in pixels e.g. `1900`. |
| dvce_screenheight | Screen height in pixels e.g. `1024`. |
| tr_currency | Currency e.g. `USD`. |
| tr_total_base | Total in base currency e.g. `12.99`. |
| tr_tax_base | Total tax in base currency e.g. `3.00`. |
| tr_shipping_base | decimal  Delivery cost in base currency e.g. `0.00`. |
| ti_currency | Currency e.g. `EUR`. |
| ti_price_base | decimal Price in base currency e.g. `9.99`. |
| base_currency | Reporting currency e.g. `GBP`. |
| geo_timezone | Visitor timezone name e.g. `Europe/London`. |
| etl_tags | JSON of tags for this ETL run e.g. `“['prod']”`. |
| dvce_sent_tstamp | When the event was sent by the client device e.g. `2013-11-26 00:03:58.032`. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. `2013-11-26 00:02:04`. |
| event_vendor | Who defined the event e.g. `com.acme`. |
| event_name | Event name e.g. `link_click`. |
| event_format | Format for event e.g. `jsonschema`. |
| event_version | Version of event schema e.g. `1-0-2`. |
| event_fingerprint | Hash client-set event fields e.g. `AADCE520E20C2899F4CED228A79A3083`. |
| true_tstamp | User-set “true timestamp” for the event e.g. `2013-11-26 00:02:04`. |
| event_id_dedupe_index |  |
| row_count |  |
| event_index_in_session | A session index of the event. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="bigquery" label="bigquery" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/bigquery/snowplow_mobile_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"]
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_mobile_base_sessions_this_run'),
                                                                          'start_tstamp',
                                                                          'end_tstamp') %}

{% set session_id = snowplow_mobile.get_session_id_path_sql(relation_alias='a') %}

with events as (
  select

-- handling relations for integration tests
  {% if target.schema.startswith('gh_sp_mobile_dbt_') %}
    -- screen view events
    {{ snowplow_utils.get_optional_fields(
          enabled=true,
          col_prefix='unstruct_event_com_snowplowanalytics_mobile_screen_view_1_',
          fields=screen_view_event_fields(),
          relation=ref('snowplow_mobile_events_stg'),
          relation_alias='a') }},
    -- session context
    {{ snowplow_utils.get_optional_fields(
          enabled=true,
          col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
          fields=session_context_fields(),
          relation=ref('snowplow_mobile_events_stg'),
          relation_alias='a') }},
    -- screen context
    {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_screen_context', false),
          col_prefix='contexts_com_snowplowanalytics_mobile_screen_1_',
          fields=screen_context_fields(),
          relation=ref('snowplow_mobile_events_stg'),
          relation_alias='a') }},
    -- mobile context
    {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_mobile_context', false),
          col_prefix='contexts_com_snowplowanalytics_snowplow_mobile_context_1_',
          fields=mobile_context_fields(),
          relation=ref('snowplow_mobile_events_stg'),
          relation_alias='a') }},
    -- geo context
    {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_geolocation_context', false),
          col_prefix='contexts_com_snowplowanalytics_snowplow_geolocation_context_1_',
          fields=geo_context_fields(),
          relation=ref('snowplow_mobile_events_stg'),
          relation_alias='a') }},
    -- app context
    {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_application_context', false),
          col_prefix='contexts_com_snowplowanalytics_mobile_application_1_',
          fields=app_context_fields(),
          relation=ref('snowplow_mobile_events_stg'),
          relation_alias='a') }},

  {% else %}
    -- screen view events
    {{ snowplow_utils.get_optional_fields(
          enabled=true,
          col_prefix='unstruct_event_com_snowplowanalytics_mobile_screen_view_1_',
          fields=screen_view_event_fields(),
          relation=source('atomic','events'),
          relation_alias='a') }},
    -- screen context
    {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_screen_context', false),
          col_prefix='contexts_com_snowplowanalytics_mobile_screen_1_',
          fields=screen_context_fields(),
          relation=source('atomic','events'),
          relation_alias='a') }},
    -- mobile context
    {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_mobile_context', false),
          col_prefix='contexts_com_snowplowanalytics_snowplow_mobile_context_1_',
          fields=mobile_context_fields(),
          relation=source('atomic','events'),
          relation_alias='a') }},
    -- geo context
    {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_geolocation_context', false),
          col_prefix='contexts_com_snowplowanalytics_snowplow_geolocation_context_1_',
          fields=geo_context_fields(),
          relation=source('atomic','events'),
          relation_alias='a') }},
    -- app context
    {{ snowplow_utils.get_optional_fields(
          enabled=var('snowplow__enable_application_context', false),
          col_prefix='contexts_com_snowplowanalytics_mobile_application_1_',
          fields=app_context_fields(),
          relation=source('atomic','events'),
          relation_alias='a') }},
    -- session context
    {{ snowplow_utils.get_optional_fields(
          enabled=true,
          col_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
          fields=session_context_fields(),
          relation=source('atomic','events'),
          relation_alias='a') }},

    {% endif %}

    a.*

  from {{ var('snowplow__events') }} as a
  inner join {{ ref('snowplow_mobile_base_sessions_this_run') }} as b
  on {{ session_id }} = b.session_id

  where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
  and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
  and a.collector_tstamp >= {{ lower_limit }}
  and a.collector_tstamp <= {{ upper_limit }}
  {% if var('snowplow__derived_tstamp_partitioned', true) and target.type == 'bigquery' | as_bool() %} -- BQ only
    and a.derived_tstamp >= {{ snowplow_utils.timestamp_add('hour', -1, lower_limit) }}
    and a.derived_tstamp <= {{ upper_limit }}
  {% endif %}
  and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
  and a.platform in ('{{ var("snowplow__platform")|join("','") }}') -- filters for 'mob' by default
)

, deduped_events as (
  -- without downstream joins, it's safe to dedupe by picking the first event_id found.
  select
    array_agg(e order by e.collector_tstamp limit 1)[offset(0)].*

  from events as e

  group by e.event_id
)

select
  d.*,
  row_number() over(partition by d.session_id order by d.derived_tstamp) as event_index_in_session

from deduped_events as d
```
</TabItem>
<TabItem value="databricks" label="databricks" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/databricks/snowplow_mobile_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{{
   config(
     tags=["this_run"]
   )
 }}

  {%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_mobile_base_sessions_this_run'),
                                                                           'start_tstamp',
                                                                           'end_tstamp') %}

  {% set session_id = snowplow_mobile.get_session_id_path_sql(relation_alias='a') %}

  with prep as (

    select
    -- screen view events
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1.id::STRING AS screen_view_id,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1.name::STRING AS screen_view_name,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1.previous_id::STRING AS screen_view_previous_id,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1.previous_name::STRING AS screen_view_previous_name,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1.previous_type::STRING AS screen_view_previous_type,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1.transition_type::STRING AS screen_view_transition_type,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1.type::STRING AS screen_view_type,
    -- screen context
    {% if var('snowplow__enable_screen_context', false) %}
      a.contexts_com_snowplowanalytics_mobile_screen_1[0].id::STRING AS screen_id,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0].name::STRING AS screen_name,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0].activity::STRING AS screen_activity,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0].fragment::STRING AS screen_fragment,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0].top_view_controller::STRING AS screen_top_view_controller,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0].type::STRING AS screen_type,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0].view_controller::STRING AS screen_view_controller,
    {% else %}
      cast(null as {{ type_string() }}) as screen_id, --could rename to screen_view_id and coalesce with screen view events.
      cast(null as {{ type_string() }}) as screen_name,
      cast(null as {{ type_string() }}) as screen_activity,
      cast(null as {{ type_string() }}) as screen_fragment,
      cast(null as {{ type_string() }}) as screen_top_view_controller,
      cast(null as {{ type_string() }}) as screen_type,
      cast(null as {{ type_string() }}) as screen_view_controller,
    {% endif %}
    -- mobile context
    {% if var('snowplow__enable_mobile_context', false) %}
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].device_manufacturer::STRING AS device_manufacturer,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].device_model::STRING AS device_model,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].os_type::STRING AS os_type,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].os_version::STRING AS os_version,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].android_idfa::STRING AS android_idfa,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].apple_idfa::STRING AS apple_idfa,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].apple_idfv::STRING AS apple_idfv,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].carrier::STRING AS carrier,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].open_idfa::STRING AS open_idfa,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].network_technology::STRING AS network_technology,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0].network_type::STRING AS network_type,
    {% else %}
      cast(null as {{ type_string() }}) as device_manufacturer,
      cast(null as {{ type_string() }}) as device_model,
      cast(null as {{ type_string() }}) as os_type,
      cast(null as {{ type_string() }}) as os_version,
      cast(null as {{ type_string() }}) as android_idfa,
      cast(null as {{ type_string() }}) as apple_idfa,
      cast(null as {{ type_string() }}) as apple_idfv,
      cast(null as {{ type_string() }}) as carrier,
      cast(null as {{ type_string() }}) as open_idfa,
      cast(null as {{ type_string() }}) as network_technology,
      cast(null as {{ type_string() }}) as network_type,
    {% endif %}
    -- geo context
    {% if var('snowplow__enable_geolocation_context', false) %}
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0].latitude::FLOAT AS device_latitude,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0].longitude::FLOAT AS device_longitude,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0].latitude_longitude_accuracy::FLOAT AS device_latitude_longitude_accuracy,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0].altitude::FLOAT AS device_altitude,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0].altitude_accuracy::FLOAT AS device_altitude_accuracy,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0].bearing::FLOAT AS device_bearing,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0].speed::FLOAT AS device_speed,
    {% else %}
      cast(null as {{ type_float() }}) as device_latitude,
      cast(null as {{ type_float() }}) as device_longitude,
      cast(null as {{ type_float() }}) as device_latitude_longitude_accuracy,
      cast(null as {{ type_float() }}) as device_altitude,
      cast(null as {{ type_float() }}) as device_altitude_accuracy,
      cast(null as {{ type_float() }}) as device_bearing,
      cast(null as {{ type_float() }}) as device_speed,
    {% endif %}
    -- app context
    {% if var('snowplow__enable_application_context', false) %}
      a.contexts_com_snowplowanalytics_mobile_application_1[0].build::STRING AS build,
      a.contexts_com_snowplowanalytics_mobile_application_1[0].version::STRING AS version,
    {% else %}
      cast(null as {{ type_string() }}) as build,
      cast(null as {{ type_string() }}) as version,
    {% endif %}
    -- session context
    a.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_id::STRING AS session_id,
    a.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_index::INT AS session_index,
    a.contexts_com_snowplowanalytics_snowplow_client_session_1[0].previous_session_id::STRING AS previous_session_id,
    a.contexts_com_snowplowanalytics_snowplow_client_session_1[0].user_id::STRING AS device_user_id,
    a.contexts_com_snowplowanalytics_snowplow_client_session_1[0].first_event_id::STRING AS session_first_event_id,
    -- select all fields in case of future additions to context schemas
    a.*

  from {{ var('snowplow__events') }} as a
  inner join {{ ref('snowplow_mobile_base_sessions_this_run') }} as b
  on {{ session_id }} = b.session_id

  where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
  and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
  and a.collector_tstamp >= {{ lower_limit }}
  and a.collector_tstamp <= {{ upper_limit }}
  and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
  and a.platform in ('{{ var("snowplow__platform")|join("','") }}') -- filters for 'mob' by default

  qualify row_number() over (partition by a.event_id order by a.collector_tstamp, a.etl_tstamp) = 1

  )

  select
    *,
    row_number() over(partition by session_id order by derived_tstamp) as event_index_in_session

  from prep
```
</TabItem>
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/redshift_postgres/snowplow_mobile_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sort='collector_tstamp',
    dist='event_id',
    tags=["this_run"]
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_mobile_base_sessions_this_run'),
                                                                          'start_tstamp',
                                                                          'end_tstamp') %}

/* Dedupe logic: Per dupe event_id keep earliest row ordered by collector_tstamp.
   If multiple earliest rows, i.e. matching collector_tstamp, remove entirely. */

with events_this_run AS (
  select
    sc.session_id,
    sc.session_index,
    sc.previous_session_id,
    sc.device_user_id,
    sc.session_first_event_id,

    e.*,
    dense_rank() over (partition by e.event_id order by e.collector_tstamp) as event_id_dedupe_index --dense_rank so rows with equal tstamps assigned same #

  from {{ var('snowplow__events') }} e
  inner join {{ ref('snowplow_mobile_base_session_context') }} sc
  on e.event_id = sc.root_id
  and e.collector_tstamp = sc.root_tstamp
  inner join {{ ref('snowplow_mobile_base_sessions_this_run') }} str
  on sc.session_id = str.session_id

  where e.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'str.start_tstamp') }}
  and e.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'e.dvce_created_tstamp') }}
  and e.collector_tstamp >= {{ lower_limit }}
  and e.collector_tstamp <= {{ upper_limit }}
  and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
  and e.platform in ('{{ var("snowplow__platform")|join("','") }}') -- filters for 'mob' by default
)

, events_dedupe as (
  select
    *,
    count(*) over(partition by e.event_id) as row_count

  from events_this_run e

  where e.event_id_dedupe_index = 1 -- Keep row(s) with earliest collector_tstamp per dupe event
)

, cleaned_events as (
  select *
  from events_dedupe
  where row_count = 1 -- Only keep dupes with single row per earliest collector_tstamp
)

select
  -- screen context
  {% if var("snowplow__enable_screen_context", false) %}
    sc.screen_id,
    sc.screen_name,
    sc.screen_activity,
    sc.screen_fragment,
    sc.screen_top_view_controller,
    sc.screen_type,
    sc.screen_view_controller,
  {% else %}
    cast(null as {{ type_string() }}) as screen_id, --could rename to screen_view_id and coalesce with screen view events.
    cast(null as {{ type_string() }}) as screen_name,
    cast(null as {{ type_string() }}) as screen_activity,
    cast(null as {{ type_string() }}) as screen_fragment,
    cast(null as {{ type_string() }}) as screen_top_view_controller,
    cast(null as {{ type_string() }}) as screen_type,
    cast(null as {{ type_string() }}) as screen_view_controller,
  {% endif %}
  -- mobile context
  {% if var("snowplow__enable_mobile_context", false) %}
    mc.device_manufacturer,
    mc.device_model,
    mc.os_type,
    mc.os_version,
    mc.android_idfa,
    mc.apple_idfa,
    mc.apple_idfv,
    mc.carrier,
    mc.open_idfa,
    mc.network_technology,
    mc.network_type,
  {% else %}
    cast(null as {{ type_string() }}) as device_manufacturer,
    cast(null as {{ type_string() }}) as device_model,
    cast(null as {{ type_string() }}) as os_type,
    cast(null as {{ type_string() }}) as os_version,
    cast(null as {{ type_string() }}) as android_idfa,
    cast(null as {{ type_string() }}) as apple_idfa,
    cast(null as {{ type_string() }}) as apple_idfv,
    cast(null as {{ type_string() }}) as carrier,
    cast(null as {{ type_string() }}) as open_idfa,
    cast(null as {{ type_string() }}) as network_technology,
    cast(null as {{ type_string() }}) as network_type,
  {% endif %}
  -- geo context
  {% if var("snowplow__enable_geolocation_context", false) %}
    gc.device_latitude,
    gc.device_longitude,
    gc.device_latitude_longitude_accuracy,
    gc.device_altitude,
    gc.device_altitude_accuracy,
    gc.device_bearing,
    gc.device_speed,
  {% else %}
    cast(null as {{ type_float() }}) as device_latitude,
    cast(null as {{ type_float() }}) as device_longitude,
    cast(null as {{ type_float() }}) as device_latitude_longitude_accuracy,
    cast(null as {{ type_float() }}) as device_altitude,
    cast(null as {{ type_float() }}) as device_altitude_accuracy,
    cast(null as {{ type_float() }}) as device_bearing,
    cast(null as {{ type_float() }}) as device_speed,
  {% endif %}
  -- app context
  {% if var("snowplow__enable_application_context", false) %}
    ac.build,
    ac.version,
  {% else %}
    cast(null as {{ type_string() }}) as build,
    cast(null as {{ type_string() }}) as version,
  {% endif %}
  e.*,
  row_number() over(partition by e.session_id order by e.derived_tstamp) as event_index_in_session

from cleaned_events e

{% if var("snowplow__enable_screen_context", false) %}
  left join {{ ref('snowplow_mobile_base_screen_context') }} sc
  on e.event_id = sc.root_id
  and e.collector_tstamp = sc.root_tstamp
{% endif %}

{% if var("snowplow__enable_mobile_context", false) %}
  left join {{ ref('snowplow_mobile_base_mobile_context') }} mc
  on e.event_id = mc.root_id
  and e.collector_tstamp = mc.root_tstamp
{% endif %}

{% if var("snowplow__enable_geolocation_context", false) %}
  left join {{ ref('snowplow_mobile_base_geo_context') }} gc
  on e.event_id = gc.root_id
  and e.collector_tstamp = gc.root_tstamp
{% endif %}

{% if var("snowplow__enable_application_context", false) %}
  left join {{ ref('snowplow_mobile_base_app_context') }} ac
  on e.event_id = ac.root_id
  and e.collector_tstamp = ac.root_tstamp
{% endif %}
```
</TabItem>
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/snowflake/snowplow_mobile_base_events_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_mobile_base_sessions_this_run'),
                                                                          'start_tstamp',
                                                                          'end_tstamp') %}

{% set session_id = snowplow_mobile.get_session_id_path_sql(relation_alias='a') %}

with events as (
  select
    -- screen view events
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1:id::varchar(36) AS screen_view_id,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1:name::varchar AS screen_view_name,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1:previousId::varchar(36) AS screen_view_previous_id,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1:previousName::varchar AS screen_view_previous_name,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1:previousType::varchar AS screen_view_previous_type,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1:transitionType::varchar AS screen_view_transition_type,
    a.unstruct_event_com_snowplowanalytics_mobile_screen_view_1:type::varchar AS screen_view_type,
    -- screen context
    {% if var('snowplow__enable_screen_context', false) %}
      a.contexts_com_snowplowanalytics_mobile_screen_1[0]:id::varchar(36) AS screen_id,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0]:name::varchar AS screen_name,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0]:activity::varchar AS screen_activity,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0]:fragment::varchar AS screen_fragment,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0]:topViewController::varchar AS screen_top_view_controller,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0]:type::varchar AS screen_type,
      a.contexts_com_snowplowanalytics_mobile_screen_1[0]:viewController::varchar AS screen_view_controller,
    {% else %}
      cast(null as {{ type_string() }}) as screen_id, --could rename to screen_view_id and coalesce with screen view events.
      cast(null as {{ type_string() }}) as screen_name,
      cast(null as {{ type_string() }}) as screen_activity,
      cast(null as {{ type_string() }}) as screen_fragment,
      cast(null as {{ type_string() }}) as screen_top_view_controller,
      cast(null as {{ type_string() }}) as screen_type,
      cast(null as {{ type_string() }}) as screen_view_controller,
    {% endif %}
    -- mobile context
    {% if var('snowplow__enable_mobile_context', false) %}
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:deviceManufacturer::varchar AS device_manufacturer,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:deviceModel::varchar AS device_model,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:osType::varchar AS os_type,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:osVersion::varchar AS os_version,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:androidIdfa::varchar AS android_idfa,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:appleIdfa::varchar AS apple_idfa,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:appleIdfv::varchar AS apple_idfv,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:carrier::varchar AS carrier,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:openIdfa::varchar AS open_idfa,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:networkTechnology::varchar AS network_technology,
      a.contexts_com_snowplowanalytics_snowplow_mobile_context_1[0]:networkType::varchar(255) AS network_type,
    {% else %}
      cast(null as {{ type_string() }}) as device_manufacturer,
      cast(null as {{ type_string() }}) as device_model,
      cast(null as {{ type_string() }}) as os_type,
      cast(null as {{ type_string() }}) as os_version,
      cast(null as {{ type_string() }}) as android_idfa,
      cast(null as {{ type_string() }}) as apple_idfa,
      cast(null as {{ type_string() }}) as apple_idfv,
      cast(null as {{ type_string() }}) as carrier,
      cast(null as {{ type_string() }}) as open_idfa,
      cast(null as {{ type_string() }}) as network_technology,
      cast(null as {{ type_string() }}) as network_type,
    {% endif %}
    -- geo context
    {% if var('snowplow__enable_geolocation_context', false) %}
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0]:latitude::float AS device_latitude,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0]:longitude::float AS device_longitude,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0]:latitudeLongitudeAccuracy::float AS device_latitude_longitude_accuracy,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0]:altitude::float AS device_altitude,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0]:altitudeAccuracy::float AS device_altitude_accuracy,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0]:bearing::float AS device_bearing,
      a.contexts_com_snowplowanalytics_snowplow_geolocation_context_1[0]:speed::float AS device_speed,
    {% else %}
      cast(null as {{ type_float() }}) as device_latitude,
      cast(null as {{ type_float() }}) as device_longitude,
      cast(null as {{ type_float() }}) as device_latitude_longitude_accuracy,
      cast(null as {{ type_float() }}) as device_altitude,
      cast(null as {{ type_float() }}) as device_altitude_accuracy,
      cast(null as {{ type_float() }}) as device_bearing,
      cast(null as {{ type_float() }}) as device_speed,
    {% endif %}
    -- app context
    {% if var('snowplow__enable_application_context', false) %}
      a.contexts_com_snowplowanalytics_mobile_application_1[0]:build::varchar(255) AS build,
      a.contexts_com_snowplowanalytics_mobile_application_1[0]:version::varchar(255) AS version,
    {% else %}
      cast(null as {{ type_string() }}) as build,
      cast(null as {{ type_string() }}) as version,
    {% endif %}
    -- session context
    a.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionId::varchar(36) AS session_id,
    a.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionIndex::int AS session_index,
    a.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:previousSessionId::varchar(36) AS previous_session_id,
    a.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:userId::varchar(36) AS device_user_id,
    a.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:firstEventId::varchar(36) AS session_first_event_id,
    -- select all fields in case of future additions to context schemas
    a.*

  from {{ var('snowplow__events') }} as a
  inner join {{ ref('snowplow_mobile_base_sessions_this_run') }} as b
  on {{ session_id }} = b.session_id

  where a.collector_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'b.start_tstamp') }}
  and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'a.dvce_created_tstamp') }}
  and a.collector_tstamp >= {{ lower_limit }}
  and a.collector_tstamp <= {{ upper_limit }}
  and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
  and a.platform in ('{{ var("snowplow__platform")|join("','") }}') -- filters for 'mob' by default
)

, deduped_events AS (
  select
    e.*

  from events e

  qualify row_number() over (partition by e.event_id order by e.collector_tstamp) = 1
)

select
  d.*,
  row_number() over(partition by d.session_id order by d.derived_tstamp) as event_index_in_session

from deduped_events as d
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- macro.dbt.type_string
- [macro.snowplow_mobile.app_context_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.app_context_fields)
- [macro.snowplow_mobile.geo_context_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.geo_context_fields)
- [macro.snowplow_mobile.get_session_id_path_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.get_session_id_path_sql)
- [macro.snowplow_mobile.mobile_context_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_context_fields)
- [macro.snowplow_mobile.screen_context_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.screen_context_fields)
- [macro.snowplow_mobile.screen_view_event_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.screen_view_event_fields)
- [macro.snowplow_mobile.session_context_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.session_context_fields)
- [macro.snowplow_utils.app_id_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.app_id_filter)
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)
- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_screen_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views_this_run)
- [model.snowplow_mobile.snowplow_mobile_sessions_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_aggs)
- [model.snowplow_mobile.snowplow_mobile_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_this_run)
- [model.snowplow_mobile.snowplow_mobile_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_user_mapping)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Base Events This Run Limits {#model.snowplow_mobile.snowplow_mobile_base_events_this_run_limits}

<DbtDetails><summary>
<code>models/base/scratch/&lt;adaptor&gt;/snowplow_mobile_base_events_this_run_limits.sql</code>
</summary>

#### Description
This table contains the lower and upper timestamp limits for the given run of the mobile model. These limits are used to select new events from the events table. These limits are determined by taking the `MIN` of the `start_tstamp` and `MAX` of the `end_tstamp` from the `snowplow_mobile_base_sessions_this_run` table for the `lower_limit` and `upper_limit` respectively.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| lower_limit | The min `start_tstamp` of all events processed this run |
| upper_limit | The max `end_tstamp` of all events processed this run |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/redshift_postgres/snowplow_mobile_base_events_this_run_limits.sql">Source</a></i></b></center>

```jinja2
select
  min(s.start_tstamp) as lower_limit,
  max(s.end_tstamp) as upper_limit

from {{ ref('snowplow_mobile_base_sessions_this_run') }} s
```
</TabItem>
</Tabs>

</DbtDetails>

</DbtDetails>

### Snowplow Mobile Base Geo Context {#model.snowplow_mobile.snowplow_mobile_base_geo_context}

<DbtDetails><summary>
<code>models/base/scratch/&lt;adaptor&gt;/contexts/snowplow_mobile_base_geo_context.sql</code>
</summary>

#### Description
** This table only exists when working in a Redshift or Postgres warehouse. **

This optional table provides extra context on an event level and brings in data surrounding a device's geographical properties, such as latitude/longitude, altitude, and speed.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| root_id | The corresponding UUID used in the root table. |
| root_tstamp | The timestamp for when this event was produced. |
| device_latitude | Latitude coordinates for device location. |
| device_longitude | Longitude coordinates for device location. |
| device_latitude_longitude_accuracy | Accuracy of Latitude and Longitude coordinates for device location. |
| device_altitude | Altitude coordinates for device location. |
| device_altitude_accuracy | Accuracy of device altitude coordinates. |
| device_bearing | Horizontal angle between device and true north. |
| device_speed | Mobile device speed. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/redshift_postgres/contexts/snowplow_mobile_base_geo_context.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    enabled=(var("snowplow__enable_geolocation_context", false) 
      and target.type in ['redshift','postgres'] | as_bool()),
    dist='root_id',
    sort='root_tstamp'
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(
                                      ref('snowplow_mobile_base_events_this_run_limits'),
                                      'lower_limit',
                                      'upper_limit') %}
select
  gc.root_id,
  gc.root_tstamp,
  gc.latitude AS device_latitude,
  gc.longitude AS device_longitude,
  gc.latitude_longitude_accuracy AS device_latitude_longitude_accuracy,
  gc.altitude AS device_altitude,
  gc.altitude_accuracy AS device_altitude_accuracy,
  gc.bearing AS device_bearing,
  gc.speed AS device_speed

from {{ var("snowplow__geolocation_context") }} gc

where gc.root_tstamp between {{ lower_limit }} and {{ upper_limit }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Base Mobile Context {#model.snowplow_mobile.snowplow_mobile_base_mobile_context}

<DbtDetails><summary>
<code>models/base/scratch/&lt;adaptor&gt;/contexts/snowplow_mobile_base_mobile_context.sql</code>
</summary>

#### Description
** This table only exists when working in a Redshift or Postgres warehouse. **

This optional table provides extra context on an event level and brings in data surrounding a device's manufacturer, model, and carrier.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| root_id | The corresponding UUID used in the root table. |
| root_tstamp | The timestamp for when this event was produced. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| os_version | Operation system full version. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| carrier | Carrier serivce provider used within device. |
| open_idfa | Identifier for Vendors for Open devices. |
| network_technology | technology used by the network provider of the device. |
| network_type | Type of network eg. `3G`. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/redshift_postgres/contexts/snowplow_mobile_base_mobile_context.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    enabled=(var("snowplow__enable_mobile_context", false) 
      and target.type in ['redshift','postgres'] | as_bool()),
    dist='root_id',
    sort='root_tstamp'
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(
                                      ref('snowplow_mobile_base_events_this_run_limits'),
                                      'lower_limit',
                                      'upper_limit') %}
select
  m.root_id,
  m.root_tstamp,
  m.device_manufacturer,
  m.device_model,
  m.os_type,
  m.os_version,
  m.android_idfa,
  m.apple_idfa,
  m.apple_idfv,
  m.carrier,
  m.open_idfa,
  m.network_technology,
  m.network_type

from {{ var("snowplow__mobile_context") }} m

where m.root_tstamp between {{ lower_limit }} and {{ upper_limit }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Base New Event Limits {#model.snowplow_mobile.snowplow_mobile_base_new_event_limits}

<DbtDetails><summary>
<code>models/base/scratch/snowplow_mobile_base_new_event_limits.sql</code>
</summary>

#### Description
This table contains the lower and upper timestamp limits for the given run of the mobile model. These limits are used to select new events from the events table.

The sql to determine the correct limits for the run is generated by the `get_run_limits()` macro. Please refer to the documentation for details on how this macro determines the run limits.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| lower_limit | The lower `collector_tstamp` limit for the run |
| upper_limit | The upper `collector_tstamp` limit for the run |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/snowplow_mobile_base_new_event_limits.sql">Source</a></i></b></center>

```jinja2
{{ config(
    post_hook=["{{snowplow_utils.print_run_limits(this)}}"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}


{%- set models_in_run = snowplow_utils.get_enabled_snowplow_models('snowplow_mobile') -%}

{% set min_last_success,
         max_last_success, 
         models_matched_from_manifest,
         has_matched_all_models = snowplow_utils.get_incremental_manifest_status(ref('snowplow_mobile_incremental_manifest'),
                                                                                 models_in_run) -%}


{% set run_limits_query = snowplow_utils.get_run_limits(min_last_success, 
                                                          max_last_success,
                                                          models_matched_from_manifest,
                                                          has_matched_all_models,
                                                          var("snowplow__start_date","2020-01-01")) -%}


{{ run_limits_query }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_incremental_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_enabled_snowplow_models](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_enabled_snowplow_models)
- [macro.snowplow_utils.get_incremental_manifest_status](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_incremental_manifest_status)
- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)
- [macro.snowplow_utils.print_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_run_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_this_run)
- [model.snowplow_mobile.snowplow_mobile_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views)
- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)
- [model.snowplow_mobile.snowplow_mobile_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_user_mapping)
- [model.snowplow_mobile.snowplow_mobile_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Base Screen Context {#model.snowplow_mobile.snowplow_mobile_base_screen_context}

<DbtDetails><summary>
<code>models/base/scratch/&lt;adaptor&gt;/contexts/snowplow_mobile_base_screen_context.sql</code>
</summary>

#### Description
** This table only exists when working in a Redshift or Postgres warehouse. **

This optional table provides extra context on an event level and brings in data surrounding the screen that the application is on, such as the screen's id, activity, and type.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| root_id | The corresponding UUID used in the root table. |
| root_tstamp | The timestamp for when this event was produced. |
| screen_id | A UUID for each screen e.g. `738f1fbc-5298-46fa-9474-bc0a65f014ab`. |
| screen_name | The name set for a specific screen, e.g. `DemoScreenName`. |
| screen_activity | The name of the Activity element in the screen. |
| screen_fragment | The name of the screen fragment (also known as an anchor). |
| screen_top_view_controller | The name of the root view controller. |
| screen_type | The type of screen that was viewed. |
| screen_view_controller | The name of the view controller. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/redshift_postgres/contexts/snowplow_mobile_base_screen_context.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    enabled=(var("snowplow__enable_screen_context", false) 
      and target.type in ['redshift','postgres'] | as_bool()),
    dist='root_id',
    sort='root_tstamp'
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(
                                      ref('snowplow_mobile_base_events_this_run_limits'),
                                      'lower_limit',
                                      'upper_limit') %}
select
  sc.root_id,
  sc.root_tstamp,
  sc.id AS screen_id,
  sc.name AS screen_name,
  sc.activity AS screen_activity,
  sc.fragment AS screen_fragment,
  sc.top_view_controller AS screen_top_view_controller,
  sc.type AS screen_type,
  sc.view_controller AS screen_view_controller

from {{ var("snowplow__screen_context") }} sc

where sc.root_tstamp between {{ lower_limit }} and {{ upper_limit }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Base Session Context {#model.snowplow_mobile.snowplow_mobile_base_session_context}

<DbtDetails><summary>
<code>models/base/scratch/&lt;adaptor&gt;/contexts/snowplow_mobile_base_session_context.sql</code>
</summary>

#### Description
** This table only exists when working in a Redshift or Postgres warehouse. **

This optional table provides extra context on an event level and brings in data surrounding the session that the application is in, such as the session's first event ID, and the ID of the previous session.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| root_id | The corresponding UUID used in the root table. |
| root_tstamp | The timestamp for when this event was produced. |
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| session_index | A visit / session index e.g. `3`. |
| previous_session_id | A previous visit / session index e.g. `3`. |
| device_user_id | Unique device user id. |
| session_first_event_id | A first visit / session index e.g. `3`. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/redshift_postgres/contexts/snowplow_mobile_base_session_context.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    enabled=(target.type in ['redshift','postgres'] | as_bool()),
    dist='root_id',
    sort='root_tstamp'
  )
}}

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(
                                      ref('snowplow_mobile_base_events_this_run_limits'),
                                      'lower_limit',
                                      'upper_limit') %}
select
  s.root_id,
  s.root_tstamp,
  s.session_id,
  s.session_index,
  s.previous_session_id,
  s.user_id as device_user_id,
  s.first_event_id as session_first_event_id

from {{ var("snowplow__session_context") }} s

where s.root_tstamp between {{ lower_limit }} and {{ upper_limit }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Base Sessions Lifecycle Manifest {#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest}

<DbtDetails><summary>
<code>models/base/manifest/&lt;adaptor&gt;/snowplow_mobile_base_sessions_lifecycle_manifest.sql</code>
</summary>

#### Description
This incremental table is a manifest of all sessions that have been processed by the Snowplow dbt mobile model. For each session, the start and end timestamp is recorded.

By knowing the life-cycle of a session the model is able to able to determine which sessions and thus events to process for a given time-frame, as well as the complete date range required to reprocess all events of each session.

#### File Paths
<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

`models/base/manifest/default/snowplow_mobile_base_sessions_lifecycle_manifest.sql`
</TabItem>
<TabItem value="redshift/postgres" label="redshift/postgres" >

`models/base/manifest/redshift_postgres/snowplow_mobile_base_sessions_lifecycle_manifest.sql`
</TabItem>
</Tabs>


#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| device_user_id |  Unique device user id. |
| start_tstamp | The `collector_tstamp` when the session began. |
| end_tstamp | The `collector_tstamp` when the session ended. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/manifest/default/snowplow_mobile_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_partition_by='start_tstamp_date'),
    cluster_by=mobile_cluster_by_fields_sessions_lifecycle(),
    full_refresh=snowplow_mobile.allow_refresh(),
    tags=["manifest"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_mobile_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_mobile') %}
{% set session_id = snowplow_mobile.get_session_id_path_sql(relation_alias='e') %}
{% set user_id  = snowplow_mobile.get_device_user_id_path_sql(relation_alias='e')%}

with new_events_session_ids as (
  select
    {{ session_id }} as session_id,
    max( {{ user_id }} ) as device_user_id,
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e

  where
    {{ session_id }} is not null
    and e.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'dvce_created_tstamp') }} -- don't process data that's too late
    and e.collector_tstamp >= {{ lower_limit }}
    and e.collector_tstamp <= {{ upper_limit }}
    and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
    and e.platform in ('{{ var("snowplow__platform")|join("','") }}') -- filters for 'mob' by default
    and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
    {% if var('snowplow__derived_tstamp_partitioned', true) and target.type == 'bigquery' | as_bool() %} -- BQ only
      and e.derived_tstamp >= {{ snowplow_utils.timestamp_add('hour', -1, lower_limit) }}
      and e.derived_tstamp <= {{ upper_limit }}
    {% endif %}
  group by 1
  )

{% if snowplow_utils.snowplow_is_incremental() %}

, previous_sessions as (
  select *

  from {{ this }}

  where start_tstamp >= {{ session_lookback_limit }}
  and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
)

, session_lifecycle as (
  select
    ns.session_id,
    ns.device_user_id,
    least(ns.start_tstamp, coalesce(self.start_tstamp, ns.start_tstamp)) as start_tstamp,
    greatest(ns.end_tstamp, coalesce(self.end_tstamp, ns.end_tstamp)) as end_tstamp -- BQ 1 NULL will return null hence coalesce

  from new_events_session_ids ns
  left join previous_sessions as self
    on ns.session_id = self.session_id

  where
    self.session_id is null -- process all new sessions
    or self.end_tstamp < {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'self.start_tstamp') }} --stop updating sessions exceeding 3 days
  )

{% else %}

, session_lifecycle as (

  select * from new_events_session_ids

)

{% endif %}

select
  sl.session_id,
  sl.device_user_id,
  sl.start_tstamp,
  least({{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'sl.start_tstamp') }}, sl.end_tstamp) as end_tstamp -- limit session length to max_session_days
  {% if target.type in ['databricks', 'spark'] -%}
  , DATE(start_tstamp) as start_tstamp_date
  {%- endif %}

from session_lifecycle sl
```
</TabItem>
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/manifest/redshift_postgres/snowplow_mobile_base_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sort='start_tstamp',
    dist='session_id',
    full_refresh=snowplow_mobile.allow_refresh(),
    tags=["manifest"]
  )
}}

{% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(ref('snowplow_mobile_base_new_event_limits')) %}
{% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
{% set is_run_with_new_events = snowplow_utils.is_run_with_new_events('snowplow_mobile') %}

with session_context as (
  select
    s.root_id,
    s.root_tstamp,
    s.session_id,
    s.user_id as device_user_id

  from {{ var('snowplow__session_context') }} s
  where s.root_tstamp between {{ lower_limit }} and {{ upper_limit }}
)

, new_events_session_ids as (
  select
    sc.session_id,
    max(sc.device_user_id) as device_user_id,
    min(e.collector_tstamp) as start_tstamp,
    max(e.collector_tstamp) as end_tstamp

  from {{ var('snowplow__events') }} e
  inner join session_context sc
  on e.event_id = sc.root_id
  and e.collector_tstamp = sc.root_tstamp

  where
    sc.session_id is not null
    and e.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', var("snowplow__days_late_allowed", 3), 'dvce_created_tstamp') }} -- don't process data that's too late
    and e.collector_tstamp >= {{ lower_limit }}
    and e.collector_tstamp <= {{ upper_limit }}
    and {{ snowplow_utils.app_id_filter(var("snowplow__app_id",[])) }}
    and e.platform in ('{{ var("snowplow__platform")|join("','") }}') -- filters for 'mob' by default
    and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.

  group by 1
  )

{% if snowplow_utils.snowplow_is_incremental() %}

, previous_sessions as (
  select *

  from {{ this }}

  where start_tstamp >= {{ session_lookback_limit }}
  and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
)

, session_lifecycle as (
  select
    ns.session_id,
    ns.device_user_id,
    least(ns.start_tstamp, coalesce(self.start_tstamp, ns.start_tstamp)) as start_tstamp,
    greatest(ns.end_tstamp, coalesce(self.end_tstamp, ns.end_tstamp)) as end_tstamp -- BQ 1 NULL will return null hence coalesce

  from new_events_session_ids ns
  left join previous_sessions as self
    on ns.session_id = self.session_id

  where
    self.session_id is null -- process all new sessions
    or self.end_tstamp < {{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'self.start_tstamp') }} --stop updating sessions exceeding 3 days
  )

{% else %}

, session_lifecycle as (

  select * from new_events_session_ids

)

{% endif %}

select
  sl.session_id,
  sl.device_user_id,
  sl.start_tstamp,
  least({{ snowplow_utils.timestamp_add('day', var("snowplow__max_session_days", 3), 'sl.start_tstamp') }}, sl.end_tstamp) as end_tstamp -- limit session length to max_session_days

from session_lifecycle sl
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_incremental_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_mobile.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.allow_refresh)
- [macro.snowplow_mobile.get_device_user_id_path_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.get_device_user_id_path_sql)
- [macro.snowplow_mobile.get_session_id_path_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.get_session_id_path_sql)
- [macro.snowplow_mobile.mobile_cluster_by_fields_sessions_lifecycle](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_sessions_lifecycle)
- [macro.snowplow_utils.app_id_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.app_id_filter)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.get_session_lookback_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_session_lookback_limit)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.snowplow_is_incremental](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_is_incremental)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Base Sessions This Run {#model.snowplow_mobile.snowplow_mobile_base_sessions_this_run}

<DbtDetails><summary>
<code>models/base/scratch/snowplow_mobile_base_sessions_this_run.sql</code>
</summary>

#### Description
For any given run, this table contains all the required sessions.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| device_user_id | Unique device user id. |
| start_tstamp | The `collector_tstamp` when the session began. |
| end_tstamp | The `collector_tstamp` when the session ended. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/scratch/snowplow_mobile_base_sessions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sort='start_tstamp',
    dist='session_id',
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

{%- set lower_limit,
        upper_limit,
        session_start_limit  = snowplow_utils.return_base_new_event_limits(ref('snowplow_mobile_base_new_event_limits')) %}

select
  s.session_id,
  s.device_user_id,
  s.start_tstamp,
  -- end_tstamp used in next step to limit events. When backfilling, set end_tstamp to upper_limit if end_tstamp > upper_limit.
  -- This ensures we don't accidentally process events after upper_limit
  case when s.end_tstamp > {{ upper_limit }} then {{ upper_limit }} else s.end_tstamp end as end_tstamp

from {{ ref('snowplow_mobile_base_sessions_lifecycle_manifest')}} s

where
-- General window of start_tstamps to limit table scans. Logic complicated by backfills.
-- To be within the run, session start_tstamp must be >= lower_limit - max_session_days as we limit end_tstamp in manifest to start_tstamp + max_session_days
s.start_tstamp >= {{ session_start_limit }}
and s.start_tstamp <= {{ upper_limit }}
-- Select sessions within window that either; start or finish between lower & upper limit, start and finish outside of lower and upper limits
and not (s.start_tstamp > {{ upper_limit }} or s.end_tstamp < {{ lower_limit }})
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_users_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Incremental Manifest {#model.snowplow_mobile.snowplow_mobile_incremental_manifest}

<DbtDetails><summary>
<code>models/base/manifest/snowplow_mobile_incremental_manifest.sql</code>
</summary>

#### Description
This incremental table is a manifest of the timestamp of the latest event consumed per model within the `snowplow-mobile` package as well as any models leveraging the incremental framework provided by the package. The latest event's timestamp is based off `collector_tstamp`. This table is used to determine what events should be processed in the next run of the model.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| model | The name of the model. |
| last_success | The latest event consumed by the model, based on `collector_tstamp` |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/base/manifest/snowplow_mobile_incremental_manifest.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='incremental',
    full_refresh=snowplow_mobile.allow_refresh(),
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

-- Boilerplate to generate table.
-- Table updated as part of end-run hook

with prep as (
  select
    cast(null as {{ snowplow_utils.type_string(4096) }}) model,
    cast('1970-01-01' as {{ type_timestamp() }}) as last_success
)

select *

from prep
where false
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- macro.dbt.type_timestamp
- [macro.snowplow_mobile.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.allow_refresh)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.type_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_string)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views)
- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)
- [model.snowplow_mobile.snowplow_mobile_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_user_mapping)
- [model.snowplow_mobile.snowplow_mobile_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Screen Views {#model.snowplow_mobile.snowplow_mobile_screen_views}

<DbtDetails><summary>
<code>models/screen_views/snowplow_mobile_screen_views.sql</code>
</summary>

#### Description
This staging table contains all the screen views for the given run of the mobile model. It possess all the same columns as `snowplow_mobile_screen_views`. If building a custom module that requires screen view events, this is the table you should reference.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| screen_view_id | The UUID of a screen view. |
| event_id | A UUID for each event e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| app_id | Application ID e.g. `angry-birds` is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. production versus dev. |
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| device_user_id | Unique device user id. |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. `ecdff4d0-9175-40ac-a8bb-325c49733607`. |
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| session_index | A visit / session index e.g. `3`. |
| previous_session_id | A previous visit / session index e.g. `3`. |
| session_first_event_id | A first visit / session index e.g. `3`. |
| screen_view_in_session_index | The index of the screen view within the session. This is generated by the tracker. |
| screen_views_in_session | Total number of screen views within a session. |
| dvce_created_tstamp | Timestamp event was recorded on the client device e.g. `2013-11-26 00:03:57.885`. |
| collector_tstamp | Time stamp for the event recorded by the collector e.g. `2013-11-26 00:02:05`. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. `2013-11-26 00:02:04`. |
| model_tstamp | The current timestamp when the model processed this row. |
| screen_view_name | Name of the screen viewed. |
| screen_view_transition_type | The type of transition that led to the screen being viewed. |
| screen_view_type | The type of screen that was viewed. |
| screen_fragment | The name of the screen fragment (also known as an anchor). |
| screen_top_view_controller | The name of the root view controller. |
| screen_view_controller | The name of the view controller. |
| screen_view_previous_id | The UUID of the previous screen view. |
| screen_view_previous_name | The name of the previous screen view. |
| screen_view_previous_type | The type of the previous screen viewed. |
| platform | Platform e.g. `web`. |
| dvce_screenwidth | Screen width in pixels e.g. `1900`. |
| dvce_screenheight | Screen height in pixels e.g. `1024`. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| os_version | Operation system full version. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| open_idfa | Identifier for Vendors for Open devices. |
| device_latitude | Latitude coordinates for device location. |
| device_longitude | Longitude coordinates for device location. |
| device_latitude_longitude_accuracy | Accuracy of Latitude and Longitude coordinates for device location. |
| device_altitude | Altitude coordinates for device location. |
| device_altitude_accuracy | Accuracy of device altitude coordinates. |
| device_bearing | Horizontal angle between device and true north. |
| device_speed | Mobile device speed. |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. `GB`, `US`. |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. `I9`, `TX`. |
| geo_city | City the visitor is in e.g. `New York`, `London`. |
| geo_zipcode | Postcode the visitor is in e.g. `94109`. |
| geo_latitude | Visitor location latitude e.g. `37.443604`. |
| geo_longitude | Visitor location longitude e.g. `-122.4124`. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| geo_timezone | Visitor timezone name e.g. `Europe/London`. |
| user_ipaddress | User IP address e.g. `92.231.54.234`. |
| useragent | Raw useragent. |
| carrier | Carrier serivce provider used within device. |
| network_technology | technology used by the network provider of the device. |
| network_type | Type of network eg. `3G`. |
| build | The build of the application. |
| version | The application version. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/screen_views/snowplow_mobile_screen_views.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='screen_view_id',
    upsert_date_key='derived_tstamp',
    sort='derived_tstamp',
    dist='screen_view_id',
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
       "field": "derived_tstamp",
       "data_type": "timestamp"
     }, databricks_partition_by='derived_tstamp_date'),
    cluster_by=snowplow_mobile.mobile_cluster_by_fields_screen_views(),
    tags=["derived"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}


select *
    {% if target.type in ['databricks', 'spark'] -%}
    , DATE(derived_tstamp) as derived_tstamp_date
    {%- endif %}
from {{ ref('snowplow_mobile_screen_views_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_mobile') }} --returns false if run doesn't contain new events.
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_incremental_manifest)
- [model.snowplow_mobile.snowplow_mobile_screen_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_mobile.mobile_cluster_by_fields_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_screen_views)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Screen Views This Run {#model.snowplow_mobile.snowplow_mobile_screen_views_this_run}

<DbtDetails><summary>
<code>models/screen_views/scratch/&lt;adaptor&gt;/snowplow_mobile_screen_views_this_run.sql</code>
</summary>

#### Description
This staging table contains all the screen views for the given run of the mobile model. It possess all the same columns as `snowplow_mobile_screen_views`. If building a custom module that requires screen view events, this is the table you should reference.

#### File Paths
<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

`models/screen_views/scratch/default/snowplow_mobile_screen_views_this_run.sql`
</TabItem>
<TabItem value="redshift/postgres" label="redshift/postgres" >

`models/screen_views/scratch/redshift_postgres/snowplow_mobile_screen_views_this_run.sql`
</TabItem>
</Tabs>


#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| screen_view_id | The UUID of a screen view. |
| event_id | A UUID for each event e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| app_id | Application ID e.g. `angry-birds` is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. production versus dev. |
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| device_user_id | Unique device user id. |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. `ecdff4d0-9175-40ac-a8bb-325c49733607`. |
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| session_index | A visit / session index e.g. `3`. |
| previous_session_id | A previous visit / session index e.g. `3`. |
| session_first_event_id | A first visit / session index e.g. `3`. |
| screen_view_in_session_index | The index of the screen view within the session. This is generated by the tracker. |
| screen_views_in_session | Total number of screen views within a session. |
| dvce_created_tstamp | Timestamp event was recorded on the client device e.g. `2013-11-26 00:03:57.885`. |
| collector_tstamp | Time stamp for the event recorded by the collector e.g. `2013-11-26 00:02:05`. |
| derived_tstamp | Timestamp making allowance for innaccurate device clock e.g. `2013-11-26 00:02:04`. |
| model_tstamp | The current timestamp when the model processed this row. |
| screen_view_name | Name of the screen viewed. |
| screen_view_transition_type | The type of transition that led to the screen being viewed. |
| screen_view_type | The type of screen that was viewed. |
| screen_fragment | The name of the screen fragment (also known as an anchor). |
| screen_top_view_controller | The name of the root view controller. |
| screen_view_controller | The name of the view controller. |
| screen_view_previous_id | The UUID of the previous screen view. |
| screen_view_previous_name | The name of the previous screen view. |
| screen_view_previous_type | The type of the previous screen viewed. |
| platform | Platform e.g. `web`. |
| dvce_screenwidth | Screen width in pixels e.g. `1900`. |
| dvce_screenheight | Screen height in pixels e.g. `1024`. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| os_version | Operation system full version. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| open_idfa | Identifier for Vendors for Open devices. |
| device_latitude | Latitude coordinates for device location. |
| device_longitude | Longitude coordinates for device location. |
| device_latitude_longitude_accuracy | Accuracy of Latitude and Longitude coordinates for device location. |
| device_altitude | Altitude coordinates for device location. |
| device_altitude_accuracy | Accuracy of device altitude coordinates. |
| device_bearing | Horizontal angle between device and true north. |
| device_speed | Mobile device speed. |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. `GB`, `US`. |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. `I9`, `TX`. |
| geo_city | City the visitor is in e.g. `New York`, `London`. |
| geo_zipcode | Postcode the visitor is in e.g. `94109`. |
| geo_latitude | Visitor location latitude e.g. `37.443604`. |
| geo_longitude | Visitor location longitude e.g. `-122.4124`. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| geo_timezone | Visitor timezone name e.g. `Europe/London`. |
| user_ipaddress | User IP address e.g. `92.231.54.234`. |
| useragent | Raw useragent. |
| carrier | Carrier serivce provider used within device. |
| network_technology | technology used by the network provider of the device. |
| network_type | Type of network eg. `3G`. |
| build | The build of the application. |
| version | The application version. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/screen_views/scratch/default/snowplow_mobile_screen_views_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    cluster_by=snowplow_utils.get_cluster_by(bigquery_cols=["session_id"]),
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with screen_views_dedupe as (
  select
    ev.screen_view_id,
    ev.event_id,

    ev.app_id,

    ev.user_id,
    ev.device_user_id,
    ev.network_userid,

    ev.session_id,
    ev.session_index,
    ev.previous_session_id,
    ev.session_first_event_id,

    ev.dvce_created_tstamp,
    ev.collector_tstamp,
    ev.derived_tstamp,

    ev.screen_view_name,
    ev.screen_view_transition_type,
    ev.screen_view_type,
    ev.screen_fragment,
    ev.screen_top_view_controller,
    ev.screen_view_controller,
    ev.screen_view_previous_id,
    ev.screen_view_previous_name,
    ev.screen_view_previous_type,

    ev.platform,
    ev.dvce_screenwidth,
    ev.dvce_screenheight,
    ev.device_manufacturer,
    ev.device_model,
    ev.os_type,
    ev.os_version,
    ev.android_idfa,
    ev.apple_idfa,
    ev.apple_idfv,

    ev.device_latitude,
    ev.device_longitude,
    ev.device_latitude_longitude_accuracy,
    ev.device_altitude,
    ev.device_altitude_accuracy,
    ev.device_bearing,
    ev.device_speed,
    ev.geo_country,
    ev.geo_region,
    ev.geo_city,
    ev.geo_zipcode,
    ev.geo_latitude,
    ev.geo_longitude,
    ev.geo_region_name,
    ev.geo_timezone,

    ev.user_ipaddress,

    ev.useragent,

    ev.carrier,
    ev.open_idfa,
    ev.network_technology,
    ev.network_type,

    ev.build,
    ev.version,

    row_number() over (partition by ev.screen_view_id order by ev.derived_tstamp) as screen_view_id_index

  from {{ ref('snowplow_mobile_base_events_this_run') }} as ev

  where ev.event_name = 'screen_view'
  and ev.screen_view_id is not null
)

, cleaned_screen_view_events AS (
  select
    *,
    row_number() over (partition by sv.session_id order by sv.derived_tstamp) as screen_view_in_session_index

  from screen_views_dedupe sv

  where sv.screen_view_id_index = 1 --take first row of duplicates
  )

select
  ev.screen_view_id,
  ev.event_id,

  ev.app_id,

  ev.user_id,
  ev.device_user_id,
  ev.network_userid,

  ev.session_id,
  ev.session_index,
  ev.previous_session_id,
  ev.session_first_event_id,

  ev.screen_view_in_session_index,
  max(ev.screen_view_in_session_index) over (partition by ev.session_id) as screen_views_in_session,

  ev.dvce_created_tstamp,
  ev.collector_tstamp,
  ev.derived_tstamp,
  {{ snowplow_utils.current_timestamp_in_utc() }} AS model_tstamp,

  ev.screen_view_name,
  ev.screen_view_transition_type,
  ev.screen_view_type,
  ev.screen_fragment,
  ev.screen_top_view_controller,
  ev.screen_view_controller,
  ev.screen_view_previous_id,
  ev.screen_view_previous_name,
  ev.screen_view_previous_type,

  ev.platform,
  ev.dvce_screenwidth,
  ev.dvce_screenheight,
  ev.device_manufacturer,
  ev.device_model,
  ev.os_type,
  ev.os_version,
  ev.android_idfa,
  ev.apple_idfa,
  ev.apple_idfv,
  ev.open_idfa,

  ev.device_latitude,
  ev.device_longitude,
  ev.device_latitude_longitude_accuracy,
  ev.device_altitude,
  ev.device_altitude_accuracy,
  ev.device_bearing,
  ev.device_speed,
  ev.geo_country,
  ev.geo_region,
  ev.geo_city,
  ev.geo_zipcode,
  ev.geo_latitude,
  ev.geo_longitude,
  ev.geo_region_name,
  ev.geo_timezone,

  ev.user_ipaddress,

  ev.useragent,

  ev.carrier,
  ev.network_technology,
  ev.network_type,

  ev.build,
  ev.version

from cleaned_screen_view_events ev
```
</TabItem>
<TabItem value="redshift/postgres" label="redshift/postgres" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/screen_views/scratch/redshift_postgres/snowplow_mobile_screen_views_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sort='derived_tstamp',
    dist='screen_view_id',
    tags=["this_run"]
  )
}}

with screen_view_ids as (
  select
    sv.root_id,
    sv.root_tstamp,
    sv.id as screen_view_id,
    sv.name as screen_view_name,
    sv.previous_id as screen_view_previous_id,
    sv.previous_name as screen_view_previous_name,
    sv.previous_type as screen_view_previous_type,
    sv.transition_type as screen_view_transition_type,
    sv.type as screen_view_type

  from {{ var('snowplow__screen_view_events') }} sv
)

, screen_view_events as (
  select *

  from {{ ref('snowplow_mobile_base_events_this_run') }} as ev

  where ev.event_name = 'screen_view'
)

, screen_views_dedupe as (
  select
    sv.screen_view_id,
    ev.event_id,

    ev.app_id,

    ev.user_id,
    ev.device_user_id,
    ev.network_userid,

    ev.session_id,
    ev.session_index,
    ev.previous_session_id,
    ev.session_first_event_id,

    ev.dvce_created_tstamp,
    ev.collector_tstamp,
    ev.derived_tstamp,

    sv.screen_view_name,
    sv.screen_view_transition_type,
    sv.screen_view_type,
    ev.screen_fragment,
    ev.screen_top_view_controller,
    ev.screen_view_controller,
    sv.screen_view_previous_id,
    sv.screen_view_previous_name,
    sv.screen_view_previous_type,

    ev.platform,
    ev.dvce_screenwidth,
    ev.dvce_screenheight,
    ev.device_manufacturer,
    ev.device_model,
    ev.os_type,
    ev.os_version,
    ev.android_idfa,
    ev.apple_idfa,
    ev.apple_idfv,

    ev.device_latitude,
    ev.device_longitude,
    ev.device_latitude_longitude_accuracy,
    ev.device_altitude,
    ev.device_altitude_accuracy,
    ev.device_bearing,
    ev.device_speed,
    ev.geo_country,
    ev.geo_region,
    ev.geo_city,
    ev.geo_zipcode,
    ev.geo_latitude,
    ev.geo_longitude,
    ev.geo_region_name,
    ev.geo_timezone,

    ev.user_ipaddress,

    ev.useragent,

    ev.carrier,
    ev.open_idfa,
    ev.network_technology,
    ev.network_type,

    ev.build,
    ev.version,

    row_number() over (partition by sv.screen_view_id order by ev.derived_tstamp) as screen_view_id_index

  from screen_view_events as ev

  inner join screen_view_ids sv
  on ev.event_id = sv.root_id
  and ev.collector_tstamp = sv.root_tstamp

  where sv.screen_view_id is not null
)

, cleaned_screen_view_events AS (
  select
    *,
    row_number() over (partition by sv.session_id order by sv.derived_tstamp) as screen_view_in_session_index

  from screen_views_dedupe sv

  where sv.screen_view_id_index = 1 --take first row of duplicates
)

select
  ev.screen_view_id,
  ev.event_id,

  ev.app_id,

  ev.user_id,
  ev.device_user_id,
  ev.network_userid,

  ev.session_id,
  ev.session_index,
  ev.previous_session_id,
  ev.session_first_event_id,

  ev.screen_view_in_session_index,
  max(ev.screen_view_in_session_index) over (partition by ev.session_id) as screen_views_in_session,

  ev.dvce_created_tstamp,
  ev.collector_tstamp,
  ev.derived_tstamp,
  {{ snowplow_utils.current_timestamp_in_utc() }} AS model_tstamp,

  ev.screen_view_name,
  ev.screen_view_transition_type,
  ev.screen_view_type,
  ev.screen_fragment,
  ev.screen_top_view_controller,
  ev.screen_view_controller,
  ev.screen_view_previous_id,
  ev.screen_view_previous_name,
  ev.screen_view_previous_type,

  ev.platform,
  ev.dvce_screenwidth,
  ev.dvce_screenheight,
  ev.device_manufacturer,
  ev.device_model,
  ev.os_type,
  ev.os_version,
  ev.android_idfa,
  ev.apple_idfa,
  ev.apple_idfv,
  ev.open_idfa,

  ev.device_latitude,
  ev.device_longitude,
  ev.device_latitude_longitude_accuracy,
  ev.device_altitude,
  ev.device_altitude_accuracy,
  ev.device_bearing,
  ev.device_speed,
  ev.geo_country,
  ev.geo_region,
  ev.geo_city,
  ev.geo_zipcode,
  ev.geo_latitude,
  ev.geo_longitude,
  ev.geo_region_name,
  ev.geo_timezone,

  ev.user_ipaddress,

  ev.useragent,

  ev.carrier,
  ev.network_technology,
  ev.network_type,

  ev.build,
  ev.version

from cleaned_screen_view_events ev
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.current_timestamp_in_utc](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.current_timestamp_in_utc)
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views)
- [model.snowplow_mobile.snowplow_mobile_sessions_sv_details](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_sv_details)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Sessions {#model.snowplow_mobile.snowplow_mobile_sessions}

<DbtDetails><summary>
<code>models/sessions/snowplow_mobile_sessions.sql</code>
</summary>

#### Description
This derived incremental table contains all historic sessions and should be the end point for any analysis or BI tools.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| app_id | Application ID e.g. `angry-birds` is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. production versus dev. |
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| session_index | A visit / session index e.g. `3`. |
| previous_session_id | A previous visit / session index e.g. `3`. |
| session_first_event_id | A first visit / session index e.g. `3`. |
| session_last_event_id | A last visit / session index e.g. `3`. |
| start_tstamp | Timestamp for the start of the session, based on `derived_tstamp`. |
| end_tstamp | Timestamp for the end of the session, based on `derived_tstamp`. |
| model_tstamp | The current timestamp when the model processed this row. |
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| device_user_id | Unique device user id. |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. `ecdff4d0-9175-40ac-a8bb-325c49733607`. |
| session_duration_s | Total duration of a session in seconds. |
| has_install | Yes/No whether application is installed or not. |
| screen_views | Total number of screen views within a session. |
| screen_names_viewed | The number of different screens viewed where the unique screens are counted by the screen names. |
| app_errors | Total number of app errors. |
| fatal_app_errors | Totoal number of fatal app errors. |
| first_event_name | Name of the first event fired in the session. |
| last_event_name | Name of the last event fired in the session. |
| first_screen_view_name | Name of the first screen viewed. |
| first_screen_view_transition_type | Type of transition for the first screen view. |
| first_screen_view_type | Type of first screen view. |
| last_screen_view_name | Name of the last screen viewed. |
| last_screen_view_transition_type | Type of transition for the last screen view. |
| last_screen_view_type | Type of last screen view. |
| platform | Platform e.g. `web`. |
| dvce_screenwidth | Screen width in pixels e.g. `1900`. |
| dvce_screenheight | Screen height in pixels e.g. `1024`. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| os_version | Operation system full version. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| open_idfa | Identifier for Vendors for Open devices. |
| device_latitude | Latitude coordinates for device location. |
| device_longitude | Longitude coordinates for device location. |
| device_latitude_longitude_accuracy | Accuracy of Latitude and Longitude coordinates for device location. |
| device_altitude | Altitude coordinates for device location. |
| device_altitude_accuracy | Accuracy of device altitude coordinates. |
| device_bearing | Horizontal angle between device and true north. |
| device_speed | Mobile device speed. |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. `GB`, `US`. |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. `I9`, `TX`. |
| geo_city | City the visitor is in e.g. `New York`, `London`. |
| geo_zipcode | Postcode the visitor is in e.g. `94109`. |
| geo_latitude | Visitor location latitude e.g. `37.443604`. |
| geo_longitude | Visitor location longitude e.g. `-122.4124`. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| geo_timezone | Visitor timezone name e.g. `Europe/London`. |
| user_ipaddress | User IP address e.g. `92.231.54.234`. |
| useragent | Raw useragent. |
| name_tracker | Tracker namespace e.g. `sp1`. |
| v_tracker | Tracker version e.g. `js-3.0.0`. |
| carrier | Carrier serivce provider used within device. |
| network_technology | technology used by the network provider of the device. |
| network_type | Type of network eg. `3G`. |
| first_build | First build of the application. |
| last_build | Last build of the application. |
| first_version | First application version. |
| last_version | Last application version. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/sessions/snowplow_mobile_sessions.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='session_id',
    upsert_date_key='start_tstamp',
    sort='start_tstamp',
    dist='session_id',
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
       "field": "start_tstamp",
       "data_type": "timestamp"
     }, databricks_partition_by='start_tstamp_date'),
    cluster_by=snowplow_mobile.mobile_cluster_by_fields_sessions(),
    tags=["derived"],
    post_hook="{{ snowplow_mobile.stitch_user_identifiers(
      enabled=var('snowplow__session_stitching')
      ) }}",
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}


select *
  {% if target.type in ['databricks', 'spark'] -%}
   , DATE(start_tstamp) as start_tstamp_date
   {%- endif %}
from {{ ref('snowplow_mobile_sessions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_mobile') }} --returns false if run doesn't contain new events.
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_incremental_manifest)
- [model.snowplow_mobile.snowplow_mobile_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_this_run)
- [model.snowplow_mobile.snowplow_mobile_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_user_mapping)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_mobile.mobile_cluster_by_fields_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_sessions)
- [macro.snowplow_mobile.stitch_user_identifiers](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.stitch_user_identifiers)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_users_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Sessions Aggs {#model.snowplow_mobile.snowplow_mobile_sessions_aggs}

<DbtDetails><summary>
<code>models/sessions/scratch/snowplow_mobile_sessions_aggs.sql</code>
</summary>

#### Description
This model aggregates various metrics derived from page views to a session level.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| last_build | Last build of the application. |
| last_version | Last application version. |
| last_event_name | Name of the last event fired in the session. |
| session_last_event_id | A last visit / session index e.g. `3`. |
| start_tstamp | Timestamp for the end of the session, based on `derived_tstamp`. |
| end_tstamp | Timestamp for the end of the session, based on `derived_tstamp`. |
| session_duration_s | Total duration of a session in seconds. |
| has_install | Yes/No whether application is installed or not. |
| app_errors | Total number of app errors. |
| fatal_app_errors | Totoal number of fatal app errors. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/sessions/scratch/snowplow_mobile_sessions_aggs.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }),
    cluster_by=snowplow_utils.get_cluster_by(bigquery_cols=["session_id"]),
    sort='session_id',
    dist='session_id',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with events as (
  select
    es.session_id,
    es.event_id,
    es.event_name,
    es.derived_tstamp,
    es.build,
    es.version,
    es.event_index_in_session,
    MAX(es.event_index_in_session) over (partition by es.session_id) as events_in_session

  from {{ ref('snowplow_mobile_base_events_this_run') }}   es
)

, session_aggs AS (
  select
    e.session_id,
    --last dimensions
    MAX(case when e.event_index_in_session = e.events_in_session then e.build end) as last_build,
    MAX(case when e.event_index_in_session = e.events_in_session then e.version end) as last_version,
    MAX(case when e.event_index_in_session = e.events_in_session then e.event_name end) as last_event_name,
    {% if target.type == 'postgres' %}
      cast(MAX(case when e.event_index_in_session = e.events_in_session then cast(e.event_id as {{ type_string() }}) end) as uuid) as session_last_event_id,
    {% else %}
      MAX(case when e.event_index_in_session = e.events_in_session then e.event_id end) as session_last_event_id,
    {% endif %}

    -- time
    MIN(e.derived_tstamp) as start_tstamp,
    MAX(e.derived_tstamp) as end_tstamp,
    {{ snowplow_mobile.bool_or("e.event_name = 'application_install'") }} as has_install

  from events e

  group by 1
)

, app_errors as (
  {% if var("snowplow__enable_app_errors_module", false) %}
    select
      ae.session_id,
      COUNT(distinct ae.event_id) AS app_errors,
      COUNT(distinct case when ae.is_fatal then ae.event_id end) as fatal_app_errors

    from {{ ref('snowplow_mobile_app_errors_this_run') }} ae

    group by 1
  {% else %}
    select
      {% if target.type == 'postgres' %}
        cast(null as uuid) as session_id,
      {% else %}
        cast(null as {{type_string() }}) as session_id,
      {% endif %}
      cast(null as {{ type_int() }}) as app_errors,
      cast(null as {{ type_int() }}) as fatal_app_errors
  {% endif %}
)


select
  sa.session_id,
  sa.last_build,
  sa.last_version,
  sa.last_event_name,
  sa.session_last_event_id,
  sa.start_tstamp,
  sa.end_tstamp,
  {{ snowplow_utils.timestamp_diff('sa.start_tstamp', 'sa.end_tstamp', 'second') }} as session_duration_s,
  sa.has_install,
  ae.app_errors,
  ae.fatal_app_errors

from session_aggs sa
left join app_errors ae
on sa.session_id = ae.session_id
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- macro.dbt.type_int
- macro.dbt.type_string
- [macro.snowplow_mobile.bool_or](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.bool_or)
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.timestamp_diff](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_diff)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Sessions Sv Details {#model.snowplow_mobile.snowplow_mobile_sessions_sv_details}

<DbtDetails><summary>
<code>models/sessions/scratch/snowplow_mobile_sessions_sv_details.sql</code>
</summary>

#### Description
This model identifies the last page view within a given session and returns various dimensions associated with that page view.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| screen_views | Total number of screen views within a session. |
| screen_names_viewed | The number of different screens viewed where the unique screens are counted by the screen names. |
| first_screen_view_name | Name of the first screen viewed. |
| first_screen_view_transition_type | Type of transition for the first screen view. |
| first_screen_view_type | Type of first screen view. |
| last_screen_view_name | Name of the last screen viewed. |
| last_screen_view_transition_type | Type of transition for the last screen view. |
| last_screen_view_type | Type of last screen view. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/sessions/scratch/snowplow_mobile_sessions_sv_details.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    cluster_by=snowplow_utils.get_cluster_by(bigquery_cols=["session_id"]),
    sort='session_id',
    dist='session_id',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  ) 
}}

select
  sv.session_id,
  COUNT(distinct sv.screen_view_id) as screen_views,
  COUNT(distinct sv.screen_view_name) as screen_names_viewed,
  --Could split below into first/last scratch tables. Trying to minimise joins to sessions.
  MAX(case when sv.screen_view_in_session_index = 1 then sv.screen_view_name end) as first_screen_view_name,
  MAX(case when sv.screen_view_in_session_index = 1 then sv.screen_view_transition_type end) as first_screen_view_transition_type,
  MAX(case when sv.screen_view_in_session_index = 1 then sv.screen_view_type end) as first_screen_view_type,
  MAX(case when sv.screen_view_in_session_index = sv.screen_views_in_session then sv.screen_view_name end) as last_screen_view_name,
  MAX(case when sv.screen_view_in_session_index = sv.screen_views_in_session then sv.screen_view_transition_type end) as last_screen_view_transition_type,
  MAX(case when sv.screen_view_in_session_index = sv.screen_views_in_session then sv.screen_view_type end) as last_screen_view_type

from {{ ref('snowplow_mobile_screen_views_this_run') }} sv

group by 1
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_screen_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Sessions This Run {#model.snowplow_mobile.snowplow_mobile_sessions_this_run}

<DbtDetails><summary>
<code>models/sessions/scratch/snowplow_mobile_sessions_this_run.sql</code>
</summary>

#### Description
This staging table contains all the sessions for the given run of the Mob model. It possess all the same columns as `snowplow_mobile_sessions`. If building a custom module that requires session level data, this is the table you should reference.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| app_id | Application ID e.g. `angry-birds` is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. production versus dev. |
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| session_index | A visit / session index e.g. `3`. |
| previous_session_id | A previous visit / session index e.g. `3`. |
| session_first_event_id | A first visit / session index e.g. `3`. |
| session_last_event_id | A last visit / session index e.g. `3`. |
| start_tstamp | Timestamp for the start of the session, based on `derived_tstamp`. |
| end_tstamp | Timestamp for the end of the session, based on `derived_tstamp`. |
| model_tstamp | The current timestamp when the model processed this row. |
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| device_user_id | Unique device user id. |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. `ecdff4d0-9175-40ac-a8bb-325c49733607`. |
| session_duration_s | Total duration of a session in seconds. |
| has_install | Yes/No whether application is installed or not. |
| screen_views | Total number of screen views within a session. |
| screen_names_viewed | The number of different screens viewed where the unique screens are counted by the screen names. |
| app_errors | Total number of app errors. |
| fatal_app_errors | Totoal number of fatal app errors. |
| first_event_name | Name of the first event fired in the session. |
| last_event_name | Name of the last event fired in the session. |
| first_screen_view_name | Name of the first screen viewed. |
| first_screen_view_transition_type | Type of transition for the first screen view. |
| first_screen_view_type | Type of first screen view. |
| last_screen_view_name | Name of the last screen viewed. |
| last_screen_view_transition_type | Type of transition for the last screen view. |
| last_screen_view_type | Type of last screen view. |
| platform | Platform e.g. `web`. |
| dvce_screenwidth | Screen width in pixels e.g. `1900`. |
| dvce_screenheight | Screen height in pixels e.g. `1024`. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| os_version | Operation system full version. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| open_idfa | Identifier for Vendors for Open devices. |
| device_latitude | Latitude coordinates for device location. |
| device_longitude | Longitude coordinates for device location. |
| device_latitude_longitude_accuracy | Accuracy of Latitude and Longitude coordinates for device location. |
| device_altitude | Altitude coordinates for device location. |
| device_altitude_accuracy | Accuracy of device altitude coordinates. |
| device_bearing | Horizontal angle between device and true north. |
| device_speed | Mobile device speed. |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. `GB`, `US`. |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. `I9`, `TX`. |
| geo_city | City the visitor is in e.g. `New York`, `London`. |
| geo_zipcode | Postcode the visitor is in e.g. `94109`. |
| geo_latitude | Visitor location latitude e.g. `37.443604`. |
| geo_longitude | Visitor location longitude e.g. `-122.4124`. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| geo_timezone | Visitor timezone name e.g. `Europe/London`. |
| user_ipaddress | User IP address e.g. `92.231.54.234`. |
| useragent | Raw useragent. |
| name_tracker | Tracker namespace e.g. `sp1`. |
| v_tracker | Tracker version e.g. `js-3.0.0`. |
| carrier | Carrier serivce provider used within device. |
| network_technology | technology used by the network provider of the device. |
| network_type | Type of network eg. `3G`. |
| first_build | First build of the application. |
| last_build | Last build of the application. |
| first_version | First application version. |
| last_version | Last application version. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/sessions/scratch/snowplow_mobile_sessions_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sort='start_tstamp',
    dist='session_id',
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

select
  -- app id
  es.app_id,

  -- session fields
  es.session_id,
  es.session_index,
  es.previous_session_id,
  es.session_first_event_id,
  sa.session_last_event_id,

  sa.start_tstamp,
  sa.end_tstamp,
  {{ snowplow_utils.current_timestamp_in_utc() }} as model_tstamp,

  -- user fields
  es.user_id,
  es.device_user_id,
  es.network_userid,

  {% if var('snowplow__session_stitching') %}
    -- updated with mapping as part of post hook on derived sessions table
    cast(es.device_user_id as {{snowplow_utils.type_string(4096) }}) as stitched_user_id,
  {% else %}
    cast(null as {{ snowplow_utils.type_string(4096) }}) as stitched_user_id,
  {% endif %}

  sa.session_duration_s,
  sa.has_install,
  sv.screen_views,
  sv.screen_names_viewed,
  cast(sa.app_errors as {{ type_int() }}) as app_errors,
  cast(sa.fatal_app_errors as {{ type_int() }}) as fatal_app_errors,

  es.event_name as first_event_name,
  sa.last_event_name,

  sv.first_screen_view_name,
  sv.first_screen_view_transition_type,
  sv.first_screen_view_type,

  sv.last_screen_view_name,
  sv.last_screen_view_transition_type,
  sv.last_screen_view_type,

  es.platform,
  es.dvce_screenwidth,
  es.dvce_screenheight,
  es.device_manufacturer,
  es.device_model,
  es.os_type,
  es.os_version,
  es.android_idfa,
  es.apple_idfa,
  es.apple_idfv,
  es.open_idfa,

  es.device_latitude,
  es.device_longitude,
  es.device_latitude_longitude_accuracy,
  es.device_altitude,
  es.device_altitude_accuracy,
  es.device_bearing,
  es.device_speed,
  es.geo_country,
  es.geo_region,
  es.geo_city,
  es.geo_zipcode,
  es.geo_latitude,
  es.geo_longitude,
  es.geo_region_name,
  es.geo_timezone,

  es.user_ipaddress,

  es.useragent,
  es.name_tracker,
  es.v_tracker,

  es.carrier,
  es.network_technology,
  es.network_type,
  --first/last build/version to measure app updates.
  es.build as first_build,
  sa.last_build,
  es.version as first_version,
  sa.last_version

from {{ ref('snowplow_mobile_base_events_this_run') }} as es

inner join {{ ref('snowplow_mobile_sessions_aggs') }} as sa
on es.session_id = sa.session_id
and es.event_index_in_session = 1

left join {{ ref('snowplow_mobile_sessions_sv_details') }} sv
on es.session_id = sv.session_id
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_sessions_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_aggs)
- [model.snowplow_mobile.snowplow_mobile_sessions_sv_details](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_sv_details)

</TabItem>
<TabItem value="macros" label="Macros">

- macro.dbt.type_int
- [macro.snowplow_utils.current_timestamp_in_utc](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.current_timestamp_in_utc)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.type_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_string)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile User Mapping {#model.snowplow_mobile.snowplow_mobile_user_mapping}

<DbtDetails><summary>
<code>models/user_mapping/snowplow_mobile_user_mapping.sql</code>
</summary>

#### Description
A mapping table between `device_user_id` and `user_id`.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| device_user_id | Unique device user id. |
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| end_tstamp | The `collector_tstamp` when the user was last active |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/user_mapping/snowplow_mobile_user_mapping.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized='incremental',
    unique_key='device_user_id',
    sort='end_tstamp',
    dist='device_user_id',
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
      "field": "end_tstamp",
      "data_type": "timestamp"
    }),
    tags=["derived"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}


select distinct
  device_user_id,
  last_value(user_id) over(
    partition by device_user_id
    order by collector_tstamp
    rows between unbounded preceding and unbounded following
  ) as user_id,
  max(collector_tstamp) over (partition by device_user_id) as end_tstamp

from {{ ref('snowplow_mobile_base_events_this_run') }}

where {{ snowplow_utils.is_run_with_new_events('snowplow_mobile') }} --returns false if run doesn't contain new events.
and user_id is not null
and device_user_id is not null
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_incremental_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Users {#model.snowplow_mobile.snowplow_mobile_users}

<DbtDetails><summary>
<code>models/users/snowplow_mobile_users.sql</code>
</summary>

#### Description
This derived incremental table contains all historic users data and should be the end point for any analysis or BI tools.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| device_user_id | Unique device user id. |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. `ecdff4d0-9175-40ac-a8bb-325c49733607`. |
| start_tstamp | Earliest timestamp for the user's activity, based on `derived_tstamp`. |
| end_tstamp | Latest timestamp for the user's activity, based on `derived_tstamp`. |
| model_tstamp | The current timestamp when the model processed this row. |
| screen_views | Total number of screen views within a session. |
| screen_names_viewed | The number of different screens viewed where the unique screens are counted by the screen names. |
| sessions | Total number of session for the user. |
| sessions_duration_s | Total session duration for the specific user. |
| active_days | Total number of active days for the user. |
| app_errors | Total number of app errors. |
| fatal_app_errors | Totoal number of fatal app errors. |
| first_screen_view_name | Name of the first screen viewed. |
| first_screen_view_transition_type | Type of transition for the first screen view. |
| first_screen_view_type | Type of first screen view. |
| last_screen_view_name | Name of the last screen viewed. |
| last_screen_view_transition_type | Type of transition for the last screen view. |
| last_screen_view_type | Type of last screen view. |
| platform | Platform e.g. `web`. |
| dvce_screenwidth | Screen width in pixels e.g. `1900`. |
| dvce_screenheight | Screen height in pixels e.g. `1024`. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| first_os_version | First Operating System version for user device. |
| last_os_version | Last Operating System version for user device. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| open_idfa | Identifier for Vendors for Open devices. |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. `GB`, `US`. |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. `I9`, `TX`. |
| geo_city | City the visitor is in e.g. `New York`, `London`. |
| geo_zipcode | Postcode the visitor is in e.g. `94109`. |
| geo_latitude | Visitor location latitude e.g. `37.443604`. |
| geo_longitude | Visitor location longitude e.g. `-122.4124`. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| geo_timezone | Visitor timezone name e.g. `Europe/London`. |
| first_carrier | First carrier for user. |
| last_carrier | Last carrier provider for user. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/users/snowplow_mobile_users.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    materialized=var("snowplow__incremental_materialization"),
    unique_key='device_user_id',
    upsert_date_key='start_tstamp',
    disable_upsert_lookback=true,
    sort='start_tstamp',
    dist='device_user_id',
   partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
       "field": "start_tstamp",
       "data_type": "timestamp"
     }, databricks_partition_by='start_tstamp_date'),
    cluster_by=snowplow_mobile.mobile_cluster_by_fields_users(),
    tags=["derived"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt')),
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
  )
}}

select *
  {% if target.type in ['databricks', 'spark'] -%}
   , DATE(start_tstamp) as start_tstamp_date
  {%- endif %}
from {{ ref('snowplow_mobile_users_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_mobile') }} --returns false if run doesn't contain new events.
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_incremental_manifest)
- [model.snowplow_mobile.snowplow_mobile_users_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_mobile.mobile_cluster_by_fields_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_users)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Users Aggs {#model.snowplow_mobile.snowplow_mobile_users_aggs}

<DbtDetails><summary>
<code>models/users/scratch/snowplow_mobile_users_aggs.sql</code>
</summary>

#### Description
This model aggregates various metrics derived from sessions to a users level.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| device_user_id | Unique device user id. |
| start_tstamp | Earliest timestamp for the user's activity, based on `derived_tstamp`. |
| end_tstamp | Latest timestamp for the user's activity, based on `derived_tstamp`. |
| first_session_id | The UUID of the first session of a user e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| last_session_id | The UUID of the last session of a user e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| screen_views | Total number of screen views within a session. |
| screen_names_viewed | The number of different screens viewed where the unique screens are counted by the screen names. |
| sessions | Total number of session for the user. |
| sessions_duration_s | Total session duration for the specific user. |
| active_days | Total number of active days for the user. |
| app_errors | Total number of app errors. |
| fatal_app_errors | Totoal number of fatal app errors. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/users/scratch/snowplow_mobile_users_aggs.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    partition_by = snowplow_utils.get_partition_by(bigquery_partition_by={
       "field": "start_tstamp",
       "data_type": "timestamp"
     }),
    cluster_by=snowplow_utils.get_cluster_by(bigquery_cols=["device_user_id"]),
    sort='device_user_id',
    dist='device_user_id',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

select
  device_user_id,
   -- time
  user_start_tstamp as start_tstamp,
  user_end_tstamp as end_tstamp,
  -- first/last session. Max to resolve edge case with multiple sessions with the same start/end tstamp
  {% if target.type == 'postgres' %}
    cast(max(case when start_tstamp = user_start_tstamp then cast(session_id as {{ type_string() }} ) end) as uuid) as first_session_id,
    cast(max(case when end_tstamp = user_end_tstamp then cast(session_id as {{ type_string() }} ) end) as uuid) as last_session_id,
  {% else %}
    max(case when start_tstamp = user_start_tstamp then session_id end) as first_session_id,
    max(case when end_tstamp = user_end_tstamp then session_id end) as last_session_id,
  {% endif %}
  -- engagement
  sum(screen_views) as screen_views,
  sum(screen_names_viewed) as screen_names_viewed,
  count(distinct session_id) as sessions,
  sum(session_duration_s) as sessions_duration_s,
  count(distinct {{ date_trunc('day', 'start_tstamp') }}) as active_days,

  sum(app_errors) as app_errors,
  sum(fatal_app_errors) as fatal_app_errors

from {{ ref('snowplow_mobile_users_sessions_this_run') }}

group by 1,2,3
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_users_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_sessions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- macro.dbt.date_trunc
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)
- [macro.snowplow_utils.get_partition_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_partition_by)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_users_lasts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_lasts)
- [model.snowplow_mobile.snowplow_mobile_users_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Users Lasts {#model.snowplow_mobile.snowplow_mobile_users_lasts}

<DbtDetails><summary>
<code>models/users/scratch/snowplow_mobile_users_lasts.sql</code>
</summary>

#### Description
This model identifies the last page view for a user and returns various dimensions associated with that page view.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| device_user_id | Unique device user id. |
| last_screen_view_name | Name of the last screen viewed. |
| last_screen_view_transition_type | Type of transition for the last screen view. |
| last_screen_view_type | Type of last screen view. |
| last_carrier | Last carrier provider for user. |
| last_os_version | Last Operating System version for user device. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/users/scratch/snowplow_mobile_users_lasts.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    sort='device_user_id',
    dist='device_user_id',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  ) 
}}

select
  a.device_user_id,
  a.last_screen_view_name,
  a.last_screen_view_transition_type,
  a.last_screen_view_type,

  a.carrier AS last_carrier,
  a.os_version AS last_os_version

from {{ ref('snowplow_mobile_users_sessions_this_run') }} a

inner join {{ ref('snowplow_mobile_users_aggs') }} b
on a.session_id = b.last_session_id
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_users_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_aggs)
- [model.snowplow_mobile.snowplow_mobile_users_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_sessions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_users_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Users Sessions This Run {#model.snowplow_mobile.snowplow_mobile_users_sessions_this_run}

<DbtDetails><summary>
<code>models/users/scratch/snowplow_mobile_users_sessions_this_run.sql</code>
</summary>

#### Description
This model contains all sessions data related to users contained in the given run of the Mobile model

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| app_id | Application ID e.g. `angry-birds` is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. production versus dev. |
| session_id | A visit / session UUID e.g. `c6ef3124-b53a-4b13-a233-0088f79dcbcb`. |
| session_index | A visit / session index e.g. `3`. |
| previous_session_id | A previous visit / session index e.g. `3`. |
| session_first_event_id | A first visit / session index e.g. `3`. |
| session_last_event_id | A last visit / session index e.g. `3`. |
| start_tstamp | Timestamp for the start of the session, based on `derived_tstamp`. |
| end_tstamp | Timestamp for the end of the session, based on `derived_tstamp`. |
| model_tstamp | The current timestamp when the model processed this row. |
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| device_user_id | Unique device user id. |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. `ecdff4d0-9175-40ac-a8bb-325c49733607`. |
| session_duration_s | Total duration of a session in seconds. |
| has_install | Yes/No whether application is installed or not. |
| screen_views | Total number of screen views within a session. |
| screen_names_viewed | The number of different screens viewed where the unique screens are counted by the screen names. |
| app_errors | Total number of app errors. |
| fatal_app_errors | Totoal number of fatal app errors. |
| first_event_name | Name of the first event fired in the session. |
| last_event_name | Name of the last event fired in the session. |
| first_screen_view_name | Name of the first screen viewed. |
| first_screen_view_transition_type | Type of transition for the first screen view. |
| first_screen_view_type | Type of first screen view. |
| last_screen_view_name | Name of the last screen viewed. |
| last_screen_view_transition_type | Type of transition for the last screen view. |
| last_screen_view_type | Type of last screen view. |
| platform | Platform e.g. `web`. |
| dvce_screenwidth | Screen width in pixels e.g. `1900`. |
| dvce_screenheight | Screen height in pixels e.g. `1024`. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| os_version | Operation system full version. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| open_idfa | Identifier for Vendors for Open devices. |
| device_latitude | Latitude coordinates for device location. |
| device_longitude | Longitude coordinates for device location. |
| device_latitude_longitude_accuracy | Accuracy of Latitude and Longitude coordinates for device location. |
| device_altitude | Altitude coordinates for device location. |
| device_altitude_accuracy | Accuracy of device altitude coordinates. |
| device_bearing | Horizontal angle between device and true north. |
| device_speed | Mobile device speed. |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. `GB`, `US`. |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. `I9`, `TX`. |
| geo_city | City the visitor is in e.g. `New York`, `London`. |
| geo_zipcode | Postcode the visitor is in e.g. `94109`. |
| geo_latitude | Visitor location latitude e.g. `37.443604`. |
| geo_longitude | Visitor location longitude e.g. `-122.4124`. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| geo_timezone | Visitor timezone name e.g. `Europe/London`. |
| user_ipaddress | User IP address e.g. `92.231.54.234`. |
| useragent | Raw useragent. |
| name_tracker | Tracker namespace e.g. `sp1`. |
| v_tracker | Tracker version e.g. `js-3.0.0`. |
| carrier | Carrier serivce provider used within device. |
| network_technology | technology used by the network provider of the device. |
| network_type | Type of network eg. `3G`. |
| first_build | First build of the application. |
| last_build | Last build of the application. |
| first_version | First application version. |
| last_version | Last application version. |
| user_start_tstamp | Earliest timestamp for the user's activity, based on `derived_tstamp`. |
| user_end_tstamp | Latest timestamp for the user's activity, based on `derived_tstamp`. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/users/scratch/snowplow_mobile_users_sessions_this_run.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    sort='start_tstamp',
    dist='device_user_id',
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  ) 
}}

 
with user_ids_this_run as (
select distinct device_user_id from {{ ref('snowplow_mobile_base_sessions_this_run') }}
)


select
  a.*,
  min(a.start_tstamp) over(partition by a.device_user_id) as user_start_tstamp,
  max(a.end_tstamp) over(partition by a.device_user_id) as user_end_tstamp 

from {{ var('snowplow__sessions_table') }} a
inner join user_ids_this_run b
on a.device_user_id = b.device_user_id
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_this_run)
- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_users_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_aggs)
- [model.snowplow_mobile.snowplow_mobile_users_lasts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_lasts)
- [model.snowplow_mobile.snowplow_mobile_users_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Users This Run {#model.snowplow_mobile.snowplow_mobile_users_this_run}

<DbtDetails><summary>
<code>models/users/scratch/snowplow_mobile_users_this_run.sql</code>
</summary>

#### Description
This staging table contains all the users for the given run of the Mobile model. It possess all the same columns as `snowplow_mobile_users`. If building a custom module that requires session level data, this is the table you should reference.

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| user_id | Unique ID set by business e.g. `jon.doe@email.com`. |
| device_user_id | Unique device user id. |
| network_userid | User ID set by Snowplow using 3rd party cookie e.g. `ecdff4d0-9175-40ac-a8bb-325c49733607`. |
| start_tstamp | Earliest timestamp for the user's activity, based on `derived_tstamp`. |
| end_tstamp | Latest timestamp for the user's activity, based on `derived_tstamp`. |
| model_tstamp | The current timestamp when the model processed this row. |
| screen_views | Total number of screen views within a session. |
| screen_names_viewed | The number of different screens viewed where the unique screens are counted by the screen names. |
| sessions | Total number of session for the user. |
| sessions_duration_s | Total session duration for the specific user. |
| active_days | Total number of active days for the user. |
| app_errors | Total number of app errors. |
| fatal_app_errors | Totoal number of fatal app errors. |
| first_screen_view_name | Name of the first screen viewed. |
| first_screen_view_transition_type | Type of transition for the first screen view. |
| first_screen_view_type | Type of first screen view. |
| last_screen_view_name | Name of the last screen viewed. |
| last_screen_view_transition_type | Type of transition for the last screen view. |
| last_screen_view_type | Type of last screen view. |
| platform | Platform e.g. `web`. |
| dvce_screenwidth | Screen width in pixels e.g. `1900`. |
| dvce_screenheight | Screen height in pixels e.g. `1024`. |
| device_manufacturer | Manufacturer name of the device eg. `Apple`. |
| device_model | Model of the mobile device. |
| os_type | Type of OS running on the mobile device. |
| first_os_version | First Operating System version for user device. |
| last_os_version | Last Operating System version for user device. |
| android_idfa | Identifier for Advertisers for Android devices. |
| apple_idfa | Identifier for Advertisers for Apple devices. |
| apple_idfv | Identifier for Vendors for Apple devices. |
| open_idfa | Identifier for Vendors for Open devices. |
| geo_country | ISO 3166-1 code for the country the visitor is located in e.g. `GB`, `US`. |
| geo_region | ISO-3166-2 code for country region the visitor is in e.g. `I9`, `TX`. |
| geo_city | City the visitor is in e.g. `New York`, `London`. |
| geo_zipcode | Postcode the visitor is in e.g. `94109`. |
| geo_latitude | Visitor location latitude e.g. `37.443604`. |
| geo_longitude | Visitor location longitude e.g. `-122.4124`. |
| geo_region_name | Visitor region name e.g. `Florida`. |
| geo_timezone | Visitor timezone name e.g. `Europe/London`. |
| first_carrier | First carrier for user. |
| last_carrier | Last carrier provider for user. |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/models/users/scratch/snowplow_mobile_users_this_run.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sort='start_tstamp',
    dist='device_user_id',
    tags=["this_run"],
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

select

    -- user fields
    a.user_id,
    a.device_user_id,
    a.network_userid,

    b.start_tstamp,
    b.end_tstamp,
    {{ current_timestamp() }} AS model_tstamp,

    -- engagement fields
    b.screen_views,
    b.screen_names_viewed,
    b.sessions,
    b.sessions_duration_s,
    b.active_days,
    --errors
    b.app_errors,
    b.fatal_app_errors,

    -- screen fields
    a.first_screen_view_name,
    a.first_screen_view_transition_type,
    a.first_screen_view_type,

    c.last_screen_view_name,
    c.last_screen_view_transition_type,
    c.last_screen_view_type,

    -- device fields
    a.platform,
    a.dvce_screenwidth,
    a.dvce_screenheight,
    a.device_manufacturer,
    a.device_model,
    a.os_type,
    a.os_version first_os_version,
    c.last_os_version,
    a.android_idfa,
    a.apple_idfa,
    a.apple_idfv,
    a.open_idfa,

    -- geo fields
    a.geo_country,
    a.geo_region,
    a.geo_city,
    a.geo_zipcode,
    a.geo_latitude,
    a.geo_longitude,
    a.geo_region_name,
    a.geo_timezone,

    a.carrier first_carrier,
    c.last_carrier

from {{ ref('snowplow_mobile_users_aggs') }} as b

inner join {{ ref('snowplow_mobile_users_sessions_this_run') }} as a
on a.session_id = b.first_session_id

inner join {{ ref('snowplow_mobile_users_lasts') }} c
on b.device_user_id = c.device_user_id
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_users_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_aggs)
- [model.snowplow_mobile.snowplow_mobile_users_lasts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_lasts)
- [model.snowplow_mobile.snowplow_mobile_users_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_sessions_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- macro.dbt.current_timestamp
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users)

</TabItem>
</Tabs>
</DbtDetails>

