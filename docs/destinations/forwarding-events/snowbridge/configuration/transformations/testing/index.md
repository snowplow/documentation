---
title: "Testing Transformations"
date: "2023-04-14"
sidebar_position: 300
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

The easiest way to test a transformation configuration for Snowbridge is to run it locally, using the default stdin source, stdout target and your actual transformation config - using a sample of data that is as close to the real world as possible.

The sample file should contain the events/messages you'd like to test with, one per line.

## Snowplow data - generating a sample

If you're working with Snowplow data, you can follow the [guide to use Snowplow Micro](/docs/getting-started-with-micro/basic-usage/index.md) to generate test data, using the `--output-tsv` to get the data into a file, as per the [exporting to tsv section](/docs/getting-started-with-micro/basic-usage/index.md#exporting-events-to-tsv).

For example, here we're using a file named `data.tsv`:

<CodeBlock language="bash">{
`docker run -p 9090:9090 snowplow/snowplow-micro:${versions.snowplowMicro} --output-tsv > data.tsv`
}</CodeBlock>

Point some test environment tracking to `localhost:9090`, and your events should land in `data.tsv`.

## Testing Snowbridge locally

### Local Snowbridge setup

You can run Snowbridge locally via Docker:

<CodeBlock language="bash">{
`docker run snowplow/snowbridge:${versions.snowbridge}`
}</CodeBlock>

Since the default configuration for snowbridge is already `stdin` source and `stdout` target. So, to test sending data through with no transformations, (where `data.tsv` contains our test data) we can run:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i snowplow/snowbridge:${versions.snowbridge}`
}</CodeBlock>

This will print the data to console, along with logs.

:::note

The metrics reported in the logs may state that no data has been processed. This is because the app reached the end of output and exited before the default reporting period of 1 second. You can safely ignore this.

:::

It is likely easiest to output the results to file, to make it easier to examine the results:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i snowplow/snowbridge:${versions.snowbridge} > output.txt`
}</CodeBlock>

:::tip

The output (in `output.txt`) will contain more than the data itself. There will be additional fields called `PartitionKey`, `TimeCreated` `TimePulled` and `TimeTransformed`. The data that reaches the target in a production setup is under `Data`.

:::

### Adding configuration

To add a specific configuration to test, create a configuration file (`config.hcl`) and pass it to the Docker container. You will need to [mount the file](https://docs.docker.com/storage/bind-mounts/) and set the `SNOWBRIDGE_CONFIG_FILE` environment variable to the path _inside_ the container:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i \\
    --mount type=bind,source=$(pwd)/config.hcl,target=/tmp/config.hcl \\
    --env SNOWBRIDGE_CONFIG_FILE=/tmp/config.hcl \\
    snowplow/snowbridge:${versions.snowbridge} > output.txt`
}</CodeBlock>

Note that docker expects absolute paths for mounted files - here we use `$(pwd)` but you can specify the aboslute path manually too.

To test transformations, you only need to add the `transform` block(s) to your configuration file. Don’t specify the `source` and `target` blocks to leave them on default (`stdin` and `stdout`).

### Adding custom scripts

Finally, you can add custom scripts by mounting a file, in the exact same manner. Assuming the script is in `script.js`, that looks like this:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i \\
    --mount type=bind,source=$(pwd)/config.hcl,target=/tmp/config.hcl \\
    --mount type=bind,source=$(pwd)/script.js,target=/tmp/script.js \\
    --env SNOWBRIDGE_CONFIG_FILE=/tmp/config.hcl \\
    snowplow/snowbridge:${versions.snowbridge} > output.txt`
}</CodeBlock>

The transformation config should point to the path of the script _inside_ the container (`/tmp/script.js` above). For example, the transformation block in the configuration might look like this:

```hcl
transform {
  use "js" {
    script_path = env.JS_SCRIPT_PATH
  }
}
```

## Further testing

You can use the above method to test all other aspects of the app from a local environment too, including sources, targets, failure targets, metrics endpoints etc. To do so, first you'll need to ensure that the local envionment has access to any required resources and can authenticate (eg. connecting from a laptop to a cloud account, or setting up a local metrics server for testing). Once that's done, provide Snowbridge with an hcl file configuring it to connect to those resources, and run it the same way as in the transformation examples above.
