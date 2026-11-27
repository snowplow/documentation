---
title: "Read predictive attribute scores through the Signals MCP server"
sidebar_label: "Predictive attributes in the Signals MCP server"
keywords: ["Signals", "MCP server", "predictive attributes", "propensity score"]
description: "An agent connected to the Signals MCP server can now discover published predictive attributes and read their scores and tiers, alongside calculated attributes."
date: "2026-11-27"
category:
  - "Product news"
components:
  - "Signals"
  - "AI tools"
---

An agent connected to the [Signals MCP server](/docs/signals/applications/mcp-server/) can now read [predictive attribute](/docs/signals/predictive-attributes/) scores, using the same tools it already uses for calculated attributes. The server still has four tools.

## What's new

`list_attribute_groups` lists each published predictive attribute after the attribute groups, with the goal it predicts, its description, and the attribute keys a score needs a value for. The agent reads one with `get_attributes` by naming it like an attribute group, and can read it in the same call as the groups it needs. Each predictive attribute has two attributes: `score`, between 0 and 1, and `tier`, the name of the score range it falls in, which you set when you review a training in Console.

The score ranks how likely the goal is later in the session, compared with other sessions. It isn't a probability, and the tool descriptions tell the agent never to present it as a percentage chance.

Predictive attributes are in public preview, and they appear in the listing only for organizations that have them enabled.

## Links

* [Serve Signals data to your agent with the MCP server](/docs/signals/applications/mcp-server/#predictive-attributes)
* [Define predictive attributes](/docs/signals/predictive-attributes/)
* [Retrieve predictive attribute scores](/docs/signals/applications/predictive-attributes/)
