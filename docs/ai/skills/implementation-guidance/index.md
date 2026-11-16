---
title: "Add Snowplow trackers to your app with an AI assistant"
sidebar_label: "Implementation guidance"
sidebar_position: 2
description: "Use the Snowplow implementation guidance skill to add the Snowplow tracker to a web, mobile, or server-side app in a coding agent such as Claude Code, Cursor, or Codex, using your own schemas and event specifications, then test the events with Snowplow Micro before you go to production."
keywords: ["snowplow tracker", "snowplow javascript tracker", "mobile tracker", "server-side tracking", "tracking implementation", "snowplow micro", "test events", "Snowplow MCP", "AI assistant", "Claude Code", "Cursor", "Codex"]
date: "2026-11-16"
content_type: concept
---

The implementation guidance skill helps your AI assistant add Snowplow tracking to your application. You name the platform and the events you need. The assistant reads your [event specifications](/docs/event-studio/tracking-plans/event-specifications/index.md) and [schemas](/docs/fundamentals/schemas/index.md) in Console, fetches the tracker documentation for your platform, and writes tracking code that uses your exact field names and Iglu URIs. It then walks you through testing the events in [Snowplow Micro](/docs/testing/snowplow-micro/index.md) and moving from your development environment to production.

The skill is part of the Snowplow plugin and works through the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md). To install it, see [Install the skills](/docs/ai/skills/index.mdx#install-the-skills). Your assistant loads the skill on its own when you ask it to add a tracker, send events, or instrument an app, even if you don't mention Snowplow by name. You don't need to run a command.

## Decide when to use the skill

Use the implementation guidance skill once your tracking plan is designed and you need the tracking code in your application. It's built for the questions developers ask when they implement tracking, such as:

- How do I add the Snowplow JavaScript tracker to my website, or the native mobile trackers to my iOS or Android app?
- How do I send server-side events from my back end with the Node.js, Python, Go, Java, or .NET tracker?
- How do I send a custom event with all the entities that its event specification requires?
- Which schema version should my tracking code reference?
- How do I test my tracking before any events reach production?
- Did my test events reach Snowplow Micro, and why did any of them fail validation?
- Are the schemas my code uses deployed to my development environment, and have they been promoted to production?
- Which Collector endpoints do my development and production pipelines have?

The skill implements tracking that already exists in Console. If the events or schemas don't exist yet, design them first with the [tracking design skill](/docs/ai/skills/tracking-design/index.md). If events fail validation after you deploy, use the [troubleshooting skill](/docs/ai/skills/troubleshooting/index.md).

For other ways to implement a tracking plan, such as tracker code from a source application, Console code snippets, or [Snowtype](/docs/event-studio/implement-tracking/index.md) code generation, see [Hand off a tracking plan to developers](/docs/event-studio/hand-off-to-implementation/index.md).

## Understand how the skill works

The skill follows the implementation lifecycle in five stages, in this order:

1. Instrument: the assistant asks which platform, language, and framework you use, and which events you need. It looks up the event specifications, their entities and cardinality, the exact schema properties, and any [source application](/docs/event-studio/source-applications/index.md) for your platform. It then writes the tracking code, with the tracker pointed at a Snowplow Micro endpoint for testing.
2. Deploy schemas to development: the assistant checks that every schema the code uses is deployed to your development environment. Micro validates events against development schemas, so any missing schema needs to be deployed first. See [Deploy data structures to your development environment](/docs/event-studio/test-and-publish/index.md#deploy-data-structures-to-your-development-environment).
3. Test with Micro: the assistant lists your Micro instances and their endpoints. After you send test events, it reads the events that Micro received, both valid and failed, and shows the reason for each failure.
4. Validate in the development pipeline: if you have a development [pipeline](/docs/pipeline/index.md), the assistant finds it and its Collector endpoints, so you can point the tracker there and confirm events flow through without [failed events](/docs/fundamentals/failed-events/index.md).
5. Publish to production: before you switch the tracker to the production Collector endpoint, the assistant checks that every schema is deployed to production and that the event specifications are published.

:::note[Check production before you switch the Collector URL]
Don't point your tracker at the production Collector until every schema it uses is in production. Events that reference a schema that exists only in development fail validation. To promote schemas, see [Promote data structures to production](/docs/event-studio/test-and-publish/index.md#promote-data-structures-to-production).
:::

The skill doesn't write tracker code from the assistant's memory. Tracker APIs change between releases, so the assistant fetches the tracker pages from the Snowplow documentation each time and builds the code from them. The skill covers these trackers:

- Web: the [JavaScript tracker](/docs/sources/web-trackers/index.md)
- iOS and Android: the [native mobile trackers](/docs/sources/mobile-trackers/index.md)
- Server-side: the [Node.js](/docs/sources/node-js-tracker/index.md), [Python](/docs/sources/python-tracker/index.md), [Go](/docs/sources/golang-tracker/index.md), [Java](/docs/sources/java-tracker/index.md), and [.NET](/docs/sources/net-tracker/index.md) trackers

The assistant works with the permissions of your Console login, or of the API key if you connect with one, so it can see and change only what those allow. See [Authentication](/docs/ai/snowplow-mcp/index.md#authentication).

## Review what the skill produces

The tracking code that the assistant writes is complete and ready to copy, not a fragment. The code includes:

- Tracker initialization that points at your Micro endpoint for testing
- The tracking call for each [self-describing event](/docs/fundamentals/events/index.md#self-describing-events), with the exact Iglu URI and schema version from your account
- Every required [entity](/docs/fundamentals/entities/index.md), with its Iglu URI and a comment that says whether the event specification requires it or makes it optional
- Field names and types that match the schema, with optional fields marked in comments
- Any property instructions from the event specification, as code comments

During testing, the assistant reports which events reached Micro and why any failed. You can also inspect each event in the [Micro dashboard](/docs/testing/snowplow-micro/ui/index.md). If you run Micro through Console, your development environment validates events against draft event specifications as well, so you can test a specification before you publish it. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

Before the switch to production, the assistant tells you which schemas are deployed to development and production, which event specifications are published, and the Collector endpoints for each pipeline.

## Try example prompts

Describe your app and the events you need in your own words. The assistant asks follow-up questions where it needs more detail. Try prompts like these:

- "Add the Snowplow JavaScript tracker to this React app and implement the event specifications in the Checkout tracking plan."
- "Implement the `add_to_cart` event in our iOS app in Swift. Include every entity the event specification requires."
- "Our order service runs on Node.js. Send a server-side `order_completed` event with the Node.js tracker."
- "Point the tracker at my Micro instance, then check that the test events arrived and tell me why any failed."
- "Are all the schemas this implementation uses deployed to development and production?"
- "Which Collector endpoints does the production pipeline have, and is everything ready to switch to it?"

For a guided first session that designs the tracking, adds the tracker, and checks the events in one prompt, see [Snowplow quickstart with your coding agent](/docs/get-started/quickstart/index.md).
