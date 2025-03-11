---
title: "What to expect from the quick start guide"
sidebar_label: "Before you begin"
sidebar_position: 1
---

We have built a set of [terraform](https://www.terraform.io/docs/language/modules/develop/index.html) modules, which automates the setup and deployment of the required infrastructure and applications for an operational Snowplow Community Edition pipeline, with just a handful of input variables required on your side.

After following this guide, you will be able to: 

- Collect granular, well-structured data with our suite of web, mobile and server side [SDKs](/docs/sources/trackers/index.md)
- Create your own [custom events](/docs/fundamentals/events/index.md#self-describing-events) and [entities](/docs/fundamentals/entities/index.md#custom-entities)
- Easily enable and disable our suite of [out-of-the-box enrichments](/docs/pipeline/enrichments/available-enrichments/index.md)
- Consume your rich data from the data warehouse, database, lake and/or real-time stream

Here’s some key information.

## Required time

If you are proficient with Terraform and cloud tooling, 1 hour should be sufficient. Otherwise, expect to spend a few hours.

## Cost

Assuming around 100 events per second, the pipeline will cost around $200 per month on AWS and $240 per month on GCP.

:::tip

To reduce the costs, you can tweak the configuration (e.g. use smaller instances), or shut down the pipeline when not in use.

:::

## Scale

Out of the box, the deployed pipeline will handle up to ~100 events per second (~9 million events per day).

## Getting help

Check out our [Community](https://community.snowplow.io/). If you run into any problems or have any questions, we are here to help.

If you are interested in receiving the latest updates from Product & Engineering, such as critical bug fixes, security updates, new features and the rest, then [join our mailing list](https://info.snowplow.io/newsletter-signup).
