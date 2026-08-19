---
title: "Conclusions and next steps from the conversational Signals tutorial"
position: 5
sidebar_label: "Conclusion"
description: "Recap of managing Signals conversationally in the Snowplow Assistant or with the Snowplow MCP server, with next steps for services and interventions."
keywords: ["snowplow assistant", "snowplow mcp", "signals services", "interventions", "next steps"]
date: "2026-08-04"
---

In this tutorial you managed a complete Signals workflow conversationally, in the Snowplow Assistant or in your own MCP-connected assistant:

* Opened the assistant in Console, or installed the Snowplow plugin and authenticated with your Console account
* Defined a stream attribute group with three session metrics, saved as a draft
* Tested the definitions and published the group
* Verified the configuration in Console, and the live values in the Snowplow Inspector
* Added an attribute and published the new version, without leaving the conversation

## Beyond attribute groups

Attribute groups are one part of [Signals](/docs/signals/introduction/). The same conversational approach applies to:

* [Services](/docs/signals/applications/services/): bundle attribute groups behind a single name for your applications to query
* [Interventions](/docs/signals/interventions/): define rules that push an action to your application the moment a user's attributes meet your criteria
* [Attribute keys](/docs/signals/attributes/attribute-keys/): create custom keys to aggregate by, such as an account or tenant ID
* [Agentic contexts](/docs/signals/agentic-contexts/): maintain a rolling log of each user's recent events to ground your own AI agents in live behavior

Both routes reach beyond Signals into the rest of Snowplow Console, from data structures and tracking plans to pipeline health and failed events. See [Snowplow Assistant](/docs/llms-support/console-agent/) and [Snowplow MCP server](/docs/llms-support/snowplow-mcp/) for what each one covers.

## Next steps

Some directions to take from here:

* Follow the [interventions tutorial](/tutorials/signals-interventions/start) to react to attribute changes in an ecommerce app, then try recreating its configuration conversationally
* Use the [Python SDK](/tutorials/python-tracking-and-signals/introduction) when you want Signals definitions in version control, with the assistant helping you write them
* Ask your assistant to explore what's already in your account: "list my attribute groups and summarize what each one calculates" is a useful audit prompt
