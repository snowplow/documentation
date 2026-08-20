---
title: "Announcing Data Quality Dashboard"
description: "We are pleased to announce the general availability of the Data Quality Dashboard for Snowflake."
date: "2025-03-05"
update_type:
  - "Release notes"
components:
  - "Console"
  - "Monitoring"
---
We are pleased to announce the general availability of the Data Quality Dashboard for Snowflake.

## What is the Data Quality Dashboard?

The Data Quality Dashboard allows you to see failed events directly from your warehouse, if you have a failed events loader deployed. Your browser connects to an API running within your infrastructure, such that no failed event information flows through Snowplow. This offers a secure way to view failed events without risking PII leaks.

## How is the Data Quality Dashboard different from the existing failed events UI?

The Data Quality Dashboard is similar to the default view, but offers substantially more information to support resolution of tracking issues. The main differences are:

* You can focus on failed events of the last hour, or the last day (previously the last 7 days)
* You can see the associated application version for each failed event, as long as it is attached as an entity to the event
* The issue detail view provides more granular information about each unique error, including metadata and a sample of the rows in the data warehouse, so that you can triangulate issues faster
* You can inspect a failure entity that tells you what values caused the event to fail validation, making it easier to debug and correct the issue
* You can view and copy the query that you can run in your warehouse to get the same view, making it easy to go even further back in time and debug your failed events

## Links

* [Documentation](/docs/monitoring/)
