---
title: "Configuration"
date: "2022-10-20"
sidebar_position: 300
---

# Configuration Overview

Snowbridge is configured using [HCL](https://github.com/hashicorp/hcl). To configure Snowbridge, create your configuration in a file with `.hcl` extension, and set the `STREAM_REPLICATOR_CONFIG_FILE` environment variable to the path to your file.

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
There’ll be no external statistics reporting or sentry error reporting.

The below example is a complete configuration, which specifies a kinesis source, a builtin Snowplow filter (which may only be used if the input is Snowplow enriched data), a custom javascript transformation, and a pubsub target, as well as the statsD stats receiver, and sentry for error reporting.

In layman's terms, this configuration will read data from a kinesis stream, filter out any data whose `event_name` field is not `page_view`, run a custom Javascript script upon the data to change the `app_id` to `"1"`, and send the transformed page view data to pubsub. It will also send statistics about what it's doing to a statsD endpoint, and will send information about errors to a sentry endpoint.

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/overview-full-example.hcl
```

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```