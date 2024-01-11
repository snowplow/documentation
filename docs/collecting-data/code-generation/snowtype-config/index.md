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

### `trackingScenarioIds`

The Tracking Scenario IDs you wish to generate tracking code for. The Tracking Scenario ID is a UUID that can be retrieved as the final part of the URL when visiting a tracking scenario main page.

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
  "trackingScenarioIds": [
    "a123456b-c222-11d1-e123-1f123456789g"
  ],
  "organizationId": "a654321b-c111-33d3-e321-1f123456789g",
  "tracker": "@snowplow/browser-tracker",
  "language": "typescript",
  "outpath": "./src/snowtype"
}
```