---
title: "Modeling identity data"
sidebar_label: "Identity data"
date: "2025-02-25"
sidebar_position: 3
---

Snowplow Identities will ship with a dbt package to help you model your identity data. Existing Snowplow dbt models will be updated to support Identities.

## Identity event data

Identities includes a new event type, and adds a new entity to your tracked events.

### Identity entity

When Identities resolves identity for an event, it adds a new entity to the event payload. This entity contains the profile's `snowplow_id`.

The added entity uses schema X. The `snowplow_id` has format Y.

Here's an example:

```json
{ "some":"json"}
```

### Merge events

When merges occur, Identities emits a merge event into the Snowplow pipeline.

The merge event uses this schema:

```json
{ "some":"json"}
```
