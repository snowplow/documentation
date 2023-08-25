---
title: "PubSub Target"
description: "Write data to a Pubsub topic."
---

## Authentication

Authentication is done using a [GCP Service Account](https://cloud.google.com/docs/authentication/application-default-credentials#attached-sa). Create a service account credentials file, and provide the path to it via the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.


## Configuration options

The PubSub Target has only two required options, and no optional ones.

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/targets/pubsub-full-example.hcl
```

If you want to use this as a [failure target](/docs/destinations/forwarding-events/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.
