---
title: "Testing"
date: "2024-12-04"
sidebar_position: 8.5
---

There are a number of ways you can test your tracking implementation and QA your pipeline to follow good data practices.

When implementing new tracking, or when making changes to your schemas or enrichments, we recommend you run testing by sending events to a sandbox environment before deploying your changes to Production environments.

1. Find the sandbox endpoint in Snowplow Console (Snowplow customers only) - this is accessible on the _Environments_ screen, as well as in the _'Testing details'_ dialog box on _Data Structures_ and _Enrichments_ screens.
2. Send a few events from your application to the sandbox endpoint.
3. Visit the OpenSearch Dashboard interface for your sandbox environment to check that your events have landed in the good queue (i.e. are valid) and that the data looks as you expect it to look (i.e. enriched appropriately, formatted and structured correctly).
4. Once you are happy that your changes are valid, you can deploy them to Production along with any application code.

## Test web tracking using the Snowplow Inspector

Use the [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) browser extension to validate your web tracking implementation.

## Test tracking using automated testing

For more automated testing of your tracking we have a tool called [Snowplow Micro](/docs/testing/snowplow-micro/index.md) which allows you to integrate with your automated testing suite to check that your tracking remains intact as application-level changes are made.

Follow [this guide](/docs/testing/snowplow-micro/basic-usage/index.md) to get familiar with Micro and set it up. Next, take a look at the [examples of integrating Micro with Nightwatch and Cypress](/docs/testing/snowplow-micro/automated-testing/index.md).
