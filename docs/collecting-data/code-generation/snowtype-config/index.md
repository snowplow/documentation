---
title: "Snowtype configuration options"
sidebar_position: 3
---

The Snowtype CLI configuration will be saved in a`snowtype.config.json` file after initialization. **We highly recommend you keep this file in the root of your project folder.**

## Attributes in `snowtype.config.json`

### `igluCentralSchemas`

The schema tracking URLs for schemas available in [Iglu Central](http://iglucentral.com/).

### `dataStructures`

The schema tracking URLs for Data Structures published in the Console.

### `eventSpecificationIds`

The Event Specification IDs you wish to generate tracking code for. The Event Specification ID is a UUID that can be retrieved as the final part of the URL when visiting an event specification main page.

### `dataProductIds`

The Data Product IDs you wish to generate tracking code for. By providing the Data Product Id, Snowtype will fetch all the event specifications for the Data Product and generate code for all of them. The Data Product ID is a UUID that can be retrieved as the final part of the URL when visiting a data product main page.

### `organizationId`

The Organization ID for your Snowplow BDP account. The Organization ID is a UUID that can be retrieved from the URL immediately following the .com when visiting console.

### `tracker`

The target tracker to generate the required code for. [See list of available trackers](../using-the-cli/index.md#available-trackerslanguages).

### `language`

The target language to generate the required code for. [See list of available languages](../using-the-cli/index.md#available-trackerslanguages).

### `outpath`

The outpath relative to the current working directory when running the script.


## Example configuration file

```json
{
  "igluCentralSchemas": ["iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0"],
  "dataStructures": ["iglu:com.myorg/custom_web_page/jsonschema/1-1-0"],
  "eventSpecificationIds": [
    "a123456b-c222-11d1-e123-1f123456789g"
  ],
  "dataProductIds": [
    "a123456b-c222-11d1-e123-1f12345678dp"
  ],
  "organizationId": "a654321b-c111-33d3-e321-1f123456789g",
  "tracker": "@snowplow/browser-tracker",
  "language": "typescript",
  "outpath": "./src/snowtype"
}
```