---
title: "Manage enrichments in Snowplow Self-Hosted"
date: "2021-10-06"
sidebar_label: "Snowplow Self-Hosted Terraform"
sidebar_position: 15
description: "Enable and configure enrichments in Snowplow Self-Hosted deployments using Terraform on AWS, GCP, or Azure."
keywords: ["Terraform enrichments", "Self-Hosted enrichments", "enrichment deployment"]
---

If you have installed Snowplow via [Quick Start](/docs/get-started/self-hosted/index.md), you will have the following enrichments enabled by default:

- [UA parser](/docs/pipeline/enrichments/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md)
- [Campaign attribution](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md)
- [Event fingerprint](/docs/pipeline/enrichments/available-enrichments/event-fingerprint-enrichment/index.md)
- [Referer parser](/docs/pipeline/enrichments/available-enrichments/referrer-parser-enrichment/index.md)

To enable another enrichment, you'll need to provide additional configuration. Every enrichment has its own configuration schema, with required `name`, `vendor`, and `enabled` fields. Check the documentation for the enrichment you want to enable for details.

For example, to enable the [IP anonymization enrichment](/docs/pipeline/enrichments/available-enrichments/ip-anonymization-enrichment/index.md), you'll need a JSON schema with this structure:

```json
schema: "iglu:com.snowplowanalytics.snowplow/anon_ip/jsonschema/1-0-1",
data: {
    name: "anon_ip",
    vendor: "com.snowplowanalytics.snowplow",
    enabled: true,
    parameters: {
        anonOctets: 1,
        anonSegments: 1
    }
}
```

The exact mechanism for providing this configuration depends on your cloud provider:
- Follow the instructions for [AWS](https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2#inserting-custom-enrichments), [GCP](https://github.com/snowplow-devops/terraform-google-enrich-pubsub-ce#inserting-custom-enrichments) or [Azure](https://github.com/snowplow-devops/terraform-azurerm-enrich-event-hub-vmss#inserting-custom-enrichments)
- Run `terraform apply`

:::note
The IAB and IP Lookups enrichments require a third-party database to function.
:::

To disable any enrichment, follow the instructions for [AWS](https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2#disabling-default-enrichments), [GCP](https://github.com/snowplow-devops/terraform-google-enrich-pubsub-ce#disabling-default-enrichments) or [Azure](https://github.com/snowplow-devops/terraform-azurerm-enrich-event-hub-vmss#disabling-default-enrichments).

If you are using [Snowplow Micro](/docs/testing/snowplow-micro/index.md) for testing, you can configure enrichments following the [usage guide](/docs/testing/snowplow-micro/local/enrichments/index.md).
