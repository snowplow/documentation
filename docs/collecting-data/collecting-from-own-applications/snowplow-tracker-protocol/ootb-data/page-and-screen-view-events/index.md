---
title: "Page and screen views"
---

## Page view events

Pageview tracking is used to record views of web pages.

Currently, recording a pageview involves recording an event where `e=pv`. All the fields associated with web events can be tracked. There are no other pageview specific fields.


| page view context [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/web_page/jsonschema) | ✅ | ❌ | required for web (needed for page_view_id) | autotracked by default for web trackers | com_snowplowanalytics_snowplow_web_page_1 |

### Web page context

| schema_name       | id  | 
|-------------------|-----|
| page_view_context | 024629F0-6B9B-440C-82D4-DB3CF9D31533  | 

#### page view context

| schema_name       | id  | 
|-------------------|-----|
| page_view_context | 024629F0-6B9B-440C-82D4-DB3CF9D31533  | 

## Screen view events

| screen view events [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/screen_view/jsonschema) | ❌ | ✅ | required for mobile (needed for screen_view_id) | must be manually tracked | com_snowplowanalytics_mobile_screen_view_1 |
| screen context [(schema)](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/browser_context/jsonschema) | ❌ | ✅ | ? | ? | com_snowplowanalytics_mobile_screen_1 |

| schema_name        | id                                   | name | previous_id | previous_name | previous_type | transition_type | type  |
|--------------------|--------------------------------------|------|-------------|---------------|---------------|-----------------|-------|
| screen_view_events | 024629F0-6B9B-440C-82D4-DB3CF9D31533 | na   | na          | na            | na            | na              | na    |


### Screen context

| screen context [(schema)](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/browser_context/jsonschema) | ❌ | ✅ | ? | ? | com_snowplowanalytics_mobile_screen_1 |


| schema_name    | id                                   | name         | activity | type | fragment | top_view_controller | view_controller  |
|----------------|--------------------------------------|--------------|----------|------|----------|---------------------|------------------|
| screen_context | 4e8c2289-b1cd-4915-90de-2d87e1976a58 | Add New Item | na       | na   | na       | na                  | na               |
