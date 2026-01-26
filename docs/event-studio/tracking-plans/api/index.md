---
title: "Managing tracking plans via the API"
sidebar_label: "Using the API"
sidebar_position: 3
description: "Programmatically manage tracking plans through the API with endpoints for creating, updating, retrieving, and managing subscriptions for automated workflows and version control integration."
keywords: ["tracking plans API", "API endpoints", "programmatic management", "subscription management", "automation"]
---

import TrackingPlansNomenclature from '@site/docs/reusable/tracking-plans-nomenclature/_index.md';

<TrackingPlansNomenclature />

As well as managing [tracking plans](/docs/event-studio/tracking-plans/index.md) through Snowplow Console, Snowplow customers can also manage them programmatically through an API.

This functionality is key to automating existing processes and frequent manual tasks, including workflows in version control systems like GitHub.

Partnered with other tools like our [CI tool](/docs/testing/data-structures-ci-tool/index.md) and / or [Snowplow Micro](/docs/testing/snowplow-micro/index.md), it's possible to have a very robust and automated data structure workflow that ensures data quality upstream of data hitting your pipeline.

## Getting started

You can have a look at and interact with all available endpoints in the [API documentation](https://console.snowplowanalytics.com/api/msc/v1/docs).

### Authorizing in the API documentation

To be able to post sample requests in the documentation you need to click the `Authorize` button at the top of the document and authorize with your token. The value for the token field in each individual request is overwritten by this authorization.

The endpoints focus on the main operations in the workflow around:

1. Retrieving existing tracking plans and their event specifications
2. Creating new or editing existing tracking plans
3. Viewing the tracking plan history
4. Managing subscriptions for change notifications

Each request will need to include your Organization ID. You can find it [on the _Manage organization_ page](https://console.snowplowanalytics.com/settings) in Console.

```mdx-code-block
import GetConsoleApiKey from "@site/docs/reusable/get-console-api-key/_index.md"

<GetConsoleApiKey/>
```

## Retrieving Information about Tracking Plans

The following `GET` requests are designed to allow you to access information about tracking plans.

### Retrieve a List of All Tracking Plans

To retrieve a comprehensive list of all tracking plans in your organization, you can use the following GET request:

`**GET** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v2`

Path parameter `organizationId` is required.

### Retrieving Information about a Specific Tracking Plan

`**GET** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v2/{dataProductId}`

Path parameters `organizationId` and `dataProductId` are required.

When retrieving a tracking plan, it could also contain an array field `data[].tracking_scenarios` that will include the `id` and `url` of the associated event specifications. For example:

```json
"data": [
  ...
  "eventSpecs": [
    {
      "id": "d1336abc-1b60-46f7-be2d-2105f2daf283",
      "url": "https://console.snowplowanalytics.com/api/msc/v1/organizations/f51dada7-4f11-4b6a-bbbd-2cf6a3673035/event-specs/v1/d1336abc-1b60-46f7-be2d-2105f2daf283"
      }
  ]
  ...
]
```

Under the json path `includes.tracking_scenarios`, the API will also attach associated event specifications in their entirety:

```json
"includes": {
  ...
  "eventSpecs": [
    "id": "d1336abc-1b60-46f7-be2d-2105f2daf283",
     ...
  ]
  ...
}
```

### Retrieve History Information for a Tracking Plan

If you wish to retrieve the change log of a specific tracking plan, you can use the following GET request:

`**GET** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v2/{dataProductId}/history`

You can pass several parameters to control the result of the response:

- **before**: returns records equal or less than the timestamp in the ISO-8601 format
- **limit**: limits the number of records
- **offset**: skip the first N results
- **order**: order of returned records, `asc` or `desc`. Defaults to `desc`.

Path parameter `organizationId` is required.

## Creating and updating Tracking Plans

### Creating a Tracking Plan

This `POST` request allows you to create a new tracking plan within an organization.

`**POST** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v2`


The request body is mandatory and should be in JSON format. The minimum payload would be a JSON with only the `name` of the tracking plan. The remaining fields are optional and not required on creation. Example:

```json
{
  "name": "Performance tracking",
  "description": "Tracks performance",
  "domain": "Marketing",
  "owner": "IT department",
  "accessInstructions": "The data can be accessed in the warehouse, in the atomic.events table"
}
```

:::note
The name of your tracking plan must be unique to ensure proper identification and avoid conflicts.
:::

### Updating a Tracking Plan

Use this request to update a tracking plan. The `dataProductId` is required, along with a valid request body.

The minimum payload on update would be the same as on creation but with the addition of the required `status` field. On creation, by default, it will set the `status` to `draft`.

`**POST** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v2/{dataProductId}`

:::note
The name of your tracking plan must be unique to ensure proper identification and avoid conflicts.
:::

See the [detailed API documentation](https://console.snowplowanalytics.com/api/msc/v1/docs) for all options.

### Delete a Tracking Plan

Use this request to delete a tracking plan. The `dataProductId` and `organizationId` are both required.

`**POST** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v2/{dataProductId}`

## Subscription Management for Tracking Plans

### Retrieve All Subscriptions for a Tracking Plan

To retrieve all subscriptions for a tracking plan, use the following request. The `organizationId` and `dataProductId` are required.

`**GET** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions`

### Add a Subscription

To add a subscription for a tracking plan, use the following request. The `organizationId`, `dataProductId` and a valid request body are required.

`**POST** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions`

The following is the minimum accepted payload. It will create a subscription for the user who issues the request, as inferred by the JWT in the request headers.

```json
{
  "reason": "Get notified on breaking changes",
  "receiveNotifications": true
}
```

If you want to subscribe a different user you will need to populate an additional field, `recipient`, with that user's email address.

When a subscription is created, it will send a confirmation email to the recipient (default user or third user). Clicking the confirmation link in that email will direct the recipient to the following URL and and mark the subscription as confirmed:

`**POST** /organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions/{subscriptionId}/actions/confirm`


Once a subscription is created and the email has been confirmed, the subscriber will start receiving a daily email digest referencing all the tracking plans that had changes in the last 24 hours.

### Update a Subscription

To update a subscription for a specific tracking plan, use the following request. Path parameters `organizationId`, `subscriptionId`, `dataProductId`, and a valid request body are required.

`**PUT** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions/{subscriptionId}`

### Delete a Subscription

To delete a subscription for a specific tracking plan (unsubscribe action), use the following request. Path parameters `organizationId`, `subscriptionId`, `dataProductId`, and a valid request body are required.

`**DELETE** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions/{subscriptionId}`

### Resend a Subscription Confirmation Email

To resend a subscription confirmation email, use the following request. Path parameters `organizationId`, `subscriptionId`, `dataProductId` are required.

`**POST** ​/api​/msc​/v1/organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions/{subscriptionId}/actions/resend-confirmation`

### Integration with the SDK Generator

To send emails with instructions for the SDK generator, use the following request. Path parameters `organizationId` and `dataProductId` and a valid request body are required.

`**POST** /organizations/{organizationId}/data-products/v2/{dataProductId}/share-instructions`
