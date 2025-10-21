---
position: 1
title: Introduction
description: "Get hands-on with Snowplow Signals using the Sandbox trial environment to create real-time personalization."
---

Welcome to the Snowplow Signals Sandbox tutorial.

Snowplow Signals is a real-time personalization engine for customer intelligence, built on Snowplow's behavioral data pipeline. It allows you to compute, access, and act on in-session stream and historical user data, in real time.

This tutorial provides a hands-on introduction to Signals using the Signals Sandbox, a trial environment where you can experiment with defining attributes, services, and interventions. You'll use Python to programmatically define these concepts and then test them with a demo e-commerce application.

This tutorial should take approximately 20-30 minutes to complete.

## What you'll learn

In this tutorial, you will:

* Deploy a Signals Sandbox instance for testing
* Use the Signals Python SDK to define attributes, services, and interventions
* Calculate real-time user behavior metrics from e-commerce events
* Create intervention rules that trigger personalized experiences
* Test your Signals configuration with an interactive demo application

## What is Signals Sandbox?

Signals Sandbox provides a temporary Signals deployment that you can use to explore the platform without needing a full Snowplow BDP setup. The Sandbox includes:

* A dedicated Profiles API endpoint for your attributes and interventions
* A Snowplow Collector endpoint for tracking events
* Access credentials (Sandbox Token) for authentication
* Limited-time access to experiment with Signals capabilities

## Prerequisites

This tutorial requires:

* Python 3.7 or higher
* A Jupyter notebook environment (local or Google Colab)
* Basic familiarity with Python
* A modern web browser for testing the demo application

:::note

The Signals Sandbox is designed for experimentation and learning. For production use cases, you'll need a [Snowplow BDP](/docs/getting-started-with-snowplow-bdp/) account with [Signals enabled](/docs/signals/connection/).

:::
