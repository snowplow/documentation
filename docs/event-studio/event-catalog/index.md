---
title: "Find existing events in the Event Catalog"
sidebar_label: "Find existing events"
sidebar_position: 10
description: "Browse, search, and filter all event specifications across tracking plans from a single location, to find existing events before you define new ones."
keywords: ["event catalog", "event specifications", "event discovery", "event governance", "tracking plans"]
date: "2025-02-05"
content_type: how-to
---

The Event Catalog lists all event specifications across your [tracking plans](/docs/event-studio/tracking-plans/index.md) in one view, with their status, so you can browse, search, and filter them without opening each tracking plan.

Check the Event Catalog before you define a new event specification, to see whether a team has already defined a similar event.

## Access the Event Catalog

Navigate to **Event Catalog** in the main navigation.

![Event Catalog page listing published event specifications from the E-commerce Web tracking plan, showing their entities, tracking plan, event volume with a colored bar, last seen date, and status, with a pipeline selector and a "Create event specification" button in the top right](images/event-catalog-overview.png)

## Browse event specifications

The Event Catalog lists all event specifications defined across your tracking plans. The volume and last seen columns show data for the selected pipeline. See [Monitor tracking plan data quality in Console](/docs/event-studio/tracking-plans/data-quality/index.md) for what the volume categories mean. Each row displays:

| Column                   | Description                                                                |
| ------------------------ | -------------------------------------------------------------------------- |
| Event specification name | The name and schema identifier of the event specification                  |
| Entities                 | The [entities](/docs/fundamentals/entities/index.md) attached to the event |
| Tracking plan            | The tracking plan containing the event specification                       |
| Volume                   | The number of events collected in the last 30 days on the selected pipeline, split by category |
| Last seen                | When the event was last received on the selected pipeline                  |
| Status                   | The status of the event specification                                      |

### Filter and search

You can filter and search the list to find specific event specifications. Use the controls at the top of the list:

- **Search**: enter text to filter by event specification name
- **Status filter**: show all specifications or filter by Draft or Published status
- **Entity filter**: filter specifications by attached entities
- **Pipeline selector**: choose the pipeline used for the **Volume** and **Last seen** columns, by default your production pipeline

## Create an event specification from the catalog

You can create an event specification from the Event Catalog without first opening a tracking plan. See [Create an event specification from the Event Catalog](/docs/event-studio/tracking-plans/event-specifications/index.md#create-an-event-specification-from-the-event-catalog).
