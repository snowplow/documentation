---
position: 4
title: "Next steps from the Snowplow CLI MCP tool tutorial"
sidebar_label: "Next steps"
description: "Advanced use cases for the Snowplow CLI MCP tool, including business process analysis, schema evolution planning, and cross-platform tracking."
keywords: ["Snowplow CLI", "MCP", "schema evolution", "tracking plans", "cross-platform"]
---

Beyond creating individual files, AI assistants can help analyze tracking requirements and suggest comprehensive solutions:

### Business process analysis
```
We want to track user engagement on our blog
```

The assistant will suggest:
- Page view events with article entity
- Custom events for shares and subscriptions
- Reading progression metrics
- Time-based engagement tracking

### Schema evolution planning
```
Our product_viewed event is missing context about where users found the product
```

The assistant will provide:
- Recommendations for adding entities
- Versioning strategy
- Guidelines for maintaining consistency with related events

### Journey mapping
```
Create a tracking plan for our checkout funnel
```

The assistant will create:
- Complete tracking plan covering cart management through payment
- Error state tracking
- Abandonment scenario tracking

### Cross-platform consistency
```
We're adding mobile app tracking to our existing web tracking
```

The assistant will analyze:
- Which entities should be consistent across platforms
- Platform-specific contexts needed
- Tracking plan structure recommendations
