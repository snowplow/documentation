---
title: "Test your Snowplow tracking and pipeline implementation"
sidebar_label: "Testing"
description: "Test and validate your Snowplow tracking implementation using Snowplow Inspector or Micro. Run automated tests and QA your pipeline before deploying to production environments."
keywords: ["testing", "qa", "snowplow micro", "snowplow inspector", "tracking validation"]
date: "2024-12-04"
sidebar_position: 8.5
sidebar_custom_props:
  space_above: true
---

There are a number of ways you can test your tracking implementation and QA your pipeline to follow good data practices.

When implementing new tracking, or when making changes to your schemas or enrichments, we recommend you run testing by sending events to a test environment before deploying your changes to production environments. You can use the [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) or [Snowplow Micro](/docs/testing/snowplow-micro/index.md) to do this.

## Test web tracking using the browser extension

Use the [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) browser extension to validate your web tracking implementation.

## Test schema and enrichment changes with Snowplow Micro

[Snowplow Micro](/docs/testing/snowplow-micro/index.md) is a lightweight version of a Snowplow pipeline that you can use to validate that your schemas, tracking code and enrichments work as expected.

Micro can be deployed [through Console](/docs/testing/snowplow-micro/console/index.md) or [locally](/docs/testing/snowplow-micro/local/index.md) using Docker or Java.

Micro can also be used for [automated testing](/docs/testing/snowplow-micro/automated-testing/index.md) in a CI/CD environment.
