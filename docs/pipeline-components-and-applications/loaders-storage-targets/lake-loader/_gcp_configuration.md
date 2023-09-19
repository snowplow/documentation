```json title="Minimal GCP config file"
{
  "input": {
    "subscription": "projects/myproject/subscriptions/snowplow-enriched"
  }
  "output" {
    "good": {
      "location": "gs://my-bucket/events"
    }
    "bad": {
      "topic": "projects/myproject/topics/snowplow-bad"
    }
  }
}
```

See the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference-gcp/index.md) for all possible configuration parameters.
