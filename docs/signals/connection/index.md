---
title: "Connect to Snowplow Signals"
sidebar_position: 35
sidebar_label: "Connect with SDKs or API"
description: "Get your Signals connection credentials, then connect with the Python SDK, Node.js SDK, or Signals API to manage configurations or consume calculated values."
keywords: ["signals connection", "python sdk", "nodejs sdk", "signals api", "connection credentials"]
content_type: how-to
---

You connect to Signals for one of two reasons: to define and manage configurations, such as attribute groups, services, and interventions, or to consume calculated values in your application. A data team usually does the first with Console or the Python SDK. Application code does the second with the SDKs, the browser plugin, the API, or the Signals MCP server.

Console needs no connection setup: log in and go to the **Signals** section. The Snowplow MCP server, which lets your own coding agent manage Signals for you, authenticates with your Console account rather than with Signals credentials. Install it, with the Snowplow [skills](/docs/ai/skills/index.mdx), using `npx plugins add snowplow/skills`.

This page covers connecting from code. For the full list of interfaces and what each supports, the client constructor options, and the SDK methods, see the [Signals connection reference](/docs/signals/connection/reference/index.md).

## Before you begin

You'll need:

* Signals enabled for your organization. If it isn't, see [Set up Signals](/docs/signals/setup/index.md).
* Permission to create API keys in Console. See [Account management](/docs/account-management/index.md).
* Python 3, or Node.js, depending on the SDK you use

Choose your interface:

* **To define configurations in code**: use the [Python SDK](/docs/signals/connection/reference/index.md#python-sdk). We recommend keeping your configurations in a new repository. A Jupyter notebook is the easiest place to start.
* **To retrieve attributes in a Node.js application**: use the [Node.js SDK](/docs/signals/connection/reference/index.md#nodejs-sdk).
* **To subscribe to interventions in the browser**: use the [browser plugin](/docs/signals/applications/subscribe/index.md).
* **From any other language, or over plain HTTP**: use the [Signals API](#signals-api).
* **From an AI agent in your application**: use the [Signals MCP server](/docs/signals/applications/mcp-server/index.md).

## Steps

These steps connect with the Python or Node.js SDK. The code tabs remember your choice.

<Steps>

### Get your connection credentials

The SDKs, plugin, API, and Signals MCP server all use the same four values. Find the Signals API URL and organization ID in Console under **Signals** > **Overview**, and [create an API key](/docs/account-management/index.md) to get the API key and its ID. The [connection credentials reference](/docs/signals/connection/reference/index.md#connection-credentials) lists the format of each.

Add the four values to your environment secrets. Keep them on the server: don't commit them or send them to the browser.

### Install the SDK

<CodeGroup groupId="signals-sdk">

```bash title="Python"
pip install snowplow-signals
```

```bash title="Node.js"
npm i @snowplow/signals-node
# or
yarn add @snowplow/signals-node
# or
pnpm i @snowplow/signals-node
```

</CodeGroup>

To call the Signals API directly, skip this step and go to [Signals API](#signals-api).

### Create a Signals client

Create a `Signals` object with your connection credentials:

<CodeGroup groupId="signals-sdk">

```python title="Python"
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=SIGNALS_DEPLOYED_URL,
    api_key=CONSOLE_API_KEY,
    api_key_id=CONSOLE_API_KEY_ID,
    org_id=ORG_ID,
)
```

```typescript title="Node.js"
import { Signals } from '@snowplow/signals-node';

const signals = new Signals({
  baseUrl: SIGNALS_DEPLOYED_URL,
  apiKey: CONSOLE_API_KEY,
  apiKeyId: CONSOLE_API_KEY_ID,
  organizationId: ORG_ID,
});
```

</CodeGroup>

### Verify the connection

Retrieve attributes from a published service. Replace `my_service` with one of your services, and the identifier with an attribute key value that has events, such as your own `domain_userid`:

<CodeGroup groupId="signals-sdk">

```python title="Python"
sp_signals.get_service_attributes(
    name="my_service",
    attribute_key="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)
```

```typescript title="Node.js"
await signals.getServiceAttributes({
  name: "my_service",
  attribute_key: "domain_userid",
  identifier: "218e8926-3858-431d-b2ed-66da03a1cbe5",
});
```

</CodeGroup>

A response with attribute values, even empty ones, means the connection works. If you don't have a service yet, follow the [quickstart tutorial](/docs/signals/get-started/quickstart-tutorial/index.md) to create one.

</Steps>

Next, define configurations with [attribute groups](/docs/signals/attributes/attribute-groups/index.md), [services](/docs/signals/applications/services/index.md), and [interventions](/docs/signals/interventions/index.md), or consume them with [retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md) and [subscribe to interventions](/docs/signals/applications/subscribe/index.md).

## Signals API

The SDKs handle authentication for you. When you call the Signals API directly, exchange your API key for a token first, then send it with each request.

<Steps>

### Get an access token

Exchange your API key and key ID for an access token, using the Console Credentials API:

```bash
curl \
  --header 'X-API-Key-ID: <API_KEY_ID>' \
  --header 'X-API-Key: <API_KEY>' \
  https://console.snowplowanalytics.com/api/msc/v1/organizations/<ORGANIZATION_ID>/credentials/v3/token
```

This returns a JWT, valid for 24 hours:

```json
{ "accessToken": "<JWT>" }
```

[Account management](/docs/account-management/index.md#obtain-an-access-token) describes the full process, including how to create an API key.

### Call the API

Send the JWT as a Bearer token in the `Authorization` header:

```bash
curl \
  --header 'Authorization: Bearer <JWT>' \
  {{API_URL}}/api/v1/registry/interventions
```

A list of interventions, even an empty one, means the connection works. The [Signals API reference](/docs/signals/connection/reference/index.md#signals-api-endpoints) shows where to find the full API documentation for your deployment.

</Steps>

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
