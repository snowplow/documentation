---
title: "Testing"
date: "2024-12-04"
sidebar_position: 8.5
---

There are a number of ways you can test your tracking implementation and QA your pipeline to follow good data practices.

When implementing new tracking, or when making changes to your schemas or enrichments, we recommend you run testing by sending events to a test environment before deploying your changes to production environments. You can use [Snowplow Micro](/docs/testing/snowplow-micro/index.md) or [Snowplow Mini](/docs/api-reference/snowplow-mini/index.md) to do this.

## Test web tracking using the browser extension

Use the [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) browser extension to validate your web tracking implementation.

## Automated testing with Snowplow Micro

For more automated testing of your tracking we have a tool called [Snowplow Micro](/docs/testing/snowplow-micro/index.md) which allows you to integrate with your automated testing suite to check that your tracking remains intact as application-level changes are made.

Follow [this guide](/docs/testing/snowplow-micro/basic-usage/index.md) to get familiar with Micro and set it up.

## Validate events with Snowplow Mini

To configure a Snowplow Mini sandbox enviroment, go to **Settings** > **Manage organization** > **Set up a sandbox** in [Snowplow Console](https://console.snowplowanalytics.com). You'll need to provide a password.

Once it's deployed, you can find your Mini details in two ways:
* As a pipeline under **Pipelines**
* In **Workspaces** > **Details** > **Sandboxes**

To test your tracking:
1. Send a few events from your application to the sandbox endpoint
2. Visit the endpoint URL to log into the Mini dashboard using the sandbox name and password
3. Check that your events have landed in the good queue (i.e. are valid), and that the data looks as you expect it to look (i.e. enriched appropriately, formatted and structured correctly).
4. Once you are happy that your changes are valid, you can deploy them to production along with any application code
