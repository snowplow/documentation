---
title: "Initialization and configuration"
date: "2022-10-24"
sidebar_position: 2000
---

The `Snowplow` module provides a single method to initialize and configure a new tracker, the `Snowplow::create_tracker` method. It accepts configuration parameters for the tracker and returns a `Tracker` instance.

```rust
use snowplow_tracker::Subject;
let subject = Subject::builder().language("en-gb").build()?;
let tracker = Snowplow::create_tracker("ns", "app_id", "https://...", Some(subject));
```

The method returns a `Tracker` instance. This can be later used for tracking events, or accessing tracker properties.

The required attributes of the `Snowplow::create_tracker` method are `namespace` used to identify the tracker, `app_id` to identify your app, and the Snowplow collector `endpoint`. Additionally, one can pass in a `Subject` to provide additional context about the application environment.

| Attribute   | Type      | Description                                                                |
| ----------- | --------- | -------------------------------------------------------------------------- |
| `namespace` | `&str`    | Tracker namespace to identify the tracker.                                 |
| `app_id`    | `&str`    | Application identifier.                                                    |
| `endpoint`  | `&str`    | URI for the Snowplow collector endpoint.                                   |
| `subject`   | `Subject` | Subject information about tracked user and device that is added to events. |

## Configuration of subject information: `Subject`

Subject information are persistent and global information about the tracked device or user. They apply to all events and are assigned as event properties.

The configured attributes are mapped to Snowplow event properties described in the [Snowplow Tracker Protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md). They are mapped as follows:

| Attribute         | Event Property   |
| ----------------- | ---------------- |
| `user_id`         | `uid`            |
| `network_user_id` | `network_userid` |
| `domain_user_id`  | `domain_userid`  |
| `user_agent`      | `useragent`      |
| `ip_address`      | `user_ipaddress` |
| `timezone`        | `os_timezone`    |
| `language`        | `lang`           |
