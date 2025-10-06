---
title: "Creating a tracking plan with event specifications"
sidebar_label: "Creating a tracking plan"
sidebar_position: 2
sidebar_custom_props:
  offerings:
    - cdi
---

As explained in [Introduction to tracking design](/docs/data-product-studio/index.md), to use Snowplow successfully, you need to have a good idea of:
- The events that matter to your business
- The events that occur in your website, mobile application, server-side systems, factories, call centers, dispatch centers, etc.
- The decisions you make based on those events
- What you need to know about those events to make those decisions

While our [Schema](/docs/fundamentals/schemas/index.md) technology and Data Structures UI can help you capture the structure and instructions for validating your data, we also provide event specifications, which help capture additional information.

## Event Specifications Information

- The events you want to capture on your product
- The channels or apps where they are created
- The actions the events represent
- The data structure against which this event will be validated
- The instructions that need to be applied to correctly populate the event's properties
- The entities that should be captured together with this event

This additional information represents the tracking requirements that are often lost in translation or difficult to keep up to date. With event specifications, teams can create a shared understanding of your business' tracking needs.

## Event Specifications

An Event Specification consists of three main parts.

### Descriptive

The descriptive part includes assigning:

- a name for the event described in this scenario (e.g., "Add_to_Basket");
- a description to help people understand what action the event is capturing;
- a series of application tags to represent which application this event needs to be tracked on;
- a list of Triggers to describe the conditions that need to happen for the event to be captured (e.g., "When a user selects the 'Add to Basket' button on the product page of the website" and "When a user selects the '+' icon button on the product page in the mobile app").

### Event Validation

The event validation part allows you to set the instructions for tracking implementation related to the associated data structure. For each data structure property, you can declare where this value should be populated with:

- a single exact value that you can provide (or select from the enum list associated with the data structure) (e.g., this property should always be set to "this" value);
- a choice between a selection of values that you can provide (or select from the enum list associated with the data structure) (e.g., this property should be set with a value among this set providing certain conditions are met, which you can describe in the comment in the Detailed Instruction text box);
- a description of what the value for this property should be;
- any additional comments in the Detailed Instruction section.

### Entities

The [Entities](/docs/fundamentals/entities/index.md) part allows you to declare which entities should be tracked with the event. You can also define whether the entity should be mandatory or optional, or whether more than one instance should be tracked with this event.

:::info
Snowplow BDP provides both a UI and an API to manage your Event Specifications. For information about managing event specifications see [How to manage Event Specifications](/docs/data-product-studio/event-specifications/index.md).
:::
