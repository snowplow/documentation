---
title: "Conclusions and next steps from the Signals MCP tutorial"
position: 5
sidebar_label: "Conclusion"
description: "Recap of managing Signals conversationally through the Snowplow MCP server, with next steps for services, interventions, and the Console-embedded Snowplow Assistant."
keywords: ["snowplow mcp", "signals services", "interventions", "snowplow assistant", "next steps"]
date: "2026-07-30"
---

In this tutorial you connected the Snowplow MCP server to an AI assistant and managed a complete Signals workflow conversationally:

* Installed the Snowplow plugin and authenticated with Console credentials
* Defined a stream attribute group with three session metrics, saved as a draft
* Tested the definitions and published the group
* Verified the configuration in Console, and the live values in the Snowplow Inspector
* Added an attribute and published the new version, without leaving the conversation

The pattern that makes this work is the same at every step: the assistant stages the change, and you confirm the result somewhere the assistant can't embellish — Console, or the Snowplow Inspector reading the Profiles Store directly.

## Beyond attribute groups

The MCP server covers the full [Signals](/docs/signals/introduction/) surface, so the same conversational workflow extends to:

* [Services](/docs/signals/applications/services/): bundle attribute groups behind a single name for your applications to query
* [Interventions](/docs/signals/interventions/): define rules that push an action to your application the moment a user's attributes meet your criteria
* [Attribute keys](/docs/signals/attributes/attribute-keys/): create custom keys to aggregate by, such as an account or tenant ID
* [Agentic contexts](/docs/signals/agentic-contexts/): maintain a rolling log of each user's recent events to ground your own AI agents in live behavior

It also manages the rest of Snowplow Console, from data structures and tracking plans to pipeline health and failed events. See the [Snowplow MCP server](/docs/llms-support/snowplow-mcp/) documentation for the full capability list.

## Use the Snowplow Assistant instead

If you want the same conversational control without configuring an MCP client, the [Snowplow Assistant](/docs/llms-support/console-agent/) is built into Snowplow Console and uses the same set of tools, operating with your existing Console permissions. It's a practical option for teammates who don't work in AI coding tools.

## Next steps

Some directions to take from here:

* Follow the [interventions tutorial](/tutorials/signals-interventions/start) to react to attribute changes in an ecommerce app, then try recreating its configuration conversationally
* Use the [Python SDK](/tutorials/python-tracking-and-signals/introduction) when you want Signals definitions in version control, with the assistant helping you write them
* Ask your assistant to explore what's already in your account: "list my attribute groups and summarize what each one calculates" is a useful audit prompt
