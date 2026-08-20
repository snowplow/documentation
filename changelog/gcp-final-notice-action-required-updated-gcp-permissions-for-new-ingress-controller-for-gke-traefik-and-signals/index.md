---
title: "[GCP] Final notice: updated GCP permissions for the new GKE ingress controller and Signals"
description: "As part of our ongoing efforts to make Snowplow pipelines more resilient and easier to manage, we are implementing a new ingress controller (load balancer) for Google Kubernetes Engine (GKE) deployments."
date: "2025-10-15"
update_type:
  - "Maintenance notification"
components:
  - "Signals"
platforms:
  - "GCP"
---
> **Final notice only applies to GCP customers.**
>
> Previous communication: [\[GCP\] Action required: New ingress controller for GKE (Traefik)](/changelog/gcp-action-required-new-ingress-controller-for-gke-traefik/)

As part of our ongoing efforts to make Snowplow pipelines more resilient and easier to manage, we are implementing a new ingress controller (load balancer) for Google Kubernetes Engine (GKE) deployments. You will need to adjust the IAM permissions to enable this change (see below).

Concretely, we will be replacing Network Endpoint Groups (NEG) with [Traefik](https://traefik.io/traefik/). Traefik provides a number of advantages:

* Based on our testing, it is more reliable than NEG, e.g. when dealing with traffic spikes
* Traefik simplifies the SSL/TLS setup and will eventually allow us to introduce self-served Collector domain configuration
* Traefik can handle all necessary routing, obviating the need for other NEG or GCP-related load balancers

**Action Required: IAM Permission Update**

To enable this enhancement for your pipeline, you need to update the IAM permissions for our service account `techops-cloud-admin@snowplowanalytics.com` by adding the `roles/container.admin` role. This permission allows us to deploy and manage Traefik within your GKE clusters as part of the pipeline infrastructure.

The `roles/container.admin` role includes permissions to create, update, and manage Kubernetes resources, ingress controllers, and related networking components necessary for deploying Traefik and ensuring proper traffic routing to your pipeline services.

Additionally, we require `roles/run.admin` permission as part of our standard deployment now. This allows creating, updating and managing GCP Cloud Run service, and is related to our standard deployment of Snowplow and Signals.

**Please update this permission as soon as possible to prepare your pipeline for this enhancement.** We will notify you separately when Traefik is ready for roll out to your environment.

To apply this permission update:

1. Navigate to your GCP IAM console
2. Locate the `techops-cloud-admin@snowplowanalytics.com` service account
3. Add the `roles/container.admin` role to this principal
4. Add `roles/run.admin` role to this principal

**If these permissions are not updated by October 27th, 2025, Snowplow will apply them automatically to ensure your pipeline remains compatible with upcoming GCP deployments.**

Please see /docs/get-started/private-managed-cloud/setup-guide-gcp/#set-up-required-permissions

If you have any questions or concerns about this update, please don't hesitate to reach out to us at [support@snowplow.io](mailto:support@snowplow.io).
