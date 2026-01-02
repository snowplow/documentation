---
title: "Built-in Snowbridge transformations"
sidebar_label: "Built-in transformations"
date: "2022-10-20"
sidebar_position: 200
description: "Use built-in Snowbridge transformations for Snowplow data including enriched filtering, JSON conversion, and base64 encoding."
keywords: ["snowbridge config", "builtin transformations", "enriched filter", "json conversion", "jq transformation"]
---

Snowbridge includes several configurable built-in transformations.

| Transformation                  | Functionality                                                                          | Snowplow data only |
| ------------------------------- | -------------------------------------------------------------------------------------- | ------------------ |
| `base64Decode`                  | Base64-decodes the message's data.                                                     |                    |
| `base64Encode`                  | Base64 encodes the message's data.                                                     |                    |
| `jq`                            | Runs a `jq` command on the message data, and outputs the result of the command.        |                    |
| `jqFilter`                      | Filters messages based on the output of a `jq` command.                                |                    |
| `spEnrichedFilter`              | Filters messages based on a regex match against an atomic field.                       | ✅                  |
| `spEnrichedFilterContext`       | Filters messages based on a regex match against a field in an entity.                  | ✅                  |
| `spEnrichedFilterUnstructEvent` | Filters messages based on a regex match against a field in a custom event.             | ✅                  |
| `spEnrichedSetPk`               | Sets the message's destination partition key.                                          | ✅                  |
| `spEnrichedToJson`              | Transforms a message's data from Snowplow enriched tsv string format to a JSON object. | ✅                  |
| `spGtmssPreview`                | Attaches a GTM SS preview mode header                                                  | ✅                  |
