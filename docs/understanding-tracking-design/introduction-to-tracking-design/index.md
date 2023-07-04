---
title: "Introduction to tracking design"
date: "2020-06-01"
sidebar_position: 0
---

To use Snowplow successfully, you need to have a good idea of:

- What events you care about in your business
- What events occur in your website / mobile application / server side systems / factories / call centers / dispatch centers / etc
- What decisions you make based on those events
- What you need to know about those events to make those decisions

This is where creating a **Tracking Plan** comes into play. It is a comprehensive document that adds a semantic layer to the events your business is interested in tracking. For each event, it defines:

- A description of the event, often illustrated with screenshots.
- The data that is captured with the event, and its structure.
- The origin of the data, i.e. what platforms or apps this data is created by.
- Other relevant information.

:::info
Snowplow BDP Enterprise customers can create tracking plans directly in Snowplow instead of using an external document. See [Creating tracking plans](/docs/understanding-tracking-design/tracking-plans/index.md) for more information.
:::

Snowplow also uses a **schema registry** to store the definition of these data structures.

> **Schema registry** provides a serving layer for your metadata. It provides a RESTful interface for storing and retrieving schemas. It stores a versioned history of all schemas and allows evolution of schemas.

When an **event** occurs, it generally involves a number of **entities**, and takes place in a particular setting.

> An **entity** is the group of entities associated with or describing the setting in which an **event** has taken place.

Due to the nature of _custom_ (as well as Snowplow authored) events/entities there has to be some mechanism in place ensuring validity of the captured data.

JSON schema plays a significant part in this mechanism. Both events and entities have schemas which define what data is recorded about the event, or entity, at data capture time.

> **JSON schema** specifies a _JSON_-based format to define the structure of JSON data for validation, documentation, and interaction control.

> **JSON** (JavaScript Object Notation) is an open-standard format that uses human-readable text to transmit data objects consisting of attribute–value pairs.

Snowplow requires that you put together schemas for your events and entities, ahead of data collection time. It then uses those schemas to process the data, in particular:

1. To validate that the data coming in is "good data" that conforms to the schema
2. Process the data correctly, in particular, shredding the JSONs that represent the data into tidy tables in Redshift suitable for analysis

**Iglu** is a key technology for making this possible. It is machine-readable, open-source _schema registry_ for JSON and Thrift schemas from the team at Snowplow Analytics. A schema registry is like [Git](https://en.wikipedia.org/wiki/Git_(software)) but holds data schemas instead of software or code.
