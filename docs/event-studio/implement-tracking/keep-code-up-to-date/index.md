---
title: "Keep Snowtype code up to date"
sidebar_label: "Keep code up to date"
sidebar_position: 3
description: "Update your Snowtype-generated tracking code when schemas and event specifications change, manage your lock file, and automate updates in CI/CD."
keywords: ["Snowtype", "update", "lock file", "patch", "purge", "CI/CD", "schema versions", "event specification versions"]
date: "2026-03-23"
---

You can check for updates to the schemas and event specifications in your configuration with the `snowtype update` command.

## Keep data structures up to date

When generating code for data structures and Iglu Central schemas, the version number is included in the configuration file. For example, this data structure is version `1-0-0`.

```json title="snowtype.config.json"
{
  "orgId": "your-org-id",
  "tracker": "@snowplow/browser-tracker",
  "language": "typescript",
  "outpath": "./src/tracking/snowplow",
  "dataStructures": [
    "iglu:com.example/product/jsonschema/1-0-0"
  ]
}
```

Run `snowtype update` to check whether any of your pinned schemas have newer versions available:

```bash
npx snowtype update
```

The command outputs a diff showing the available version updates:

```bash
✔: Valid configuration found
⠧ Checking for updates...✔: Available updates found!
✔: Available Data Structures Updates

 - iglu:com.example/product/jsonschema/1-0-0
 + iglu:com.example/product/jsonschema/2-0-0
```


You can then choose to accept the updates and regenerate your tracking code. To skip the confirmation prompt and automatically update and regenerate, use the `--yes` flag:

```bash
npx snowtype update --yes
```

### Update based on SchemaVer level

For data structure updates, you can filter what `update` shows you based on the [SchemaVer](/docs/fundamentals/schemas/versioning/index.md) bump level. The `--maximumBump` flag sets the highest level of update to include. It defaults to `major`, meaning all updates are shown.

For example, if your configuration pins `iglu:com.acme_company/page_unload/jsonschema/1-0-0` and versions `1-0-1`, `1-1-0`, and `2-0-0` are available:

```bash
npx snowtype update --maximumBump=major
# Shows all updates, including 2-0-0.

npx snowtype update --maximumBump=minor
# Shows 1-1-0 and 1-0-1 only.

npx snowtype update --maximumBump=patch
# Shows 1-0-1 only.
```

You can also set this in your [configuration file](/docs/event-studio/implement-tracking/snowtype-config/index.md) so it applies to every `update` run.

## Keep event specifications up to date

The first time you run `snowtype generate`, Snowtype creates a `.snowtype-lock.json` file next to your configuration file. This lock file pins the exact event specification versions used for code generation.

It has this structure:

```json
{
  "eventSpecifications": {
    "a965caf1-88a6-4a89-9aea-cc92516a9d56": 8,
    "c83f1895-3eb3-469e-a592-a22fabd545b0": 1
  }
}
```

If you've specified tracking plans in your configuration, Snowtype will list event specifications referenced within them individually in the lock file.

:::note
Commit `.snowtype-lock.json` to version control. This ensures everyone on your team is generating code from the same versions.
:::

On subsequent runs, `generate` will read from the lock file rather than fetching the latest versions. This ensures reproducible builds, as running `generate` twice produces the same output, even if a schema was updated in between.

If you add new event specifications to your configuration file, and then run `generate` without updating the lock file, Snowtype will skip them:

```bash
Generating...⚠ Warning: Skipping 25 event specification(s) not found in lock file. Run 'update --yes' to add new entries.
```

To check for newer event specification versions, use the `update` command:

```bash
npx snowtype update
```

Use the `--yes` flag to automatically accept all updates and regenerate the lock file:

```bash
✔: Valid configuration found
⠦ Checking for updates...✔: Available updates found!
✔: Available Event Specification Updates

 - 8a4d8cbd-e703-4e06-9484-abc1877771a7: (new)
 + 8a4d8cbd-e703-4e06-9484-abc1877771a7: version 13

ℹ No updates applied
ℹ To apply the available updates automatically run `update` with the --yes flag
ℹ (caution: will overwrite the configuration file)
```

### Include draft versions

By default, `update` only checks published event specification versions. If Snowtype isn't detecting your event specification, it might be because it's still in draft mode.

To include the latest draft version, use the `--latestDraft` flag:

```bash
npx snowtype update --latestDraft
```

### Scope update to specific IDs

You can limit the update check to a subset of your configuration:

```bash
# Check specific event specifications only
npx snowtype update --eventSpecs <id1> <id2>

# Check specific tracking plans only
npx snowtype update --dataProducts <id1> <id2>
```

## Add new sources with `patch`

Use `snowtype patch` to add new event specifications, data structures, or other schema sources to your configuration file without editing it by hand:

```bash
# Add event specifications
npx snowtype patch --eventSpecificationIds <id1> <id2>

# Add data products
npx snowtype patch --dataProductIds <id1> <id2>

# Add data structures
npx snowtype patch --dataStructures iglu:com.example/my_entity/jsonschema/1-0-0

# Add Iglu Central schemas
npx snowtype patch --igluCentralSchemas iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0

# Add local schema repositories
npx snowtype patch --repositories ./local-schemas
```

The `patch` command updates your configuration file and, by default, regenerates your tracking code. You can disable automatic regeneration in your [configuration file](/docs/event-studio/implement-tracking/snowtype-config/index.md) by setting `regenerateOnPatch` to `false`.

## Clean up stale entries

Over time, your lock file may accumulate entries for schemas you've removed from your configuration. Use `snowtype purge` to clean them up:

```bash
npx snowtype purge
```

This removes any entries in `.snowtype-lock.json` that are no longer referenced by your configuration file.

## Automate with CI/CD

You can run Snowtype in a CI/CD pipeline to catch outdated tracking code before it reaches production. A typical approach:

1. Run `snowtype update --yes` to check for updates and regenerate if any are found.
2. If the generated output changes, fail the pipeline or open a pull request with the updated code.

The `--yes` flag runs non-interactively, accepting all available updates and regenerating automatically.

Combine this with [`--disallowDevSchemas`](/docs/event-studio/implement-tracking/generate-tracking-code/index.md#prevent-generation-from-development-schemas) on the `generate` step to also prevent development-only schemas from reaching production:

```bash
npx snowtype update --yes
npx snowtype generate --disallowDevSchemas
```

## TODO deprecation warnings

TODO
