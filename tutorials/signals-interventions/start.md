---
position: 1
title: "Learn how to implement real-time interventions in an ecommerce app using Signals"
sidebar_label: "Introduction"
description: "Get hands-on with Snowplow Signals, using Snowplow Console, to create real-time personalization."
keywords: ["snowplow signals tutorial", "ecommerce interventions"]
---

Welcome to the **Snowplow Signals** tutorial.

[Snowplow Signals](/docs/signals/introduction/) is a real-time personalization engine for customer intelligence, built on Snowplow's behavioral data pipeline. It allows you to compute, access, and act on in-session stream and historical user data, in real time.

This tutorial provides a hands-on introduction to Signals. You'll use Python to programmatically define attributes, services, and interventions, then test them with a demo ecommerce application.

To follow this tutorial, you'll need a Snowplow account with Signals enabled.

This tutorial should take approximately 20-30 minutes to complete.

## What you'll learn

In this tutorial, you will:

* Set up your Signals connection through Snowplow Console
* Use the Signals Python SDK to define attributes, services, and interventions
* Calculate real-time user behavior metrics from ecommerce events
* Create intervention rules that trigger personalized experiences
* Test your Signals configuration with an interactive demo application

## Deployment

If you have a Snowplow account, you can [enable Signals through Snowplow Console](/docs/signals/setup/). This provides:

* Integration with your existing Snowplow data pipeline
* Access to your production behavioral data
* Full production capabilities and support

## Prerequisites

This tutorial requires:

* Python 3.7 or higher
* A Jupyter notebook environment (local or Google Colab)
* Basic familiarity with Python
* A modern web browser for testing the demo application
* A Snowplow account with Signals enabled
