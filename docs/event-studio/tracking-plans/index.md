---
title: "Defining the data to collect with Tracking Plans"
sidebar_position: 20
sidebar_label: "Tracking plans"
description: "Create logical groupings of behavioral data by domain with explicit ownership, event specifications, and source applications to improve governance and collaboration across your organization."
keywords: ["tracking plans", "event specifications", "data ownership", "data governance", "tracking implementation"]
---

As described in [Tracking Plans Introduction](/docs/fundamentals/tracking-plans/index.md), a tracking plan is a logical grouping of the data you collect as an organization by domain, with an explicit owner.

With tracking plans, you can:

* Set clear ownership for the data being created
* Make tracking implementation easier
* Deliver better governance around your data
* More easily communicate what the data means and how to use it
* Collaborate more effectively with the various teams involved in delivering value from your data
* Drive a self-serve culture around data across your organization
* See event volume metrics helping to monitor data collection over time.

Each tracking plan contains event specifications that define the events you want to track. By grouping related event specifications together in tracking plans, you can better organize your data collection efforts by domain, with clear ownership and implementation instructions for each event specification.

Event specifications bridge the gap between tracking design and data collection:

- **Design phase**: you document your tracking requirements by creating event specifications that capture both technical structure and business context
- **Implementation phase**: developers use these specifications to instrument tracking code, either manually or through code generation within the Snowplow Console or using tools like Snowtype. Snowtype generated code ensures type-safety and alignment with specifications, reducing implementation errors and accelerating development time
- **Observability phase**: monitor event specification usage directly in the Console. See the total number of events collected for each specification and when each was last seen. This visibility helps you confirm implementations are live, identify unused specifications, and understand event volume patterns across your tracking plan
- **Data modeling phase**: event specifications enable automatically generated dbt models that transform atomic events into analysis-ready tables. These models understand the structure defined in your specifications, creating consistent table schemas and joining related [entities](/docs/fundamentals/entities/index.md). As you update specifications, corresponding data models can be regenerated, keeping your warehouse transformations synchronized with your tracking design

## Elements of a Tracking Plan

**Tracking plan**

- **Name;** a descriptive and unique name for the tracking plan
- **Description;** a description of the data that the tracking plan captures
- **Owner;** the individual responsible for the tracking plan
- **Domain;** the team or business domain that owns the tracking plan
- **Source Application;** the [source application/s](/docs/event-studio/source-applications/index.md) the Tracking Plan is implemented in
- **Event specifications**
    * **Name;** a descriptive name for the event
    * **Description;** a description to help people understand what action the event is capturing
    * **Source Applications;** the source application(s) inherited from the tracking plan containing the Application ID(s) that will be sent with this event
    * **Triggers;** specific instructions on where the event gets triggered (e.g. when a user clicks the "Add to basket" button)
    * **Event data structure;** the event data structure that this event will validate against as it is processed by your pipeline
    * **Entities;** the entities that should be attached to this event (e.g. user, product)
    * **Properties;** any specific rules for each property of the event
