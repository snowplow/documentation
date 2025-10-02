---
title: "Identities"
date: "2025-02-25"
sidebar_position: 6
---

Snowplow Identities provides real-time identity resolution.

As events flow through your pipeline, the Identities graph database checks the identifiers. It uses deterministic profile stitching to link identifiers into a single profile, and adds the persistent `snowplow_id` as an entity to each event. This `snowplow_id` allows you to create one-row-per-user and identifier mapping tables in your warehouse.

Use cases for Identities include:
* Attribution and analytics: tie together user behavior across sessions, devices, and domains to form a complete picture of the user journey. This improves accuracy in marketing attribution, conversion funnel analysis, and multi-touchpoint reporting.
* Feature engineering and personalization: aggregate behavior across platforms, enabling feature extraction and personalization in both real-time and batch contexts.
* Audience targeting and activation: create deduplicated user audiences for targeting in marketing tools, CRMs, adtech channels, or other engagement platforms.

## Using Identities

Contact Support to get started with Snowplow Identities. Check out the Configuration ADD LINK page for more details.

## Architecture

## Identities entity

The added entity uses schema X. The `snowplow_id` has format Y.

Here's an example:

```json
{ "probably":"json"}
```

## Merge event

When Identities merges two profiles, it generates a merge event and adds it directly to your enriched event stream.

This event is useful for ??? in modeling.

The merge event uses schema Z.

```json
{ "probably":"json"}
```
