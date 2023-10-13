---
title: "Recommended Tracking Design for Web or Mobile Events"
date: "2023-10-12"
sidebar_position: 200
---

# Recommended Tracking Design for Web or Mobile Events

Depending on your business needs you may decide to come up with your own custom context entities / self-describing events. However, for out-of-the-box solutions Snowplow designed a set of context entities specifically useful for web and mobile tracking which we used as a base for our data models, too. 

The below table provides a list of our recommended web & mobile context entities and also shows how to enable them in your modeled data (the *snowplow-unified* package has all of them but the mobile and web only contexts are also available to use in their respective platform specific data models under the same variable names).

:::tip
Snowplow has started to move away from the wide, out-of-the-box canonical event structure and as part of this process some of these vital fields are now recommended to be tracked and used from purpose built topical context entities such as below. The snowplow-unified data model structure should enable this transition to be smooth: with a set of coalesce(..) statements you can change the source of a specific field in the `unify_fields_query()` macro, if necessary. You can check the full list of fields and from where we recommend taking them for both web and mobile [here](/docs/understanding-your-pipeline/canonical-event/index.md).
:::

| context                                                                                             | web | mobile | recommendation                                     | how to enable it in the unified model      | field name                                             |
|-----------------------------------------------------------------------------------------------------|------|---------|----------------------------------------------------|--------------------------------------------|--------------------------------------------------------|
|  page view context                                                                                  | ✅    | ❌       | required for web (needed for page_view_id)         | snowplow__enable_web: true                 |  com_snowplowanalytics_snowplow_web_page_1             |
|  screen view events                                                                                 | ❌    | ✅       | required for mobile (needed for screen_view_id)    | snowplow__enable_mobile: true              |  com_snowplowanalytics_mobile_screen_view_1            |
|  session context                                                                                    | ❌    | ✅       | required for mobile (needed for device_session_id) | snowplow__enable_mobile: true              |  com_snowplowanalytics_snowplow_client_session_1       |
|  [yauaa context](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md)         | ✅    | ✅       | recommended: provides useful information about user's device and browser | snowplow__enable_yauaa: true               |  nl_basjes_yauaa_context_1                             |
| [ iab context](/docs/enriching-your-data/available-enrichments/iab-enrichment/index.md)             | ✅    | ❌       | ?                                                  | snowplow__enable_iab: true                 |  com_iab_snowplow_spiders_and_robots_1                 |
|  [ua parser context](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md) | ✅    | ❌       | ?                                                  | snowplow__enable_ua: true                  |  com_snowplowanalytics_snowplow_ua_parser_context_1    |
|  browser context                                                                                    | ✅    | ❌       | ?                                                  | snowplow__enable_browser_context: true     |  com_snowplowanalytics_snowplow_browser_context_1      |
|  mobile context                                                                                     | ❌    | ✅       | ?                                                  | snowplow__enable_mobile_context: true      |  com_snowplowanalytics_snowplow_mobile_context_1       |
|  geolocation context                                                                                | ❌    | ✅       | ?                                                  | snowplow__enable_geolocation_context: true |  com_snowplowanalytics_snowplow_geolocation_context_1  |
|  application context  | ❌ | ✅ | ? | snowplow__enable_app_context: true                  |  com_snowplowanalytics_mobile_application_1                  |
|  screen context       | ❌ | ✅ | ? | snowplow__enable_screen_context: true               |  com_snowplowanalytics_mobile_screen_1                       |
|  deep link context    | ❌ | ✅ | ? | snowplow__enable_deep_link_context: true            |  contexts_com_snowplowanalytics_mobile_deep_link_1           |
|  consent - cmp visible  | ✅ | ❌ | ? | snowplow__enable_consent: true                      |  com_snowplowanalytics_snowplow_cmp_visible_1                |
|  consent preferences  | ✅ | ❌ | ? | snowplow__enable_consent: true (optional module)    |  com_snowplowanalytics_snowplow_consent_preferences_1        |
|  cwv context          | ✅ | ❌ | ? | snowplow__enable_cwv: true (optional module)        |  unstruct_event_com_snowplowanalytics_snowplow_web_vitals_1  |
|  app errors           | ❌ | ✅ | ? | snowplow__enable_app_errors_module: true (optional module) |  com_snowplowanalytics_snowplow_application_error_1          |
