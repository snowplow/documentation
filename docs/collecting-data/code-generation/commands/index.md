---
title: "Commands"
sidebar_position: 4
---

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
 -  `--instructions` Generate event specification instructions.
 -  `--no-instructions` Generate without instructions.
 -  `--validations` Add runtime validation on events. _Currently available for the Browser tracker_.
 -  `--no-validations` Do not add runtime validation on events.
 -  `--disallowDevSchemas` Disallow generation of code using schemas deployed on DEV environment. _Sending events using schemas deployed on DEV, will result in failed events in production pipelines._ (default: false)
 -  `--deprecateOnlyOnProdAvailableUpdates` Show deprecation warnings only when there are PROD available schema updates. (default: false)

### `snowtype update`

Checks for latest version updates in Data Structures and Event Specifications.

**Options**
 -  `-y, --yes` Updates all to latest version without prompting. (default: false)
 -  `-m, --maximumBump` The maximum SchemaVer update to show an available update notification for. Possible values are 'patch', 'minor', 'major' and will work as expected regular SemVer bumps. (default: 'major')

### `snowtype patch`

Adds new Data Structures and Event Specifications in the `snowtype.config.json` file without needing to modify the file by hand.

**Options**
 - `-e, --eventSpecificationIds` Event Specification ID/s.
 - `-p, --dataProductIds` Data Product ID/s.
 - `-d, --dataStructures` Data structure schema URI/s.
 - `-i, --igluCentralSchemas` Iglu central schema URI/s.

### `snowtype help`

Shows a helpful message and brief instructions for the Snowtype CLI usage.

### Global options
 - `-h, --help` Shows helpful instructions for the command.
 - `-V, --version` Output the package version number.
 - `-k, --apiKey` Provide the Snowplow Console API key as a CLI option.
 - `-v, --verbose` Enable verbose logging.