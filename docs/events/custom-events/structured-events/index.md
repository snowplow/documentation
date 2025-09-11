---
title: "Structured events"
description: "Create structured behavioral events with predefined parameters for standardized analytics tracking."
schema: "TechArticle"
keywords: ["Structured Events", "Event Structure", "Event Schema", "Structured Data", "Event Format", "Standard Events"]
---

:::info

Structured event tracking is a legacy format used to track events that were not natively supported by Snowplow.

We recommend using [self-describing events](#self-describing-events) for custom event tracking.

:::

As well as setting `e=se`, there are five custom event specific parameters that can be set:

| **Table Column**   | **Type** | **Description**                                                         | **Example values**            |
|---------------|----------|-------------------------------------------------------------------------|-------------------------------|
| `se_category` | text     | The category of event                                                   | `Ecomm`, `Media`              |
| `se_action`   | text     | The action / event itself                                               | `add-to-basket`, `play-video` |
| `se_label`    | text     | A label often used to refer to the 'object' the action is performed on  | `dog-skateboarding-video`     |
| `se_property` | text     | A property associated with either the action or the object              | `hd`                          |
| `se_value`    | decimal  | A value associated with the user action                                 | `13.99`                       |
