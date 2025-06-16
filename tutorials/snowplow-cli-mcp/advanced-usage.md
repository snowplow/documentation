---
position: 4
title: Advanced Usage & AI Analysis
---

# Advanced Usage & AI Analysis

## Data Product Creation

> Create a data product for e-commerce product interactions. Include:
> - Product page views
> - Add to cart events  
> - A source application for our website
> - Proper validation of all components

The assistant will:
1. Create the necessary data structures for events (locally)
2. Create a source application definition (locally)
3. Create a data product linking everything together (locally)
4. Validate all components together (including cross-references)

**Publishing to Console**: Once you're satisfied with your local files, use `snowplow-cli dp publish` and `snowplow-cli ds publish` to sync them to BDP Console.

## Beyond Text Editing: AI-Powered Analysis

The real power of the Snowplow CLI MCP tool isn't just natural language file creation - it's the AI's ability to analyze, infer, and guide your tracking strategy:

### Business Logic Analysis
Instead of manually figuring out what to track, describe your business process:
- **You say**: "We want to track user engagement on our blog".
- **AI infers**: Need both standard page_view events enhanced with article context, plus custom events for shares/subscriptions, reading progression metrics, and time-based engagement.

### Schema Evolution Guidance  
When existing tracking needs updates:
- **You say**: "Our product_viewed event is missing context about where users found the product"
- **AI suggests**: Add context entities rather than breaking schema changes, proper versioning strategy, and related events that should stay consistent

### Complete Journey Mapping
Describe high-level goals and get comprehensive tracking plans:
- **You say**: "Create a data product for our checkout funnel"  
- **AI designs**: Complete user journey from cart management through payment, including error states and abandonment points you might have missed

### Cross-Platform Strategy
When expanding to new platforms:
- **You say**: "We're adding mobile app tracking to our existing web tracking"
- **AI identifies**: Which entities should be consistent across platforms, platform-specific contexts needed, and how to structure shared vs. separate data products

The AI understands Snowplow patterns, business processes, and data governance - making it a strategic partner, not just a faster way to write YAML.