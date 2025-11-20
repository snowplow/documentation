---
title: "Configuring Pub/Sub as a Snowbridge target"
sidebar_label: "PubSub"
description: "Write data to a Pubsub topic."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Authentication

Authentication is done using a [GCP Service Account](https://cloud.google.com/docs/authentication/application-default-credentials#attached-sa). Create a service account credentials file, and provide the path to it via the `GOOGLE_APPLICATION_CREDENTIALS` environment variable.

Snowbridge connects to PubSub using [Google's Go Pubsub sdk](https://cloud.google.com/go/pubsub), which establishes a grpc connection with TLS encryption.

## Configuration options

The PubSub Target has only two required options, and no optional ones.

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/targets/pubsub-full-example.hcl
`}</CodeBlock>

If you want to use this as a [failure target](/docs/api-reference/snowbridge/concepts/failure-model/index.md#failure-targets), then use failure_target instead of target.
