---
title: "How Snowplow works — interactive walkthrough"
sidebar_position: 1.5
sidebar_label: "How Snowplow works"
description: "An interactive walkthrough of the Snowplow CDI pipeline. Send an event through each stage and inspect the JSON payload, validation result, and enrichments."
keywords: ["how snowplow works", "interactive demo", "snowplow architecture", "event pipeline", "snowplow walkthrough"]
date: "2026-05-18"
hide_table_of_contents: true
---

import ResizingIframe from '@site/src/components/ResizingIframe'

Snowplow CDI validates and enriches every [event](/docs/fundamentals/events/index.md) you track, then delivers it to your warehouse, lake, or stream in real time. The walkthrough below sends a single event through each stage of the pipeline, with the JSON payload and pipeline log updating at every step.

Click any stage to read what it does. Select **Send a valid event** to watch an event traverse the pipeline, or **Send an invalid event** to see how Snowplow handles a payload that violates its [schema](/docs/fundamentals/schemas/index.md) — routing it to [failed events](/docs/fundamentals/failed-events/index.md) for recovery. The demo also shows how [entities](/docs/fundamentals/entities/index.md) attach to events as they pass through enrichment.

<ResizingIframe
  src="/demo/how-it-works.html"
  title="How Snowplow works — interactive walkthrough"
  initialHeight={2400}
/>
