---
position: 1
title: Introduction
---

Welcome to the [Snowplow Signals](/docs/signals/) Quick Start tutorial.

Snowplow Signals is a real-time personalization engine for customer intelligence, built on Snowplow's behavioral data pipeline. It allows you to compute, access, and act on in-session stream and historical user data, in near real time.

This guide will walk you through the steps to calculate user behavior attributes from your Snowplow event stream, and retrieve them for use in your application. This will unlock real-time personalization use cases for your business.

## Prerequisites

This tutorial assumes that you have:

* Python 3.12+ installed in your environment
* Basic Python and [Jupyter notebook](https://jupyter.org/) knowledge
* Deployed Snowplow page view tracking from a web application
* Snowflake warehouse
* Valid API credentials for your Signals account:
  * Signals API URL
  * Snowplow API key
  * Snowplow API key ID
  * Snowplow organization ID

Check out the [Signals configuration](/docs/signals/configuration) documentation to find out how to generate these credentials.

## Interactive version

Try out an interactive version of this tutorial on Google Colab [here](https://colab.research.google.com/drive/1ExqheS4lIuJRs0wk0B6sxaYfnZGcTYUv).

You'll need to log in with a Google account to use the Colab notebook.
