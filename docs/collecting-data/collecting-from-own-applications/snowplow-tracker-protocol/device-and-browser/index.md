---
title: "Device and browser information"
---

| [yauaa context](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) | ✅ | ✅ | recommended enrichment: provides useful information about user's device and browser | [enable the entrichment](docs/enriching-your-data/managing-enrichments/ui/#enable-editing-an-enrichment) | nl_basjes_yauaa_context_1 |
| [iab context](/docs/enriching-your-data/available-enrichments/iab-enrichment/) | ✅ | ✅ | enrichment | [enable the entrichment](docs/enriching-your-data/managing-enrichments/ui/#enable-editing-an-enrichment) | com_iab_snowplow_spiders_and_robots_1 |
| [~~ua parser context~~](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/) | ✅ | ❌ | deprecated enrichment | [enable the entrichment](docs/enriching-your-data/managing-enrichments/ui/#enable-editing-an-enrichment) true | com_snowplowanalytics_snowplow_ua_parser_context_1 |
| browser context [(schema)](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/browser_context/jsonschema) | ✅ | ❌ | ? | ? | com_snowplowanalytics_snowplow_browser_context_1 |
| mobile context [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema) | ❌ | ✅ | ? | ? | com_snowplowanalytics_snowplow_mobile_context_1 |

### Platform parameters

| **Parameter** | **Table Column**                                 | **Type** | **Description**                                               | **Example values**                                                                                                      |
|---------------|---------------------------------------------|----------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `url`         | `page_url`                                  | text     | Page URL                                                      | `http%3A%2F%2Ftest.psybazaar.com%2F2-tarot-cards`                                                                       |
| `ua`          | `useragent`                                 | text     | Useragent                                                     | Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0                                    |
| `page`        | `page_title`                                | text     | Page title                                                    | `Snowplow%20Behavoral%20Data`                                                                                           |
| `refr`        | `page_referrer`                             | text     | Referrer URL                                                  | `http%3A%2F%2Fwww.snowplow.io%2F`                                                                                       |
| `cookie`      | `br_cookies`                                | boolean  | Does the browser permit cookies?                              | `1`                                                                                                                     |
| `lang`        | `br_lang`                                   | text     | Language the browser is set to                                | `en-US`                                                                                                                 |
| `f_pdf`       | `br_features` or `br_features_pdf`          | boolean  | Adobe PDF plugin installed?                                   | `1`                                                                                                                     |
| `cd`          | `br_colordepth`                             | integer  | Browser color depth                                           | `24`                                                                                                                    |
| `cs`          | `doc_charset`                               | text     | Web page's character encoding                                 | `UTF-8`                                                                                                                 |
| `ds`          | `doc_width` and `doc_height`                | text     | Web page width and height                                     | `1090x1152`                                                                                                             |
| `vp`          | `br_viewwidth` and `br_viewheight`          | text     | Browser viewport width and height                             | `1105x390`                                                                                                              |
| `res`         | `dvce_screenwidth` and `dvce_screenheight`  | text     | Screen / monitor resolution                                   | `1280x1024`                                                                                                             |
| `mac`         | `mac_address`                               | text     | MAC address for the device running the tracker                | `12:34:56:78:9A:BC`                                                                                                     |

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
