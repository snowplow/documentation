---
title: "The Snowplow mobile data model"
date: "2022-04-04"
sidebar_position: 20
---

## Overview

The Snowplow mobile data model aggregates Snowplow's out-of-the-box mobile events to create a set of derived tables - screen views, sessions, and users. These contain many useful dimensions, as well as calculated measures such as screen views per session.

![](images/Screenshot-2022-03-25-at-10.50.33.png)

The model runs incrementally, processing new events and previously modelled events for which there is new information with every run. This avoids the costly reprocessing of previously modelled events which are unchanged. The incremental logic is separate from the logic that does the calculations for the tables so as to make customisation of the model easier.

# Running the mobile data model

There are two ways you can run the Snowplow Mobile data model, with [sql-runner](https://github.com/snowplow/sql-runner) or [dbt](https://github.com/dbt-labs/dbt). Below are guides to help you get started.
