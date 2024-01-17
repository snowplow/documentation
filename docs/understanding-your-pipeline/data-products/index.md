---
title: "🆕 Data Products introduction"
sidebar_position: 7
description: "Snowplow's data products enable organizations to easily generate AI and BI-ready data that is reliable, clear, compliant, accurate, and predictable"
---

Data products are Snowplow’s solution to helping organisations more easily create & democratise data that is AI & BI ready; data that is reliable, explanatory, compliant, accurate, and predictable. 

With data products, you can:

* Set clear ownership for the data being created
* Make tracking implementation easier
* Deliver better governance around your data
* More easily communicate what the data means and how to use it 
* Collaborate more effectively with the various teams involved in delivering value from your data

## What is a Data Product

A data product is a well documented dataset. By documenting what data you are collecting, where, the meaning of that data and how to use it, you can break down the barriers that exist today between the many teams involved in the data value chain (i.e. from those implementing the tracking to those analysing the data). 

At its core, a data product has:

* An explicit owner; that is responsible for maintaining and updating the data over time
* Consumers; who use the data to deliver use cases and are impacted by upstream changes 

Data products at Snowplow are underpinned by the concept of a data contract. They provide an upfront agreement on what to expect from the data being collected and capture changes to that dataset over time. 

We have always believed in the value of data contracts at Snowplow; our tech is underpinned by event and entity schemas that describe upfront the structure of the data and ensure that the data conforms to that structure as it is processed by your pipeline. This schema technology forms the foundations of a data contract, but data products take this to the next level to bring enhanced quality, governance and discoverability to the data that you create. 

With a data product, you can:

* Define the owner of a dataset
* Specify in detail the events to collect including where they are triggered & on which applications
* Define the entities to attach to those events (i.e. user, product etc) 
* Easily communicate tracking requirements to developers implementing tracking
* Provide important metadata to make the semantics of the data well understood across your business 
* Subscribe to the data product to receive notifications when changes are being made
* View a change log to understand how the data has changed over time

## Key elements of a data product

![Elements of a data product diagram](images/data-product-elements.png)

**An owner**; data products are typically split by domain with each data product having an explicit owner that is responsible for the maintenance and evolution of that data.

**Benefits:**

* Know who to go to when new data is required for a particular domain or when there is an issue with the data, breaking down the barriers between data producers and data consumers

**Event specifications**; these describe each event that is collected as part of the data product, on which applications they are triggered and where, the event data structure to validate against, and the entities to attach to each event (i.e. user, product etc).

**Benefits:**

* Provide implementation details to developers implementing tracking (see section on Snowtype for further details)
* Provide documentation around the semantics of the data that you are creating, to enable analysts, data scientists, analytics engineers with data discoverability

**Subscribers;** these describe people who are interested in this Data product or who are actively using the data in other ways.

**Benefits:**

* Provide notifications for changes in a Data product.

**Change history**; a complete audit log of the changes that have been made to the data product, including changes to existing data and new data that has been added over time.

**Benefits:**

* Enhances accountability and transparency by providing a clear audit trail of all data modifications, fostering confidence in data integrity

## How data products help with governance, data quality and data discoverability

![Data products and governance](images/data-product-governance.png)

The **data structures** that you attach to your event specification describe the [structure of the data](/docs/understanding-your-pipeline/schemas/). They validate that the values of the properties contained within your events and entities are **valid** as they pass through your pipeline.

The **event specification** describes a specific implementation of an event. It is a narrower definition of your event than a data structure - not only do they describe the structure of the data (by attaching the relevant data structure to validate against), they also allow you to define the **right values** for fields when the event gets triggered and the entities that need to be attached.

*NB: the event specifications are not enforced by your pipeline (for example, we don’t yet validate that the correct entities are attached to an event) - this is coming soon!*

By adding screenshots, and descriptions to the event specification, you are also able to communicate the **semantics of the data** to those that want to analyse it. In this way you can ensure that the data is **represented accurately** when being used to derive insights and make decisions by the many teams using the data downstream.

A data structure can be used across event specifications, and across data products. In doing so, you can ensure you consistently track business critical events and entities (for example, your ‘product’ entity) across your organisation. Having the ability to use centralised event and entity schemas in this way, means that you are able to better govern the structure of the data across an organisation whilst also empowering teams to manage their own specific implementation of events via data products. 

To understand how to get started with data products, see [Defining the data to collect with Data Products](/docs/understanding-tracking-design/defining-the-data-to-collect-with-data-poducts/) for further details.