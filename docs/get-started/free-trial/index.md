---
title: "Snowplow free trial"
sidebar_position: 3
sidebar_label: "Free trial"
description: "Start a free 14-day trial of Snowplow CDI Cloud, and learn about the product and capacity limitations that apply during the trial."
keywords: ["free trial", "Snowplow trial", "CDI Cloud", "14-day trial", "trial limitations", "getting started"]
date: "2026-06-16"
---

The Snowplow free trial is a 14-day trial of [Snowplow CDI Cloud](/docs/get-started/index.md#cdi-cloud). Snowplow hosts and manages the pipeline infrastructure, so you can collect, validate, and load behavioral data without setting up any cloud infrastructure yourself.

Use the trial to evaluate Snowplow end to end: define your data, send events from your application, and load validated data into a warehouse or lake destination.

## Start the trial

Sign up for the free trial on the [Snowplow website](https://snowplow.io/get-started/snowplow-free-trial).

After you sign up, your trial environment is provisioned automatically. You will receive access instructions within around 20 minutes.

The trial runs for 14 days. To request an extension, [contact sales](https://console.snowplowanalytics.com/contact-us).

## Product limitations

Some Snowplow features are not available during the trial:

* First-party tracking using your own domain is not available.
* Some destinations are not available during the trial. [Contact sales](https://console.snowplowanalytics.com/contact-us) to discuss your requirements.

## Capacity limits

The trial includes a limited set of resources that do not scale:

* Destinations are limited to:
  * one [Micro](/docs/testing/snowplow-micro/index.md) instance
  * one [warehouse or lake destination](/docs/destinations/warehouses-lakes/index.md)
  * one [event forwarding destination](/docs/destinations/forwarding-events/index.md)
* Collector-level rate limits apply.
* Pipeline, [Signals](/docs/signals/index.md), and [Identities](/docs/identities/index.md) resources are limited and do not scale during the trial.

:::note[Beyond the trial]
For the full set of features available in Snowplow CDI, see the [feature comparison](/docs/get-started/feature-comparison/index.md).
:::
