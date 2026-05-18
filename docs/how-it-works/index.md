---
title: "How Snowplow works — interactive walkthrough"
sidebar_position: 1.5
sidebar_label: "How Snowplow works"
description: "An interactive walkthrough of the Snowplow Customer Data Infrastructure pipeline — from a click in the browser to a row in the warehouse."
keywords: ["how snowplow works", "interactive demo", "snowplow architecture", "event pipeline", "snowplow walkthrough"]
date: "2026-05-18"
hide_table_of_contents: true
---

import ResizingIframe from '@site/src/components/ResizingIframe'

Snowplow Customer Data Infrastructure captures every customer interaction as a validated, enriched [event](/docs/fundamentals/events/index.md) and delivers it to your warehouse, lake, or stream in real time. Watch a single event travel from a tracker call to a warehouse row below, with live JSON and enrichment at each step. Click any pipeline stage to learn what happens there, or select **Send a valid event** to step through the whole pipeline.

<ResizingIframe
  src="/demo/how-it-works.html"
  title="How Snowplow works — interactive walkthrough"
  initialHeight={2400}
/>
