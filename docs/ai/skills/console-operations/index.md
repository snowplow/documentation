---
title: "Manage enrichments, alerts, and tracking plans in Console with an AI assistant"
sidebar_label: "Console operations"
sidebar_position: 5
description: "Use the Snowplow console operations skill to enable and configure Snowplow enrichments, create data quality alerts, register source applications, and edit tracking plans in Console from a coding agent such as Claude Code, Cursor, or Codex, with your approval before every change."
keywords: ["snowplow enrichment", "enable enrichment", "cookie extractor", "data quality alerts", "failed event alerts", "source applications", "tracking plan", "Console", "Snowplow MCP", "AI assistant", "Claude Code", "Cursor", "Codex"]
date: "2026-11-16"
content_type: concept
---

The console operations skill helps your AI assistant change resources in Console for you. You describe the change in plain language, such as turning on a Snowplow enrichment or getting a Slack message when events fail validation. The assistant reads what's already configured, proposes the change, and makes it only after you approve it.

The skill covers four kinds of Console resources: [enrichment](/docs/pipeline/enrichments/index.md) configuration, data quality alerts, [source applications](/docs/event-studio/source-applications/index.md), and [tracking plans](/docs/event-studio/tracking-plans/index.md). It's part of the Snowplow plugin and works through the [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md). To install it, see [Install the skills](/docs/ai/skills/index.mdx#install-the-skills). Your assistant loads the skill on its own when you ask it to create, update, or delete one of these resources. You don't need to run a command.

## Decide when to use the skill

Use the console operations skill when you want to change a Console resource and would rather describe the change than find the right screen. It's built for the questions teams ask when they configure a pipeline or set up monitoring, such as:

- How do I turn on the ASN lookup and bot detection enrichments, first on a development environment and then on production?
- Which enrichments are switched off on my pipeline?
- How do I add a cookie to the cookie extractor enrichment?
- How do I change an enrichment that's already enabled, such as IP lookup?
- Will changing an enrichment affect event processing?
- How do I get a Slack message when events from one app start failing validation?
- Should I set up an immediate alert, or a digest of failed events?
- How do I register a new app as a source application, with its application IDs and entities?
- How do I rename a tracking plan or update its description?

The skill changes Console resources. To look at pipelines, collector configuration, enrichments, and health metrics without changing anything, use the [pipeline infrastructure skill](/docs/ai/skills/pipeline-infrastructure/index.md). To add event specifications to a tracking plan, use the [tracking design skill](/docs/ai/skills/tracking-design/index.md). To investigate why events are failing, use the [troubleshooting skill](/docs/ai/skills/troubleshooting/index.md).

## Understand how the skill works

The skill follows the same three rules for every change:

1. Read before writing: the assistant lists or fetches the existing resources first, such as the enrichments on a pipeline or the alerts you already have, so it doesn't duplicate or overwrite something by mistake.
2. Confirm before changing: the assistant shows you the proposed change and waits for your approval. It never creates, updates, or deletes a resource without it.
3. Offer to verify: after the change, the assistant offers to take you to the relevant Console page so you can check the result.

:::note[Nothing changes without your approval]
The assistant asks you to confirm every create, update, and delete before it calls the tool that makes the change. Deleting a data quality alert can't be undone, so check the alert name before you confirm.
:::

The assistant works with the permissions of your Console login, or of the API key if you connect with one, so it can see and change only what those allow. If you connect with a Console API key, it can do anything the key allows. To limit the assistant to reading, grant only the **View** level when you create the key. See [Authentication](/docs/ai/snowplow-mcp/index.md#authentication).

Some changes stay in the Console UI. For example, the skill can't create or delete pipelines, and it can create source applications but not change existing ones.

## Review what the skill changes

Each kind of resource has its own rules. Check them against the assistant's proposal before you confirm a change.

| Resource | What the skill can do | What to know before you confirm |
| --- | --- | --- |
| Enrichments | Enable or disable an enrichment on a pipeline, and update its parameters, such as the cookies the cookie extractor reads | The update replaces the enrichment's whole configuration, and it triggers a pipeline reconfiguration. The pipeline must be in a ready state |
| Data quality alerts | Create, update, or delete alerts that notify you about [failed events](/docs/fundamentals/failed-events/index.md) by email or Slack | Slack alerts need the Slack integration set up first, and the Slack channel ID |
| Source applications | Create a source application with its tracker platform, application IDs, and entities | Every event specification in a linked tracking plan inherits the source application's entities |
| Tracking plans | Create a tracking plan with a name and description, and edit its name, description, domain, and access instructions | Only the fields you name change. Locked tracking plans can't be edited |

### Change an enrichment safely

An enrichment update is a full replacement, not a patch. To add a cookie to the [cookie extractor enrichment](/docs/pipeline/enrichments/available-enrichments/cookie-extractor-enrichment/index.md), for example, the assistant reads the current configuration, shows you the `cookies` array, asks which cookies to add, and sends the complete updated configuration. If it sent only the new cookie, the existing ones would be lost.

Every enrichment update triggers a pipeline reconfiguration, which can briefly affect event processing. An invalid configuration can stop the pipeline from processing data. Test the change on a [development environment](/docs/testing/snowplow-micro/console/index.md) first, then deploy the tested configuration to your pipeline, as described in [Manage enrichments in Console](/docs/pipeline/enrichments/managing-enrichments/index.md).

Never paste credentials, API keys, or salts into the conversation. For enrichments that need secrets, share them with Snowplow Support through the process in [Manage enrichments in Console](/docs/pipeline/enrichments/managing-enrichments/index.md).

### Choose an alert type and filters

A data quality alert is either an immediate alert or a periodic digest. You can narrow it by application ID, by issue type (`ValidationError` or `ResolutionError`), or to specific schemas. The skill can't set alert thresholds or time windows, so set those in Console. Before it proposes a new alert, the assistant checks your existing alerts for one that already does the same job. For how alerts behave once they're set up, see [Failed event alerts](/docs/monitoring/alerts/failed-event-alerts/index.md).

## Try example prompts

Describe the change in your own words, and name the pipeline, alert, source application, or tracking plan if you know it. The assistant asks follow-up questions where it needs more detail. Try prompts like these:

- "Which enrichments are disabled on my development environment? Enable ASN lookup and bot detection there, and show me the configuration before you publish it."
- "Add the `consent_status` cookie to the cookie extractor enrichment on the staging pipeline. Keep the cookies that are already there."
- "Create a Slack alert for validation errors from the `web-checkout` app ID. Check first that I don't already have one."
- "Set up an email digest of failed events for the production pipeline."
- "Delete the `checkout-errors-old` data quality alert."
- "Register our iOS app as a source application with the app IDs `shop-ios` and `shop-ios-dev`."
- "Rename the Checkout tracking plan to Checkout v2 and update its description."

Tracking plans were previously called data products.
