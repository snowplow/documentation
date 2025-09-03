---
position: 1
title: Introduction
---

Welcome to the [Snowplow Signals](/docs/signals/) Quick Start tutorial.

Snowplow Signals is a real-time personalization engine for customer intelligence, built on Snowplow's behavioral data pipeline. It allows you to compute, access, and act on in-session stream and historical user data, in near real time.

This guide will walk you through the steps to calculate user behavior attributes from your Snowplow event stream, and retrieve them for use in your application. This will unlock real-time personalization use cases for your business.

It should take less than 10 minutes from starting to retrieving calculated attributes.

## Prerequisites

This tutorial assumes that you have:

* Snowplow page view tracking on a web application
* Snowflake warehouse
* A Signals connection

## Connecting to Signals

Log in to [Console](https://console.snowplowanalytics.com) and navigate to the **Signals** section.

If your Overview page looks like this, you'll need to [set up a Signals connection](/docs/signals/configuration/) to deploy the required infrastructure:

<!-- TODO image initial landing page no deployment -->

If it looks like this, continue with the tutorial:

<!-- TODO image overview page with connection -->
