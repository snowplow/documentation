---
title: "Managing Data Products via the API"
sidebar_label: "Using the API"
sidebar_position: 2
sidebar_custom_props:
  offerings:
    - enterprise
---

As well as managing [data product](/docs/understanding-tracking-design/defining-the-data-to-collect-with-data-poducts/index.md) through the Snowplow BDP Console, Snowplow BDP customers can also manage them programmatically through an API.

This functionality is key to automating any existing process you may have, including workflows in version control systems like GitHub.

Partnered with other tools like our [CI tool](/docs/managing-data-quality/testing-and-qa-workflows/using-the-data-structures-ci-tool-for-data-quality/index.md) and / or [Snowplow Micro](/docs/testing-debugging/snowplow-micro/what-is-micro/index.md), it's possible to have a very robust and automated data structure workflow that ensures data quality upstream of data hitting your pipeline.

## Getting started

You can have a look at and interact with all available endpoints in the [API documentation](https://console.snowplowanalytics.com/api/msc/v1/docs).

### Authorizing in the API documentation

To be able to post sample requests in the documentation you need to click the `Authorize` button at the top of the document and authorize with your token. The value for the token field in each individual requests is overwritten by this authorization.

The endpoints focus on the main operations in the workflow around:

1. Retrieving existing data products and their event specifications, also known as tracking scenarios in the current v1 API version
2. Creating or editing new or existing data products
3. Seeing the data product history
4. Managing user subscriptions

Each request will need to include your company's `organizationID` which is a UUID that can be retrieved from the URL immediately following the .com when visiting console:

![](images/orgID.png)

```mdx-code-block
import GetConsoleApiKey from "@site/docs/reusable/get-console-api-key/_index.md"

<GetConsoleApiKey/>
```

## Retrieving Information about Data Products

The following `GET` requests are designed to allow you to access information about data products. These data products could be stored in either your development environment registry or your production environment registry.

### Retrieve a List of All Data Products

To retrieve a comprehensive list of all data products in your organization, you can use the following GET request:

`**GET** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1`

Query parameter `organizationId` is required.

### Retrieving Information about a Specific Data Product

`**GET** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}`

Query parameters `organizationId` and `dataProductId` are required.

### Retrieve History Information for a Data Product

If you wish to retrieve information about a specific data product, you can use the following GET request:

`**GET** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}/history`

You can pass several parameters to control the result of the response:

- **before**: returns records equal or less than the timestamp in the ISO-8601 format
- **limit**: limits the number of records
- **offset**: skip the first N results
- **order**: order of returned records, `asc` or `desc`. Defaults to `desc`.

Query parameter `organizationId` is required.

## Creating and updating Data Products

### Creating a Data Product

This `POST` request allows you to create a new data product within an organization.

`**POST** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1`

The request body is mandatory and should be in JSON format. Here’s an example of how the request body might look:

```json
{
  "name": "Performance tracking",
  "description": "Tracks performance",
  "domain": "Marketing",
  "owner": "IT department",
  "accessInstructions": "The data can be accessed through company Superset"
}
```

### Updating a Data Product

Use this request to update a data product. The `dataProductId` is required, along with a valid request body.

`**POST** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}`

See the [detailed API documentation](https://console.snowplowanalytics.com/api/msc/v1/docs) for all options.

### Delete a Data Product

Use this request to delete a data product. The `dataProductId` and `organizationId` are both required.

`**POST** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}`

## Subscription Management for Data Products

### Retrieve All Subscriptions for a Data Product

To retrieve all subscriptions for a data product, use the following request. The `organizationId` and `dataProductId` are required.

`**GET** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions`

### Add a Subscription

To add a subscription for a data product, use the following request. The `organizationId`, `dataProductId` and a valid request body are required.

`**POST** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions`

### Update a Subscription

To update a subscription for a specific data product, use the following request. The `organizationId`, `subscriptionId`, `dataProductId`, and a valid request body are required.

`**PUT** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions/{subscriptionId}`

### Delete a Subscription

To delete a subscription for a specific data product, use the following request. The `organizationId`, `subscriptionId`, `dataProductId`, and a valid request body are required.

`**DELETE** ​/api​/msc​/v1​/organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions/{subscriptionId}`

### Resend a Subscription Confirmation Email

To resend a subscription confirmation email, use the following request. The `organizationId`, `subscriptionId`, `dataProductId` are required.

`**POST** ​/api​/msc​/v1/organizations/{organizationId}/data-products/v1/{dataProductId}/subscriptions/{subscriptionId}/actions/resend-confirmation`

### Integration with the SDK Generator

To send emails with instructions for the SDK generator, use the following request. The `organizationId` amd `dataProductId` and a valid request body are required.

`**POST** /organizations/{organizationId}/data-products/v1/{dataProductId}/share-instructions`
