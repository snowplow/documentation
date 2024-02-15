---
title: "Aligning tracking with modeling"
sidebar_position: 10
---

## Aligning tracking with modeling

Depending on the availability of your contexts, our dbt packages provide out-of-the-box modeling for the below entities / events that you can just enable in our packages with the following variables:

| context               | web | mobile | package variable                      | packages |
|-----------------------|-----|--------|-------------------------------------------------------------|---------|
| page view context     | ✅   | ❌      | snowplow__enable_web: true                                 | unified |
| screen view events    | ❌   | ✅      | snowplow__enable_mobile: true                              | unified |
| session context       | ❌   | ✅      | snowplow__enable_mobile: true                              | unified |
| yauaa context         | ✅   | ✅      | snowplow__enable_yauaa: true                               | unified / web |
| iab context           | ✅   | ❌      | snowplow__enable_iab: true                                 | unified  / web |
| ua parser context     | ✅   | ❌      | snowplow__enable_ua: true                                  | unified  / web |
| browser context       | ✅   | ❌      | snowplow__enable_browser_context: true                     | unified |
| mobile context        | ❌   | ✅      | snowplow__enable_mobile_context: true                      | unified / mobile |
| geolocation context   | ❌   | ✅      | snowplow__enable_geolocation_context: true                 | unified /mobile|
| application context   | ❌   | ✅      | snowplow__enable_application_context: true                         | unified / mobile|
| screen context        | ❌   | ✅      | snowplow__enable_screen_context: true                      | unified  / mobile|
| deep link context     | ❌   | ✅      | snowplow__enable_deep_link_context: true                   | unified |
| screen summary context| ❌   | ✅ (iOS/Android tracker v6+) | snowplow__enable_screen_summary_context: true              | unified |
| consent - cmp visible | ✅   | ❌      | snowplow__enable_consent: true                             | unified / web|
| consent preferences   | ✅   | ❌      | snowplow__enable_consent: true (optional module)           | unified  / web |
| cwv context           | ✅   | ❌      | snowplow__enable_cwv: true (optional module)               | unified / web|
| app errors            | ❌   | ✅      | snowplow__enable_app_errors_module: true (optional module) | unified / mobile|
