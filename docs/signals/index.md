---
title: "Snowplow Signals"
sidebar_position: 8
description: "An overview of Signals concepts."
sidebar_label: "Signals"
---

Snowplow Signals empowers users to build more intelligent AI applications that can perceive and act on customer behavior in real-time. By aggregating engineer-defined attributes and facts, Signals enables Large Language Models (LLMs) to act intelligently and deliver personalized experiences.

With real-time visibility into customer actions and seamless access to their complete history, Snowplow Signals simplifies the personalization of agentic applications, helping you build AI-driven solutions that understand and respond to your users.

Built on top of Snowplow's behavioural data collection capabilities, integrating with Signals becomes straightforward once you grasp a few key concepts.

### **Attributes**

The foundation of Signals is the `Attribute`. An attribute represents a specific fact about a user's behaviour. For example:

- **Number of Pageviews in the Last 7 Days:** Counts how many pages a user has viewed within the past week.
- **Last Product Viewed:** Identifies the most recent product a user interacted with.
- **Previous Purchases:** Provides a record of the user's past transactions.


### **Views**

A `View` is a collection of attributes that share a common aggregator (eg `session_id` or `user_id`) and a data `Source`. You can picture it as a table of attributes, for example:

| user_id | number_of_pageviews | last_product_viewed |  previous_purchases |
|---------|---------------------|---------------------|---------------------|
| `abc123`| 5                   |     Red Shoes       |[`Blue Shoes`, `Red Hat`]|


### **Sources**

The `Source` of a view refers to the origin of the data. A source can be one of two types:

- **Batch Source:** Data that is aggregated and stored in a data warehouse, such as DBT models.
- **Stream Source:** Data that is aggregated in real-time in stream.


### **Services**

A `Service` is a collection of `Views` that are grouped to make the retrieval of attributes simpler. 

