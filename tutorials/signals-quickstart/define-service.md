---
position: 4.5
title: Define a service
description: "Configure a Snowplow Signals service to group attribute groups for easy consumption in applications."
---

[Services](/docs/signals/concepts/#services) group attribute groups together for serving to your applications.

To create a service, go to **Signals** > **Services** in Snowplow Console and click **Create service**.

![Create service form for quickstart tutorial service](./images/service-create.png)

## Configure basic service information

Specify the configuration for your service:

* **Name**: `quickstart_service`
* **Description**: Quick Start tutorial service
* **Owner**: your email address

The name will be the service's unique identifier. The description and owner are optional.

## Select attribute groups

When choosing which attribute groups to include, you'll select a specific version of each attribute group.

To add an attribute group:
1. Click the attribute group selector
2. Search for and select the group you just created, `quickstart_group (v1)`

If `quickstart_group (v1)` attribute group isn't showing up, check that it's published.

![Attribute group selector showing quickstart_group v1 selection](./images/service-choose-groups.png)

## Create the service

Click **Create service** to save your service configuration. Services are automatically published as soon as they're created.

![Published quickstart service ready for attribute retrieval](./images/service-published.png)

Your service is ready to use for retrieving attributes from the Profiles Store.
