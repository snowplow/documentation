---
title: "Introduction to Snowplow Signals"
sidebar_position: 8.7
description: "Snowplow Signals is a real-time personalization engine that computes and acts on behavioral data from your pipeline. It enables in-session stream and historical user data access for personalized experiences, recommendations, and dynamic pricing."
keywords: ["real-time personalization", "customer intelligence", "behavioral data", "signals", "agentic applications"]
sidebar_label: "Signals"
sidebar_custom_props:
  header: "Signals"
---

{/* This page isn't seen because of how the navigation sidebar is structured, with the Signals subsections artificially hoisted to look like they're all top-level sections. Requests for this page are redirected to introduction/index.md (see worker/redirects.js). Keep this summary short: the full content lives on the get-started page. */}

Snowplow Signals computes user attributes from your data. You can retrieve these attributes in your applications to take real-time actions. Signals can also send automated triggers to your applications based on calculated attributes.

Use Signals to:
* Provide enriched user context to chatbots and other agentic applications, in near real time
* Deliver personalized recommendations, dynamic pricing, and adaptive UIs based on current behavior
* Trigger actions automatically when users meet specific criteria

By default, Signals calculates attributes from your real-time Snowplow event stream, but you can also sync pre-calculated values from your warehouse.

See the [get started](/docs/signals/get-started/index.md) page for an overview of the architecture and workflow, or try Signals for free with the [Signals Sandbox](https://try-signals.snowplow.io/).
