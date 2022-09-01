---
title: "What is Snowplow Open Source?"
date: "2020-11-24"
sidebar_position: 0
---

Snowplow Open Source is an event data collection platform for data teams who want to manage the collection and warehousing of data across all their platforms and channels, in real-time.

Snowplow is a complete, loosely coupled platform that lets you capture, store and analyse granular customer-level and event-level data:

- Drill down to individual customers and events
- Zoom out to compare behaviours between cohorts and over time
- Join web analytics data with other data sets (e.g. CRM, media catalogue, product catalogue, offline data)
- Segment your audience by behaviour
- Develop recommendations and personalisations engines

Snowplow has been technically designed to:

- Give you access, ownership and control of your own web analytics data (no lock in)
- Be loosely coupled and extensible, so that it is easy to add e.g. new trackers to capture data from new platforms (e.g. mobile, TV) and put the data to new uses

## Getting started

We have built a set of [terraform](https://registry.terraform.io/namespaces/snowplow-devops) modules, which automates the setting up & deployment of the required infrastructure & applications for an operational Snowplow open source pipeline, with just a handful of input variables required on your side.

[Quick Start Installation Guide on AWS](/docs/open-source-quick-start/quick-start-installation-guide-on-aws/index.md)

You can also follow our guides to understand how to set up and configure Snowplow pipeline components across AWS or GCP.

[Setup Snowplow on AWS](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/index.md)

[Setup Snowplow on GCP](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-gcp/index.md)
