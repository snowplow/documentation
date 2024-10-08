---
title: "Managing data structures via the CLI"
description: "Use the 'snowplow-cli data-structures' command to manage your data structures."
sidebar_label: "Using the CLI"
sidebar_position: 2
sidebar_custom_props:
  offerings:
    - bdp
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Getting started

The `data-structures` subcommand of [Snowplow CLI](https://github.com/snowplow-product/snowplow-cli) provides a collection of functionality to ease the integration of custom development and publishing workflows.

### Snowplow CLI Prerequisites

#### Download

Releases can be found on github https://github.com/snowplow-product/snowplow-cli/releases.

For systems with `curl` available the following commands should get you started with the latest version. Take care to replace `darwin_amd64` with the correct architecture for your system.

```bash
curl -L -o snowplow-cli https://github.com/snowplow-product/snowplow-cli/releases/latest/download/snowplow-cli_darwin_amd64
chmod u+x snowplow-cli
```

#### Configure

You will need three values.

API Key Id and API Key Secret are generated from the [credentials section](https://console.snowplowanalytics.com/credentials) in BDP Console.

Organization Id can be retrieved from the URL immediately following the .com when visiting BDP console:

![](images/orgID.png)

Snowplow CLI can take its configuration from a variety of sources. More details are available from `snowplow-cli data-structures --help`. Variations on these three examples should serve most cases.

<Tabs groupId="config">
  <TabItem value="env" label="env variables" default>

  ```bash
  SNOWPLOW_CONSOLE_API_KEY_ID=********-****-****-****-************
  SNOWPLOW_CONSOLE_API_KEY_SECRET=********-****-****-****-************
  SNOWPLOW_CONSOLE_ORG_ID=********-****-****-****-************
  ```

  </TabItem>
  <TabItem value="defaultconfig" label="$HOME/.config/snowplow/snowplow.yml" >

  ```yaml
  console:
    api-key-id: ********-****-****-****-************
    api-key-secret: ********-****-****-****-************
    org-id: ********-****-****-****-************
  ```

  </TabItem>
  <TabItem value="args" label="inline arguments" >

  ```bash
  snowplow-cli data-structures --api-key-id ********-****-****-****-************ --api-key-secret ********-****-****-****-************ --org-id ********-****-****-****-************
  ```

  </TabItem>
</Tabs>


## Available commands

### Creating data structures

```bash
snowplow-cli ds generate login_click ./folder-name

```

Will create a minimal data structure template in a new file `./folder-name/login_click.yaml`. Note that you will need to add a vendor name to the template before it will pass validation. Alternatively supply a vendor at creation time with the `--vendor com.acme` flag.


### Downloading data structures

```bash
snowplow-cli ds download 
```

This command will retrieve all organization data structures. By default it will create a folder named `data-structures` in the current working directory to put them in. It uses a combination of vendor and name to further break things down.

Given a data structure with `vendor: com.acme` and `name: link_click` and assuming the default format of yaml the resulting folder structure will be `./data-structures/com.acme/link_click.yaml`.


### Validating data structures

```bash
snowplow-cli ds validate ./folder-name
```

This command will find all files under `./folder-name` (if omitted then `./data-structures`) and attempt to validate them using BDP console. It will assert the following

1. Is each file a valid format (yaml/json) with expected fields
2. Does the schema in the file conform to [snowplow expectations](/docs/understanding-your-pipeline/schemas/#the-anatomy-of-a-schema)
3. Given the organization's [loading configuration](/docs/storing-querying/loading-process/) will any schema version number choices have a potentially negative effect on data loading

If any validations fail the command will report the problems to stdout and exit with status code 1.


### Deploying data structures

```bash
snowplow-cli ds deploy dev ./folder-name
```

This command will find all files under `./folder-name` (if omitted then `./data-structures`) and attempt to publish them to BDP console in the environment provided (`dev` or `prod`).

Publishing to `dev` will also cause data structures to be validated with the `validate` command before upload. Publishing to `prod` will not validate but requires all data structures referenced to be present on `dev`.



