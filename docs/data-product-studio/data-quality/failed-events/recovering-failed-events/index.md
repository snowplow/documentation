---
title: "Recovering failed events"
date: "2021-10-13"
sidebar_position: 4
sidebar_label: "Recover"
---

Event recovery ensures you can recover these failed events from the file storage in your cloud, meaning you maintain a complete and accurate data set, even when your tracking or pipeline encounters problems.

At its most simple, the recovery process simply runs a script over a set of raw data to 'fix' the issues and then attempts to re-process these events.

There are two phases to a recovery: designing and running.

## Design

Designing the script that will run and perform the fixes. For Snowplow BDP Enterprise customers, this stage of recovery can be designed using the [recovery builder](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/builder/index.md).

A recovery script has two key parts:
- **Recovery steps**: a failed event is recovered by applying one or more steps to the payload to fix the issue that is causing a failure. These are typically actions to Replace a value, Remove a value, or Cast a value to a new type.
- **Recovery filters**: filters determine whether your recovery steps will be applied to a specific failed event; events will only be processed if they validate successfully against all filters.

The recovery process crudely process all failed events within a given time period. Within this period you may have had multiple different events failing, for multiple reasons.

You want your recovery steps to apply only to events that need these recovery steps applying, this helps to avoid duplicates or failed recoveries.

## Run

Running the script over a batch of failed events between two dates. This fixes the event payloads, per the recovery script, and then reprocesses them through your pipeline.

For Snowplow BDP Enterprise customers, this recovery stage is run by the Snowplow Support team.
