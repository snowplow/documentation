---
position: 1
title: "Learn how to set up Signals for real-time calculation"
sidebar_label: "Introduction"
description: "Get started with Snowplow Signals to calculate user behavior attributes in real time, to build personalization use cases."
keywords: ["snowplow signals", "real-time attributes"]
---

<NotebookLinks path="snowplow-incubator/signals-notebooks/blob/main/quickstart.ipynb" />

Welcome to the [Snowplow Signals](/docs/signals/introduction/) Quick Start tutorial.

Snowplow Signals computes attributes from your behavioral data in real time and serves them to your applications over an API. It works with both in-session stream data and historical warehouse data.

This guide will walk you through the steps to calculate user behavior attributes from your Snowplow event stream, and to retrieve them for use in your application. This will unlock real-time personalization use cases for your business.

It should take less than 10 minutes from starting to retrieving calculated attributes.

This tutorial shows how to define attributes using the Snowplow Console UI, as well as programmatically using the [Signals Python SDK](https://pypi.org/project/snowplow-signals/).

## Prerequisites

This tutorial assumes that you have:

* A web application you can add the Snowplow JavaScript tracker to, with page view tracking
* Snowflake warehouse
* Signals enabled on your Snowplow account

:::note[Snowplow account required]
You don't need to run a Snowplow pipeline first. If you don't have an account, sign up for the [Signals free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral), which includes event collection, to follow along.
:::

## Enable Signals

Log in to [Console](https://console.snowplowanalytics.com) and navigate to the **Signals** section.

If Signals isn't enabled for your organization yet, follow [Set up Signals](/docs/signals/setup/) first.
