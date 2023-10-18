---
title: "User and session identification and stitching"
---

| session context [(schema)](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) | ✅ | ✅ | optional for web, required for mobile (needed for device_session_id) | tracking client_session | snowplow__enable_mobile: true | com_snowplowanalytics_snowplow_client_session_1 |


### User related parameters

| **Parameter** | **Table Column**         | **Type** | **Description**                                                                                                                                                    | **Example values**                     |
|---------------|---------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `duid`        | `domain_userid`     | text     | Unique identifier for a user, based on a first party cookie (so domain specific)                                                                                   | `aeb1691c5a0ee5a6`                     |
| `tnuid`       | `network_userid`    | text     | Can be used be a tracker to overwrite the nuid                                                                                                                     | `ecdff4d0-9175-40ac-a8bb-325c49733607` |
| `uid`         | `user_id`           | text     | Unique identifier for user, set by the business using `setUserId`                                                                                                  | `jon.doe@email.com`                    |
| `vid`         | `domain_sessionidx` | int      | Index of number of visits that this user_id has made to this domain. `1` is first visit.                                                                           | `1`                                    |
| `sid`         | `domain_sessionid`  | text     | Unique identifier (UUID) for this visit of this user_id to this domain                                                                                             | `9c65e7f3-8e8e-470d-b243-910b5b300da0` |
| `ip`          | `user_ipaddress`    | text     | IP address override. This is useful, if traffic is being proxied to a Snowplow collector (optional, as IP Address will be automatically captured by collector)     | `37.157.33.178`                        |

:::info

`network_userid` is captured via a cookie set by the Snowplow Collector. It can be overriden by setting `tnuid` on a Tracker request payload but is typically expected to be populated by the collector cookies.

:::

#### session context

| schema_name     | session_index | session_id                           | previous_session_id                  | user_id                              | first_event_id                       | event_index | storage_mechanism | first_event_timestamp  |
|-----------------|---------------|--------------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|-------------|-------------------|------------------------|
| session_context | 7             | bca0fa0e-853c-41cf-9cc4-15048f6f0ff5 | fa008142-c427-4289-8424-6fb2b6576692 | 7a62ec9d-2aa0-4426-b014-eba2d0dcfebb | 1548BE58-4CE7-4A32-A5E8-2696ECE941F4 | 66          | SQLITE            | 14:01.6                |
