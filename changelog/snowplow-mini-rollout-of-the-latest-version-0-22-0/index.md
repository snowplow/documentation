---
title: "[Snowplow Mini] Rollout of the latest version (0.22.0)"
description: "As part of our regular infrastructure maintenance, we will be upgrading Snowplow Minis to the latest release."
date: "2025-03-06"
update_type:
  - "Maintenance notification"
components:
  - "Snowplow Mini"
---
> **This notice applies to AWS and GCP customers with Snowplow Mini component deployed.**

As part of our regular infrastructure maintenance, we will be upgrading Snowplow Minis to the latest release. The new version comes with the latest versions of Collector (3.3.0) and Enrich (5.2.0). It contains security updates (usage of Docker Compose version 2) and deployment changes (switching from Launch Configuration to Launch Template, extending tagging to the instance's EBS volume).

The upgrade will take place on **11th of March between 8-10AM UTC** and it does not require any actions on your part.

**Please note that as part of this upgrade, the data stored in your Mini(s) OpenSearch cluster will be lost. There will also be a short period of downtime of around 5-10 minutes.**

If you have any questions or concerns about this update, please don’t hesitate to reach out to us at support\@snowplow\.io.
