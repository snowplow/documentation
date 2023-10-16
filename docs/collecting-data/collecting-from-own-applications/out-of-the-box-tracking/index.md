---
title: "Out-of-the-box tracking"
date: "2023-10-12"
sidebar_position: 200
---

# Out-of-the-box tracking for Web or Mobile Events

Depending on your business needs you may decide to come up with your own events / custom entities. However, for out-of-the-box solutions Snowplow designed a set of events and entities specifically useful for web and mobile tracking which we used as a base for our data models, too.

In the below tables we have collected the list of such events and entities and highlight where possible how you can enable them in the snowplow dbt packages for modeling purposes.

:::tip
Snowplow has started to move away from the wide, out-of-the-box canonical event structure and as part of this process some of these vital fields are now recommended to be tracked and used from purpose built topical entities such as below. The snowplow-unified data model structure should enable this transition to be smooth: with a set of coalesce(..) statements you can change the source of a specific field in the `unify_fields_query()` macro, if necessary. You can check the full list of fields and from where we recommend taking them for both web and mobile [here](/docs/understanding-your-pipeline/canonical-event/index.md).
:::

## Events
| event               | web | mobile | recommendation                                                           | how to enable it in the trackers / pipeline | how to enable it in the unified model                      | field name                                                  |
|-----------------------|-----|--------|--------------------------------------------------------------------------|-------------------------------------------|------------------------------------------------------------|-------------------------------------------------------------|
| screen view events [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/screen_view/jsonschema)   | ❌   | ✅      | required for mobile (needed for screen_view_id)                          | must be manually tracked                  | snowplow__enable_mobile: true                              | com_snowplowanalytics_mobile_screen_view_1                  |
## Context entities

| context               | web | mobile | recommendation                                                           | how to enable it in the trackers / pipeline | how to enable it in the unified model                      | field name                                                  |
|-----------------------|-----|--------|--------------------------------------------------------------------------|-------------------------------------------|------------------------------------------------------------|-------------------------------------------------------------|
| page view context [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/web_page/jsonschema)     | ✅   | ❌      | required for web (needed for page_view_id)                               | autotracked by default for web trackers   | snowplow__enable_web: true                                 | com_snowplowanalytics_snowplow_web_page_1                   |
| session context [(schema)](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2)       | ✅    | ✅      | optional for web, required for mobile (needed for device_session_id)                       | tracking client_session                                         | snowplow__enable_mobile: true                              | com_snowplowanalytics_snowplow_client_session_1             |
| [yauaa context](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md)         | ✅   | ✅      | recommended enrichment: provides useful information about user's device and browser | [enable the entrichment](docs/enriching-your-data/managing-enrichments/ui/#enable-editing-an-enrichment)                                         | snowplow__enable_yauaa: true                               | nl_basjes_yauaa_context_1                                   |
| [iab context](/docs/enriching-your-data/available-enrichments/iab-enrichment/)           | ✅   | ✅       |  enrichment                                                                       | [enable the entrichment](docs/enriching-your-data/managing-enrichments/ui/#enable-editing-an-enrichment)                                         | snowplow__enable_iab: true                                 | com_iab_snowplow_spiders_and_robots_1                       |
| [~~ua parser context~~](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/)     | ✅   | ❌      | deprecated enrichment                                                                        | [enable the entrichment](docs/enriching-your-data/managing-enrichments/ui/#enable-editing-an-enrichment)                                        | snowplow__enable_ua: true                                  | com_snowplowanalytics_snowplow_ua_parser_context_1          |
| browser context [(schema)](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/browser_context/jsonschema)      | ✅   | ❌      | ?                                                                        | ?                                         | snowplow__enable_browser_context: true                     | com_snowplowanalytics_snowplow_browser_context_1            |
| mobile context [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema)       | ❌   | ✅      | ?                                                                        | ?                                         | snowplow__enable_mobile_context: true                      | com_snowplowanalytics_snowplow_mobile_context_1             |
| geolocation context [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/geolocation_context/jsonschema)  | ✅   | ✅      | web: [geolocation plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/geolocation/)                                                                        | ?                                         | snowplow__enable_geolocation_context: true                 | com_snowplowanalytics_snowplow_geolocation_context_1        |
| application context [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/geolocation_context/jsonschema)  | ❌   | ✅      | using the geolocation plugin                                                                        | ?                                         | snowplow__enable_app_context: true                         | com_snowplowanalytics_mobile_application_1                  |
| screen context [(schema)](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/browser_context/jsonschema)       | ❌   | ✅      | ?                                                                        | ?                                         | snowplow__enable_screen_context: true                      | com_snowplowanalytics_mobile_screen_1                       |
| deep link context [(schema)](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/browser_context/jsonschema)    | ❌   | ✅      | ?                                                                        | ?                                         | snowplow__enable_deep_link_context: true                   | contexts_com_snowplowanalytics_mobile_deep_link_1           |
| consent - cmp visible [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/cmp_visible/jsonschema)| ✅   | ❌      | ?                                                                        | ?                                         | snowplow__enable_consent: true                             | com_snowplowanalytics_snowplow_cmp_visible_1                |
| consent preferences [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/consent_preferences/jsonschema)  | ✅   | ❌      | ?                                                                        | ?                                         | snowplow__enable_consent: true (optional module)           | com_snowplowanalytics_snowplow_consent_preferences_1        |
| consent (other)            | ❌    |  ✅      | ?                                                                         | ?                                         |  
| web performance [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/web_vitals/jsonschema)                  | ✅   | ❌      | ?                                                                        | ?                                         | snowplow__enable_cwv: true (optional module)               | unstruct_event_com_snowplowanalytics_snowplow_web_vitals_1  |
| app errors [(schema)](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/application_error/jsonschema/1-0-2)           | ✅    |  ✅      | web: error tracking plugin                                                                        | ?                                         | snowplow__enable_app_errors_module: true (optional module) |  com_snowplowanalytics_snowplow_application_error_1         |

Below you will find more detailed information on the individual Snowplow events and entities:

#### page view context

| schema_name       | id  | 
|-------------------|-----|
| page_view_context | 024629F0-6B9B-440C-82D4-DB3CF9D31533  | 

#### screen view events

| schema_name        | id                                   | name | previous_id | previous_name | previous_type | transition_type | type  |
|--------------------|--------------------------------------|------|-------------|---------------|---------------|-----------------|-------|
| screen_view_events | 024629F0-6B9B-440C-82D4-DB3CF9D31533 | na   | na          | na            | na            | na              | na    |

#### session context

| schema_name     | session_index | session_id                           | previous_session_id                  | user_id                              | first_event_id                       | event_index | storage_mechanism | first_event_timestamp  |
|-----------------|---------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|-------------|-------------------|------------------------|
| session_context | 7             | bca0fa0e-853c-41cf-9cc4-15048f6f0ff5 | fa008142-c427-4289-8424-6fb2b6576692 | 7a62ec9d-2aa0-4426-b014-eba2d0dcfebb | 1548BE58-4CE7-4A32-A5E8-2696ECE941F4 | 66          | SQLITE            | 14:01.6                |

#### yauaa context

| schema_name | agent_class | agent_information_email | agent_name | agent_name_version | agent_name_version_major | agent_version | agent_version_major | device_brand | device_class | device_cpu | device_cpu_bits | device_name    | device_version | layout_engine_class | layout_engine_name | layout_engine_name_version | layout_engine_name_version_major | layout_engine_version | layout_engine_version_major  |
|-------------|-------------|-------------------------|------------|--------------------|--------------------------|---------------|---------------------|--------------|--------------|------------|-----------------|----------------|----------------|---------------------|--------------------|----------------------------|----------------------------------|-----------------------|------------------------------|
| yauaa       | Browser     | Unknown                 | Chrome     | Chrome109          | Chrome109                | 109           | 109.00              | Apple        | Desktop      | Intel      | 64              | AppleMacintosh | Demo           | Browser             | Blink              | Blink109                   | Blink109                         | 109                   | 109                          |

| network_type | operating_system_class | operating_system_name | operating_system_name_version | operating_system_name_version_major | operating_system_version | operating_system_version_build | operating_system_version_major | webview_app_name | webview_app_name_version_major | webview_app_version | webview_app_version_major  |
|--------------|------------------------|-----------------------|-------------------------------|-------------------------------------|--------------------------|--------------------------------|--------------------------------|------------------|--------------------------------|---------------------|----------------------------|
| Unknown      | Desktop                | MacOS                 | MacOS>=10.15.7                | MacOS>=10.15                        | >=10.15.7                | ??                             | >=10.15                        | Unknown          | Unknown??                      | ??                  | ??                         |

#### iab context

| schema_name | category | primary_impact | reason     | spider_or_robot  |
|-------------|----------|----------------|------------|------------------|
| iab_context | BROWSER  | NONE           | PASSED_ALL | FALSE            |


#### ua parser context

| schema_name | device_family | os_family | os_major | os_minor | os_patch | os_patch_minor | os_version    | useragent_family | useragent_major | useragent_minor | useragent_patch | useragent_version  |
|-------------|---------------|-----------|----------|----------|----------|----------------|---------------|------------------|-----------------|-----------------|-----------------|--------------------|
| ua_parser   | Mac           | MacOSX    | 10       | 15       | 7        | [NULL]         | MacOSX10.15.7 | Chrome           | 110             | 0               | 0               | Chrome110.0.0      |


#### browser context

| schema_name     | viewport | document_size | resolution | color_depth | device_pixel_ratio | cookies_enabled | online | browser_language | document_language | webdriver | device_memory | hardware_concurrency | tab_id  |
|-----------------|----------|---------------|------------|-------------|--------------------|-----------------|--------|------------------|-------------------|-----------|---------------|----------------------|---------|
| browser_context | na       | na            | na         | 1           | 1                  | TRUE            | TRUE   | na               | na                | TRUE      | 1             | 1                    | na      |


#### mobile context

| schema_name    | device_manufacturer | device_model                          | os_type                   | os_version | android_idfa                         | apple_idfa | apple_idfv | carrier | open_idfa | network_technology | network_type | physical_memory | system_available_memory | app_available_memory | battery_level | battery_state | low_power_mode | available_storage | total_storage   | is_portrait| resolution | scale | language | app_set_id | app_set_id_scope |
|----------------|---------------------|---------------------------------------|---------------------------|------------|--------------------------------------|------------|------------|---------|-----------|--------------------|--------------|-----------------|-------------------------|----------------------|---------------|---------------|----------------|-------------------|-----------------|----------------|-------------------|-----------------|---------------|-------|-
| mobile_context | Samsung             | SM-N960N Galaxy Note9 TD-LTE KR 128GB | Google Android 8.1 (Oreo) | 8.10       | 00000000-0000-0000-0000-000000000000 | na         | na         | Unknown | na        | 2G                 | wifi         | 1               | 1                       | 1                    | 42            | charging      | TRUE           | 1                 | 128,000,000,000 | TRUE  |1440x2960 | 1 | | |



#### geolocation context

| schema_name         | latitude    | longitude   | latitude_longitude_accuracy | altitude   | altitude_accuracy | bearing       | speed         |
|---------------------|-------------|-------------|-----------------------------|------------|-------------------|---------------|---------------|
| geolocation_context | 30.04335623 | 67.59633102 | -24,902,753.22              | -19,459.88 | -29,970,651.08    | 21,055,653.32 | -7,127,794.98 |

#### application context

| schema_name | build | version  |
|-------------|-------|----------|
| app_context | na    | na       |

#### screen context

| schema_name    | id                                   | name         | activity | type | fragment | top_view_controller | view_controller  |
|----------------|--------------------------------------|--------------|----------|------|----------|---------------------|------------------|
| screen_context | 4e8c2289-b1cd-4915-90de-2d87e1976a58 | Add New Item | na       | na   | na       | na                  | na               |

#### deep link context

| schema_name       | url | referrer  |
|-------------------|-----|-----------|
| deep_link_context | na  | na        |


#### consent - cmp visible

| schema_name       | elapsed_time | 
|-------------------|-----|
| cmp_visible | 1.5  | 

#### consent preferences

| schema_name         | basis_for_processing | consent_version | consent_scopes                           | domains_applied              | consent_url              | event_type     | gdpr_applies  |
|---------------------|----------------------|-----------------|------------------------------------------|------------------------------|--------------------------|----------------|---------------|
| consent_preferences | consent              | 1               | ["necessary","preferences","statistics"] | ["https://www.example.com/"] | https://www.example.com/ | allow_selected | FALSE         |


#### consent (other)

#### web performance

| schema_name | cls  | fcp | fid     | inp     | lcp   | navigation_type | ttfb  |
|-------------|------|-----|---------|---------|-------|-----------------|-------|
| web_vitals  | 0.05 | 0   | 36:00.0 | 36:00.0 | 1,908 | navigate        | 228.9 |
#### app errors
