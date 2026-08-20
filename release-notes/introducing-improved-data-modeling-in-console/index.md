---
title: "Introducing improved data modeling in Console"
description: "This week we are rolling out a new data modeling feature, which will replace the existing Console flows for setting up out-of-the-box and custom data models."
date: "2026-03-02"
update_type:
  - "Product news"
components:
  - "Data models"
  - "Console"
---
This week we are rolling out a new data modeling feature, which will replace the existing Console flows for setting up out-of-the-box and custom data models.

**Going forward, this will be the only way to add data models to Console.**

**All your existing models will continue running as before.**

### Highlights

Data modeling is a great way to get more value out of your Snowplow data. The new data modeling feature gives you more control and flexibility for scheduling and running data models through Snowplow Console.

You can bring your own Git repository with a dbt project and use Console to configure when the models should run and what dbt commands should be executed.

The data modeling jobs will now run in your cloud account associated with Snowplow, which means you can take advantage of a more secure warehouse connection through VPC Peering or AWS PrivateLink.

For more details on the new feature, please see [the documentation](/docs/modeling-your-data/running-data-models-via-console/).

### What is changing

Previously, Console supported two ways of adding data models:

* _Out-of-the-box models_, limited to Snowplow’s Unified Digital, Attribution, Media and Ecommerce models
* _Custom models_, using a dbt project configured within a Snowplow-provided Git repository

The new feature addresses many limitations of both of these:

|                                                 |                            |                    |                 |
| ----------------------------------------------- | -------------------------- | ------------------ | --------------- |
|                                                 | Out-of-the-box data models | Custom data models | The new feature |
| Fully self-served setup                         | ✅                          | ❌                  | ✅               |
| Full control over the dbt project configuration | ❌                          | ✅                  | ✅               |
| Support for dbt projects with multiple models   | ❌                          | ❌                  | ✅               |
| “Run now” functionality                         | ✅                          | ❌                  | ✅               |
| Bring your own Git repository                   | ❌                          | ❌                  | ✅               |
| Models run in your cloud account                | ❌                          | ❌                  | ✅               |

### Migrating

All your existing data models will continue to run as before, and you can still alter their schedules.

All new data models will have to be added through the new feature.

In the future, we are planning to work on a semi-automated migration for your existing models. We will provide more details when available. In the meantime, you can also manually re-create your existing setup through the new flow if you wish to benefit from the new features.
