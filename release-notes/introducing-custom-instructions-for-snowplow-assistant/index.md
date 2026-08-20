---
title: "Introducing custom instructions for Snowplow Assistant"
description: "Snowplow Assistant can now follow your organization's own conventions."
date: "2026-08-06"
update_type:
  - "Product news"
components:
  - "Event Studio"
  - "Console"
  - "AI tools"
---
Snowplow Assistant can now follow your organization's own conventions. Custom Instructions is a set of instructions you write and store in Console that the Assistant reads at the start of every conversation, across every interaction in your organization.

Until now the Assistant reasoned from Snowplow's general best practices. That works well for a tracking plan which follows our conventions, but many organizations have their own naming rules, schema patterns and internal vocabulary, and there was nowhere to declare them. Custom Instructions gives you one place to write your standards down so every interaction with the Snowplow Assistant starts from them.

## Key benefits

* **Consistency across teams.** Everyone using the Assistant works from the same conventions, whether they are designing a tracking plan, creating a data structure or investigating failed events.

* **Less repeating yourself.** You state your naming rules and terminology once instead of correcting the Assistant in each conversation.

* **Output that fits your business.** The Assistant knows what your organization does, what your product areas are called and which team owns what, so its suggestions are relevant to you and not only structurally correct.

## What to put in it

Custom Instructions describes your preferences and your business. It sits over the Snowplow best practices the Assistant already knows, so you only need to write down what is specific to you.

* **Naming conventions** for tracking plans, event specifications, data structures and properties, including any vendor prefix you use.

* **Design preferences** the Assistant would otherwise have to guess at, such as whether you favour atomic or grouped schemas, how you split properties between events and entities, and what you expect people to reuse rather than create.

* **Business and domain context,** covering what your organization does, your product areas, which teams own which tracking plans, and a glossary of internal terms.

## Adding your custom instructions

You will find it in Settings > Manage Organization > Snowplow Assistant. Write or paste your context, save, and it applies to new conversations straight away.

## Additional information

Snowplow Assistant is an AI assistant built into Snowplow Console. You describe what you want to do in plain language and it calls the relevant tools to act on your behalf, whether that is designing a tracking plan, creating data structures, checking pipeline health, investigating failed events or configuring Signals. It authenticates with your current Console session, so it can only do what your account is already permitted to do.

You can read more about this feature and related features here:

* [Snowplow Assistant](/docs/llms-support/console-agent/)

* [Adding Custom Instructions](/docs/llms-support/console-agent/#custom-instructions)

* [Snowplow MCP Server](/docs/llms-support/snowplow-mcp/)
