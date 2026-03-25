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

Snowtype reads its settings from a configuration file in your project root. The file is created when you run [`snowtype init`](/docs/event-studio/implement-tracking/snowtype/get-started/index.md), and you can edit it directly at any time.

<TrackingPlansNomenclature />

## Config file formats

The configuration file can be JSON, JavaScript, or TypeScript. The file name must start with `snowtype.config` — for example, `snowtype.config.json`, `snowtype.config.js`, or `snowtype.config.ts`.

<Tabs groupId="config" queryString>
  <TabItem value="json" label="JSON" default>

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
    "repositories": ["../data-structures"]
}
```

  </TabItem>
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
    "repositories": ["../data-structures"]
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
    repositories: ["../data-structures"]
};

export default config;
```

  </TabItem>
</Tabs>

:::note
Keep the configuration file in the root of your project. CLI flags take precedence over values set in the configuration file.
:::

## Configuration attributes

### Required attributes

| Attribute  | Type     | Description                                                                                                                                        |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tracker`  | `string` | The Snowplow tracker to generate code for. Determines the structure of the output. See [supported trackers](#supported-trackers).                  |
| `language` | `string` | The programming language for the generated code. Must be a valid language for the selected tracker. See [supported trackers](#supported-trackers). |
| `outpath`  | `string` | The output path for the generated code file, relative to the working directory when you run the command.                                           |

### Optional attributes

| Attribute               | Type       | Description                                                                                                                                                                           |
| ----------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `organizationId`        | `string`   | Your Snowplow [organization ID](/docs/account-management/index.md). Required when generating code from event specifications, tracking plans, or data structures published in Console. |
| `eventSpecificationIds` | `string[]` | An array of [event specification](/docs/event-studio/tracking-plans/event-specifications/index.md) IDs to generate code for.                                                          |
| `dataProductIds`        | `string[]` | An array of [tracking plan](/docs/event-studio/tracking-plans/index.md) IDs. Generates code for all event specifications in each tracking plan.                                       |
| `dataStructures`        | `string[]` | An array of Iglu schema URIs for [data structures](/docs/fundamentals/schemas/index.md) published in Console (for example, `iglu:com.example/my_event/jsonschema/1-0-0`).             |
| `igluCentralSchemas`    | `string[]` | An array of Iglu schema URIs for schemas hosted on [Iglu Central](https://iglucentral.com/) (for example, `iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0`).           |
| `repositories`          | `string[]` | An array of paths to local schema repositories managed with [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/data-structures/index.md).                         |
| `namespace`             | `string`   | A namespace prefix for the generated code. Only applies to the Swift tracker. See [namespace](#namespace).                                                                            |

### Supported trackers

Each tracker supports one or more languages. Set `tracker` and `language` to a valid combination from this table:

| Tracker                          | Language(s)                |
| -------------------------------- | -------------------------- |
| `@snowplow/browser-tracker`      | `javascript`, `typescript` |
| `@snowplow/node-tracker`         | `javascript`, `typescript` |
| `@snowplow/react-native-tracker` | `typescript`               |
| `@snowplow/javascript-tracker`   | `javascript`               |
| `snowplow-golang-tracker`        | `go`                       |
| `snowplow-ios-tracker`           | `swift`                    |
| `snowplow-android-tracker`       | `kotlin`                   |
| `snowplow-flutter-tracker`       | `dart`                     |
| `snowplow-java-tracker`          | `java`                     |

## Command options

The `options` object configures the behavior of specific Snowtype commands. You can set these in the configuration file so they apply on every run, or override them with CLI flags. See the [commands reference](/docs/event-studio/implement-tracking/snowtype/commands/index.md) for the equivalent flags.

### `options.commands.generate`

| Option                                | Type      | Default | Description                                                                                                                                                                          |
| ------------------------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `instructions`                        | `boolean` | `false` | Generate a Markdown file with implementation instructions for each event specification. Equivalent to the `--instructions` flag.                                                     |
| `validations`                         | `boolean` | `false` | Include runtime [client-side validation](/docs/event-studio/implement-tracking/snowtype/client-side-validation/index.md) code in the output. Equivalent to the `--validations` flag. |
| `disallowDevSchemas`                  | `boolean` | `false` | Fail generation if any schema is only deployed to the development environment. Equivalent to the `--disallowDevSchemas` flag.                                                        |
| `deprecateOnlyOnProdAvailableUpdates` | `boolean` | `false` | Only show deprecation warnings for schemas that have a newer version deployed to production. Equivalent to the `--deprecateOnlyOnProdAvailableUpdates` flag.                         |

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

### `options.commands.update`

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

### `options.commands.patch`

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

## Namespace

The `namespace` option applies only when generating Swift code. It adds a prefix to all generated classes, which helps avoid naming conflicts in your project.

For example, setting `namespace` to `"Snowtype"`:

```json title="snowtype.config.json"
{
    "tracker": "snowplow-ios-tracker",
    "language": "swift",
    "namespace": "Snowtype",
    "outpath": "./Sources/Tracking"
}
```

Results in classes accessed with the `Snowtype` prefix:

```swift
let data = Snowtype.AccountConfirmed(
    companyCountry: "US",
    companyName: "Acme Corp"
)
```

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
