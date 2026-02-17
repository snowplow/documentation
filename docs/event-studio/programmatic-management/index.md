---
title: "Programmatic management using CLI or API"
sidebar_label: "Programmatic management"
sidebar_position: 70
description: "Automate Event Studio workflows using Snowplow CLI for git-ops integration or the APIs for custom tooling and CI/CD pipelines."
keywords: ["Snowplow CLI", "API", "automation", "git-ops", "CI/CD", "programmatic access"]
---

Data structures and tracking plans can be managed programmatically, enabling git-ops workflows, CI/CD integration, and custom tooling.

Partnered with other tools like the data structures [CI tool](/docs/testing/data-structures-ci-tool/index.md) and the testing pipeline [Snowplow Micro](/docs/testing/snowplow-micro/index.md), it's possible to have a very robust and automated data structure workflow that ensures data quality upstream of data hitting your pipeline.

## Snowplow CLI

The [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/index.md) provides file-based workflows for git-ops integration. It has commands to:

- Download and upload [data structures](/docs/event-studio/programmatic-management/snowplow-cli/data-structures/index.md) as local YAML/JSON files
- Manage [tracking plans](/docs/event-studio/programmatic-management/snowplow-cli/tracking-plans/index.md), event specifications, and source applications
- Validate resources before publishing
- Integrate with version control and code review workflows

The [Snowplow CLI MCP server](/docs/event-studio/mcp-server/index.md) enables AI assistants to interact with your tracking plan resources through natural language.

## Console API

Use the Console REST API for direct programmatic access to tracking plans and data structures. This is useful for integration with other tools, or when you need more control than file-based workflows allow.

It has endpoints for three resource types:

- [Data structures](/docs/event-studio/programmatic-management/data-structures-api/index.md) (`/data-structures/v1`): retrieve, validate, and deploy schemas to development and production registries
- [Tracking plans](/docs/event-studio/programmatic-management/tracking-plans-api/index.md) (`/data-products/v2`): create and update tracking plans, view change history, and manage subscriptions
- [Event specifications](/docs/event-studio/programmatic-management/event-specifications-api/index.md) (`/event-specs/v1`): create, publish, deprecate, and delete event specifications within tracking plans

You can explore all available endpoints in the [Swagger API documentation](https://console.snowplowanalytics.com/api/msc/v1/docs).

:::note Only available for Iglu Server registries
By default, Snowplow pipelines use Iglu Server schema registries. Each pipeline has a development and a production Iglu Server instance.

The Console API only works with these registries. If you're using a custom static S3 registry instead, you'll need to update your registry manually.
:::

### Authentication

Each request requires your organization ID and an authorization token. You can find your organization ID [on the **Manage organization** page](https://console.snowplowanalytics.com/settings) in Console.

Follow the instructions in the [Account management](/docs/account-management/index.md) section to obtain an access token for API authentication.

To be able to post sample requests in the [Swagger API documentation](https://console.snowplowanalytics.com/api/msc/v1/docs), click the `Authorize` button at the top of the document and authorize with your token. The value for the token field in each individual requests is overwritten by this authorization.
