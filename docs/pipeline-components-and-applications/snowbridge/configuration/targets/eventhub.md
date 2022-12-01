# EventHub Target

## Authentication

Authentication for the EventHub target is done by configuring any valid combination of the environment variables [listed in the Azure EventHubs Client documentation](https://pkg.go.dev/github.com/Azure/azure-event-hubs-go#NewHubWithNamespaceNameAndEnvironment).

## Configuration options

Here is an example of the minimum required configuration:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/targets/eventhub-minimal-example.hcl
```

If you want to use this as a [failure target](/docs/pipeline-components-and-applications/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.
Here is an example of every configuration option:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/targets/eventhub-full-example.hcl
```

If you want to use this as a [failure target](/docs/pipeline-components-and-applications/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.