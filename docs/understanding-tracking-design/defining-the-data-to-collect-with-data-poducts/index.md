---
title: "Defining the Data to collect with Data Products"
sidebar_position: 2
sidebar_label: "🆕 Defining the Data to collect with Data Products"
---

As described in [Data Products Introduction](/docs/understanding-your-pipeline/data-products/index.md), a data product is a logical grouping of the data you collect as an organisation by domain, with an explicit owner.

With data products, you can:

* Set clear ownership for the data being created
* Make tracking implementation easier
* Deliver better governance around your data
* More easily communicate what the data means and how to use it
* Collaborate more effectively with the various teams involved in delivering value from your data
* Drive a self-serve culture around data across your organization

## Elements of a Data Product

**Data product**

- **Name;** a descriptive name for the data product
- **Description;** a description of the data that the data product captures
- **Owner;** the individual responsible for the data product
- **Domain;** the team or business domain that owns the data product
- **Event specifications**
    * **Name;** a descriptive name for the event
    * **Description;** a description to help people understand what action the event is capturing
    * **Applications;** the application/s that the event will be tracked on
    * **Triggers;** specific instructions on where the event gets triggered (e.g. when a user clicks the "Add to basket" button)
    * **Event data structure;** the event data structure that this event will validate against as it is processed by your pipeline
    * **Entities;** the entities that should be attached to this event (e.g. user, product)
    * **Properties;** any specific rules for each property of the event

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
