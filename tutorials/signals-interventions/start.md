---
position: 1
title: "Learn how to implement real-time interventions in an ecommerce app using Signals"
sidebar_label: "Introduction"
description: "Get hands-on with Snowplow Signals, using Snowplow Console or the Signals Sandbox trial environment, to create real-time personalization."
keywords: ["snowplow signals tutorial", "ecommerce interventions"]
---

Welcome to the **Snowplow Signals** tutorial.

[Snowplow Signals](/docs/signals/) is a real-time personalization engine for customer intelligence, built on Snowplow's behavioral data pipeline. It allows you to compute, access, and act on in-session stream and historical user data, in real time.

This tutorial provides a hands-on introduction to Signals. You'll use Python to programmatically define attributes, services, and interventions, then test them with a demo ecommerce application.

You can follow this tutorial using either:

* **Snowplow Console**: if you have a Snowplow account with Signals enabled
* **Signals Sandbox**: a trial environment where you can experiment without needing a Snowplow account

This tutorial should take approximately 20-30 minutes to complete.

## What you'll learn

In this tutorial, you will:

* Set up your Signals connection (via Console or Sandbox)
* Use the Signals Python SDK to define attributes, services, and interventions
* Calculate real-time user behavior metrics from ecommerce events
* Create intervention rules that trigger personalized experiences
* Test your Signals configuration with an interactive demo application

## Deployment options

### Snowplow Console

If you have a Snowplow account, you can [enable Signals through Snowplow Console](/docs/signals/connection/#snowplow-console). This provides:

* Integration with your existing Snowplow data pipeline
* Access to your production behavioral data
* Full production capabilities and support

### Signals Sandbox

[Signals Sandbox](https://try-signals.snowplow.io/) provides a temporary Signals deployment that you can use to explore the platform without needing a Snowplow account. The Sandbox includes:

* A dedicated Profiles API endpoint for your attributes and interventions
* A Snowplow Collector endpoint for tracking events
* Access credentials (Sandbox Token) for authentication
* Limited-time access to experiment with Signals capabilities

:::note

The Signals Sandbox is designed for experimentation and learning. For production use cases, you'll need a [Snowplow](/docs/get-started/private-managed-cloud/) account with [Signals enabled](/docs/signals/connection/).

:::

## Prerequisites

This tutorial requires:

* Python 3.7 or higher
* A Jupyter notebook environment (local or Google Colab)
* Basic familiarity with Python
* A modern web browser for testing the demo application
* Either a Snowplow account with Signals enabled, or access to Signals Sandbox
