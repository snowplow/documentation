---
title: "Set up Snowplow Self-Hosted"
date: "2020-10-30"
sidebar_position: 4
sidebar_label: "Setting up Self-Hosted"
description: "Deploy Snowplow Community Edition yourself with Terraform modules on AWS, GCP, or Azure. Self-hosting is optional: the hosted free trial needs no infrastructure."
keywords: ["Self-Hosted", "Community Edition", "Terraform", "self-hosted deployment", "Snowplow setup"]
---

```mdx-code-block
import LicenseNotice from '@site/docs/get-started/self-hosted/_license-notice.md';
```

Self-hosting is one of the ways to run Snowplow, and it is optional. If you want to evaluate Snowplow, or run it without operating the infrastructure yourself, start with a hosted environment instead: the [free trial](/docs/get-started/free-trial/index.md) is provisioned by Snowplow in around 20 minutes, and the [quickstart](/docs/get-started/quickstart/index.md) takes you from sign-up to validated events. Self-Hosted is for teams that want to deploy and operate the pipeline in their own cloud account, with the [deployment options](/docs/get-started/index.md) describing the managed alternatives.

This page is an introduction for the [Self-Hosted](/docs/get-started/index.md#self-hosted) [Quick Start guide](docs/get-started/self-hosted/quick-start/index.md). Follow the Quick Start to set up a self-hosted deployment.

We have built a set of [terraform](https://www.terraform.io/docs/language/modules/develop/index.html) modules, which automates the setup and deployment of the required infrastructure and applications for an operational Snowplow Community Edition pipeline, with just a handful of input variables required on your side.

After following this guide, you will be able to: 

- Collect granular, well-structured data with our suite of web, mobile and server side [SDKs](/docs/sources/index.md)
- Create your own [custom events](/docs/fundamentals/events/index.md#self-describing-events) and [entities](/docs/fundamentals/entities/index.md#custom-entities)
- Easily enable and disable our suite of [out-of-the-box enrichments](/docs/pipeline/enrichments/available-enrichments/index.md)
- Consume your rich data from the data warehouse, database, lake and/or real-time stream

<LicenseNotice/>

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
