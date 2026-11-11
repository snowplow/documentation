---
title: "Migration guides"
sidebar_label: "Migration guides"
sidebar_position: 12
description: "Migrate to Snowplow from other analytics solutions using parallel-run or full re-architecture approaches."
keywords: ["migration", "parallel-run", "dual tracking", "analytics migration", "tracking plan", "re-architecture"]
date: "2025-01-08"
sidebar_custom_props:
  header: "Resources"
content_type: concept
---

import AiAssistantInstall from '@site/docs/reusable/ai-assistant-install/_index.md';

This section contains advice for migrating to Snowplow from other solutions. For more advice on tracking plans, check out our [best practices guide](/docs/fundamentals/tracking-design-best-practice/index.md).

When migrating to Snowplow from another analytics solution, there are two possible strategies: parallel-run or full re-architecture.

We recommend a **parallel-run** approach as the lowest-risk strategy. It involves running both systems simultaneously (dual tracking) before switching over to Snowplow entirely. This allows you to test and validate your new Snowplow data in your warehouse, without affecting any existing workflows or production systems.

A **full re-architecture** or "rip-and-replace" approach is faster but riskier, involving a direct switch from your existing system to Snowplow. This is best suited for:
* Major application refactors where the switch can be part of a larger effort
* Teams with high risk tolerance and robust automated testing frameworks
* New projects or applications with minimal legacy systems

A full re-architecture strategy requires thorough testing in a staging environment to prevent data loss.

:::tip[Use your AI assistant]
An AI assistant connected to the Snowplow MCP server can help with both strategies. It can answer questions about how concepts from your current tool map to Snowplow, help translate your existing tracking plan into Snowplow data structures and event specifications, add Snowplow trackers to your application alongside your current tracking, and check that the events arrive. For example: "We track these events in our current analytics tool. Design the equivalent Snowplow tracking plan and create it in my account."

<AiAssistantInstall />
:::
