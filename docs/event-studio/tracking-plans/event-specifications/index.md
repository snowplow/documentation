---
title: "Manage event specifications using Console UI"
sidebar_label: "Event specifications"
sidebar_position: 1
description: "Create and manage event specifications in Snowplow Console UI as documented events within tracking plans with data structures and implementation details."
keywords: ["event specifications UI", "Console UI", "create event specifications", "event documentation"]
---

Event specifications define the complete structure and requirements for [events](/docs/fundamentals/events/index.md) in your behavioral data pipeline. They serve as the single source of truth for what data should be collected, how it should be structured, and what business meaning it carries.

## What are event specifications?

An event specification is a collection of [schemas](/docs/fundamentals/schemas/index.md) (also called data structures) that describes everything about a specific event you want to track. Each specification includes:

- **Event schema**: defines the core properties specific to this event type
- **Entity schemas**: defines any additional context data that is sent with the event
- **Business metadata**: captures the purpose, ownership, and implementation requirements
- **Triggers**: documents when and where the event should be collected

Event specifications act as data contracts between teams. When you create an event specification, you are defining exactly what data your applications should send, what your data warehouse will receive, and what your downstream consumers can rely on.

## Event Specifications Information

- The events you want to capture on your product
- The channels or apps where they are created
- The actions the events represent
- The data structure against which this event will be validated
- The instructions that need to be applied to correctly populate the event's properties
- The entities that should be captured together with this event

This additional information represents the tracking requirements that are often lost in translation or difficult to keep up to date. With event specifications, teams can create a shared understanding of your business' tracking needs.

## How event specifications work

Event specifications bridge the gap between tracking design and data collection:

- **Design phase**: you document your tracking requirements by creating event specifications that capture both technical structure and business context
- **Implementation phase**: developers use these specifications to instrument tracking code, either manually or through code generation within the Snowplow Console or using tools like Snowtype. Snowtype generated code ensures type-safety and alignment with specifications, reducing implementation errors and accelerating development time
- **Observability phase**: monitor event specification usage directly in the Console. See the total number of events collected for each specification and when each was last seen. This visibility helps you confirm implementations are live, identify unused specifications, and understand event volume patterns across your tracking plan
- **Data modeling phase**: event specifications enable automatically generated dbt models that transform atomic events into analysis-ready tables. These models understand the structure defined in your specifications, creating consistent table schemas and joining related [entities](/docs/fundamentals/entities/index.md). As you update specifications, corresponding data models can be regenerated, keeping your warehouse transformations synchronized with your tracking design

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
Snowplow provides both a UI and an API to manage your Event Specifications. For information about managing event specifications see [How to manage Event Specifications](/docs/event-studio/tracking-plans/event-specifications/index.md).
:::


## Creating a new event specification through Console

Event specifications serve as direct counterparts to [data structures](/docs/event-studio/data-structures/manage/index.md) and encapsulate the documented events within a tracking plan.

:::note
The creation of event specifications is exclusive to tracking plans.
:::

Create event specifications in tandem with the latest deployed data structure version in development. This ensures tracking implementation instructions align with the validation criteria in the event specification.

Your event specification guarantees compatibility with the associated data structure version, being a specialization of it. This ensures events tracked using specified instructions pass validation for the associated data structure.

## Creating and editing event specifications

To create a new event specification, follow these steps:

1. Select a tracking plan
2. Click the **Create event** button
3. A dialog will appear, prompting you to enter a name for your event specification and click **Save and continue**
4. Your first event specification will be displayed on the page

![Create an event specification](images/create-event-specification.png)

To add more information or modify an existing event specification, follow these steps:

1. Navigate to the appropriate tracking plan
2. Select the desired event specification
3. This action will open an overview of the selected event specification containing the details that have been added to date

This interface is divided into focused sections; explore each section below for more details.

![Example of an event specification overview](images/event-specification-overview.png)

### Event information

This section provides essential meta-information for your event specification, including the event name, description, and the applications in which this event is tracked.

### Event data structure

This section defines the event data structure that this event will validate against as it is processed by your pipeline.

You can choose from two types of data structures:

- **Standard**: provided by the Snowplow tracker by default
- **Custom**: provided by your organization

![Event data structure](images/event-data-structure.png)

### Entity data structures

Within this section, you have the flexibility to define the entities that should be associated with the event when it is triggered.

To facilitate making an informed selection of your entities, you can view a detailed breakdown of the properties associated with the chosen entities (and its version) by a specific version.

![Entity data structures](images/entity-data-structures.png)

### Event triggers

This section defines the locations and circumstances under which this event is triggered.

To create your first trigger, simply select the **Add trigger** button. You can edit or delete an existing trigger by clicking the dedicated buttons beside each entry in the triggers list.

A dialog will appear, allowing you to upload an image and provide additional context, such as the URL to the page on which this trigger applies.

![Event triggers](images/event-triggers.png)

### Properties

This section allows you to specify how each property for a selected event or entity data structure should be populated.

The dialog displays the list of properties for the selected data structure will be listed here, with the ability to provide the exact value/s or a description of how to populate these properties when the event is triggered.

You can configure detailed instructions for any of the properties shown in the list by clicking the **Add instruction** or **Edit** buttons. Once you have selected the type of instruction you wish to add/edit and have filled in the required input fields, you are then able to click **Save and update instruction** and return to the properties list.

:::note
Instructions for required properties are added by default and can be edited but they cannot be deleted.
:::

![Implementation instructions](images/implementation-instructions.png)


## Event specification code generation

To accelerate your implementation of event tracking, Snowplow Console includes pre-generated code snippets specifically for custom self-describing events. These snippets can be accessed directly within the Console interface to reduce the time and effort required for integrating event tracking functionality into your applications.

### Working with event specifications

When viewing an event specification, the **Working with this event** section provides two key tabs:

- **Implementation**: access ready-to-use tracking code for your event
- **Querying**: view example SQL queries to retrieve your event data from the warehouse

:::note
For standard Snowplow events (page view, screen view, page ping, and self-describing events), tracking code is available out of the box without requiring any additional configuration.
:::

### Implementation - Code snippets

The Implementation tab generates tracking code snippets tailored to your event specification. You can:

- **Select your tracker type**: choose between JavaScript tracker options (tag-based or npm-based)
- **Copy code directly**: use the generated code snippets immediately in your application
- **Toggle Snowtype code**: use the **Show snowtype code** toggle to display the specific Snowtype function name to call for tracking implementation.

:::note
Draft data structures can't be used for event validation during testing or production since they aren't loaded into Iglu. Validation will fail without schemas in an Iglu registry, though you can configure a custom registry if needed. Deploy your draft to the development environment when you're ready to test.
:::

![Implementation code snippets](images/code-snippets.png)

![Show snowtype code](images/show-snowtype-code.png)

### Querying - SQL examples

The Querying tab provides example SQL queries to help you retrieve and analyze your event data. You can:

- **Select your warehouse**: choose from Snowflake, BigQuery, Redshift, Databricks, and other supported warehouses
- **View tailored queries**: see SQL examples optimized for your selected warehouse
- **Access event data**: query both the event properties and attached entities

![Querying SQL examples](images/sql-example.png)
