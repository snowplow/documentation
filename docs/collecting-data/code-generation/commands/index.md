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

Initialize the setup of Snowtype code generation in a project. Creates the `snowtype.config.json` file.

**Options**
 -  `-i, --organizationId` Organization ID.
 -  `-t, --tracker` Tracker to use. [See available](../using-the-cli/index.md#available-trackerslanguages)
 -  `-l, --language` Language to use. [See available](../using-the-cli/index.md#available-trackerslanguages)
 -  `-o, --outpath` Output path.

### `snowtype generate`

Generates tracking code based on configuration on the `snowtype.config.json` file. Can generate/modify the `.snowtype-lock.json` file.

### `snowtype update`

Checks for latest version updates in Data Structures and Tracking Scenarios.

**Options**
 -  `-y, --yes` Updates all to latest version without prompting. (default: false)

### `snowtype patch`

Adds new Data Structures and Tracking Scenarios in the `snowtype.config.json` file without needing to modify the file by hand.

**Options**
 - `-t, --trackingScenarioIds` Tracking Scenario ID/s.
 - `-d, --dataStructures` Data structure schema URI/s.
 - `-i, --igluCentralSchemas` Iglu central schema URI/s.

### `snowtype help`

Shows a helpful message and brief instructions for the Snowtype CLI usage.

### Global options
 - `-h, --help` Shows helpful instructions for the command.
 - `-V, --version` Output the package version number.
 - `-k, --apiKey` Provide the Snowplow Console API key as a CLI option.
 - `-v, --verbose` Enable verbose logging.