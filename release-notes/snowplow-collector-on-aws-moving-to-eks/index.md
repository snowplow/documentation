---
title: "Snowplow Collector on AWS moving to EKS"
description: "Between October and December 2026, Snowplow is migrating the Collector in BDP Cloud and Private Managed Cloud AWS pipelines from an Application Load Balancer on EC2 to a Network Load Balancer on EKS."
date: "2026-09-21"
category:
  - "Product news"
components:
  - "Pipeline components"
platforms:
  - "AWS"
---

As part of moving all Snowplow-managed AWS infrastructure off EC2, we are migrating the Collector in BDP Cloud and Private Managed Cloud pipelines from an Application Load Balancer on EC2 to a Network Load Balancer running on EKS. The rest of the pipeline already runs on EKS; the Collector is the last component on the old model.

Migrations will run in waves between **October and December 2026**. The EKS Collector brings faster response to traffic spikes, AWS-managed machine images patched on AWS's cadence, and automatic certificate management for tracking domains.

## What this means for you

Please let us know by **Friday, 23 October** if any of the following applies to your setup. If it does, your pipeline will not be migrated at this stage and we will follow up when a supported path is available.

- You have a WAF attached to your Collector load balancer.
- You have a custom security group or an IP allowlist on your Collector load balancer.
- Traffic reaches your Collector by a route Snowplow does not manage, such as a CNAME in your own DNS, a CDN or proxy in front of your Collector endpoint, or a tracking domain that does not appear under **Collector endpoints** in your Snowplow Console.

If none of these apply, no action is needed. We will proceed after the deadline and let you know once your pipeline is migrated. If you manage your own collector domain DNS, we will contact you to schedule a cutover slot; Snowplow will stage and validate the new endpoint before you make any DNS change.

If you have any questions or concerns, please reach out to your Snowplow account team or [support@snowplow.io](mailto:support@snowplow.io).
