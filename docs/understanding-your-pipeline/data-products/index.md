---
title: "Data Products Introduction"
sidebar_position: 7
sidebar_label: "🆕 Data Products Introduction"
description: "Snowplow's behavioral data products enable organizations to easily generate AI and BI-ready data that is reliable, clear, compliant, accurate, and predictable"
---

Data products are Snowplow's solution to helping organizations more easily create and democratise behavioral data. Snowplow’s Customer Data Infrastructure (CDI) captures first party customer behavior data from a variety of sources. The data collected are behavioral events - actions and observations captured from a client or server endpoint. For example, Snowplow’s event tracking technology can capture behavioral events from websites, mobile phones, video, internet TVs, airplane seat entertainment systems, factory floor IoT devices, and more.  Events from these customer endpoints, often billions a month, are captured in real-time and stored in an atomic events table in a destination data store, such as Snowflake, Databricks or even cloud data lakes like S3.

This atomic events table houses data from one or more data products in a consistent way. This is a powerful concept - this table is a singular view of all the different behaviors of all your customers, all stored in one place. As a result, this events table data provides the foundation for Snowplow’s behavioral data products.

With Snowplow's behavioral data products, you can:

* Set clear ownership for the data being created
* Make tracking implementation easier
* Deliver better governance around your data
* More easily communicate what the data means and how to use it 
* Collaborate more effectively with the various teams involved in delivering value from your data
* Drive a self-serve culture around data across your organization

## What is a Behavioral Data Product

A behavioral data product is a well documented dataset. By documenting what data you are collecting, where, the meaning of that data and how to use it, you can break down the barriers that exist today between the many teams involved in the data value chain (i.e. from those implementing the tracking to those analyzing the data). 

At its core, a behavioral data product has:

* An explicit owner; that is responsible for maintaining and updating the data over time
* Consumers; who use the data to deliver use cases and are impacted by upstream changes 

Behavioral data products at Snowplow are underpinned by the concept of a data contract. They act as a formal agreement between the producers of data products and the consumers of data products, and support better collaboration around the data being created.

We have always believed in the value of data contracts at Snowplow; our tech is underpinned by event and entity schemas that describe upfront the structure of the data and ensure that the data conforms to that structure as it is processed by your pipeline. This schema technology forms the foundations of a data contract, but data products take this to the next level to bring enhanced quality, governance and discoverability to the data that you create. 

Examples of behavioral data products:

* E-commerce Web
* Media Web

## Key elements of a Behavioral Data Product

**An owner**; data products are typically split by domain with each data product having an explicit owner that is responsible for the maintenance and evolution of that data.

**Benefits:**

* Know who to go to when new data is required for a particular domain or when there is an issue with the data, breaking down the barriers between data producers and data consumers

**Event specifications**; these describe each event that is collected as part of the data product, on which applications they are triggered and where, the event data structure to validate against, and the entities to attach to each event (e.g. user, product etc).

**Benefits:**

* Provide implementation details to developers implementing tracking (see section on [Snowtype](/docs/collecting-data/code-generation) for further details)
* Provide documentation around the semantics of the data that you are creating, to enable analysts, data scientists, analytics engineers with data discoverability

**Subscribers;** allow colleagues to express an interest in understanding changes that are made to the data within a Data Product, usually because the data is being used in a downstream data model or data application. 

**Benefits:**

Break down the barriers that exist between data producers and data consumers, by providing:

* data producers, with visibility of how the data is being used downstream and the implications of any changes
* data consumers, with notifications when changes are made to a Data Product so that they can make any necessary changes to their models, reports etc.

**Change history**; a complete audit log of the changes that have been made to the data product, including changes to existing data and new data that has been added over time.

**Benefits:**

* Enhances accountability and transparency by providing a clear audit trail of all data modifications, fostering confidence in data integrity

![Key elements of a Data Product](images/key-elements-of-a-data-product.png)

## How data products help with governance, data quality and data discoverability

The **data structures** that you attach to your event specification describe the [structure of the data](/docs/understanding-your-pipeline/schemas/). They validate that the values of the properties contained within your events and entities are **valid** as they pass through your pipeline.

The **event specification** describes a specific implementation of an event. It is a narrower definition of your event than a data structure - not only do they describe the structure of the data (by attaching the relevant data structure to validate against), they also allow you to define the **right values** for fields when the event gets triggered and the entities that need to be attached.

*NB: the event specifications are not enforced by your pipeline (for example, we don’t yet validate that the correct entities are attached to an event).*

By adding screenshots, and descriptions to the event specification, you are also able to communicate the **semantics of the data** to those that want to analyse it. In this way you can ensure that the data is **represented accurately** when being used to derive insights and make decisions by the many teams using the data downstream.

A data structure can be used across event specifications, and across data products. In doing so, you can ensure you consistently track business critical events and entities (for example, your "product" entity) across your organisation. Having the ability to use centralized event and entity schemas in this way, means that you are able to better govern the structure of the data across an organisation whilst also empowering teams to manage their own specific implementation of events via data products. 

To understand how to get started with Snowplow's behavioral data products, see [Defining the Data to collect with Data Products](/docs/understanding-tracking-design/defining-the-data-to-collect-with-data-poducts/) for further details.
