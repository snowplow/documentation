# Stdout Target

Stdout target doesn't have any configurable options - when configured it simply outputs the messages to stdout.
## Configuration 

Here is an example of the configuration:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/targets/stdout-full-example.hcl
```

If you want to use this as a [failure target](/docs/pipeline-components-and-applications/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.