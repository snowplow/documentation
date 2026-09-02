---
title: "Manage your Snowplow account using the Credentials API"
sidebar_label: "Account management"
date: "2020-02-15"
sidebar_position: 8.7
description: "Manage your Snowplow account configuration, users, and API keys through Console, including instructions for obtaining JWT tokens via the Credentials API."
keywords: ["account management", "Credentials API", "API keys", "scoped API keys", "JWT authentication", "Console API"]
---

You can control Snowplow Console (e.g., to automate certain actions) through its [API](https://console.snowplowanalytics.com/api/msc/v1/docs/index.html?url=/api/msc/v1/docs/docs.yaml). To use this API, you need to first obtain an API token.

## Create an API key

In [Console](https://console.snowplowanalytics.com/), navigate to **Settings** > **Manage organization** > **View and manage API keys**. To view this page, you need the **View** permission on API keys. To create keys, you need the **Manage** permission. See [permissions](/docs/account-management/managing-permissions/index.md) for details.

Click **Create API key**, give the key a name for future reference, and select **Snowplow API key** as the type.

A Snowplow API key is granted only the permissions you select when you create it. For each Console feature, such as environments, tracking plans, or data structures, choose the permission level the key should have. The features and levels are the same as the ones available for [user permissions](/docs/account-management/managing-permissions/index.md#what-permissions-can-be-set).

The following rules apply:

- You can only grant permissions that you hold yourself. Console only offers the permissions you have.
- A key must have at least one permission.
- A key can never manage API keys or access Visualizations, so these features are not offered.
- A key's permissions are fixed at creation time. Changing your own permissions later does not change the key. To change what a key can do, create a new key and delete the old one.
- Only users can create API keys. Requests authenticated with an API key cannot create other keys.

When you create a key, Console shows the _API key ID_ and the _API key_ itself once. Store both in a secure location. This pair works like a combination of a username and password, and you should treat it with the same level of security.

You can create multiple keys, and delete any key.

:::tip[Grant the minimum permissions]

Create a separate key for each integration and grant it only the permissions that integration needs. For example, Snowtype only reads tracking plans and data structures, so its key only needs **View** on those two features.

:::

:::warning[Legacy keys have admin privileges]

API keys created before scoped API keys were introduced have admin privileges across the whole organization. They are marked as **Global admin** on the API keys page. Replace them with scoped keys that grant only what each integration needs, and delete the legacy keys.

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
