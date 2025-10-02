---
title: "Managing data structures via the CLI"
description: "Use the 'snowplow-cli data-structures' command to manage your data structures."
sidebar_label: "Snowplow CLI"
sidebar_position: 2
sidebar_custom_props:
  offerings:
    - cdi
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The `data-structures` subcommand of [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md) provides a collection of functionality to ease the integration of custom development and publishing workflows.

## Snowplow CLI Prerequisites

Installed and configured [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md)


## Available commands

### Creating data structures

```bash
./snowplow-cli ds generate login_click ./folder-name

```

Will create a minimal data structure template in a new file `./folder-name/login_click.yaml`. Note that you will need to add a vendor name to the template before it will pass validation. Alternatively supply a vendor at creation time with the `--vendor com.acme` flag.


### Downloading data structures

```bash
./snowplow-cli ds download
```

This command will retrieve all organization data structures. By default it will create a folder named `data-structures` in the current working directory to put them in. It uses a combination of vendor and name to further break things down.

Given a data structure with `vendor: com.acme` and `name: link_click` and assuming the default format of yaml the resulting folder structure will be `./data-structures/com.acme/link_click.yaml`.

:::note Drafts not included

The CLI download command only retrieves data structures that have been deployed to at least the development environment. **Draft data structures** that haven't been deployed yet will not be included in the download.

:::


### Validating data structures

```bash
./snowplow-cli ds validate ./folder-name
```

This command will find all files under `./folder-name` (if omitted then `./data-structures`) and attempt to validate them using Snowplow Console. It will assert the following

1. Is each file a valid format (yaml/json) with expected fields
2. Does the schema in the file conform to [snowplow expectations](/docs/fundamentals/schemas/index.md#the-anatomy-of-a-schema)
3. Given the organization's [loading configuration](/docs/destinations/warehouses-lakes/index.md) will any schema version number choices have a potentially negative effect on data loading

If any validations fail the command will report the problems to stdout and exit with status code 1.


### Publishing data structures

```bash
./snowplow-cli ds publish dev ./folder-name
```

This command will find all files under `./folder-name` (if omitted then `./data-structures`) and attempt to publish them to Snowplow Console in the environment provided (`dev` or `prod`).

Publishing to `dev` will also cause data structures to be validated with the `validate` command before upload. Publishing to `prod` will not validate but requires all data structures referenced to be present on `dev`.
