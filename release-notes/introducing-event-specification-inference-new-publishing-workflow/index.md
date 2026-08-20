---
title: "Introducing event specification inference and a new publishing workflow"
description: "We are pleased to introduce Event Specification Inference, a new capability rolling out this week within Event Studio that automatically matches incoming events to your defined event specifications in the pipeline."
date: "2026-03-03"
update_type:
  - "Product news"
components:
  - "Trackers"
  - "Event Studio"
  - "Console"
  - "Developer tools"
---
We are pleased to introduce Event Specification Inference, a new capability rolling out this week within Event Studio that automatically matches incoming events to your defined event specifications in the pipeline. All customers can now benefit from tracking plan observability without needing to implement with Snowtype.

## Key benefits

* **Governance without reimplementation.** Gain tracking plan observability across your existing events without changing any tracking code.
* **Full coverage of out-of-the-box events.** Include page views, page pings, media events, deep links, installs, and impressions in your tracking plans for the first time.
* **Business context for every event.** Identify business events in your warehouse through the inferred event specification context, making it easier for analysts to discover and trust available datasets.
* **Works with any tracker.** Customers using Google Tag Manager, Python trackers, or other implementations not supported by Snowtype can now fully benefit from Event Studio.

## Key capabilities

**Automatic pipeline matching.** Published event specifications are matched against incoming events using their event schema, attached entities, source application, and any defined property rules. Matched events receive an inferred event specification context, visible in both the Console and your data warehouse.

**Out-of-the-box event support.** Event specifications now support events from built-in SDK methods, including page views, page pings, media events, deep links, app installs, and ad impressions. These events can now be properly included in your tracking plans.

**Console observability.** Volume and last-seen metrics are displayed for inferred event specifications in Event Studio, giving you visibility into your tracking without requiring Snowtype.

## New publishing workflow

Event specifications now follow an explicit publishing workflow that gives you control over when your definitions become active in the pipeline.

**New event specification statuses:**

* **Draft**: The specification is being edited and is not yet active in the pipeline.
* **Publishing**: A transitional state while the specification is propagated through the pipeline. This typically takes a few minutes.
* **Published**: The specification is active and the pipeline will begin matching incoming events against it.

The previous "Live" status for tracking plans has been removed. Tracking plan statuses are now derived from the event specifications within them, and will show as "With draft" or "Published" accordingly.

**Publishing from the Console.** You can publish from either the tracking plan view or from within an individual event specification. If your event specification references data structures that are not yet in production, the publishing flow will identify these and require you to publish them at the same time.

## Migration note for existing customers

Existing tracking plans that were previously in "Live" status will have their event specifications moved to "Draft". To enable inference for these events, you will need to publish them through the new publishing workflow in Event Studio.

## Getting started

1. Create or update your event specifications in Event Studio.
2. Publish your event specification or tracking plan.
3. The new pipeline enrichment activates automatically and begins matching incoming events.
4. View volume and last-seen metrics in Event Studio.

## Documentation

* [Event Specification Inference](/docs/event-studio/tracking-plans/event-specification-inference/)
