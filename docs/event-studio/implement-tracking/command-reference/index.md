---
title: "Snowtype CLI command reference"
sidebar_label: "Command reference"
sidebar_position: 11
description: "Summary of Snowtype CLI commands and options for code generation, with details on usage scenarios and configuration."
keywords: ["Snowtype commands", "CLI reference", "command options", "Snowtype CLI"]
---

import TrackingPlansNomenclature from '@site/docs/reusable/tracking-plans-nomenclature/_index.md';

This page lists every Snowtype CLI command and its options. For more details about configuring Snowtype, see the [sources and output configuration](/docs/event-studio/implement-tracking/snowtype-config/index.md) and [configuration reference](/docs/event-studio/implement-tracking/configuration-reference/index.md) pages.

Use each command like this:

```bash
snowtype [COMMAND] [OPTIONS] [CONTEXT-SPECIFIC-OPTIONS]

# Example:
snowtype init -i my-organization-id -t snowplow-android-tracker -l kotlin -o ./generated-code
```

<TrackingPlansNomenclature />

## Global options

These options work with any command.

| Flag                      | Description                        |
| ------------------------- | ---------------------------------- |
| `-h, --help`              | Show help for the command.         |
| `-V, --version`           | Output the package version number. |
| `-k, --apiKey <string>`   | Snowplow Console API key.          |
| `-s, --apiKeyId <string>` | Snowplow Console API key ID.       |
| `-v, --verbose`           | Enable verbose logging.            |

## `init`

Initializes Snowtype in a project by creating the configuration file.

| Flag                            | Description                    |
| ------------------------------- | ------------------------------ |
| `-i, --organizationId <string>` | Organization ID                |
| `-t, --tracker <tracker>`       | Tracker to use                 |
| `-l, --language <language>`     | Language to use                |
| `-o, --outpath <string>`        | Output path for generated code |

See the [configuration reference](/docs/event-studio/implement-tracking/configuration-reference/index.md#supported-trackers-and-languages) for details of the valid tracker and language options.

## `generate`

Generates tracking code based on the configuration file.


| Flag                                    | Description                                                                                                                                                                                      | Default |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `-c, --config <string>`                 | Config file path.                                                                                                                                                                                |         |
| `--instructions`                        | Generate [event specification instructions](/docs/event-studio/implement-tracking/generate-tracking-code/index.md#markdown-instructions).                                                        |         |
| `--no-instructions`                     | Generate without instructions.                                                                                                                                                                   |         |
| `--validations`                         | Add [runtime validation](/docs/event-studio/implement-tracking/client-side-validation/index.md) using Ajv. Available only for the Browser tracker.                                               |         |
| `--no-validations`                      | Generate without runtime validations.                                                                                                                                                            |         |
| `--disallowDevSchemas`                  | Disallow [generation of code](/docs/event-studio/implement-tracking/generate-tracking-code/index.md#prevent-generation-from-development-schemas) using schemas only deployed on DEV environment. | `false` |
| `--deprecateOnlyOnProdAvailableUpdates` | Show [deprecation warnings](/docs/event-studio/implement-tracking/generate-tracking-code/index.md#deprecation-and-hidden-warnings) only when there are PROD-available schema updates.            | `false` |

## `update`

Checks for updates to event specifications and data structures. Event specification updates are checked against the versions pinned in `.snowtype-lock.json`. Data structure updates are checked against versions in `snowtype.config.json`.

| Flag                          | Description                                                                                                                                                                                          | Default |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `-c, --config <string>`       | Config file path.                                                                                                                                                                                    |         |
| `-y, --yes`                   | Apply all available updates without prompting. Overwrites the configuration and lock files.                                                                                                          | `false` |
| `-m, --maximumBump <level>`   | For data structures and schemas only. Maximum [SchemaVer](/docs/api-reference/iglu/common-architecture/schemaver/index.md) bump to show update notifications for. Values: `patch`, `minor`, `major`. | `major` |
| `-d, --latestDraft`           | Include draft versions when checking for event specification updates. By default, only published versions are shown. Does not affect data structures.                                                |         |
| `-e, --eventSpecs <ids...>`   | Check only the specified event specifications.                                                                                                                                                       |         |
| `-p, --dataProducts <ids...>` | Check only event specifications belonging to the specified tracking plans.                                                                                                                           |         |

## `patch`

Adds new items to the configuration file without modifying it by hand.

| Flag                                   | Description                                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `-c, --config <string>`                | Config file path                                                                                                          |
| `-e, --eventSpecificationIds <ids...>` | Event specification IDs                                                                                                   |
| `-p, --dataProductIds <ids...>`        | Tracking plan IDs                                                                                                         |
| `-d, --dataStructures <uris...>`       | Data structure schema URIs                                                                                                |
| `-i, --igluCentralSchemas <uris...>`   | Iglu Central schema URI.                                                                                                  |
| `-r, --repositories <paths...>`        | [Local data structure repository](/docs/event-studio/programmatic-management/snowplow-cli/data-structures/index.md) paths |

## `purge`

Removes event specification entries from the lock file that no longer appear in the configuration file.

| Flag                    | Description      |
| ----------------------- | ---------------- |
| `-c, --config <string>` | Config file path |
