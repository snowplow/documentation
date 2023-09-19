```json title="Minimal Azure config file"
{
  "input": {
    "topicName": "snowplow-enriched"
    "bootstrapServers": "localhost:9092"
  }
  "output": {
    "good": {
      "location": "abfs://snowplow@example.dfs.core.windows.net/events"
    }
    "bad": {
      "topicName": "snowplow-bad"
      "bootstrapServers": "localhost:9092"
    }
  }
}
```

See the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference-azure/index.md) for all possible configuration parameters.
