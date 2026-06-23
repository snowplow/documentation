---
title: "Define attributes in Signals"
sidebar_position: 20
sidebar_label: "Define attributes"
description: "Define attributes within attribute groups to calculate behavioral data from real-time streams or your warehouse, then test and publish the configuration to Signals."
keywords: ["attributes", "attribute groups", "attribute keys", "warehouse configuration", "configuration workflow", "publish"]
---

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

## Configuration workflow

Attribute groups move through the same lifecycle whether you manage them in Console or with the Python SDK:

1. **Define**: [create the attribute group](/docs/signals/attributes/attribute-groups/index.md#define-the-attribute-group), choosing its data source, attribute key, and attributes. In Console, new attribute groups are saved as drafts, so you can edit them freely before publishing.
2. **Test**: [preview the attribute values](/docs/signals/attributes/attribute-groups/index.md#test-attribute-definitions) the group would produce, calculated from recent events in your warehouse.
3. **Publish**: [apply the configuration](/docs/signals/attributes/attribute-groups/index.md#publish-attribute-groups) to your Signals infrastructure. Signals starts calculating attributes, or syncing warehouse tables, and populating the Profiles Store. Definitions only take effect once published: values are calculated from this point onwards, unless you've configured a backfill.
4. **Update**: editing a published attribute group creates a new [version](/docs/signals/attributes/attribute-groups/index.md#versioning), leaving the published version unchanged. This means you can iterate on definitions without breaking downstream processes, then migrate consumers by updating your [service](/docs/signals/applications/services/index.md) definitions.
5. **Unpublish**: [stop calculation](/docs/signals/attributes/attribute-groups/index.md#delete-an-attribute-group) for a specific version without losing its definition. Existing values remain in the Profiles Store, and you can republish later.
6. **Delete**: permanently remove all versions of the group, along with its calculated values in the Profiles Store. Attribute groups must be unpublished before they can be deleted.

[Interventions](/docs/signals/interventions/index.md) follow the same lifecycle. [Services](/docs/signals/applications/services/index.md) are simpler: they're published automatically as soon as they're created, and aren't versioned.

Each page in this section, along with the services and interventions pages, documents the Console and Python SDK specifics for these steps.
