---
title: "Attribute groups"
sidebar_position: 30
sidebar_label: "Attribute groups"
---

Define the behavior you want to capture in [attribute groups](/docs/signals/concepts/#attribute-groups). Choose whether to calculate attributes from your event stream or warehouse.

To create an attribute group, go to **Signals** > **Attribute groups** in BDP Console and follow the instructions.

<!-- TODO image create group page-->

The first step is to specify:
* A unique name
* An optional description
* The email address of the primary owner or maintainer
* Which data source you want to use

## Data source

There are three sources to choose from:
* Stream: real-time Snowplow event stream
* Batch: a new warehouse table created by Signals, calculated from your `atomic` events table
* External batch: pre-calculated values in a warehouse table that you can sync to the Profiles Store

Each of the different data sources is configured differently.

### Stream source

You'll need to define the [attributes](/docs/signals/configuration/attribute-groups/attributes/index.md) you want to calculate from your real-time event stream.

<!-- TODO image with attributes -->

### Batch source

You'll need to define the [attributes](/docs/signals/configuration/attribute-groups/attributes/index.md) you want to calculate from your `atomic` events table.

<!-- TODO image with attributes -->

TODO dbt

### External batch source

Attribute groups with an external batch source don't require attribute definition, as no calculation will be performed. This source type allows you to sync existing warehouse values with Signals so they're available in your Profiles Store.

Provide the warehouse and table details, and which fields you want to send to Signals.

<!-- TODO image  define fields -->

We recommend providing a timestamp field for incremental or snapshot-based tables. To minimize latency, Signals will use this to determine which rows have changed since the last sync. The sync engine will only send the new rows to the Profiles Store.

## Attribute keys

All attribute groups need an attribute key.

Signals includes four built-in attribute keys, based on commonly used identifiers from the atomic [user-related fields](/docs/fundamentals/canonical-event/index.md#user-related-fields) in all Snowplow events.

| Attribute key      | Type     |
| ------------------ | -------- |
| `user_id`          | `string` |
| `domain_userid`    | `uuid`   |
| `network_userid`   | `uuid`   |
| `domain_sessionid` | `uuid`   |

The `domain_userid` property is intended for use in web applications.

### Creating a custom attribute key

To create a custom attribute key, navigate to **Signals** > **Attribute keys** within BDP Console. Click the **Create attribute key** button.

<!-- TODO image example -->

You will need to provide:
* A unique name
* An optional description
* An optional email address for the primary owner or maintainer
* Which [atomic](/docs/fundamentals/canonical-event/index.md#atomic-fields) property you want to calculate attributes against


## Attribute lifetimes

You can optionally set a Time to live (TTL) value for each attribute group. Some attributes will only be relevant for a certain amount of time, and eventually stop being updated. To avoid stale attributes staying in your Profiles Store forever, configure a TTL for the attribute group.

When none of the attributes for an attribute group have been updated for the defined lifespan, the attribute group expires. Any attribute values for this group will be deleted: fetching them will return `None` values.

If Signals then processes a new event that calculates the attribute again, or materializes the attribute from the warehouse again, the expiration timer is reset.

## Testing the attribute definitions

After defining one or more [attributes](/docs/signals/configuration/attribute-groups/attributes/index.md) for groups with a stream or batch source, you can test out the configuration with the **Run preview** button.

This will output a table of attributes calculated from your `atomic` events table, using a random subset of events from the last hour.

## Publishing the attribute group

Once you're happy with your attribute group configuration, click **Create attribute group** to save it. It will be saved as a draft, and not yet available to Signals.

<!-- TODO image details page, not yet published -->

Click the **Edit** button if you want to make changes to the attribute group.

To send the attribute group configuration to your Signals infrastructure, click the **Publish** button. This will allow Signals to start calculating attributes or syncing tables, and populating the Profiles Store.

### Versioning

Attribute groups are versioned. This allows you to iterate on the definitions without breaking downstream processes. You'll select specific attribute group versions when you define [services](/docs/signals/configuration/services/index.md).

All attribute groups start as `v1`. If you make changes to the definition, the version will be automatically incremented.

<!-- TODO image with many attribute groups of different versions -->
