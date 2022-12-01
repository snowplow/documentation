# HTTP Target

## Authentication

Where basicauth is used, it may be configured using the `basic_auth_username` and `basic_auth_password` options. Where an authorisation header is used, it may be set via the `headers` option.

we recommend using environment variables for sensitive values - which can be done via HCL's native `env.MY_ENV_VAR` format (as seen below).

TLS may be configured by providing the `key_file`, `cert_file` and `ca_file` options with paths to the relevant TLS files.

## Configuration options

Here is an example of the minimum required configuration:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/targets/http-minimal-example.hcl
```

If you want to use this as a [failure target](/docs/pipeline-components-and-applications/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.
Here is an example of every configuration option:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/targets/http-full-example.hcl
```

If you want to use this as a [failure target](/docs/pipeline-components-and-applications/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.