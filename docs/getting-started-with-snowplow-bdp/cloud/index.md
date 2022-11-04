---
title: "BDP Cloud"
date: "2020-01-30"
sidebar_position: 1
sidebar_label: "🆕 BDP Cloud"
---

# Introduction

BDP Cloud is a hosted and lightweight version of [Snowplow](https://snowplow.io), designed to get your organization up and running and delivering value from behavioural data as quickly as possible. It enables you to create rich and well-structured data to power your advanced analytics and AI use cases.

## How does BDP Cloud differ from BDP Enterprise?
    
BDP Cloud differs from Snowplow BDP Enterprise in the following ways:

- It is hosted by Snowplow, rather than deployed into your cloud account
- It is more limited in terms of the functionality it provides
- It has an event cap of 10m events per month
- We only support Snowflake as a destination currently (although more destinations will be added soon)

For more details, see our [feature comparison page](/docs/feature-comparison/index.md).

## Where is the Snowplow pipeline hosted?
    
All data processed and collected with Snowplow BDP Cloud is undertaken within Snowplow’s own cloud account (AWS `eu-central-1` region). Data is stored in Snowplow’s cloud account for 7 days to provide resilience against potential failures.

For more information, please see our [full product description](https://snowplow.io/).
