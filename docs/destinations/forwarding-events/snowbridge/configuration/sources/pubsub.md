---
title: "PubSub"
description: "Set up Google Cloud Pub/Sub as a source for behavioral event forwarding and transformation workflows."
schema: "TechArticle"
keywords: ["PubSub Source", "Google PubSub", "GCP Source", "Stream Input", "Message Source", "Event Ingestion"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Authentication

Authentication is done using a [GCP Service Account](https://cloud.google.com/docs/authentication/application-default-credentials#attached-sa). Create a service account credentials file, and provide the path to it via the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

Snowbridge connects to PubSub using [Google's Go Pubsub sdk](https://cloud.google.com/go/pubsub), which establishes a grpc connection with TLS encryption.

## Configuration options

Here is an example of the minimum required configuration:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/sources/pubsub-minimal-example.hcl
`}</CodeBlock>

Here is an example of every configuration option:

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/sources/pubsub-full-example.hcl
`}</CodeBlock>
