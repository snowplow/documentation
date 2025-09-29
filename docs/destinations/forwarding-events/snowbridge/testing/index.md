---
title: "Testing Snowbridge locally"
date: "2023-04-14"
sidebar_position: 300
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

The easiest way to test Snowbridge configuration (e.g. transformations) is to run it locally. Ideally, you should also use a sample of data that is as close to the real world as possible. The sample file should contain the events/messages you’d like to test with, one per line.

## Snowplow data

You can get started working with Snowplow data by [downloading this file](./assets/input.txt) that contains a sample of web and mobile Snowplow events in TSV format. However, if you need events that match your actual events, generate your own events sample.

In order to generate your own sample of Snowplow data, you can follow the [guide to use Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/basic-usage/index.md) to generate test data, using the `--output-tsv` to get the data into a file, as per the [exporting to tsv section](/docs/data-product-studio/data-quality/snowplow-micro/basic-usage/index.md#exporting-events).

For example, here we’re using a file named `data.tsv`:

<CodeBlock language="bash">{
`docker run -p 9090:9090 snowplow/snowplow-micro:${versions.snowplowMicro} --output-tsv > data.tsv`
}</CodeBlock>

Point some test environment tracking to `localhost:9090`, and your events should land in `data.tsv`.

## Testing Snowbridge locally

You can run Snowbridge locally via Docker:

<CodeBlock language="bash">{
`docker run --env ACCEPT_LIMITED_USE_LICENSE=yes snowplow/snowbridge:${versions.snowbridge}`
}</CodeBlock>

The default configuration for Snowbridge uses the `stdin` source and the `stdout` target. So, to test sending data through with no transformations, we can run the following command (where `data.tsv` is a file with Snowplow events in TSV format):

<CodeBlock language="bash">{
`cat data.tsv | docker run --env ACCEPT_LIMITED_USE_LICENSE=yes -i snowplow/snowbridge:${versions.snowbridge}`
}</CodeBlock>

This will print the data to the terminal, along with logs.

:::note

The metrics reported in the logs may state that no data has been processed. This is because the app reached the end of output and exited before the default reporting period of 1 second. You can safely ignore this.

:::

You can output the results to a file to make it easier to examine them:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i snowplow/snowbridge:${versions.snowbridge} > output.txt`
}</CodeBlock>

:::tip

The output (in `output.txt`) will contain more than the data itself. There will be additional fields called `PartitionKey`, `TimeCreated` `TimePulled` and `TimeTransformed`. The data that reaches the target in a production setup is under `Data`.

:::

### Adding configuration

To add a specific configuration to test, create a configuration file (`config.hcl`) and pass it to the Docker container. You will need to [mount the file](https://docs.docker.com/storage/bind-mounts/) to the default config path of `/tmp/config.hcl`:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i \\
    --env ACCEPT_LIMITED_USE_LICENSE=yes \\
    --mount type=bind,source=$(pwd)/config.hcl,target=/tmp/config.hcl \\
    snowplow/snowbridge:${versions.snowbridge} > output.txt`
}</CodeBlock>

Note that docker expects absolute paths for mounted files - here we use `$(pwd)` but you can specify the aboslute path manually too.

To test transformations, you only need to add the `transform` block(s) to your configuration file. Don’t specify the `source` and `target` blocks to leave them on default (`stdin` and `stdout`).

To test specific sources or targets, add the respective `source` or `target` blocks. For example, see the [configuration](/docs/destinations/forwarding-events/snowbridge/configuration/targets/http/google-tag-manager.md) for an HTTP target sending data to Google Tag Manager Server Side.

### Adding a custom transformation script

You can add custom scripts by mounting a file, similarly to the above. Assuming the script is in `script.js`, that looks like this:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i \\
    --env ACCEPT_LIMITED_USE_LICENSE=yes \\
    --mount type=bind,source=$(pwd)/config.hcl,target=/tmp/config.hcl \\
    --mount type=bind,source=$(pwd)/script.js,target=/tmp/script.js \\
    snowplow/snowbridge:${versions.snowbridge} > output.txt`
}</CodeBlock>

The transformation config should point to the path of the script _inside_ the container (`/tmp/script.js` above). For example, the transformation block in the configuration might look like this:

```hcl
transform {
  use "js" {
    script_path = "/tmp/script.js"
  }
}
```

### Adding an HTTP request template

For the HTTP target, you can add a custom HTTP request template by mounting a file, similarly to above. Assuming the template is in `template.tpl`, that looks like this:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i \\
    --env ACCEPT_LIMITED_USE_LICENSE=yes \\
    --mount type=bind,source=$(pwd)/config.hcl,target=/tmp/config.hcl \\
    --mount type=bind,source=$(pwd)/template.tpl,target=/tmp/template.tpl \\
    snowplow/snowbridge:${versions.snowbridge}`
}</CodeBlock>



The HTTP target config should point to the path of the script _inside_ the container (`/tmp/template.tpl` above). For example, the HTTP target block in the configuration might look like this:

```hcl
target {
  use "http" {
    url             = "http://myApi.com/events"
    template_file   = "/tmp/template.tpl"
  }
}
```

## Further testing

You can use the above method to test all aspects of the app from a local environment too, including sources, targets, failure targets, metrics endpoints etc. In some cases, you'll need to ensure that the local environment has access to any required resources and can authenticate (e.g. connecting from a laptop to a cloud account/local mock of cloud resources, or setting up a local metrics server for testing). Once that’s done, provide Snowbridge with an hcl file configuring it to connect to those resources, and run it the same way as in the examples above.
