---
title: "Managing data products via the CLI"
description: "Use the 'snowplow-cli data-products' command to manage your data products."
sidebar_label: "Using the CLI"
sidebar_position: 4
sidebar_custom_props:
  offerings:
    - bdp
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The `data-products` subcommand of [Snowplow CLI](/docs/pipeline-components-and-applications/cli/index.md) provides a collection of functionality to ease the integration of custom development and publishing workflows.

## Snowplow CLI Prerequisites

Installed and configured [Snowplow CLI](/docs/pipeline-components-and-applications/cli/index.md)


## Available commands

### Creating data product

```bash
./snowplow-cli dp generate --data-product my-data-product

```

This command creates a minimal data product template in a new file `./data-products/my-data-product.yaml`.


### Downloading data products, event specifications and source apps

```bash
./snowplow-cli dp download
```

This command retrieves all organization data products, event specifications, and source apps. By default, it creates a folder named `data-products` in your current working directory. You can specify a different folder name as an argument if needed. 

The command creates the following structure:
- A main `data-products` folder containing your data product files
- A `source-apps` subfolder containing source app definitions
- Event specifications embedded within their related data product files


### Validating data products, event specifications and source apps

```bash
./snowplow-cli dp validate
```

This command scans all files under `./data-products` and validates them using the BDP console. It checks:

1. Whether each file is in a valid format (YAML/JSON) with correctly formatted fields
2. Whether all source app references in the data product files are valid
3. Whether event specification rules are compatible with their schemas

If validation fails, the command displays the errors in the console and exits with status code 1.


### Publishing data products, event specifications and source apps

```bash
./snowplow-cli dp publish
```

This command locates all files under `./data-products`, validates them, and publishes them to the BDP console.

