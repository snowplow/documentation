---
title: "Version and amend data structures"
sidebar_label: "Version data structures"
date: "2020-02-25"
sidebar_position: 3
description: "Evolve your tracking design safely with backwards-compatible data structure versioning using JSON schema version numbers to control warehouse loader behavior."
keywords: ["schema versioning", "backwards compatibility", "breaking changes", "schema evolution"]
content_type: how-to
---

Every data structure is based on a [versioned schema](/docs/fundamentals/schemas/versioning/index.md).

```mdx-code-block
import Breaking from "/docs/reusable/schema-version-breaking-change/_breaking.md"

<Breaking/>
```

## Automatic versioning with the data structure builder

Versioning is automated when using the data structure builder to create or edit your custom data structures.

It will automatically select how to version up your data structure depending on the changes you have just made.

In this example, a new required property has been added to the data structure. This is a breaking change, so the builder will increment the first digit:

![Data structure builder showing the "add_to_cart" event schema with properties user_id, product_id, quantity, and a newly added required property "category" highlighted in yellow. A banner at the bottom reads "Version increased to 2-0-0 — your current version is 1-0-0, based on your changes the new version will be 2-0-0."](images/data-structures-2.png)

In this example, an additional enum option has been added to `category`. This is a non-breaking change, so the builder is incrementing the middle digit:

![Data structure builder Properties section showing the "category" field highlighted in yellow with an updated enum list — books, technology, games, and newly added "appliances". A banner at the bottom reads "Version increased to 2-1-0 — your current version is 2-0-0, based on your changes the new version will be 2-1-0."](images/data-structures-1.png)

## Versioning with the JSON editor

When using the JSON editor, at the point of publishing a data structure you'll be asked to select which version you'd like to create.

![Publish version to development environment dialog for "subscription_payment_failed" showing four version options: Non-breaking (1-0-1), Non-breaking (1-1-0), Breaking (2-0-0) — currently selected with a recommended upgrade warning — and Patch (1-0-0). A caution banner warns about the impact of selecting the wrong version increment.](images/json_editor_version_options.png)

In this example, for a schema at version `1-0-0`, the dialog offers:

- **Non-breaking**: `1-0-1` or `1-1-0`
- **Breaking**: `2-0-0`
- **Patch**: [patch the current version](#patch-a-schema), which overwrites the existing schema and leaves it at `1-0-0`

For the deployment steps, see [Deploy data structures to your development environment](/docs/event-studio/test-and-publish/index.md#deploy-data-structures-to-your-development-environment).

## Patch a schema

To [patch a schema](/docs/event-studio/data-structures/superseding-and-patching/index.md#overwrite-a-schema), which means applying changes to it without updating the version, select the **Patch** option when saving the schema.

Note that various pipeline components, most importantly Enrich (including Enrich embedded in Snowplow Micro), cache schemas to improve performance. The default caching time is 10 minutes (it's controlled by the [Iglu Resolver configuration](/docs/api-reference/iglu/iglu-resolver/index.md)). This means that the effect of patching a schema will not be immediate.

:::note[Self-Hosted users]
If you are using Snowplow Self-Hosted, to patch a schema, don't increment the schema version when [uploading it with `igluctl`](/docs/api-reference/iglu/manage-schemas/index.md).

You'll need to explicitly enable patching in the [Iglu Server configuration](/docs/api-reference/iglu/iglu-repositories/iglu-server/reference/index.md) (`patchesAllowed`) at your own risk.
:::

## Mark a schema as superseded

If events are failing in production because of a mistake in a schema version, and you can't immediately update the tracking code, [mark the incorrect version as superseded](/docs/event-studio/data-structures/superseding-and-patching/index.md#mark-a-schema-as-superseded) by a new, corrected version. Events that reference the incorrect version are then validated against the corrected version instead.

You can only mark a schema as superseded in the JSON editor. For example, to supersede version `1-0-2`:

<Steps>

### Open the data structure in the JSON editor

Navigate to **Data structures**, locate the data structure, and [edit it with the JSON editor](/docs/event-studio/data-structures/create/index.md#edit-with-the-json-editor).

### Correct the schema and add `$supersedes`

Fix the mistake in the schema. Then, at the root of the schema, add a `$supersedes` field listing the incorrect versions:

```json
{
    "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
    // highlight-next-line
    "$supersedes": ["1-0-2"],
    "self": {
        ...
    },
    ...
}
```

The value must be an array of strings, even if it lists only one version. A schema version can only supersede earlier versions.

### Deploy a new version to your development environment

Click **Validate**, then [deploy the data structure to your development environment](/docs/event-studio/test-and-publish/index.md#deploy-data-structures-to-your-development-environment). In the versioning dialog, select **Non-breaking** (for example, `1-0-3`) or **Breaking** (for example, `2-0-0`), depending on your changes.

Don't select **Patch**. You can't add `$supersedes` to an existing schema version by patching it.

### Test with Snowplow Micro

Send a test event that references the superseded version to your [development environment](/docs/testing/snowplow-micro/console/index.md). For example, point a build of your app that still uses version `1-0-2` at the development environment's Collector endpoint.

Pipeline components cache schemas, so wait up to 10 minutes after deploying before you send the event.

In the [Micro dashboard](/docs/testing/snowplow-micro/ui/index.md), confirm that the event is valid and that it has a `validation_info` entity recording the original schema and the version it was validated against:

```json
{
    "schema": "iglu:com.snowplowanalytics.iglu/validation_info/jsonschema/1-0-0",
    "data": {
        "originalSchema": "iglu:com.acme/geolocation/jsonschema/1-0-2",
        "validatedWith": "1-0-3"
    }
}
```

### Promote the new version to production

Once you've confirmed the new version supersedes the incorrect one, [promote it to production](/docs/event-studio/test-and-publish/index.md#promote-data-structures-to-production).

</Steps>

Production events and entities that reference the superseded version are then validated against the new version in the same way. Because of schema caching, this can take up to 10 minutes to take effect.

You can't change the `$supersedes` field of a schema version after you've published it. To change which version supersedes which, create another new version. For details and examples, see [Superseding and patching schemas](/docs/event-studio/data-structures/superseding-and-patching/index.md#mark-a-schema-as-superseded).

To roll out a new data structure version to the event specifications and tracking code that use it, see [Evolve a tracking design](/docs/event-studio/evolve-tracking-design/index.md).
