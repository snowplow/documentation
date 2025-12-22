---
title: "Stitching logic"
date: "2025-02-25"
sidebar_position: 1
---

The Identities user stitching logic is very clever.

Flow chart etc

### Examples

Here are some examples of how the stitching logic works in practice.




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
