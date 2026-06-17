---
title: "Manage your Snowplow account using the Credentials API"
sidebar_label: "Account management"
date: "2020-02-15"
sidebar_position: 8.7
description: "Manage your Snowplow account configuration, users, and API keys through Console, including instructions for obtaining JWT tokens via the Credentials API."
keywords: ["account management", "Credentials API", "API keys", "JWT authentication", "Console API"]
---

You can control Snowplow Console (e.g., to automate certain actions) through its [API](https://console.snowplowanalytics.com/api/msc/v1/docs/index.html?url=/api/msc/v1/docs/docs.yaml). To use this API, you need to first obtain an API token.

## Create an API key

In [Console](https://console.snowplowanalytics.com/), navigate to **Settings** > **Manage organization** > **API keys for managing Snowplow**. To view this page, you need a _View API keys_ permission.

![API keys generation view](images/accessing-generated-api-keys.png)

You can create multiple API keys. It's also possible to delete any key.

When you create an API key, store the _API key ID_ and the _API key_ itself in a secure location. This pair works like a combination of a username and password, and you should treat it with the same level of security.

:::warning[Key privileges]

All API keys have admin privileges. Do not share these keys with people or systems you do not trust.

:::

## Obtain an access token

Once you have an API key and key ID, you can exchange them for a temporary access token valid for 24 hours.

For example, using curl, the process would look like this:

```bash
curl \
  --header 'X-API-Key-ID: <API_KEY_ID>' \
  --header 'X-API-Key: <API_KEY>' \
  https://console.snowplowanalytics.com/api/msc/v1/organizations/<ORGANIZATION_ID>/credentials/v3/token
```

<details>
<summary>Previous versions</summary>

A previous version of the token exchange endpoint is still available, only requiring the API key:

```bash
curl \
  --header 'X-API-Key: <API_KEY>' \
  https://console.snowplowanalytics.com/api/msc/v1/organizations/<ORGANIZATION_ID>/credentials/v2/token
```

This endpoint is deprecated and will be removed in the future. Use the v3 endpoint detailed above instead.

</details>

You can find your Organization ID [on the _Manage organization_ page](https://console.snowplowanalytics.com/settings) in Console.

The curl command above will return a JWT as follows:

```json
{ "accessToken": "<JWT>" }
```

## Use the access token with Console API

You can use the access token to supply authorization headers for subsequent API requests:

```bash
curl --header 'Authorization: Bearer <JWT>'
```
