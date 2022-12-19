---
title: "Getting started"
date: "2022-10-24"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

The following steps will guide you through setting up the Rust tracker in your project and tracking a simple event.

## Installation

Add the snowplow_tracker as a dependency in Cargo.toml inside your Rust application:

<CodeBlock language="toml">{
`[dependencies]
snowplow_tracker = ${versions.rustTracker}
`}</CodeBlock>

Use the package APIs in your code:

```rust
use snowplow_tracker::Snowplow;
```

## Initialization

Instantiate a tracker using the `Snowplow::create_tracker` function. The function takes three required arguments: `namespace`, `app_id`, `collector_url`, and one optional argument, `subject`. Tracker `namespace` identifies the tracker instance; you may create multiple trackers with different namespaces. The `app_id` identifies your app. The `collector_url` is the URI of the Snowplow collector to send the events to. `subject` allows for an optional Subject to be attached to the tracker, which will be sent with all events.

```rust
let tracker = Snowplow::create_tracker("ns", "app_id", "https://...", None);
```

There are additional optional arguments to configure the tracker. To learn more about configuring how events are sent, check out [this page](/docs/collecting-data/collecting-from-own-applications/rust-tracker/initialization-and-configuration/index.md).

## Tracking events

To track events, simply instantiate their respective types and pass them to the tracker.track method with optional context entities. Please refer to the documentation for specification of event properties.

```rust
// Tracking a Screen View event
let screen_view_event = ScreenViewEvent::builder()
    .id(Uuid::new_v4())
    .name("a screen view")
    .previous_name("previous name")
    .build()?;

let screen_view_event_id = tracker.track(screen_view_event, None).await?;
```

Visit documentation about [tracking events](/docs/collecting-data/collecting-from-own-applications/rust-tracker/tracking-events/index.md) to learn about other supported event types. You may also want to read about [adding more data to tracked events](/docs/collecting-data/collecting-from-own-applications/rust-tracker/adding-data/index.md).

## Testing

Testing that your event tracking is properly configured can be as important as testing the other aspects of your app. It confirms that you are generating the events you expect.

[Snowplow Micro](/docs/understanding-your-pipeline/what-is-snowplow-micro/index.md) is a minimal pipeline designed to be used as part of your app's automated test suite.
