---
position: 2
title: Enabling via Terraform
description: "Enable Snowplow enrichments using Terraform for automated behavioral data processing configuration."
schema: "HowTo"
keywords: ["Terraform Enrichments", "Infrastructure Code", "Enrichment Deployment", "Terraform Setup", "IaC Enrichments", "Automated Enrichments"]
---

To enable an extra enrichment, such as the [IP anonymisation enrichment](https://docs.snowplow.io/docs/enriching-your-data/available-enrichments/ip-anonymization-enrichment/):

1. Follow the instructions for [AWS](https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2#inserting-custom-enrichments), [GCP](https://github.com/snowplow-devops/terraform-google-enrich-pubsub-ce#inserting-custom-enrichments) or [Azure](https://github.com/snowplow-devops/terraform-azurerm-enrich-event-hub-vmss#inserting-custom-enrichments), updating the `anonOctets` and `anonSegments` according to the number of octets/ segments that you would like to be anonymised
2. Run `terraform apply`
