---
position: 4
title: Advanced usage and AI analysis
---

# Advanced usage and AI analysis

## Data product creation

```
Create a data product for e-commerce product interactions. Include:
- Product page views
- Add to cart events
- A source application for our website
- Proper validation of all components
```

The assistant will:
1. Create the necessary data structures for events (locally)
2. Create a source application definition (locally)
3. Create a data product linking everything together (locally)
4. Validate all components together (including cross-references)

**Publishing to Console**: Once you're satisfied with your local files, use `snowplow-cli dp publish` and `snowplow-cli ds publish` to sync them to BDP Console.

## Analysis and strategy support

Beyond creating individual files, AI assistants can help analyze tracking requirements and suggest comprehensive solutions:

### Business process analysis
```
We want to track user engagement on our blog
```

The assistant will suggest:
- Page view events with article context
- Custom events for shares and subscriptions
- Reading progression metrics
- Time-based engagement tracking

### Schema evolution planning
```
Our product_viewed event is missing context about where users found the product
```

The assistant will provide:
- Recommendations for adding context entities
- Versioning strategy
- Guidelines for maintaining consistency with related events

### Journey mapping
```
Create a data product for our checkout funnel
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
- Data product structure recommendations
