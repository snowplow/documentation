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

The sample file should contain the events/messages you'd like to test with, line separated.

## Snowplow data - generating a sample

If you're working with Snowplow data, you can simpy follow the [guide to use Snowplow Micro](/docs/getting-started-with-micro/basic-usage/index.md) to generate test data, using the `--output-tsv` to get the data into a file, as per the [exporting to tsv section](/docs/getting-started-with-micro/basic-usage/index.md#exporting-events-to-tsv).

For example, here we're using a file named `data.tsv`:

<CodeBlock language="bash">{
`docker run -p 9090:9090 snowplow/snowplow-micro:${versions.snowplowMicro} --output-tsv > data.tsv`
}</CodeBlock>

Point some test environment tracking to `localhost:9090`, and your events should land in `data.tsv`.

## Testing Snowbridge locally

### Local Snowbridge setup

Snowbridge can be run locally via docker, with:

<CodeBlock language="bash">{
`docker run snowplow/snowbridge:${versions.snowbridge}`
}</CodeBlock>

Since the default configuration for snowbridge is already `stdin` source and `stdout` target. So, to test sending data through with no transformations, (where `data.tsv` contains our test data) we can run:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i snowplow/snowbridge:${versions.snowbridge}`
}</CodeBlock>

This will print the data to console, along with logs - note that the metrics reported in logs may report that no data has been processed. This is because the app reached the end of output and exited before the default reporting period of 1 second.

It is likely easiest to output the results to file, to make it easier to examine the results:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i snowplow/snowbridge:${versions.snowbridge} > output.txt`
}</CodeBlock>

Note that the resulting data will contain more than the data: `PartitionKey`, `TimeCreated` `TimePulled` and `TimeTransformed` will also be present. The data that reaches the target in a production setup is under `Data`.

### Adding configuration

Adding the specific configuration to test is a matter of mounting a configuration file, and setting the `SNOWBRIDGE_CONFIG_FILE` env var to point to that path. If your configuration is in `config.hcl`, you can add configuration to the above example as follows:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i \\
    --mount type=bind,source=$(pwd)/config.hcl,target=/tmp/config.hcl \\
    --env SNOWBRIDGE_CONFIG_FILE=/tmp/config.hcl \\
    snowplow/snowbridge:${versions.snowbridge} > output.txt`
}</CodeBlock>

Note that docker expects absolute paths for mounted files - here we use pwd but you can specify the aboslute path manually too.

To test transformations, your configuration file only needs to contain the `transform` block(s) that you're testing, leaving the source and targets on default (by not specifying them in the configuration file).

### Adding custom scripts

Finally, you can add custom scripts by mounting a file, in the exact same manner. Assuming the script is in `script.js`, that looks like this:

<CodeBlock language="bash">{
`cat data.tsv | docker run -i \\
    --mount type=bind,source=$(pwd)/config.hcl,target=/tmp/config.hcl \\
    --mount type=bind,source=$(pwd)/script.js,target=/tmp/script.js \\
    --env SNOWBRIDGE_CONFIG_FILE=/tmp/config.hcl \\
    snowplow/snowbridge:${versions.snowbridge} > output.txt`
}</CodeBlock>

Note that you must ensure that the transformation config points to the mounted path (the `target` in the mount path - `/tmp/script.js` above).

## Further testing

You can use the above method to test sources and targets from a local environment too, which can be useful in combination with transformations, once you set up the appropriate authentication for your source and/or target, add them to your configuration file, and run as directed above.
