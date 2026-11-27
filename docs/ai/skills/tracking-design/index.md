---
title: "Design event tracking with an AI assistant"
sidebar_label: "Tracking design"
sidebar_position: 1
description: "Use the Snowplow tracking design skill to design an event tracking plan, with events, entities, schemas, and event specifications, in a coding agent such as Claude Code, Cursor, or Codex, and create it in Console once you approve the design."
keywords: ["event tracking design", "event tracking plan", "tracking design", "tracking plan", "event specification", "event schema", "event naming conventions", "entities", "Iglu", "Snowplow MCP", "AI assistant", "Claude Code", "Cursor", "Codex"]
date: "2026-11-11"
content_type: concept
---

The tracking design skill helps your AI assistant design event tracking: what to track, and how to structure it, before anyone writes tracking code. You describe the user actions you care about in plain language. The assistant then looks at the schemas and [tracking plans](/docs/event-studio/tracking-plans/index.md) you already have, proposes [events](/docs/fundamentals/events/index.md), [entities](/docs/fundamentals/entities/index.md), and [event specifications](/docs/event-studio/tracking-plans/event-specifications/index.md) that follow Snowplow conventions, and creates them in Console once you approve the design.

The skill is part of the Snowplow plugin and works through the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md). To install it, see [Install the skills](/docs/ai/skills/index.mdx#install-the-skills). Your assistant then loads the skill on its own when you ask about schemas, event design, or tracking plans. You don't need to run a command.

## Decide when to use the skill

Use the tracking design skill at the start of any new tracking work, or when you need to change what an existing tracking plan collects. It's built for the questions teams ask when they plan tracking, such as:

- How should I design event tracking for a new feature, and which events and entities does it need?
- What are the best practices for event tracking schemas and naming conventions?
- How do I give developers clear instructions for each event they implement?
- How do my existing event names and custom properties map to Snowplow events and entities?
- Which properties belong in a shared entity, and which belong on the event itself?
- Should I use one event with a `type` property, or a separate event for each action?
- Is there already a schema I can reuse, in my organization or on Iglu Central?
- How do I add an event to an existing tracking plan without duplicating entities that are already attached?
- What version number should a schema change get?

For background on the design principles the skill applies, see [Introduction to tracking design](/docs/fundamentals/tracking-design-best-practice/index.md).

The skill designs and creates tracking definitions. To add the tracking code to your application, use the [implementation guidance skill](/docs/ai/skills/implementation-guidance/index.md). To investigate events that fail validation, use the [troubleshooting skill](/docs/ai/skills/troubleshooting/index.md). To manage tracking plans as files in a git workflow, see [Programmatic management using CLI or API](/docs/event-studio/programmatic-management/index.md).

## Understand how the skill works

The skill works through the design in this order:

1. Load context: the assistant lists your existing schemas, tracking plans, and event specifications. If the tracking plan has [source applications](/docs/event-studio/source-applications/index.md), it reads which entities they already provide. It also searches [Iglu Central](https://github.com/snowplow/iglu-central) for public schemas you could reuse.
2. Gather intent: the assistant asks what triggers the event, what business question the data answers, which objects are involved, and whether existing schemas cover any of it.
3. Apply design rules: the assistant takes an entity-first approach, so information that more than one event needs goes into an entity rather than onto a single event. It applies Snowplow naming conventions, reuses schemas where it can, and marks each entity as required or optional.
4. Present a proposal: the assistant shows you the full design and asks you to confirm it.
5. Create the definitions: only after you confirm, the assistant creates the schema versions, the tracking plan if needed, and the event specification.

:::note[Nothing is created without your approval]
The skill tells the assistant not to create schemas or event specifications until you confirm the proposal. Schema versions can't be edited once they're created, so every change becomes a new version.
:::

The assistant works with the permissions of your Console login, or of the API key if you connect with one, so it can see and change only what those allow. See [Authentication](/docs/ai/snowplow-mcp/index.md#authentication).

## Review what the skill produces

Before anything is created, the proposal includes:

- The event name and a description of when it triggers
- The event schema and all of its properties
- Property instructions, if the event specification restricts which values a property can take
- The entities attached to the event, with how many of each to expect, and which ones are inherited from a source application
- A JSON example of the complete tracked event

After you confirm, the assistant creates:

- Any new event and entity schema versions the design needs, following [schema versioning](/docs/event-studio/data-structures/versioning/index.md) rules. New versions are deployed to your development environment. [Promote them to production](/docs/event-studio/test-and-publish/index.md#promote-data-structures-to-production) when you're ready
- A tracking plan, if the event doesn't belong in an existing one
- An event specification that links the event schema and all its entities in a single step

The assistant then lists the Iglu URIs for everything it created, so you can use them in your tracking code or hand them to the implementation guidance skill.

### Choose between grouped and separate events

A common design decision is whether to capture related actions in one event schema with a property that tells them apart, or to create one schema per action. The skill explains both options, follows the pattern already used in your tracking plan, and defaults to one schema per action when there's no existing pattern, unless the actions form a clear family of closely related actions. If the choice isn't clear, it asks you which approach you prefer. If you choose the grouped approach, it suggests [property instructions](/docs/event-studio/tracking-plans/event-specifications/index.md#add-property-instructions) for each event specification so that each one accepts only its own values.

Reusing a public schema can settle the choice for you. For example, Snowplow's ecommerce schemas on Iglu Central use a single `snowplow_ecommerce_action` event with a `type` property, such as `add_to_cart` or `transaction`. If the assistant proposes reusing it for a checkout flow, each event specification restricts `type` to its own action. For more detail, see [Event data structure granularity](/docs/fundamentals/tracking-design-best-practice/index.md#event-data-structure-granularity).

## Try example prompts

Describe what you want to track in your own words. The assistant asks follow-up questions where it needs more detail. Try prompts like these:

- "Design tracking for our checkout flow: add to cart, start checkout, and complete purchase. Reuse any schemas we already have."
- "We track `button_click` with a `button_name` property everywhere. Help me redesign it with entities so analysts don't have to parse names."
- "Here's our current event list for the mobile app as a table. Map each row to Snowplow events and entities, and tell me which properties should become shared entities."
- "Add a `newsletter_signup` event to the Marketing Site tracking plan. Don't duplicate entities that the source application already sends."
- "Is there a schema on Iglu Central for form submissions I can use instead of creating my own?"
- "I need to add a required `currency` property to the `purchase_completed` schema. Is that a breaking change, and what version should it get?"
- "Show me the event volume for the event specifications in the Ecommerce Checkout Flow tracking plan."

If your team uses the older name "data product", the assistant treats it as a tracking plan.
