---
title: "Event specification validation results in Console"
description: "Console now shows how many events matched each tracking plan and event specification over the last 30 days, split into valid events, inferred events, events with violations, and failed events, with a per-version breakdown for each event specification."
sidebar_label: "Validation results in Console"
keywords: ["event specification validation", "tracking plans", "data quality", "Event Studio", "Console"]
date: "2026-09-22"
category:
  - "Product news"
components:
  - "Event Studio"
  - "Console"
---
Event specification validation results are now visible in Console. Until now, you had to look for them in your warehouse. Console shows how many events matched each tracking plan and event specification, and how many of them passed or failed validation, next to the tracking plans and event specifications themselves.

## Validation results in Console

Every event volume figure in Event Studio is split into four categories: valid events, inferred events, events with violations, and failed events. Metrics cover the last 30 days, and you can switch between pipelines.

<img src={require('./images/data-quality-panel.png').default} alt="Data quality panel of a tracking plan showing a donut chart of 139.78k total events over the last 30 days on the prod pipeline, split into valid events, inferred events, events with violations, and failed events, with a View details button" style={{maxWidth: '496px', width: '100%'}} />

* **Tracking plan page**: a new **Data quality** panel shows the breakdown for the whole plan, with a link to the data quality dashboard
* **Tracking plans list and Event Catalog**: the volume column shows the breakdown for each tracking plan and event specification
* **Tracking summary tab**: each event specification has a new tab with metrics per specification version and application ID. You can see which applications send which version, and whether an application sends the event without being listed in the specification

Failed event counts require the data quality dashboard to be connected to the selected pipeline. Whether an event that fails validation counts as a violation or as a failed event depends on the tracking plan's [data quality rules](/docs/event-studio/tracking-plans/event-specification-validation/#send-invalid-events-to-failed-events).

## Documentation

* [Monitor tracking plan data quality in Console](/docs/event-studio/tracking-plans/data-quality/)
* [Event specification validation](/docs/event-studio/tracking-plans/event-specification-validation/)
