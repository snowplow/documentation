# Kinesis Target

## Authentication

Authentication is done via the [AWS authentication environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html). Optionally, you can use the `role_arn` option to specify an ARN to use on the stream.


## Configuration options

Here is an example of the minimum required configuration:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/targets/kinesis-minimal-example.hcl
```

If you want to use this as a [failure target](/docs/pipeline-components-and-applications/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.
Here is an example of every configuration option:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/targets/kinesis-full-example.hcl
```

If you want to use this as a [failure target](/docs/pipeline-components-and-applications/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.