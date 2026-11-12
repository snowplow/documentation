---
title: "Manage data structures"
sidebar_label: "Manage data structures"
date: "2024-12-04"
sidebar_position: 30
description: "Create, edit, deploy, version, and hide data structures (schemas) using Snowplow Console, the Data structures API, Snowplow CLI, an AI assistant, or Iglu for Community users."
keywords: ["data structures", "schemas", "JSON schemas", "schema management"]
content_type: landing
---

Data structures wrap your [schemas](/docs/fundamentals/schemas/index.md) with metadata, so you can create, manage, and update them. Snowplow provides different options for data structure management:

* Snowplow Console
* [Data structures API](/docs/event-studio/programmatic-management/data-structures-api/index.md)
* [Snowplow CLI](/docs/api-reference/snowplow-cli/index.md)
* An AI assistant connected to the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md), or the [Snowplow Assistant](/docs/ai/console-agent/index.md) in Console: describe the data you need, and the assistant creates the data structure for you. It can also search [Iglu Central](https://github.com/snowplow/iglu-central) for an existing public schema you can reuse.
* For Community users: [Iglu](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md)

## Choose a task

Each task in managing data structures has its own page:

| I want to | Go to |
| --- | --- |
| Create a simple data structure with basic types | [Create a data structure with the builder](/docs/event-studio/data-structures/create/index.md#create-a-data-structure-with-the-builder) |
| Write a complex or nested schema | [Create a data structure with the JSON editor](/docs/event-studio/data-structures/create/index.md#create-a-data-structure-with-the-json-editor) |
| Edit an existing data structure | [Edit a data structure](/docs/event-studio/data-structures/create/index.md#edit-a-data-structure) |
| Deploy a data structure to development and promote it to production | [Test, promote, and publish a tracking design](/docs/event-studio/test-and-publish/index.md) |
| Choose a version number for my changes | [Version and amend data structures](/docs/event-studio/data-structures/versioning/index.md) |
| Hide, restore, or unlock a data structure | [Hide, restore, and unlock data structures](/docs/event-studio/data-structures/hide-and-lock/index.md) |
| Manage schemas from a repository | [Manage your tracking design as code](/docs/event-studio/programmatic-management/index.md) or [Snowplow CLI data structures](/docs/api-reference/snowplow-cli/data-structures/index.md) |

## Work with drafts

When you create a new data structure in Console, your changes are initially saved as a **draft**. Drafts allow you to:

- Make multiple changes without worrying about version numbers
- Experiment freely before committing to a final version
- Review and refine your data structure before deployment

Draft data structures aren't deployed to your development environment and aren't available for event validation. You must deploy your draft to the development environment when you're ready to test it. See [Deploy data structures to your development environment](/docs/event-studio/test-and-publish/index.md#deploy-data-structures-to-your-development-environment).

This workflow gives you the flexibility to iterate on your data structure design without the overhead of managing version increments for every small change. Draft data structures can't be downloaded with Snowplow CLI or used for validation. In Console, you can't hide a draft data structure, only delete it, so drafts never appear in the list of hidden data structures.

## Development and production versions

By default, Snowplow pipelines use Iglu Server schema registries. Each pipeline has a development and a production Iglu Server instance.

The data structures listing in Console shows a **Development** and a **Production** version column for each data structure. You can identify data structures where the development version is ahead of the production version by the yellow background on the version number.

To move a data structure from draft to development, and then to production, see [Test, promote, and publish a tracking design](/docs/event-studio/test-and-publish/index.md).
