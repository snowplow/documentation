---
title: "Recovering failed events"
date: "2021-10-13"
sidebar_position: 4
---

## What is event recovery?

Events can fail to process for many reasons ([see more in Failed Events](/docs/understanding-your-pipeline/failed-events/index.md)), when this happens the raw data for these events is stored in file storage on your cloud so they can be analyzed, diagnosed and recovered.

Event recovery ensures you can recover these failed events, meaning you maintain a complete and accurate data set, even when your tracking or pipeline encounters problems.

## How does event recovery work?

At its most simple, the recovery process simply runs a script over a set of raw data to 'fix' the issues and then attempts to re-process these events.

There are two phases to a recovery:

### Designing the recovery

Designing the script that will run and perform the fixes. For Snowplow BDP Enterprise customers, this stage of recovery can be designed using the [Recovery Builder](/docs/managing-data-quality/recovering-failed-events/builder/index.md).

A recovery script has two key parts:

**Recovery steps**  
A failed event is recovered by applying one or more steps to the payload to fix the issue that is causing a failure. These are typically actions to Replace a value, Remove a value, or Cast a value to a new type.

**Recovery filters**  
Filters determine whether your recovery steps will be applied to a specific failed event, events will only be processed if they validate successfully against all filters.

The recovery process crudely process all Failed Events within a given time period. Within this period you may have had multiple different events failing, for multiple reasons reasons.

You want your recovery steps to apply only to events that need these recovery steps applying, this helps to avoid duplicates or failed recoveries.

### Running the recovery

Running the script over a batch of failed events between two dates. This fixes the event payloads, per the recovery script, and then reprocesses them through your pipeline.

For Snowplow BDP Enterprise customers, this stage of recovery is run by the Snowplow Support team.
