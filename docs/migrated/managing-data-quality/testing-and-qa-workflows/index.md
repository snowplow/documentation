---
title: "Testing and QA workflows"
date: "2021-08-02"
sidebar_position: 0
---

As a Snowplow BDP customer there are a number of ways you can test and QA your pipeline to follow good data practices.

## Testing new tracking implementations, schema changes, and enrichment changes

When implementing new tracking, or when making changes to your schemas or enrichments, we recommend you run testing by sending events to your sandbox environment before deploying your changes to Production environments.

1. Find the sandbox endpoint in Snowplow Console - this is accessible on the _Environments_ screen, as well as in the _'Testing details'_ modal on _Data Structures_ and _Enrichments_ screens.
2. Send a few events from your application to the sandbox endpoint.
3. Visit the Kibana interface for your sandbox environment to check that your events have landed in the good queue (i.e. are valid) and that the data looks as you expect it to look (i.e. enriched appropriately, formatted and structured correctly).
4. Once you are happy that your changes are valid, you can deploy them to Production along with any application code.

## Test tracking using automated testing

For more automated testing of your tracking we have a tool called Snowplow Micro which is part of our Open Source estate and allows you to integrate with your automated testing suite to check that your tracking remains intact as application-level changes are made.

1. [Generate and copy](https://console.snowplowanalytics.com/iglu-keys) an IgluAPI Read key from console
2. Request your schema registry URLs from Snowplow Support
3. [Follow this guide](/docs/migrated/understanding-your-pipeline/what-is-snowplow-micro/) using the registry URLs to configure Micro, and the API key to run the commands

You'll also find [examples of integrating with Nightwatch and Cypress](/docs/migrated/managing-data-quality/set-up-automated-testing-with-snowplow-micro/example-of-automated-tests/) in the guide.

## Verify schema dependencies using the Data Structures CI tool

The Data Structures CI is a command-line tool which integrates Data Structures API into your CI/CD pipelines and currently has one task which verifies that all schema dependencies for a project are already deployed into a specified environment, thus preventing tracking going live in your application without the required schemas being published in your Snowplow schema registries.

[You can learn about this tool in documentation.](/docs/migrated/managing-data-quality/using-the-data-structures-ci-tool-for-data-quality/)
