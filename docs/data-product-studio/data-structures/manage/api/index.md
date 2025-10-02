---
title: "Managing data structures via the API"
sidebar_label: "Data structures API"
sidebar_position: 3
sidebar_custom_props:
  offerings:
    - cdi
---

As well as managing [data structures](/docs/fundamentals/schemas/index.md) through Snowplow Console, Snowplow customers can also manage them programmatically through the data structures API.

This functionality is key to automating any existing process you may have, including workflows in version control systems like GitHub.

Partnered with other tools like our [CI tool](/docs/data-product-studio/data-quality/data-structures-ci-tool/index.md) and / or [Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/index.md), it's possible to have a very robust and automated data structure workflow that ensures data quality upstream of data hitting your pipeline.

:::note

Data structures interfaces are only compatible with pipelines that have been upgraded to use Iglu Server registries, rather than static S3 registries. Please check [here](https://console.snowplowanalytics.com/data-structures/) in the console, to see if you need an upgrade or if your registries are ready to go.

:::

## Getting started

You can have a look at and interact with all available endpoints in the [API documentation](https://console.snowplowanalytics.com/api/msc/v1/docs).

Authorizing in the API documentation

To be able to post sample requests in the documentation you need to click the `Authorize` button at the top of the document and authorize with your token. The value for the token field in each individual requests is overwritten by this authorization.

The endpoints focus on the main operations in the workflow around:

1. Retrieving existing data structures and their associated schemas
2. Creating or editing new or existing data structures
3. Validating a data structure
4. Deploying a data structure to a registry

Each request will need to include your Organization ID. You can find it [on the _Manage organization_ page](https://console.snowplowanalytics.com/settings) in Console.

```mdx-code-block
import GetConsoleApiKey from "@site/docs/reusable/get-console-api-key/_index.md"

<GetConsoleApiKey/>
```

## Retrieving data structures

The following `GET` requests allow you to retrieve data structures from both your development and production environment registries.

### Retrieve a list of all data structures

Use this request to:

- Retrieve a list of all data structures
- Retrieve a list of data structures filtered by `vendor` or `name` query parameters

`**GET** /api/msc/v1/organizations/{organizationId}/data-structures/v1`

### Retrieve a specific data structure

Use this request to retrieve a specific data structure by its hash (see 'Generating a data structure hash' below), which is generated on creation.

`**GET** /api/msc/v1/organizations/{organizationId}/data-structures/v1/{dataStructureHash}`

### Retrieve specific version of a specific data structure

Use this request to retrieve all versions of a specific data structure by its hash (see 'Generating a data structure hash' below)

`**GET** /api/msc/v1/organizations/{organizationId}/data-structures/v1/{dataStructureHash}/versions/{versionNumber}`

See the [detailed API documentation](https://console.snowplowanalytics.com/api/msc/v1/docs) for all options.

#### Generating a data structure hash

To use the commands to retrieve information about a specific Data Structure, you need to encode its identifying parameters (`organization ID`, `vendor`, `name` and `format`) and hash it with SHA-256.

**Example:**

| Parameter       | Value                                  |
| --------------- | -------------------------------------- |
| Organization ID | `38e97db9-f3cb-404d-8250-cd227506e544` |
| Vendor          | `com.acme.event`                       |
| Schema name     | `search`                               |
| Format          | `jsonschema`                           |

First concatenate the information with a dash (-) as the separator:
`38e97db9-f3cb-404d-8250-cd227506e544-com.acme.event-search-jsonschema`

And then hash them with SHA-256 to receive: `a41ef92847476c1caaf5342c893b51089a596d8ecd28a54d3f22d922422a6700`

## Validation

To validate that your schema is in proper JSON format and complies with warehouse loading requirements, you can use the validation `POST` requests.

`**POST** /api/msc/v1/organizations/{organizationId}/data-structures/v1/validation-requests`

### Example

```bash
curl 'https://console.snowplowanalytics.com/api/msc/v1/organizations/cad39ca5-3e1e-4e88-91af-87d977a4acd8/data-structures/v1/validation-requests' \
  -H 'authorization: Bearer YOUR_TOKEN' \
  -H 'content-type: application/json' \
  --data-binary '{
  "meta": {
    "hidden": false,
    "schemaType": "event",
    "customData": {}
  },
  "data": {
    "description": "Schema for an example event",
    "properties": {
      "example_field_1": {
        "type": "string",
        "description": "the example_field_1 means x",
        "maxLength": 128
      }
    },
    "additionalProperties": false,
    "type": "object",
    "required": [
      "example_field_1"
    ],
    "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
    "self": {
      "vendor": "com.acme",
      "name": "example_schema_name",
      "format": "jsonschema",
      "version": "1-0-0"
    }
  }
}'
```

Please note:

- the request's body has two parts:
    - one for data structure metadata as value to the `meta` key
    - one for the schema itself as value to the `data` key
- this example uses the synchronous version of validation that responds with the result immediately. There is also an asynchronous version available that returns a request ID that you can later poll to get the result.
- you can add metadata specific to your organisation to the schema as key/value pairs in the `customData` object. See '[Managing Meta Data](#managing-meta-data)' for more information.

## Deployments

The deployment endpoints deal with getting a new or edited version of your data structure into your development and production environments.

`**GET** /api/msc/v1/organizations/{organizationId}/data-structures/v1/{dataStructureHash}/deployments`

`**POST** /api/msc/v1/organizations/{organizationId}/data-structures/v1/deployment-requests`

### Example

```bash
curl 'https://console.snowplowanalytics.com/api/msc/v1/organizations/cad39ca5-3e1e-4e88-91af-87d977a4acd8/data-structures/v1/deployment-requests' \
  -H 'authorization: Bearer MY_TOKEN' \
  -H 'content-type: application/json' \
  --data-binary '{
  "message": "",
  "source": "VALIDATED",
  "target": "DEV",
  "vendor": "com.acme",
  "name": "example_schema_name",
  "format": "jsonschema",
  "version": "1-0-0"
}'
```

Please note:

- This example demonstrates deployment from `VALIDATED` to `DEV`. The method is the same for Production, but you would change the variables where `"source": "DEV"` and `"target": "PROD"`
- The API enforces a workflow of validating, testing on development and then deploying to production. To achieve this you deploy from one environment to another; from (virtual environment) `VALIDATED` to `DEV`, then `DEV` to `PROD`.
- Only users designated as "admin" in the console have the permissions to promote from `DEV` to `PROD`.
- There is a sync option that will return the response of the deployment request directly. Otherwise you can poll for deployment responses using the deployment ID.
- The property for `message` can be sent with a deployment which will capture any change log notes that will be stored against the deployment. (Note that this specific property is a bolt-on feature and might not be available for your account.)

## Managing meta data

Meta data is used to add additional information to a Data Structure.

```json
"meta": {
  "hidden": false,
  "schemaType": "event",
  "customData": {}
}
```

The `hidden` property sets the data structure as visible (true) or not (false) in the console.

The `schemaType` property can be set as null | "event" | "entity".

The `customData` property is mapped as `[string, string]` and can be used to send across any key/value pairs you'd like to associate with the schema.

For example if you wanted to specify departmental ownership through meta data:

```json
"customData": { "department": "marketing" }
```

You can update the meta data for a data structure using the PUT endpoint:

`**PUT** ​/api​/msc​/v1​/organizations​/{organizationId}​/data-structures/v1/{dataStructureHash}​/meta`

## Migrating from the legacy API

The API described above supersedes the legacy one, which was to be found under `/api/schemas`. It offers under-the-hood improvements and a clear path forward to adding further value. To make the transition easier, we have kept the same models for the data being exchanged; it is therefore simply a matter of 1) [updating the authentication method](#obtaining-an-api-key), and 2) switching to the new endpoints listed above.

The legacy API is currently tunneled to the new one, so there is no data differences to be expected after the upgrade. We will maintain this facade while supporting customers in upgrading. Your Customer Success Manager and our Engineers will be glad to assist you during this transition.
