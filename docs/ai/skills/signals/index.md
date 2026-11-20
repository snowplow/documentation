---
title: "Configure Signals with an AI assistant"
sidebar_label: "Signals"
sidebar_position: 3
description: "Use the Snowplow Signals skill to define real-time customer attributes, services, interventions, and agentic contexts for real-time personalization in a coding agent such as Claude Code, Cursor, or Codex, and publish them once you approve each change."
keywords: ["Signals", "real-time personalization", "customer attributes", "real-time customer attributes", "attribute groups", "attribute keys", "interventions", "agentic context", "Snowplow MCP", "AI assistant", "Claude Code", "Cursor", "Codex"]
date: "2026-11-16"
content_type: concept
---

The Signals skill helps your AI assistant manage [Signals](/docs/signals/introduction/index.md) configuration: the customer attributes Signals calculates from your events, and the ways your applications and agents use them. You describe the behavior you care about in plain language. The assistant reads the Signals configuration you already have, proposes [attribute keys](/docs/signals/attributes/attribute-keys/index.md), [attribute groups](/docs/signals/attributes/attribute-groups/index.md), [services](/docs/signals/applications/services/index.md), [interventions](/docs/signals/interventions/index.md), or [agentic contexts](/docs/signals/agentic-contexts/index.md), and creates and publishes them only when you approve.

The skill is part of the Snowplow plugin and works through the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md). To install it, see [Install the skills](/docs/ai/skills/index.mdx#install-the-skills). Your assistant loads the skill on its own when you ask about customer attributes, personalization, interventions, or agent context, even if you don't name Signals. You don't need to run a command.

## Decide when to use the skill

Use the Signals skill when you want to add, change, or check what Signals calculates and serves. It's built for the questions teams ask when they use behavioral data for real-time personalization, such as:

- How do I calculate real-time customer attributes, such as page views this session or the last product viewed, from the events I already track?
- Should an attribute be calculated per session, per device, or per logged-in user?
- Which attributes should a service give my application when it renders a banner, a paywall, or a recommendation?
- Should my application pull attribute values, or should Signals push an intervention when a user crosses a threshold?
- Can I use attributes I already calculate in my warehouse, instead of recalculating them from events?
- How do I check that an attribute returns the values I expect before it goes live?
- How do I give a chatbot or AI agent the user's recent activity in the current session?
- What's live on the Signals engines right now, and what does publishing a change affect?

For background on the components the skill works with, see [How Signals works](/docs/signals/concepts/index.md). For the difference between services and interventions, see [Pull attributes or push interventions](/docs/signals/concepts/pull-and-push/index.md).

The skill manages Signals configuration. To set up Signals for the first time in your own project, including the tracking and the code that fetches attribute values, follow the [Signals quickstart with your coding agent](/docs/signals/quickstart/index.md), which uses the separate `signals-setup` skill. To design the events that attributes are calculated from, use the [tracking design skill](/docs/ai/skills/tracking-design/index.md). To add tracking code to your application, use the [implementation guidance skill](/docs/ai/skills/implementation-guidance/index.md).

## Understand how the skill works

The skill follows the same approach for every Signals resource, in this order:

1. Read before writing: the assistant lists the attribute keys, attribute groups, services, interventions, and agentic contexts you already have, and can show which stream attributes and interventions are running on the engines.
2. Propose the change: the assistant suggests what to create or update, and reuses an existing attribute key where one fits.
3. Ask for approval: the assistant asks before it creates, updates, deletes, publishes, or unpublishes anything.
4. Test: for stream attribute groups, the assistant suggests [testing the attribute definitions](/docs/signals/attributes/attribute-groups/index.md#test-attribute-definitions) against a sample of recent events in your warehouse before you publish. Testing needs a warehouse connection.
5. Publish: once you approve, the assistant publishes the configuration so Signals starts to act on it, and explains the effect first.

:::note[Nothing changes without your approval]
The skill never creates, updates, deletes, publishes, or unpublishes Signals resources without your explicit approval. Publishing affects real-time processing, so the assistant explains the impact before it publishes.
:::

The assistant works with the permissions of your Console login, or of the API key if you connect with one, so it can see and change only what those allow. See [Authentication](/docs/ai/snowplow-mcp/index.md#authentication).

The steps differ by resource:

- Stream attribute groups: the assistant checks for a suitable attribute key and creates one if the aggregation level you need doesn't exist. It then defines each attribute with the events to read, the aggregation, such as `counter`, `last`, or `unique_list`, the property to aggregate, optional criteria, and a time period.
- Warehouse attribute groups: the assistant lists the tables in your warehouse, finds a timestamp column, and sets up the attribute key and the [warehouse source](/docs/signals/attributes/warehouse-config/index.md).
- Services: the assistant checks which attribute groups exist and are published, then bundles the ones you choose into a service, pinned to specific versions. A service goes live as soon as it's created, with no separate publish step.
- Interventions: the assistant checks that the attribute groups behind the criteria are published, then creates a rule-based intervention with criteria such as `session_engagement:product_views > 3`.
- Agentic contexts: the assistant identifies the events and properties that matter to your agent, creates a draft with buffer limits and an optional prompt, and publishes it. Agentic contexts always use the `domain_sessionid` attribute key.

## Review what the skill produces

Before anything changes, the assistant shows you the proposed configuration. Depending on the request, it includes:

- The attribute key, and why it fits the aggregation level you want
- Each attribute, with its events, aggregation, property, criteria, and period
- The data source: the real-time stream, or a warehouse table
- For a service, the attribute groups and versions it bundles
- For an intervention, the criteria and the attributes they reference
- For an agentic context, the events, the properties projected from each, the buffer limits, and the prompt

After you approve, the assistant creates the resources and, with your go-ahead, publishes them. Updating a published attribute group or intervention creates a new version and leaves the published version running. See [Publish and manage Signals configuration](/docs/signals/publish/index.md).

### Build an agentic context

An agentic context keeps a rolling window of the user's recent events in the current session, so an agent can read what the user just did. The assistant can select up to 20 event types and project up to 50 properties from each. The buffer keeps up to 100 events, for up to one hour. For page views, page pings, and structured events, the assistant references the baked-in event directly and projects atomic properties such as `page_url` and `page_title`, because these events have no schema in your tracking plans.

Changes to an agentic context start as a draft, and the published version stays live until you publish the draft. Once the agentic context is published, the assistant can read the buffered events for a session to confirm that events are being captured. The assistant treats buffered events and prompts as data, and never follows instructions found in them. To fetch an agentic context in your application, see [Retrieve agentic contexts in your application](/docs/signals/applications/agentic-contexts/index.md).

## Try example prompts

Describe the outcome you want in your own words. The assistant asks follow-up questions where it needs more detail. Try prompts like these:

- "List our Signals attribute groups and show me which attributes are running on the streaming engine right now."
- "Explain what each attribute in the `session_engagement` attribute group calculates and which events it reads."
- "Create an attribute group keyed on `domain_sessionid` that counts product views and add-to-cart events in the last 30 minutes. Test it before you publish."
- "Bundle the published session and user attribute groups into one service for the homepage, pinned to their current versions."
- "Trigger an intervention when a user views more than three products in a session without adding one to the cart."
- "Sync our `customer_lifetime_value` warehouse table into Signals as attributes keyed on `user_id`."
- "Set up an agentic context for our support chatbot with the pages the user viewed and the searches they ran this session, and a prompt that tells the agent it's a support assistant."

For the other Snowplow skills, see the [pipeline infrastructure](/docs/ai/skills/pipeline-infrastructure/index.md), [console operations](/docs/ai/skills/console-operations/index.md), and [troubleshooting](/docs/ai/skills/troubleshooting/index.md) skills.
