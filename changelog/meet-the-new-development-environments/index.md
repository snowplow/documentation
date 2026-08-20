---
title: "Meet the new development environments"
description: "We are excited to announce an easier to use and more secure replacement for Snowplow Mini."
date: "2026-03-03"
update_type:
  - "Product news"
components:
  - "Console"
  - "Testing"
---
We are excited to announce an easier to use and more secure replacement for Snowplow Mini.

### What’s new

You might already know Snowplow Micro as a tool for testing your schemas, tracking code and enrichments locally.

AWS and GCP customers will also be familiar with Snowplow Mini — a similar testing tool integrated into Console as a development environment (aka “sandbox”).

With this release, we are bringing Snowplow Micro to Console as a replacement for Snowplow Mini.

Here are the key improvements:

* You can **set up** (and delete) new Micro instances **in minutes** — perfect for multiple teams
* Development environments are now **available on Azure,** not just AWS and GCP
* Micro integrates with **Console SSO**, instead of requiring a username and password
* Micro brings an **easier to use UI**, developed with Snowplow data in mind, replacing OpenSearch dashboard / Kibana
* **Data is preserved** when Micro is restarted or when you patch schemas
* There are fewer components and no AMIs are involved, dramatically **reducing** the surface area for **security vulnerabilities**

### Setting up

Head to the documentation to learn how to [set up a development environment](/docs/testing/snowplow-micro/console/) based on Snowplow Micro and [how to use its user interface](/docs/testing/snowplow-micro/ui/).

### Migration

We encourage all customers to migrate from Mini to Micro. After you deploy your Micro instance, our Support Team can optionally point the existing Mini URL to Micro, avoiding the need to change tracking code on your end.

Existing Mini instances will continue working as before, however it is no longer possible to deploy new ones.
