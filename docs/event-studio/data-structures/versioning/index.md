---
title: "Version and amend data structures"
sidebar_label: "Version and amend"
date: "2020-02-25"
sidebar_position: 2
description: "Evolve your tracking design safely with backwards-compatible data structure versioning using JSON schema version numbers to control warehouse loader behavior."
keywords: ["schema versioning", "backwards compatibility", "breaking changes", "schema evolution"]
---

Every data structure is based on a [versioned schema](/docs/fundamentals/schemas/versioning/index.md).

## Versioning with the data structure builder

Versioning is automated when using the data structure builder to create or edit your custom data structures.

It will automatically select how to version up your data structure depending on the changes you have just made.

![](images/data-structures-2.png)
![](images/data-structures-1.png)

## Versioning with the JSON editor

When using the JSON editor, at the point of publishing a data structure you'll be asked to select which version you'd like to create.

```mdx-code-block
import Breaking from "/docs/reusable/schema-version-breaking-change/_breaking.md"

<Breaking/>
```

## Increment the middle digit

For particular workflows you may want to make use of the middle digital as part of your versioning strategy. For simplicity, the UI allows only breaking or non-breaking changes.

Should you wish to use the middle versioning digit this is possible [via the Data Structures API](/docs/event-studio/programmatic-management/data-structures-api/index.md).

## Patch a schema

To [patch a schema](/docs/fundamentals/schemas/versioning/index.md#patch-a-schema), i.e. apply changes to it without updating the version, select the **Patch** option when saving the schema.

Note that various pipeline components, most importantly Enrich (including Enrich embedded in Snowplow Mini and Snowplow Micro), cache schemas to improve performance. The default caching time is 10 minutes (it's controlled by the [Iglu Resolver configuration](/docs/api-reference/iglu/iglu-resolver/index.md)). This means that the effect of patching a schema will not be immediate.

:::note Self-Hosted users
If you are using Snowplow Self-Hosted, to patch a schema, don't increment the schema version when [uploading it with `igluctl`](/docs/api-reference/iglu/manage-schemas/index.md).

You'll need to explicitly enable patching in the [Iglu Server configuration](/docs/api-reference/iglu/iglu-repositories/iglu-server/reference/index.md) (`patchesAllowed`) at your own risk.
:::

## Mark a schema as superseded

To [mark a schema as superseded](/docs/fundamentals/schemas/versioning/index.md#mark-a-schema-as-superseded), use the JSON editor and add a `$supersedes` field.
