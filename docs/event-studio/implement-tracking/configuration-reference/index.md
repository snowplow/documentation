---
title: "Configuration reference"
sidebar_label: "Configuration reference"
sidebar_position: 10
description: "Complete reference for all Snowtype configuration file options, including schema sources, output settings, and command behavior."
keywords: ["Snowtype", "configuration", "config file", "options", "reference"]
date: "2026-03-25"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TrackingPlansNomenclature from '@site/docs/reusable/tracking-plans-nomenclature/_index.md';

Snowtype reads its settings from a configuration file in your project root. The file is created when you run [`snowtype init`](/docs/event-studio/implement-tracking/install-snowtype/index.md), and you can edit it directly at any time.

Keep the configuration file in the root of your project, and include it in your version control system.

<TrackingPlansNomenclature />

## Configuration file structure

The configuration file is a JSON object with the following structure:

```json title="snowtype.config.json"
{
    "organizationId": "a654321b-c111-33d3-e321-1f123456789g",
    "tracker": "@snowplow/browser-tracker",
    "language": "typescript",
    "outpath": "./src/snowtype",
    "eventSpecificationIds": [
        "a123456b-c222-11d1-e123-1f123456789g"
    ],
    "dataProductIds": [
        "a123456b-c222-11d1-e123-1f12345678dp"
    ],
    "dataStructures": [
        "iglu:com.myorg/custom_web_page/jsonschema/1-1-0"
    ],
    "igluCentralSchemas": [
        "iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0"
    ],
    "repositories": ["../data-structures"],
    "namespace": "Snowtype",
    "options": {
        "commands": {
            "generate": {
                "instructions": true,
                "validations": true,
                "disallowDevSchemas": true
            },
            "update": {
                "maximumBump": "minor",
                "showOnlyProdUpdates": true
            },
            "patch": {
                "regenerateOnPatch": false
            }
        }
    }
}
```

| Property                | Type       | Description                                                                                                                                                                                                                           | Required |
| ----------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `organizationId`        | `string`   | Your Snowplow account [organization ID](/docs/account-management/index.md). Used to fetch tracking plans, event specifications, or data structures from Console. Not required if you're only generating code from a local repository. | ✅/❌      |
| `tracker`               | `string`   | The Snowplow tracker to generate code for. This determines the structure of the generated code and which tracker it will work with.                                                                                                   | ✅        |
| `language`              | `string`   | The programming language to generate code in.                                                                                                                                                                                         | ✅        |
| `outpath`               | `string`   | The output path where Snowtype writes the generated code, relative to the current working directory when running the script.                                                                                                          | ✅        |
| `dataProductIds`        | `string[]` | An array of [tracking plan](/docs/event-studio/tracking-plans/index.md) IDs to generate code for.                                                                                                                                     | ❌        |
| `eventSpecificationIds` | `string[]` | An array of [event specification](/docs/event-studio/tracking-plans/event-specifications/index.md) IDs to generate code for.                                                                                                          | ❌        |
| `dataStructures`        | `string[]` | An array of schema URIs for [data structures](/docs/fundamentals/schemas/index.md) published in Console to generate code for.                                                                                                         | ❌        |
| `igluCentralSchemas`    | `string[]` | An array of schema URIs for [Iglu Central](https://iglucentral.com/) schemas to generate code for.                                                                                                                                    | ❌        |
| `repositories`          | `string[]` | An array of paths to local [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/data-structures/index.md) schema repositories to generate code for.                                                                 | ❌        |
| `namespace`             | `string`   | Swift tracker only: a namespace prefix for the generated code. For other trackers it will trigger an error.                                                                                                                           | ❌        |
| `options`               | `object`   | Additional settings related to Snowtype behavior. See details below.                                                                                                                                                                  | ❌        |

### File formats

Snowtype automatically creates the configuration file in JSON format, but you can also use JavaScript or TypeScript if you prefer. The filename must start with `snowtype.config` — for example, `snowtype.config.json`, `snowtype.config.js`, or `snowtype.config.ts`.


<Tabs groupId="config" queryString>
  <TabItem value="javascript" label="JavaScript">

```javascript title="snowtype.config.js"
const config = {
    "organizationId": "a654321b-c111-33d3-e321-1f123456789g",
    "tracker": "@snowplow/browser-tracker",
    "language": "typescript",
    "outpath": "./src/snowtype",
    "eventSpecificationIds": [
        "a123456b-c222-11d1-e123-1f123456789g"
    ],
    "dataProductIds": [
        "a123456b-c222-11d1-e123-1f12345678dp"
    ],
    "dataStructures": [
        "iglu:com.myorg/custom_web_page/jsonschema/1-1-0"
    ],
    "igluCentralSchemas": [
        "iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0"
    ],
    "repositories": ["../data-structures"],
    "namespace": "Snowtype",
    "options": {
        "commands": {
            "generate": {
                "instructions": true,
                "validations": true,
                "disallowDevSchemas": true
            },
            "update": {
                "maximumBump": "minor",
                "showOnlyProdUpdates": true
            },
            "patch": {
                "regenerateOnPatch": false
            }
        }
    }
};

module.exports = config;
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript title="snowtype.config.ts"
const config = {
    organizationId: "a654321b-c111-33d3-e321-1f123456789g",
    tracker: "@snowplow/browser-tracker" as const,
    language: "typescript" as const,
    outpath: "./src/snowtype",
    eventSpecificationIds: [
        "a123456b-c222-11d1-e123-1f123456789g"
    ],
    dataProductIds: [
        "a123456b-c222-11d1-e123-1f12345678dp"
    ],
    dataStructures: [
        "iglu:com.myorg/custom_web_page/jsonschema/1-1-0"
    ],
    igluCentralSchemas: [
        "iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0"
    ],
    repositories: ["../data-structures"],
    namespace: "Snowtype",
    options: {
        commands: {
            generate: {
                instructions: true,
                validations: true,
                disallowDevSchemas: true
            },
            update: {
                maximumBump: "minor",
                showOnlyProdUpdates: true
            },
            patch: {
                regenerateOnPatch: false
            }
        }
    }
};

export default config;
```

  </TabItem>
</Tabs>

## Supported trackers and languages

Set `tracker` and `language` to a valid combination from this table:

| Tracker                                                         | `tracker`                        | `language`                 |
| --------------------------------------------------------------- | -------------------------------- | -------------------------- |
| [Browser](/docs/sources/web-trackers/index.md)                  | `@snowplow/browser-tracker`      | `javascript`, `typescript` |
| [JavaScript](/docs/sources/web-trackers/index.md)               | `@snowplow/javascript-tracker`   | `javascript`               |
| [iOS](/docs/sources/mobile-trackers/index.md)                   | `snowplow-ios-tracker`           | `swift`                    |
| [Android](/docs/sources/mobile-trackers/index.md)               | `snowplow-android-tracker`       | `kotlin`                   |
| [React Native](/docs/sources/react-native-tracker/index.md)     | `@snowplow/react-native-tracker` | `typescript`               |
| [Flutter](/docs/sources/flutter-tracker/index.md)               | `snowplow-flutter-tracker`       | `dart`                     |
| [Node.js](/docs/sources/node-js-tracker/index.md)               | `@snowplow/node-tracker`         | `javascript`, `typescript` |
| [Go](/docs/sources/golang-tracker/index.md)                     | `snowplow-golang-tracker`        | `go`                       |
| [Java](/docs/sources/java-tracker/index.md)                     | `snowplow-java-tracker`          | `java`                     |
| [Google Tag Manager](/docs/sources/google-tag-manager/index.md) | `google-tag-manager`             | `javascript-gtm`           |

## Command options

The `options` object configures the behavior of specific Snowtype commands. You can set these in the configuration file so they apply on every run, or override them with CLI flags. See the [commands reference](/docs/event-studio/implement-tracking/command-reference/index.md) for more details on the flags.

:::note Flag priority
CLI flags take precedence over values set in the configuration file.
:::

### `generate`

The `generate` options apply when running `snowtype generate`, which creates the initial code based on your configuration and schemas.

| Option                                | Type      | Default | Description                                                                                                                                                                                          | Equivalent flag                         |
| ------------------------------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `instructions`                        | `boolean` | `false` | Generate a [Markdown file](/docs/event-studio/implement-tracking/generate-tracking-code/index.md#markdown-instructions) with implementation instructions for each event specification                | `--instructions`                        |
| `validations`                         | `boolean` | `false` | Include runtime [client-side validation](/docs/event-studio/implement-tracking/client-side-validation/index.md) code in the output                                                                   | `--validations`                         |
| `disallowDevSchemas`                  | `boolean` | `false` | Fail generation if any schema is only deployed to the development environment                                                                                                                        | `--disallowDevSchemas`                  |
| `deprecateOnlyOnProdAvailableUpdates` | `boolean` | `false` | Only show [deprecation warnings](/docs/event-studio/implement-tracking/generate-tracking-code/index.md#deprecation-and-hidden-warnings) for schemas that have a newer version deployed to production | `--deprecateOnlyOnProdAvailableUpdates` |

```json title="Example"
{
    "options": {
        "commands": {
            "generate": {
                "instructions": true,
                "validations": true,
                "disallowDevSchemas": true
            }
        }
    }
}
```

### `update`

The `update` options apply when running `snowtype update`, which checks for new schema versions and regenerates code if needed.

| Option                | Type                                | Default   | Description                                                                                                                                                              |
| --------------------- | ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `regenerateOnUpdate`  | `boolean`                           | `true`    | Automatically regenerate code after accepting updates.                                                                                                                   |
| `maximumBump`         | `"major"` \| `"minor"` \| `"patch"` | `"major"` | The highest [SchemaVer](/docs/fundamentals/schemas/index.md) bump level to include in update checks. For example, setting this to `"minor"` hides major version updates. |
| `showOnlyProdUpdates` | `boolean`                           | `false`   | Only show updates for data structures that have been deployed to the production environment.                                                                             |

```json title="Example"
{
    "options": {
        "commands": {
            "update": {
                "maximumBump": "minor",
                "showOnlyProdUpdates": true
            }
        }
    }
}
```

### `patch`

The `patch` option applies when running `snowtype patch`, which adds new sources to your configuration file and optionally regenerates code.

| Option              | Type      | Default | Description                                                                   |
| ------------------- | --------- | ------- | ----------------------------------------------------------------------------- |
| `regenerateOnPatch` | `boolean` | `true`  | Automatically regenerate code after adding new schemas with `snowtype patch`. |

```json title="Example"
{
    "options": {
        "commands": {
            "patch": {
                "regenerateOnPatch": false
            }
        }
    }
}
```

## Swift namespace

The `namespace` option applies only when generating Swift code. It adds a prefix to all generated classes, which helps avoid naming conflicts in your project.

For example, setting `namespace` to `"Snowtype"`:

```json title="snowtype.config.json"
{
    "tracker": "snowplow-ios-tracker",
    "language": "swift",
    "outpath": "./Sources/Tracking",
    "namespace": "Snowtype"
}
```

This results in classes accessed with the `Snowtype` prefix:

```swift
let data = Snowtype.AccountConfirmed(
    companyCountry: "US",
    companyName: "Acme Corp"
)
```

Setting a `namespace` when generating code for a non-Swift tracker will trigger an error.

## Full configuration type

For TypeScript users, this is the complete type definition for the configuration file:

```typescript
type SnowtypeConfig = {
    tracker:
        | "@snowplow/browser-tracker"
        | "@snowplow/javascript-tracker"
        | "@snowplow/node-tracker"
        | "@snowplow/react-native-tracker"
        | "snowplow-android-tracker"
        | "snowplow-ios-tracker"
        | "snowplow-golang-tracker"
        | "snowplow-flutter-tracker"
        | "snowplow-java-tracker";
    language:
        | "typescript"
        | "javascript"
        | "kotlin"
        | "swift"
        | "go"
        | "dart"
        | "java";
    outpath: string;
    organizationId?: string;
    eventSpecificationIds?: string[];
    dataProductIds?: string[];
    dataStructures?: string[];
    igluCentralSchemas?: string[];
    repositories?: string[];
    namespace?: string;
    options?: {
        commands: {
            generate?: {
                instructions?: boolean;
                validations?: boolean;
                disallowDevSchemas?: boolean;
                deprecateOnlyOnProdAvailableUpdates?: boolean;
            };
            update?: {
                regenerateOnUpdate?: boolean;
                maximumBump?: "major" | "minor" | "patch";
                showOnlyProdUpdates?: boolean;
            };
            patch?: {
                regenerateOnPatch?: boolean;
            };
        };
    };
};
```
