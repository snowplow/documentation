---
title: "What is Try Snowplow?"
date: "2020-11-23"
sidebar_position: 0
---

Try Snowplow enables you to explore how Snowplow can help you solve your data use cases by:

- Collecting granular, well-structured data from your digital products and model, analyse and visualize it in your BI tool of choice. 
- Exploring the recipe library to see how Snowplow approaches common data use cases such as marketing attribution, content recommendations or building a single customer view.

[Sign up for Try Snowplow](https://try.snowplowanalytics.com)

## How does Try Snowplow compare to Snowplow BDP?

Try Snowplow is a minified version of the Snowplow BDP technology that uses the same core components as Snowplow BDP, but is:

- Free
- Fast (setup in less than 5 minutes)
- Non-scalable (unsuitable for production workloads)

<table><tbody><tr><td></td><td class="has-text-align-center" data-align="center"><strong>Try Snowplow</strong></td><td class="has-text-align-center" data-align="center"><strong>Snowplow BDP</strong></td></tr><tr><td>Hosted in your own cloud</td><td class="has-text-align-center" data-align="center">✗</td><td class="has-text-align-center" data-align="center">AWS, GCP</td></tr><tr><td>First-party server cookies</td><td class="has-text-align-center" data-align="center">✗</td><td class="has-text-align-center" data-align="center"><strong>✓</strong></td></tr><tr><td>Unlimited sources</td><td class="has-text-align-center" data-align="center"><strong>✓</strong></td><td class="has-text-align-center" data-align="center"><strong>✓</strong></td></tr><tr><td>Custom data structures</td><td class="has-text-align-center" data-align="center">✗</td><td class="has-text-align-center" data-align="center"><strong>✓</strong></td></tr><tr><td>Available enrichments</td><td class="has-text-align-center" data-align="center">7</td><td class="has-text-align-center" data-align="center">16</td></tr><tr><td>Custom enrichments</td><td class="has-text-align-center" data-align="center">✗</td><td class="has-text-align-center" data-align="center"><strong>✓</strong></td></tr><tr><td>Bad rows</td><td class="has-text-align-center" data-align="center"><strong>✓</strong> (no UI)</td><td class="has-text-align-center" data-align="center"><strong>✓</strong> (with monitoring and diagnosis UI)</td></tr><tr><td>Load data into warehouse</td><td class="has-text-align-center" data-align="center">Postgres</td><td class="has-text-align-center" data-align="center">Redshift, Snowflake, BigQuery</td></tr><tr><td>Load data into lake</td><td class="has-text-align-center" data-align="center">✗</td><td class="has-text-align-center" data-align="center">S3, GCS</td></tr><tr><td>Data available in-stream</td><td class="has-text-align-center" data-align="center">✗</td><td class="has-text-align-center" data-align="center">Kinesis, PubSub, Azure Event Streams</td></tr><tr><td>Maximum throughput</td><td class="has-text-align-center" data-align="center">50 events per second*</td><td class="has-text-align-center" data-align="center">Unlimited</td></tr><tr><td>Autoscaling</td><td class="has-text-align-center" data-align="center">✗</td><td class="has-text-align-center" data-align="center"><strong>✓</strong></td></tr><tr><td>SLAs</td><td class="has-text-align-center" data-align="center">✗</td><td class="has-text-align-center" data-align="center"><strong>✓</strong></td></tr><tr><td>Time limit</td><td class="has-text-align-center" data-align="center">14 days</td><td class="has-text-align-center" data-align="center">Unlimited</td></tr></tbody></table>

_\* any events above this cap will be dropped_

## How do I get started?

There are only a handful of steps you need to take to get started with Try Snowplow:

- [Sign up for Try Snowplow](https://try.snowplowanalytics.com)
- [Instrument tracking](/docs/migrated/try-snowplow/tracking-events-with-try-snowplow/)
- [Query your data](/docs/migrated/try-snowplow/accessing-and-querying-your-try-snowplow-data/) and [explore recipes](/docs/migrated/try-snowplow/recipes/)
