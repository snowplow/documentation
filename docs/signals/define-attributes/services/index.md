---
title: "Define services in Console "
sidebar_label: "Services"
sidebar_position: 32
description: "Services group multiple versioned attribute groups into stable consumption interfaces for applications. Create and manage services to control which attribute versions your applications use."
keywords: ["services", "attribute group versioning", "stable interfaces"]
---

[Services](/docs/signals/concepts/attributes/index.md#services) group attribute groups together for serving to your applications.

To create a service, go to **Signals** > **Services** in Snowplow Console and follow the instructions.

![Create service form with name, description, owner, and attribute group selection](../../images/service-create.png)

To configure a service, you'll need to specify:
* A unique name
* An optional description
* The email address of the primary owner or maintainer
* Which attribute groups to include

## Versioning

When choosing which attribute groups to include, you'll select a specific version of each attribute group.

Services themselves are not versioned. You can update them to use different attribute groups, or different attribute group versions, at any time.

![Service configuration showing selected attribute groups with version numbers](../../images/service-groups.png)

## Managing services

Services are automatically published as soon as they're created. They're a wrapper for consuming calculated attributes, and don't cause any additional processing themselves.

To edit a service definition, go to the service details page and click the **Edit** button.

To delete a service, go to the service details page and click the `⋮` button, then choose **Delete**.

![Service management menu with Edit and Delete options](../../images/service-edit-delete.png)
