---
position: 1
title: Introduction
---

# Introduction

This tutorial demonstrates how to implement an Abandoned Browse tracking and re-engagement system using Snowplow, Snowflake, and Census. This solution helps e-commerce businesses identify and re-engage users who have shown interest in products but haven't completed a purchase.

## Prerequisites

- An eCommerce website with a product catalog to track events from
- Snowplow instance
    - [Localstack](https://github.com/snowplow-incubator/snowplow-local) (Recommended)
    - [Community Edition](/docs/get-started/snowplow-community-edition)
    - BDP Enterprise if you're already a customer
- Access to a data warehouse (e.g. [Snowflake](https://www.snowflake.com))
- [Census Reverse ETL](https://www.getcensus.com) or Snowplow Reverse ETL
- Marketing automation platform (e.g. [Braze](https://www.braze.com))

## What You'll Learn

- How to implement product view tracking using Snowplow's JavaScript tracker
- Setting up time-on-page tracking to measure user engagement
- Creating SQL queries to identify abandoned browse behavior
- Implementing Reverse ETL workflows to sync data to marketing platforms
- Building automated re-engagement campaigns

## Business Outcomes

- Identify users showing genuine interest in products
- Measure product engagement through view time and interaction
- Create targeted re-engagement campaigns
- Increase conversion rates through personalized messaging
- Track campaign effectiveness and ROI

## Similar Use Cases

This solution can be adapted for:

1. **Abandoned Cart Recovery**: Extend the tracking to include cart additions and checkout steps
2. **Product Recommendations**: Use viewing patterns to suggest related items
3. **Category Affinity Analysis**: Understand user preferences across product categories
4. **Price Drop Alerts**: Notify users when viewed items go on sale
5. **Inventory Alerts**: Alert users when viewed out-of-stock items become available

By following this tutorial, you'll establish a complete abandoned browse tracking and re-engagement system that can be expanded to support various e-commerce marketing initiatives.

## Next Step

Proceed to the [Tracking Setup](./tracking-setup.md) step to implement the tracking setup.