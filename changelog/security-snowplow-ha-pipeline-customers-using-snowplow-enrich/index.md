---
title: "[Security] Snowplow HA pipeline customers using Snowplow Enrich"
description: "Snowplow HA Pipeline customers using Snowplow Enrich should upgrade to Enrich 6.1.1 or higher."
date: "2025-10-17"
update_type:
  - "Product news"
components:
  - "Pipeline components"
  - "Security"
---
**Action is required.**

Snowplow HA Pipeline customers using Snowplow Enrich should upgrade to Enrich 6.1.1 or higher.

The Snowplow team identified a critical security vulnerability affecting Snowplow’s Enrich service that requires your prompt attention and a recommended upgrade.

If you are deploying Enrich via a Docker image, you will need to change the version to 6.1.1. Similarly, if you are using the Snowplow Terraform files, look for the Enrich module and change app_version to 6.1.1.

In line with responsible disclosure practices, we have filed this issue with [cve.org](http://cve.org), but we have not yet publicly disclosed the technical details about this vulnerability. We plan to do so in 90 days.

[Security](https://snowplow.io/security) continues to be our top priority. If you have any questions or concerns, please do not hesitate to contact the Support Team at [support@snowplow.io](mailto:support@snowplow.io).

NB: If you are a **Snowplow CDI** customer (formerly **Snowplow BDP**), you do not have to worry, as no action is required. Your software has already been patched.
