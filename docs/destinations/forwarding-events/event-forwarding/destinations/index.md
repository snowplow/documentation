---
title: "Supported destinations"
sidebar_position: 10
---

Event Forwarding supports third-party destinations through pre-built integrations that handle authentication, field mapping, and API-specific requirements.

## Current destinations

### Marketing and customer engagement

#### Braze
Send user attributes, custom events, and purchase data to Braze for personalized messaging and campaign automation.

- **API**: [Users Track API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track/)
- **Event types**: User attributes, custom events, purchases
- **Authentication**: REST API key
- **Setup guide**: [Braze destination setup](braze.md)

### Product analytics

#### Amplitude
Forward events to Amplitude for product analytics, user behavior tracking, and funnel analysis.

- **API**: [HTTP V2 API](https://amplitude.com/docs/apis/analytics/http-v2)
- **Event types**: Custom events with user properties
- **Authentication**: API key
- **Setup guide**: Contact your Snowplow account team

## Real-time Infrastructure

These destinations were previously available as native integrations and continue to be supported through Event Forwarding or Snowbridge:

### Elasticsearch
Stream enriched events to Elasticsearch for search and analytics.

- **Community Edition**: Use [Snowbridge](/docs/destinations/forwarding-events/snowbridge/)
- **Snowplow BDP**: Available through Console

### Apache Kafka
Forward events to Kafka for stream processing and data integration.

- **Community Edition**: Use [Snowbridge](/docs/destinations/forwarding-events/snowbridge/)
- **Snowplow BDP**: Available through Console

### Azure Event Hubs
Stream data to Event Hubs for Azure-based analytics pipelines.

- **Community Edition**: Use [Snowbridge](/docs/destinations/forwarding-events/snowbridge/)
- **Snowplow BDP**: Available through Console

## Requesting new destinations

If you don't see your destination listed, choose from these options:

1. **Request a new destination**: Contact your Snowplow account team to request support for additional SaaS platforms
2. **Use Snowbridge**: Create a custom HTTP target using [Snowbridge](/docs/destinations/forwarding-events/snowbridge/) for any HTTP API
3. **Custom integration**: Build your own integration using [custom integrations](/docs/destinations/forwarding-events/custom-integrations/)

Priority for new destinations is based on customer demand and API compatibility.