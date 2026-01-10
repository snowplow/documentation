---
title: "Snowtype configuration options"
sidebar_label: "Configuration options"
sidebar_position: 3
description: "Configure Snowtype code generation with options for output paths, tracker selection, language settings, and custom templates."
keywords: ["Snowtype configuration", "config options", "code generation settings", "Snowtype setup"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The Snowtype CLI configuration can be saved in a `.json`, `.js`, or `.ts` file after initialization. For example: `snowtype.config.json`, `snowtype.config.js`, or `snowtype.config.ts`. **We highly recommend you keep this file in the root of your project folder.**

## Attributes in your configuration file

### `igluCentralSchemas`

The schema tracking URLs for schemas available in [Iglu Central](https://iglucentral.com/).

### `repositories`

Local Data Structure repositories generated from the [snowplow-cli](/docs/data-product-studio/data-structures/manage/cli/index.md).

### `dataStructures`

The schema tracking URLs for Data Structures published in the Console.

### `eventSpecificationIds`

The Event Specification IDs you wish to generate tracking code for. The Event Specification ID is a UUID that can be retrieved as the final part of the URL when visiting an event specification main page.

### `dataProductIds`

The Data Product IDs you wish to generate tracking code for. By providing the Data Product Id, Snowtype will fetch all the event specifications for the Data Product and generate code for all of them. The Data Product ID is a UUID that can be retrieved as the final part of the URL when visiting a data product main page.

### `organizationId`

The Organization ID for your Snowplow account. The Organization ID is a UUID that can be retrieved from the URL immediately following the .com when visiting console.

### `tracker`

The target tracker to generate the required code for. [See list of available trackers](../using-the-cli/index.md#available-trackerslanguages).

### `language`

The target language to generate the required code for. [See list of available languages](../using-the-cli/index.md#available-trackerslanguages).

### `outpath`

The outpath relative to the current working directory when running the script.

### `options`

Options related to Snowtype behavior and are described by the following TypeScript type:

```ts
options?: {
  /* Command related options. */
  commands: {
    generate?: {
      /* Generate implementation instructions. */
      instructions?: boolean;
      /* Add runtime validations. */
      validations?: boolean;
      /* Disallow generation of code using schemas only deployed on DEV environment. */
      disallowDevSchemas?: boolean;
      /* Show deprecation warnings only when there are PROD available schema updates. */
      deprecateOnlyOnProdAvailableUpdates?: boolean;
    }
    update?: {
      /* Update your configuration file automatically and regenerate the code of the latest available update. */
      regenerateOnUpdate?: boolean;
      /* The maximum SchemaVer update to show an available update notification for. */
      maximumBump?: "major" | "minor" | "patch";
      /* The `update` command will only display updates for Data Structures that have been deployed to production environment. */
      showOnlyProdUpdates?: boolean;
    }
    patch?: {
      /* Automatically regenerate the code after a successful patch operation. */
      regenerateOnPatch?: boolean;
    }
  }
}
```

### `namespace`

:::info

This option only applies when generating Swift code.

:::

The namespace for the generated code. All classes generated will be included in this namespace, which can be used to avoid naming conflicts.


For example, setting `namespace` to `Snowtype` will result in classes being accessed with the `Snowtype` prefix:

```swift
let data = Snowtype.AccountConfirmed(companyCountry: "", companyName:
"", ...)
```

_Keep in mind that CLI flags take precedence over configuration file options._


## Example configuration file

<Tabs groupId="config" queryString>
  <TabItem value="json" label="JSON" default>

  ```json
{
    "igluCentralSchemas": ["iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0"],
    "repositories": ["../data-structures"],
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
  </TabItem>

  <TabItem value="javascript" label="JavaScript" default>

```javascript
const config = {
  "igluCentralSchemas": ["iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0"],
  "repositories": ["../data-structures"],
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

module.exports = config;

```
  </TabItem>

  <TabItem value="typescript" label="TypeScript">

```typescript
type SnowtypeConfig = {
  tracker:
    | "@snowplow/browser-tracker"
    | "@snowplow/javascript-tracker"
    | "snowplow-android-tracker"
    | "snowplow-ios-tracker"
    | "@snowplow/node-tracker"
    | "snowplow-golang-tracker"
    | "@snowplow/react-native-tracker"
    | "snowplow-flutter-tracker";
  language: "typescript" | "javascript" | "kotlin" | "swift" | "go" | "dart";
  outpath: string;
  organizationId?: string;
  igluCentralSchemas?: string[];
  repositories?: string[];
  dataStructures?: string[];
  eventSpecificationIds?: string[];
  dataProductIds?: string[];
  options?: {
    commands: {
      generate?: {
        instructions?: boolean;
        validations?: boolean;
        disallowDevSchemas?: boolean;
        deprecateOnlyOnProdAvailableUpdates?: boolean;
      }
      update?: {
        regenerateOnUpdate?: boolean;
        maximumBump?: "major" | "minor" | "patch";
        showOnlyProdUpdates?: boolean;
      }
      patch?: {
        regenerateOnPatch?: boolean
      }
    }
  }
};

const config: SnowtypeConfig = {
  "igluCentralSchemas": ["iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0"],
  "repositories": ["../data-structures"],
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
};

export default config;

```
  </TabItem>

</Tabs>
