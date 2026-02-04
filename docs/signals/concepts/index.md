---
title: "Core Signals components and concepts"
sidebar_position: 10
sidebar_label: "Fundamentals"
description: "Signals introduces attribute groups for defining behavioral data, services for consuming attributes, and interventions for triggering actions. Learn about data sources, attribute keys, and the Profiles Store."
keywords: ["attribute groups", "services", "interventions", "profiles store", "attribute keys"]
---

Signals introduces a new set of data governance concepts to Snowplow. As with schemas for Snowplow event data, Signals components are strictly defined, structured, and versioned.

Signals has three main configurable components:
* [Attribute groups](/docs/signals/concepts/attributes/index.md) for defining and calculating attributes
* [Services](/docs/signals/concepts/attributes/index.md#services) for consuming calculated attributes in your applications
* [Interventions](/docs/signals/concepts/interventions/index.md) for consuming calculated attributes and triggering actions in your applications

**Attribute groups** are where you define the behavioral data you want to calculate. Each attribute group contains multiple **attributes** - the specific facts about user behavior you want to measure or take action on - along with the configuration that defines how to calculate them, and from what data. Attributes can only be defined within attribute groups; they are effectively properties of the attribute group.

To use attributes to trigger actions such as in-app messages, discounts, or personalized journeys, use services or interventions.

**Services** provide a stable interface layer between your calculated attributes and your applications. Each service can contain multiple attribute groups, pinned to specific versions. You'd build the logic within your application for how to use the retrieved attributes. **Interventions** are a separate abstraction for defining when to trigger actions in your application.

![Detailed Signals architecture showing how attribute groups, services, and interventions connect to the Profiles Store](../images/overview-detailed.png)
