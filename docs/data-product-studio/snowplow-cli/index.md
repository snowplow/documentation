---
title: Snowplow CLI
sidebar_label: Snowplow CLI
sidebar_position: 7
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Snowplow CLI brings data management elements of Snowplow Console into the command line. It allows you to download your data structures and data products to yaml/json files and publish them back to console. This enables git-ops-like workflows, with reviews and brancing.

# Install

Snowplow CLI can be installed with [homebrew](https://brew.sh/):
```
brew install snowplow/taps/snowplow-cli
```

Verify the installation with
```
snowplow-cli --help
```

For systems where homebrew is not available binaries for multiple platforms can be found in [releases](https://github.com/snowplow/snowplow-cli/releases).

Example installation for `linux_x86_64` using `curl`

```bash
curl -L -o snowplow-cli https://github.com/snowplow/snowplow-cli/releases/latest/download/snowplow-cli_linux_x86_64
chmod u+x snowplow-cli
```

Verify the installation with
```
./snowplow-cli --help
```

# Configure

You will need three values.

An API Key Id and the corresponding API Key (secret), which are generated from the [credentials section](https://console.snowplowanalytics.com/credentials) in BDP Console.

The organization ID, which can be retrieved from the URL immediately following the .com when visiting BDP console:

![](./images/orgID.png)

Snowplow CLI can take its configuration from a variety of sources. More details are available from `./snowplow-cli data-structures --help`. Variations on these three examples should serve most cases.

<Tabs groupId="config">
  <TabItem value="env" label="env variables" default>

  ```bash
  SNOWPLOW_CONSOLE_API_KEY_ID=********-****-****-****-************
  SNOWPLOW_CONSOLE_API_KEY=********-****-****-****-************
  SNOWPLOW_CONSOLE_ORG_ID=********-****-****-****-************
  ```

  </TabItem>
  <TabItem value="defaultconfig" label="$HOME/.config/snowplow/snowplow.yml" >

  ```yaml
  console:
    api-key-id: ********-****-****-****-************
    api-key: ********-****-****-****-************
    org-id: ********-****-****-****-************
  ```

  </TabItem>
  <TabItem value="args" label="inline arguments" >

  ```bash
  ./snowplow-cli data-structures --api-key-id ********-****-****-****-************ --api-key ********-****-****-****-************ --org-id ********-****-****-****-************
  ```

  </TabItem>
</Tabs>

Snowplow CLI defaults to yaml format. It can be changed to json by either providing a `--output-format json` flag or setting the `output-format: json` config value. It will work for all commands where it matters, not only for `generate`.


# Use cases

- [Manage your data structures with snowplow-cli](/docs/data-product-studio/data-structures/manage/cli/index.md)
- [Set up a github CI/CD pipeline to manage data structures and data products](/docs/resources/recipes-tutorials/recipe-data-structures-in-git/index.md)
