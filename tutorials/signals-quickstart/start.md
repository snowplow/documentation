---
position: 1
title: "Introduction to Signals quick start"
sidebar_label: "Introduction"
description: "Get started with Snowplow Signals to calculate user behavior attributes in real time, to build personalization use cases."
---

Welcome to the [Snowplow Signals](/docs/signals/) Quick Start tutorial.

Snowplow Signals is a real-time personalization engine for customer intelligence, built on Snowplow's behavioral data pipeline. It allows you to compute, access, and act on in-session stream and historical user data, in real time.

This guide will walk you through the steps to calculate user behavior attributes from your Snowplow event stream, and to retrieve them for use in your application. This will unlock real-time personalization use cases for your business.

It should take less than 10 minutes from starting to retrieving calculated attributes.

This tutorial shows how to define attributes using the Snowplow Console UI, as well as programmatically using the [Signals Python SDK](https://pypi.org/project/snowplow-signals/).

## Prerequisites

This tutorial assumes that you have:

* Snowplow page view tracking on a web application
* Snowflake warehouse
* A Signals connection

## Connecting to Signals

Log in to [Console](https://console.snowplowanalytics.com) and navigate to the **Signals** section.

You'll need to [set up a Signals connection](/docs/signals/connection/) if you don't have one yet.
