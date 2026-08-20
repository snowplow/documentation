---
title: "[GCP] Action required: enable more resilient observability metrics"
description: "Snowplow collects observability metrics for monitoring, measuring SLA compliance, and so on."
date: "2026-05-18"
update_type:
  - "Maintenance notification"
components:
  - "GCP"
---
Snowplow collects observability metrics for monitoring, measuring SLA compliance, and so on. To make metric collection more resilient in case of temporary failures, we are adding a mandatory checkpointing mechanism. **You will need to adjust the IAM permissions to enable this change (see below).**

Concretely, we will be using Cloud Firestore to keep track of the last processed Google Observability datapoints. This ensures that we can correctly retrieve and analyze metrics even in the case of downstream outages.

**Action Required: IAM Permission Update**
To enable this rollout for your pipeline, you need to update the IAM permissions for our service account `techops-cloud-admin@snowplowanalytics.com` by adding the `Roles/datastore.owner` role. This permission allows us to deploy and manage Cloud Firestore as part of the pipeline infrastructure.
The `Roles/datastore.owner` role includes permissions to administer the Cloud Firestore data that we create for checkpointing.

**Please grant the permission as soon as possible to prepare your pipeline for the rollout.**
Here are the necessary steps:

1. Navigate to your GCP IAM console

2. Locate the `techops-cloud-admin@snowplowanalytics.com` service account

3. Add the `Roles/datastore.owner` role to this principal

If you have any questions or concerns about this update, please don't hesitate to reach out to us at [support@snowplow.io](mailto:support@snowplow.io).
