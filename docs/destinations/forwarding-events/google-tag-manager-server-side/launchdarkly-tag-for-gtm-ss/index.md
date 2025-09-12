---
title: "LaunchDarkly Tag for GTM SS"
description: "Send behavioral events to LaunchDarkly feature management platform via Google Tag Manager Server-Side."
schema: "TechArticle"
keywords: ["LaunchDarkly Tag", "Feature Flags", "A/B Testing", "Feature Management", "GTM LaunchDarkly", "Experimentation"]
sidebar_position: 600
---

The [LaunchDarkly Tag for GTM SS](https://github.com/snowplow/snowplow-gtm-server-side-launchdarkly-tag) allows events to be forwarded to LaunchDarkly using its [metric import REST API](https://docs.launchdarkly.com/home/creating-experiments/import-metric-events). This Tag works best with events from the Snowplow Client, but can also work with events from other GTM SS Clients such as GAv4.

## Template Installation

:::note

The server Docker image must be 2.0.0 or later.

:::

### Tag Manager Gallery

Coming soon!

## LaunchDarkly Tag Setup

With the template installed, you can now add the LaunchDarkly Tag to your GTM SS Container.

1. From the Tag tab, select "New", then select the LaunchDarkly Tag as your Tag Configuration.
2. Select your desired Trigger for the events you wish to use as metrics in LaunchDarkly experiments.
3. [Configure](/docs/destinations/forwarding-events/google-tag-manager-server-side/launchdarkly-tag-for-gtm-ss/launchdarkly-tag-configuration/index.md) the Tag.
4. Click Save.
