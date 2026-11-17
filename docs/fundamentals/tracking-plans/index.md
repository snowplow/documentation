---
title: "Introduction to tracking plans"
sidebar_position: 7
sidebar_label: "Tracking plans"
description: "A tracking plan documents the events and entities a team collects, with an explicit owner, and acts as a data contract between the producers and consumers of the data."
keywords: ["tracking plans", "event specifications", "data governance", "data quality", "data contracts"]
content_type: concept
---

A tracking plan documents the behavioral data a team collects, with an explicit owner. Tracking plans are both human and machine readable, which helps teams collaborate around data and supports self-service analytics.

With tracking plans, you can:

* Set clear ownership for the data being created
* Make tracking implementation easier
* Deliver better governance around your data
* Communicate what the data means and how to use it
* Collaborate more effectively with the various teams involved in delivering value from your data
* Drive a self-serve culture around data across your organization

## What is a tracking plan

A tracking plan is a documented dataset. By documenting what data you are collecting, where, the meaning of that data and how to use it, you can break down the barriers that often exist between the many teams involved in the data value chain, from those implementing the tracking to those analyzing the data.

At its core, a tracking plan has:

* An explicit owner; that is responsible for maintaining and updating the data over time
* Consumers; who use the data to deliver use cases and are impacted by upstream changes

Tracking plans at Snowplow are underpinned by the concept of a data contract. They act as a formal agreement between the producers of tracking plans and the consumers of tracking plans, and support better collaboration around the data being created.

Examples of tracking plans:

* Ecommerce Web
* Media Web

## Key elements of a tracking plan

A tracking plan is made up of these elements.

**The source applications it is part of**; a tracking plan references the [source applications](/docs/event-studio/source-applications/index.md) that it spans.

**Benefits:**

* Have a clear view in which application the tracking plan is implemented in, which domains it spans and the related application entities it will have available by default in the dataset.

**An owner**; tracking plans are typically split by domain with each tracking plan having an explicit owner that is responsible for the maintenance and evolution of that data.

**Benefits:**

* Know who to go to when new data is required for a particular domain or when there is an issue with the data, breaking down the barriers between data producers and data consumers

**Event specifications**; these describe each event that is collected as part of the tracking plan, on which applications they are triggered and where, the event data structure to validate against, and the entities to attach to each event (e.g. user, product etc).

**Benefits:**

* Provide implementation details to developers implementing tracking (see section on [Snowtype](/docs/event-studio/implement-tracking/index.md) for further details)
* Provide documentation around the semantics of the data that you are creating, to enable analysts, data scientists, analytics engineers with data discoverability

**Subscribers;** allow colleagues to express an interest in understanding changes that are made to the data within a tracking plan, usually because the data is being used in a downstream data model or Data Model Pack.

**Benefits:**

Break down the barriers that exist between data producers and data consumers, by providing:

* data producers, with visibility of how the data is being used downstream and the implications of any changes
* data consumers, with notifications when changes are made to a tracking plan so that they can make any necessary changes to their models, reports etc.

**Change history**; a complete audit log of the changes that have been made to the tracking plan, including changes to existing data and new data that has been added over time.

**Benefits:**

* Enhances accountability and transparency by providing a clear audit trail of all data modifications, fostering confidence in data integrity

**Volume metrics**; tracking plans detect events ingested in your pipeline that match their event specifications. For each event specification, they show the volume of matching events and when the last one was seen.

**Benefits:**

* Detect trackers that don't send the expected events, or that use incorrect [application IDs](/docs/event-studio/source-applications/index.md#application-ids). This is particularly useful during the development phase, when you implement tracking for a specific application using [Snowtype](/docs/event-studio/implement-tracking/index.md). See [Monitor tracking plan data quality in Console](/docs/event-studio/tracking-plans/data-quality/index.md) for the volume categories and application ID statuses.

## How tracking plans help with governance, data quality, and data discoverability

The **data structures** that you attach to your event specification describe the [structure of the data](/docs/fundamentals/schemas/index.md). They validate that the values of the properties contained within your events and entities are **valid** as they pass through your pipeline.

The **event specification** describes a specific implementation of an event. It is a narrower definition of your event than a data structure - not only do they describe the structure of the data (by attaching the relevant data structure to validate against), they also allow you to define the **right values** for fields when the event gets triggered and the entities that need to be attached.

Once you publish an event specification, the pipeline validates events that declare it against its property instructions and entity cardinality. See [event specification validation](/docs/event-studio/tracking-plans/event-specification-validation/index.md).

By adding screenshots, and descriptions to the event specification, you are also able to communicate the **semantics of the data** to those that want to analyze it. In this way you can ensure that the data is **represented accurately** when being used to derive insights and make decisions by the many teams using the data downstream.

A data structure can be used across event specifications, and across tracking plans. In doing so, you can ensure you consistently track business critical events and entities (for example, your "product" entity) across your organization. Having the ability to use centralized event and entity schemas in this way, means that you are able to better govern the structure of the data across an organization while also empowering teams to manage their own specific implementation of events via tracking plans.

To get started with tracking plans, see [Design tracking with Event Studio](/docs/event-studio/index.md) and [Tracking plan and event specification elements](/docs/event-studio/tracking-plans/index.md).

You can also ask an AI assistant to draft a tracking plan from a description of your product. Connected to the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md), it creates the tracking plan, event specifications, and data structures in your account. Run `npx plugins add snowplow/skills` to install the MCP server and the Snowplow [skills](/docs/ai/skills/index.mdx) in your coding agent, or use the [Snowplow Assistant](/docs/ai/console-agent/index.md) in Console.
