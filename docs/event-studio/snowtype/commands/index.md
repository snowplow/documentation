---
title: "Snowtype CLI command reference"
sidebar_label: "Commands"
sidebar_position: 4
description: "Summary of Snowtype CLI commands and options for code generation, with details on usage scenarios and configuration."
keywords: ["Snowtype commands", "CLI reference", "command options", "Snowtype CLI"]
---

import TrackingPlansNomenclature from '@site/docs/reusable/tracking-plans-nomenclature/_index.md';

<TrackingPlansNomenclature />

:::info
This page only summarizes the CLI commands and the options for each command. For details on which scenarios they can be used, you can go to the [Working with the CLI page](../using-the-cli/index.md).
:::

## Usage

`snowtype [COMMAND] [OPTIONS] [CONTEXT-SPECIFIC-OPTIONS]`

## Available CLI commands

### `snowtype init`

Initialize the setup of Snowtype code generation in a project. Creates the configuration file.

**Options**
 -  `-i, --organizationId` Organization ID.
 -  `-t, --tracker` Tracker to use. [See available](../using-the-cli/index.md#available-trackerslanguages)
 -  `-l, --language` Language to use. [See available](../using-the-cli/index.md#available-trackerslanguages)
 -  `-o, --outpath` Output path.

### `snowtype generate`

Generates tracking code based on configuration on the configuration file. Can generate/modify the `.snowtype-lock.json` file.

**Options**
 -  `-c, --config` Config file path.
 -  `--instructions` Generate event specification instructions.
 -  `--no-instructions` Generate without instructions.
 -  `--validations` Add runtime validation on events. _Currently available for the Browser tracker_.
 -  `--no-validations` Do not add runtime validation on events.
 -  `--disallowDevSchemas` Disallow generation of code using schemas deployed on DEV environment. _Sending events using schemas deployed on DEV, will result in failed events in production pipelines._ (default: false)
 -  `--deprecateOnlyOnProdAvailableUpdates` Show deprecation warnings only when there are PROD available schema updates. (default: false)

### `snowtype update`

Checks for latest version updates in Data Structures and Event Specifications.

**Options**
 -  `-c, --config` Config file path.
 -  `-y, --yes` Updates all to latest version without prompting. (default: false)
 -  `-m, --maximumBump` The maximum SchemaVer update to show an available update notification for. Possible values are 'patch', 'minor', 'major' and will work as expected regular SemVer bumps. (default: 'major')

### `snowtype patch`

Adds new Data Structures and Event Specifications in the `snowtype.config.json` file without needing to modify the file by hand.

**Options**
 - `-c, --config` Config file path.
 - `-e, --eventSpecificationIds` Event Specification ID/s.
 - `-p, --dataProductIds` Tracking Plan ID/s.
 - `-d, --dataStructures` Data structure schema URI/s.
 - `-i, --igluCentralSchemas` Iglu central schema URI/s.
 - `-r, --repositories` Local Data Structure repositories generated from the [snowplow-cli](/docs/event-studio/data-structures/manage/cli/index.md).


### `snowtype help`

Shows a helpful message and brief instructions for the Snowtype CLI usage.

### Global options
 - `-h, --help` Shows helpful instructions for the command.
 - `-V, --version` Output the package version number.
 - `-k, --apiKey` Provide the Snowplow Console API key as a CLI option.
 - `-v, --verbose` Enable verbose logging.
