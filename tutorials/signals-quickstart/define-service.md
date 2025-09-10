---
position: 4.5
title: Define a service
description: "Configure a Snowplow Signals service to group attribute groups for easy consumption in applications."
---

[Services](/docs/signals/concepts/#services) group attribute groups together for serving to your applications.

To create a service, go to **Signals** > **Services** in BDP Console and click **Create service**.

<!-- TODO image create service page-->

## Configure basic service information

Specify the configuration for your service:

* **Name**: `quickstart_service`
* **Description**: service for quickstart tutorial attributes
* **Owner**: your email address

The name will be the service's unique identifier. The description and owner are optional.

<!-- TODO image {{service creation form with name filled in}} -->

## Select attribute groups

When choosing which attribute groups to include, you'll select a specific version of each attribute group.

To add an attribute group:
1. Click the attribute group selector
2. Search for and select the group you just created, `quickstart_group (v1)`

<!-- TODO image {{attribute group version selector showing group added}} -->

## Create the service

Click **Create service** to save your service configuration. Services are automatically published as soon as they're created.

<!-- TODO image {{service details page showing attributes}} -->

Your service is ready to use for retrieving attributes from the Profiles Store.
