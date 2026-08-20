---
title: "[Snowplow CDI] New workspace details page"
description: "It is sometimes useful to revisit key details of your cloud account (AWS, GCP, Azure) associated with Snowplow."
date: "2025-03-18"
update_type:
  - "Release notes"
components:
  - "Console"
---
> **This update only applies to Snowplow CDI customers.**

It is sometimes useful to revisit key details of your cloud account (AWS, GCP, Azure) associated with Snowplow. For example, the NAT (Network Address Translation) IP addresses often need to be added to an allow list in your warehouse.

The cloud account and network details are part of the concept of a Snowplow _workspace_, which also includes all your pipelines deployed in that account and network.

To make it easy to see this information for each workspace, we’ve added a new “Workspaces” page (in the “Account” section of the sidebar). Customers on PMC (Private Managed Cloud) can see additional data related to networking and permissions.

|                            |                              |
| -------------------------- | ---------------------------- |
| ![Workspace details page for a private managed cloud deployment, showing account, network, and pipeline information](images/image-1.png) | ![Workspace details page for a cloud deployment, showing cloud provider, region, and pipeline information](images/image-2.png) |
| Private Managed Cloud view | Cloud (SaaS) view            |

In the future, we will be extending this page to allow managing certain aspects of your setup (e.g. adding pipelines).
