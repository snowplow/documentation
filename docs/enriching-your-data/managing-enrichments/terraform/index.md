---
title: "Managing enrichments in Snowplow Community Edition"
date: "2021-10-06"
sidebar_label: "Using Terraform"
sidebar_position: 15
sidebar_custom_props:
  offerings:
    - community
---

If you have installed Snowplow via [Quick Start](/docs/getting-started-on-community-edition/what-is-quick-start/index.md), you will have the following enrichments enabled by default:

- [UA parser](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md)
- [Campaign Attribution](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)
- [Event fingerprint](/docs/enriching-your-data/available-enrichments/event-fingerprint-enrichment/index.md)
- [Referer parser](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)

To enable an extra enrichment, such as the [IP anonymisation enrichment](/docs/enriching-your-data/available-enrichments/ip-anonymization-enrichment/index.md):

- Follow the instructions for [AWS](https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2#inserting-custom-enrichments), [GCP](https://github.com/snowplow-devops/terraform-google-enrich-pubsub-ce#inserting-custom-enrichments) or [Azure](https://github.com/snowplow-devops/terraform-azurerm-enrich-event-hub-vmss#inserting-custom-enrichments), updating the `anonOctets` and `anonSegments` according to the number of octets/ segments that you would like to be anonymised
- Run `terraform apply`
- Now when you query your events you should find that the `user_ipaddress` has been anonymised

:::note

The IAB and IP Lookups enrichments require a 3rd party database to function.

:::

To disable any enrichment, you can follow the instructions for [AWS](https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2#disabling-default-enrichments), [GCP](https://github.com/snowplow-devops/terraform-google-enrich-pubsub-ce#disabling-default-enrichments) or [Azure](https://github.com/snowplow-devops/terraform-azurerm-enrich-event-hub-vmss#disabling-default-enrichments).

If you are using [Snowplow Micro](/docs/testing-debugging/snowplow-micro/what-is-micro/index.md) for testing, you can configure enrichments following the [usage guide](/docs/testing-debugging/snowplow-micro/configuring-enrichments/index.md).
