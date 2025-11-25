---
title: "Event specifications"
sidebar_label: "Event specifications"
sidebar_position: 4
date: "2025-11-14"
---

Event specifications define the complete structure and requirements for [events](/docs/fundamentals/events/index.md) in your behavioral data pipeline. They serve as the single source of truth for what data should be collected, how it should be structured, and what business meaning it carries.

## What are event specifications?

An event specification is a collection of [schemas](/docs/fundamentals/schemas/index.md) (also called data structures) that describes everything about a specific event you want to track. Each specification includes:

- **Event schema**: defines the core properties specific to this event type
- **Entity schemas**: defines any additional context data that is sent with the event
- **Business metadata**: captures the purpose, ownership, and implementation requirements
- **Triggers**: documents when and where the event should be collected

Event specifications act as data contracts between teams. When you create an event specification, you are defining exactly what data your applications should send, what your data warehouse will receive, and what your downstream consumers can rely on.

## How event specifications work

Event specifications bridge the gap between tracking design and data collection:

- **Design phase**: you document your tracking requirements by creating event specifications that capture both technical structure and business context
- **Implementation phase**: developers use these specifications to instrument tracking code, either manually or through code generation within the Snowplow Console or using tools like Snowtype. Snowtype generated code ensures type-safety and alignment with specifications, reducing implementation errors and accelerating development time
- **Observability phase**: monitor event specification usage directly in the Console. See the total number of events collected for each specification and when each was last seen. This visibility helps you confirm implementations are live, identify unused specifications, and understand event volume patterns across your tracking plan
- **Data modeling phase**: event specifications enable automatically generated dbt models that transform atomic events into analysis-ready tables. These models understand the structure defined in your specifications, creating consistent table schemas and joining related [entities](/docs/fundamentals/entities/index.md). As you update specifications, corresponding data models can be regenerated, keeping your warehouse transformations synchronized with your tracking design
