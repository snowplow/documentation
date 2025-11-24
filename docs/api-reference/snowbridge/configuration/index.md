---
title: "Snowbridge configuration overview"
sidebar_label: "Configuration"
date: "2022-10-20"
sidebar_position: 300
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

# Configuration Overview

Snowbridge is configured using [HCL](https://github.com/hashicorp/hcl). To configure Snowbridge, create your configuration in a file with `.hcl` extension, and set the `SNOWBRIDGE_CONFIG_FILE` environment variable to the path to your file. By default, the Snowbridge docker image uses `/tmp/config.hcl` as the config path - when using the docker images you can either mount your config file to `/tmp/config.hcl`, or mount it to a different path, and set the `SNOWBRIDGE_CONFIG_FILE` environment variable in your docker container to that path.

Inside the configuration, you can reference environment variables using the `env` object. For example, to refer to an environment variable named `MY_ENV_VAR` in your configuration, you can use  `env.MY_ENV_VAR`. We recommend employing environment variables for any sensitive value, such as a password, as opposed to adding the value to the configuration verbatim.

For most options, Snowbridge uses blocks for configuration. The `use` keyword specifies what you'd like to configure - for example a kinesis source is configured using `source { use "kinesis" {...}}`.

For all configuration blocks except for transformations, you must provide only one block (or none, to use the defaults).

For transformations, you may provide 0 or more `transform` configuration blocks. They will be applied to the data, one after another, in the order they appear in the configuration. The exception to this is when a filter is applied and the filter condition is met - in this case the message will be acked and subsequent transformations will not be applied (neither will the data be sent to the destination).

Some application-level options are not contained in a block, instead they're top-level options in the configuration. For example, to set the log level of the application, we just set the top-level variable `log_level`.

If you do not provide a configuration, or provide an empty one, the application will use the defaults:
* `stdin` source;
* no transformations;
* `stdout` target;
* `stdout` failure target.
There'll be no external statistics reporting or sentry error reporting.

## License

Since version 2.4.0, Snowbridge is released under the [Snowplow Limited Use License](https://docs.snowplow.io/limited-use-license-1.0/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)).

To accept the terms of license and run Snowbridge, set the `ACCEPT_LIMITED_USE_LICENSE=yes` environment variable. Alternatively, you can configure the `license.accept` option, like this:

```hcl
license {
  accept = true
}
```

## Example configuration

The below example is a complete configuration, which specifies a kinesis source, a builtin Snowplow filter (which may only be used if the input is Snowplow enriched data), a custom javascript transformation, and a pubsub target, as well as the statsD stats receiver, and sentry for error reporting.

In layman's terms, this configuration will read data from a kinesis stream, filter out any data whose `event_name` field is not `page_view`, run a custom Javascript script upon the data to change the `app_id` to `"1"`, and send the transformed page view data to pubsub. It will also send statistics about what it's doing to a statsD endpoint, and will send information about errors to a sentry endpoint.

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/overview-full-example.hcl
`}</CodeBlock>
