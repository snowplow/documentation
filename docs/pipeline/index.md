---
title: "Configure your Snowplow pipeline"
date: "2024-12-04"
sidebar_position: 5
sidebar_label: "Pipeline"
description: "Configure collector settings, manage enrichments, and secure your Snowplow data pipeline infrastructure."
keywords: ["pipeline configuration", "Snowplow pipeline", "collector configuration"]
content_type: landing
---

import AiAssistantInstall from '@site/docs/reusable/ai-assistant-install/_index.md';

![Snowplow pipeline architecture diagram showing data flowing from web, mobile, server-side, pixel, and webhook sources through Collect, Validate, and Enrich stages. Validated events route to a Real-Time Good Stream and on to a data warehouse and BI tools; invalid events route to a Real-Time Bad Stream and Bad Logs.](@site/docs/fundamentals/images/architecture.png)

This section explains how to validate and update your [collector configuration](/docs/pipeline/collector/index.md), manage [enrichments](/docs/pipeline/enrichments/index.md), and has information on [security](/docs/pipeline/security/index.md).

:::tip[Ask your AI assistant]
An AI assistant connected to the Snowplow MCP server can inspect your pipeline configuration, health metrics, and collector settings, and view or update your enrichments. For example: "What's the current status of my production pipeline, and which enrichments are enabled on it?"

<AiAssistantInstall />
:::
