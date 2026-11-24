---
title: "Schemas for events from your existing analytics"
sidebar_position: 60
sidebar_label: "Reference"
description: "Field reference for the external_event and external_identity schemas that the adapters use for events from other analytics tools."
keywords: ["external_event", "external_identity", "schema", "iglu", "reference"]
date: "2026-11-13"
content_type: landing
---

The adapters use two schemas alongside the standard Snowplow schemas: `external_event` for events that have no standard Snowplow schema, and the `external_identity` entity for your tool's own identifiers.

Neither schema is on Iglu Central. You create both in your own Snowplow registry, under your own vendor, before you set up an adapter.

## Create the schemas in your registry

The adapters send `iglu:com.example/external_event/jsonschema/1-0-0` and attach `iglu:com.example/external_identity/jsonschema/1-0-0`, where `com.example` stands for your vendor. Until both schemas exist in the registry your Collector validates against, every adapter event fails validation, including page views.

<Steps>

### Copy the schemas

Copy [`external_event.json`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/schemas/external_event.json) and [`external_identity.json`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/schemas/external_identity.json) from the `existing-analytics` skill.

### Set your vendor

In each schema, replace `com.example` in `self.vendor` with your vendor, such as the vendor your other schemas use. Change nothing else: the adapters depend on the field names and limits.

### Create them in Console

Create `external_event` as an event and `external_identity` as an entity, with the JSON editor. See [Create a data structure with the JSON editor](/docs/event-studio/data-structures/create/index.md#create-a-data-structure-with-the-json-editor).

### Deploy them

[Deploy both to your development environment](/docs/event-studio/test-and-publish/index.md#deploy-data-structures-to-your-development-environment), and [promote them to production](/docs/event-studio/test-and-publish/index.md#promote-data-structures-to-production) before you point an adapter at your pipeline's Collector.

</Steps>

When you set up the adapter, set its schema vendor to the same vendor. If you set up with an agent, the `existing-analytics` skill in the [Snowplow plugin](/docs/ai/skills/index.mdx) creates both schemas under your vendor first.

## Schema reference

The field reference for each schema:

```mdx-code-block
import DocCardList from '@theme/DocCardList';
```

<DocCardList/>
