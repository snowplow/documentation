---
position: 1
title: Introduction
---

Welcome to the [Snowplow Signals](/docs/signals/) batch engine tutorial.

Snowplow Signals is a real-time personalization engine for customer intelligence, built on Snowplow's behavioral data pipeline. It allows you to compute, access, and act on in-session stream and historical user data, in near real time.

The Signals batch engine is a CLI tool to help with historical data analysis. It isn't required to use Signals: it's only necessary if you want to:
* Analyze historical data, rather than in real time
* Calculate attributes from Snowplow events in your warehouse

The batch engine helps by:
* Generating separate dbt projects for each batch view definition
* Testing and validating your data pipelines
* Materializing calulated attributes to Signals for production use

To use tables of pre-existing, already calculated values, see the [Signals documentation](/docs/signals/configuration/batch-calculations).

This guide will walk you through the steps to set up the batch engine and calculate attributes.

## Prerequisites

This tutorial assumes that you have:

* Python 3.11+ installed in your environment
* Snowflake warehouse with tables of Snowplow events
* Permissions to create tables and views in your warehouse
* [dbt](https://www.getdbt.com/) configured in your warehouse
* Basic [dbt](https://www.getdbt.com/) knowledge
* Valid API credentials for your Signals account:
  * Signals API URL
  * Snowplow API key
  * Snowplow API key ID
  * Snowplow organization ID
* BatchView definitions already applied to Signals

Check out the [Signals configuration](/docs/signals/configuration) documentation to find out how to generate these credentials, and how to apply attribute configurations.
