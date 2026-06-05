---
title: "Snowplow Assistant"
sidebar_label: "Snowplow Assistant"
sidebar_position: 50
description: "The Snowplow Assistant is an AI assistant built into Snowplow BDP Console that lets you manage your tracking plans, pipelines, and data quality through natural language."
keywords: ["snowplow assistant", "ai assistant", "ai agent", "natural language", "console", "automation"]
date: "2026-04-10"
---

import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges
  available={['cloud', 'pmc','addon']}
  helpContent="Snowplow Assistant is part of Event Studio, which is a paid addon for Snowplow CDI."
/>

The Snowplow Assistant is an AI assistant embedded in [Snowplow Console](https://console.snowplowanalytics.com). It lets you manage your tracking implementation, monitor pipelines, troubleshoot issues, and configure Signals through natural language conversation.

## How it works

The Snowplow Assistant runs as a chat interface inside the Console. When you send a message, the assistant determines which tools and skills to use, calls the relevant Snowplow APIs on your behalf, and returns the results in a conversational format.

### Permissions

The Snowplow Assistant operates with **your existing Console permissions**. It authenticates using your current session and can only perform actions that your account is authorized to do. It cannot escalate privileges or access resources outside your organization.

Any action that modifies data (creating a schema, updating an enrichment, deleting an alert) requires your explicit confirmation before the assistant proceeds.

### Data privacy

The Snowplow Assistant does not have access to personal data or PII such as names or email addresses. It operates only on Snowplow configuration and metadata (schemas, tracking plans, pipeline settings, failed event error details, and similar).

:::warning[Third-party LLM processing]
To provide this functionality, the content of your messages and the configuration data the assistant retrieves on your behalf are sent to a third-party LLM provider for processing. Do not enter personal data, credentials, or other sensitive information into the chat.
:::

### Enabling and disabling the assistant

You can enable or disable the Snowplow Assistant for your organization from the **Settings** section of the Snowplow Console. When disabled, the chat interface does not appear in the Console for any user in your organization.

:::note
Only users with the Administrator role can enable or disable the Snowplow Assistant.
:::

When enabling the feature for the first time, an admin user must accept the terms and conditions related to LLM usage within the Snowplow product.

### Usage Limits

The Snowplow Assistant has weekly refreshing token limits at the organisation level. The limit is set at a level that under normal usage you will not reach it.

## Capabilities

The assistant provides support across several areas of the Console. It loads specialized skills on demand based on your request.

### Tracking design

Design and implement your event tracking using natural language:

- Create and manage [data structures](/docs/fundamentals/schemas/index.md) (Iglu schemas)
- Create and manage [event specifications](/docs/event-studio/tracking-plans/event-specifications/index.md) with entity contexts
- Create and manage [tracking plans](/docs/event-studio/tracking-plans/index.md)
- Search [Iglu Central](https://github.com/snowplow/iglu-central) for reusable public schemas
- Browse the data catalog to understand what is already being tracked

### Implementation guidance

Get help instrumenting Snowplow trackers in your applications:

- Generate copy-paste-ready tracking code for web, mobile, and server-side platforms
- Look up schema definitions and event specifications for correct implementation
- Follow a guided workflow from instrumentation through to production deployment

### Pipeline management

Explore and understand your pipeline infrastructure:

- List pipelines with their status, collector endpoints, and labels
- View real-time pipeline metrics including throughput, enrichment latency, and bad row rates
- Review collector configuration (CNAME, cookie policy, DNS)
- List and manage enrichments
- View mini and Micro development instances

### Troubleshooting

Diagnose and resolve pipeline issues:

- Investigate [failed events](/docs/fundamentals/failed-events/index.md) with detailed error breakdowns
- Analyze schema validation failures and enrichment errors
- Drill into specific errors by app ID and tracker version
- Get targeted recommendations for fixes

### Data quality

Manage alerts for data quality issues:

- Create and manage data quality alerts via email or Slack
- Filter alerts by app ID, issue type, or data structure
- Update or remove existing alert configurations

### Console operations

Perform day-to-day management tasks:

- View and manage source applications, including their platform, app IDs, and entity definitions
- Navigate directly to relevant Console pages from the chat
- Search and browse the Snowplow documentation

### Signals

If [Signals](/docs/signals/concepts/index.md) is enabled for your organization, the assistant can help you configure and manage it:

- Define and manage attribute keys and attribute groups
- Create services for pull-based attribute access
- Set up interventions for push-based actions
- Test attribute groups against sample data
- Publish and unpublish configurations
- Query real-time attributes for specific users
