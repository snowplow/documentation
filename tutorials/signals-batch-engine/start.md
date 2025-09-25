---
position: 1
title: Introduction
description: "Set up the Snowplow Signals batch engine to calculate historical behavioral data attributes from warehouse data using dbt."
---

Welcome to the [Snowplow Signals](/docs/signals/) batch engine tutorial.

Snowplow Signals is a real-time personalization engine for customer intelligence, built on Snowplow's behavioral data pipeline. It allows you to compute, access, and act on in-session stream and historical user data, in real time.

The Signals batch engine is a CLI tool to create the attributes in your warehouse to compute over larger historical data that otherwise would not be possible / efficient to do so in real time. It isn't required to use Signals: it's only necessary if you want to:
* Calculate attributes from Snowplow events in your warehouse
* Sync those attributes to the Profiles Store so they can be served in real time alongside stream attributes

The batch engine helps by:
* Generating separate dbt projects for each batch attribute group definition
* Building efficient modeled datasets at different aggregation levels, instead of querying directly against large atomic event tables
* Producing attributes tables optimized for downstream use
* Syncing the calculated attributes to Signals, making them available for production use

To use tables of pre-existing, already calculated values, read up on external batch sources in the [Signals documentation](/docs/signals/concepts/).

This guide will walk you through the steps to set up the batch engine and calculate attributes.

## Prerequisites

This tutorial assumes that you have:

* Python 3.11+ installed in your environment
* Snowflake or BigQuery warehouse with your atomic Snowplow events ready to use as the data source
* [dbt](https://www.getdbt.com/) with your warehouse [target](https://docs.getdbt.com/reference/dbt-jinja-functions/target) set up
* Basic [dbt](https://www.getdbt.com/) knowledge
* Valid API credentials for your Signals account:
  * Signals API URL
  * Snowplow API key
  * Snowplow API key ID
  * Snowplow organization ID
* Batch attribute groups already created for Signals, but not yet published

The batch source configuration can't be done before the attributes table has been created.

Check out the [Signals configuration](/docs/signals/) documentation to find out where to find these credentials, and how to apply attribute configurations.
