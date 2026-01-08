---
position: 5
title: "Use the Snowplow CLI MCP tool for strategic analysis and planning"
sidebar_label: "Analyze and plan tracking"
---

Beyond creating individual files, AI assistants can help analyze tracking requirements and suggest comprehensive solutions. Here are some example prompts to guide strategic planning using the Snowplow CLI MCP tool.

## Business process analysis

```txt
We want to track user engagement on our blog
```

The assistant will suggest:
- Page view events with article entities
- Custom events for shares and subscriptions
- Reading progression metrics
- Time-based engagement tracking

## Schema evolution planning

```txt
Our `product_viewed` event is missing data about where users found the product
```

The assistant will provide:
- Recommendations for adding entities
- Versioning strategy
- Guidelines for maintaining consistency with related events

## Journey mapping

```txt
Create a data product for our checkout funnel
```

The assistant will create:
- Complete tracking plan covering cart management through payment
- Error state tracking
- Abandonment scenario tracking

## Cross-platform consistency

```txt
We're adding mobile app tracking to our existing web tracking
```

The assistant will analyze:
- Which entities should be consistent across platforms
- Platform-specific entities needed
- Data product structure recommendations
