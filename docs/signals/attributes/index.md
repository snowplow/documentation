---
title: "Define attributes in Signals"
sidebar_position: 20
sidebar_label: "Define attributes"
description: "Define attributes within attribute groups to calculate behavioral data from real-time streams or your warehouse, then publish the configuration to Signals."
keywords: ["attributes", "attribute groups", "attribute keys", "warehouse configuration", "signals python sdk", "publish"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

[Attributes](/docs/signals/concepts/index.md#attribute-groups) are the behavioral facts you want Signals to calculate, such as a user's page view count or lifetime value.

Attributes are defined within [attribute groups](/docs/signals/attributes/attribute-groups/index.md). Each group specifies an [attribute key](/docs/signals/attributes/attribute-keys/index.md) (the identifier to calculate against), the [attributes](/docs/signals/attributes/attributes/index.md) to compute, and a data source — either a real-time event stream or a [warehouse table](/docs/signals/attributes/warehouse-config/index.md).

This section covers the definition workflow:
* [Attribute groups](/docs/signals/attributes/attribute-groups/index.md): create a group, choose a data source, and publish it
* [Attributes](/docs/signals/attributes/attributes/index.md): configure the individual calculations within a group
* [Attribute keys](/docs/signals/attributes/attribute-keys/index.md): use built-in identifiers or define custom ones
* [Warehouse configuration](/docs/signals/attributes/warehouse-config/index.md): sync pre-calculated warehouse tables to Signals

To consume the calculated values in your applications, see [Use in your application](/docs/signals/applications/index.md).

## Ways to define attributes

Each page in this section documents two approaches side by side, using tabs:

* **[Snowplow Console](https://console.snowplowanalytics.com)**: a UI for defining and managing attribute configurations. Navigate to the **Signals** section, and use the **Attribute groups**, **Attribute keys**, and **Services** pages to create and manage your configuration.
* **[Signals Python SDK](https://pypi.org/project/snowplow-signals/)**: define and publish attribute configurations programmatically from a notebook or script. Start by [connecting to Signals](/docs/signals/connection/index.md).

You can also use the [Signals API](/docs/signals/connection/index.md#signals-api) to interact with Signals directly over HTTP.

![Signals section of the Console navigation sidebar showing Overview, Attribute groups, Services, Attribute keys, and Interventions as menu items](../images/console-navbar.png)

## Publish and manage configurations

Definitions only take effect once you publish them to Signals. The same lifecycle applies to attribute groups, attribute keys, [services](/docs/signals/applications/services/index.md), and [interventions](/docs/signals/interventions/index.md):

* **Publish** registers objects with Signals. This makes them available for real-time calculation and retrieval.
* **Unpublish** stops active calculation without losing the object definitions.
* **Delete** permanently removes objects from Signals. Objects must be unpublished before deletion. If you delete an attribute group, the calculated attributes in the Profiles Store will also be deleted.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

In Console, each configuration is saved as a draft when you create it, and published from its details page. See the [attribute groups](/docs/signals/attributes/attribute-groups/index.md#publish-attribute-groups) and [interventions](/docs/signals/interventions/index.md#publish-and-manage-the-intervention) pages for details.

</TabItem>
<TabItem value="sdk" label="Python SDK">

Use the `publish()`, `unpublish()`, and `delete()` methods on your `Signals` object:

```python
from snowplow_signals import StreamAttributeGroup, Service, RuleIntervention

# Define your objects (assuming these are already created)
objects_to_manage = [my_attribute_group, my_service, my_intervention]

# 1. Publish objects
published_objects = sp_signals.publish(objects_to_manage)

# 2. Unpublish objects
unpublished_objects = sp_signals.unpublish(objects_to_manage)

# 3. Delete objects permanently - must unpublish first
sp_signals.delete(objects_to_manage)
```

</TabItem>
</Tabs>
