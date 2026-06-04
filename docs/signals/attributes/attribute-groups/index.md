---
title: "Define attribute groups in Console"
sidebar_position: 1
sidebar_label: "Attribute groups"
description: "Define attribute groups to calculate behavioral data from real-time event streams or sync pre-calculated warehouse tables. Configure attributes, attribute keys, TTL lifetimes, and test definitions before publishing."
keywords: ["attribute groups", "stream attributes", "warehouse attributes", "attribute keys", "ttl", "backfill"]
---

Define the behavior you want to capture in [attribute groups](/docs/signals/concepts/index.md#attribute-groups). Choose whether to calculate attributes from your event stream or sync pre-calculated values from your warehouse.

To create an attribute group, go to **Signals** > **Attribute groups** in Snowplow Console and follow the instructions.

![Create attribute group form with name, description, data source, and owner fields](../../images/attribute-group-create.png)

The first step is to specify:
* A unique name
* An optional description
* The email address of the primary owner or maintainer
* Which data source you want to use

## Data source

There are two [sources](/docs/signals/concepts/index.md#data-sources) to choose from:
* **Stream**: real-time Snowplow event stream, with an optional warehouse backfill
* **Warehouse**: pre-calculated values in a warehouse table that you sync to the Profiles Store

Attribute groups are configured differently based on the data source.

### Stream

Signals calculates attributes from events in your real-time stream. Check out the [quick start tutorial](/tutorials/signals-quickstart/start) for a step-by-step guide.

You'll need to define the [attributes](/docs/signals/attributes/attributes/index.md) you want to calculate from your event stream.

#### Backfill attributes

:::note[Warehouse connection]
A warehouse connection is required to use the backfill option.
:::

Stream attribute groups only calculate attributes from the moment they are published. If you want to include historical data, enable **Backfill attributes** when creating the group.

When enabled, a date picker appears. Select the date from which Signals should backfill attribute values from your `atomic` events table. On publish, Signals backfills all events from that date up to the publish timestamp using your warehouse. From the publish timestamp onwards, the streaming engine takes over and processes events in real time.

![Stream attribute group with Backfill attributes toggle enabled and date picker shown](../../images/attribute-group-stream-backfill.png)

### Warehouse

Attribute groups with a warehouse source don't require attribute definition, as no calculation is performed. This source type syncs existing, pre-calculated warehouse values to your Profiles Store using the batch engine.

Provide the warehouse and table details, and select which fields you want to send to Signals. See [Warehouse configuration](/docs/signals/attributes/using-python-sdk/attribute-groups/warehouse-config/index.md) for full configuration details.

![Warehouse source configuration showing warehouse table and field mapping options](../../images/attribute-group-warehouse-fields.png)

## Attribute keys

All attribute groups need an [attribute key](/docs/signals/concepts/index.md#attribute-keys).

Signals includes four built-in attribute keys, based on commonly used identifiers from the atomic [user-related fields](/docs/fundamentals/canonical-event/index.md#user-fields) in all Snowplow events.

To create a custom attribute key, navigate to **Signals** > **Attribute keys** within Console. Click the **Create attribute key** button.

![Create attribute key form with name, description, and atomic property selection](../../images/attribute-key-create.png)

You will need to provide:
* A unique name
* An optional description
* An optional email address for the primary owner or maintainer
* Which [atomic](/docs/fundamentals/canonical-event/index.md#common-fields) property you want to calculate attributes against

To edit or delete a custom attribute key, go to the key details page and click the **Edit** button, or the `⋮` button followed by **Delete**.

## Attribute lifetimes

TTL configuration applies to **lifetime attributes** only. For time windowed attributes, the TTL is set automatically to match the attribute's time window — a 10-minute window attribute expires after 10 minutes, regardless of any TTL you configure.

For lifetime attribute groups, we recommend setting a TTL to avoid stale values persisting in your Profiles Store indefinitely. Configure a TTL when creating or updating the attribute group.

The defaults for lifetime attribute groups are 7 days for stream attributes and 365 days for warehouse synced values.

When a lifetime attribute has not been updated for its defined TTL, its value is deleted: fetching it will return a `None` value. If Signals then processes a new event that updates the attribute, or syncs new data from the warehouse, the expiration timer is reset.

## Testing the attribute definitions

:::note[Warehouse connection]
A warehouse connection is required to test attribute definitions.
:::

After defining one or more [attributes](/docs/signals/attributes/attributes/index.md) for stream attribute groups, you can test out the configuration with the **Run preview** button.

This will output a table of attributes calculated from your `atomic` events table, using a random subset of events from the last hour.

## Publishing the attribute group

Once you're happy with your attribute group configuration, click **Create attribute group** to save it. It will be saved as a draft, and not yet available to Signals.

![Draft attribute group page showing Edit and Publish buttons](../../images/attribute-group-draft.png)

Click the **Edit** button if you want to make changes to the attribute group.

To send the attribute group configuration to your Signals infrastructure, click the **Publish** button. This will allow Signals to start calculating attributes or syncing tables, and populating the Profiles Store.

![Published attribute group page showing active status and management options](../../images/attribute-group-published.png)

### Versioning

Attribute groups are versioned. This allows you to iterate on the definitions without breaking downstream processes. You'll select specific attribute group versions when you define [services](/docs/signals/attributes/services/index.md).

All attribute groups start as `v1`. If you make changes to the definition, the version will be automatically incremented.

## Deleting an attribute group

To unpublish or delete an attribute group, click the `⋮` button on the group details page.

![Attribute group management menu showing Edit, Unpublish, and Delete options](../../images/attribute-group-edit-delete.png)

Unpublishing is version specific. It will stop Signals from calculating attributes for this version of this group. Existing attribute values will remain in your Profiles Store, but they won't be updated. You can republish it later if needed.

Choose **Delete** to permanently delete all versions of the attribute group, along with attribute values in your Profiles Store for this group.

If the attribute group version is used by a [service](/docs/signals/concepts/index.md#services), you'll need to update the service definition before unpublishing or deleting.

If the attribute group version is used by a published [intervention](/docs/signals/concepts/index.md#interventions), deleting or unpublishing it will unpublish the intervention.
