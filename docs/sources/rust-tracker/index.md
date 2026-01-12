---
title: "Rust tracker SDK"
sidebar_label: "Rust tracker"
date: "2022-10-24"
sidebar_position: 225
description: "Add event tracking to Rust applications using the Snowplow Rust tracker SDK with async event sending and retry policies."
keywords: ["rust tracker", "rust analytics", "crates.io package"]
---

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Early Release"></Badges>
```

The Snowplow Rust Tracker allows you to add analytics to your Rust apps.

The tracker is published on crates.io as [snowplow_tracker](https://crates.io/crates/snowplow_tracker).

:::warning Migration from 0.1.0

If you are upgrading from 0.1.0 to 0.2.0, there are a couple of changes required to make to your code:

- [`Tracker.track`](./getting-started/index.md#tracking-events) is no longer an async function
- The Emitter must be safely closed to allow the tracker to drop, as it spawns a thread to send events. This can be done by calling `Tracker.close_emitter()`.
:::
