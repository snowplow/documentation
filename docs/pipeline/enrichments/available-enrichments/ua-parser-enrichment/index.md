---
title: "UA parser enrichment (legacy)"
sidebar_position: 1
sidebar_label: UA parser (legacy)
description: "Parse user agent strings to extract browser, operating system, and device information."
keywords: ["user agent parser", "browser detection", "device detection"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

:::tip[Use YAUAA instead]
The [YAUAA enrichment](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md) supersedes this enrichment and is preferable in most cases.
:::

This enrichment uses the [ua-parser library](https://github.com/ua-parser/uap-core/) to parse the user agent and provide information about the user's device.

Both the UA parser and YAUAA enrichments will add an additional entity to the event, based on the information available in the `User-Agent` header of the tracker request, or the `ua` [tracker payload field](/docs/fundamentals/canonical-event/index.md#browser-fields). Unlike YAUAA, this enrichment doesn't support client hints.

## UA parser vs YAUAA

This table compares the output of the two user agent parsing enrichments. The UA parser enrichment provides fewer fields, but is more lightweight and has lower memory requirements than YAUAA.

The example output is based on the user agent string `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0` (Firefox 106 on Mac OS X).

| UA Parser field    | YAUAA field                       | Example         |
| ------------------ | --------------------------------- | --------------- |
| `deviceFamily`     | `deviceClass`                     | Desktop         |
| ❌                  | `deviceName`                      | Apple Macintosh |
| ❌                  | `deviceBrand`                     | Apple           |
| ❌                  | `deviceCpu`                       | Intel           |
| ❌                  | `deviceCpuBits`                   | 32              |
| ❌                  | `deviceFirmwareVersion`           |                 |
| ❌                  | `deviceVersion`                   |                 |
| ❌                  | `operatingSystemClass`            | Desktop         |
| `osFamily`         | `operatingSystemName`             | Mac OS X        |
| `osVersion`        | `operatingSystemVersion`          | 10.15           |
| `osMajor`          | `operatingSystemVersionMajor`     | 10              |
| `osMinor`          | ❌                                 | 15              |
| `osPatch`          | ❌                                 |                 |
| `osPatchMinor`     | `operatingSystemVersionBuild`     |                 |
| ❌                  | `operatingSystemNameVersion`      | Mac OS X 10.15  |
| ❌                  | `operatingSystemNameVersionMajor` | Mac OS X 10     |
| ❌                  | `layoutEngineClass`               | Browser         |
| ❌                  | `layoutEngineName`                | Gecko           |
| ❌                  | `layoutEngineVersion`             | 106.0           |
| ❌                  | `layoutEngineVersionMajor`        | 106             |
| ❌                  | `layoutEngineNameVersion`         | Gecko 106.0     |
| ❌                  | `layoutEngineNameVersionMajor`    | Gecko 106       |
| ❌                  | `layoutEngineBuild`               | 20100101        |
| ❌                  | `agentClass`                      | Browser         |
| `useragentFamily`  | `agentName`                       | Firefox         |
| `useragentVersion` | `agentVersion`                    | 106.0           |
| `useragentMajor`   | `agentVersionMajor`               | 106             |
| `useragentMinor`   | ❌                                 | 0               |
| `useragentPatch`   | ❌                                 |                 |
| ❌                  | `agentNameVersion`                | Firefox 106.0   |
| ❌                  | `agentNameVersionMajor`           | Firefox 106     |
| ❌                  | `agentBuild`                      |                 |
| ❌                  | `agentLanguage`                   |                 |
| ❌                  | `agentLanguageCode`               |                 |
| ❌                  | `agentInformationEmail`           |                 |
| ❌                  | `agentInformationUrl`             |                 |
| ❌                  | `agentSecurity`                   |                 |
| ❌                  | `agentUuid`                       |                 |
| ❌                  | `webviewAppName`                  |                 |
| ❌                  | `webviewAppVersion`               |                 |
| ❌                  | `webviewAppVersionMajor`          |                 |
| ❌                  | `webviewAppNameVersionMajor`      |                 |
| ❌                  | `facebookCarrier`                 |                 |
| ❌                  | `facebookDeviceClass`             |                 |
| ❌                  | `facebookDeviceName`              |                 |
| ❌                  | `facebookDeviceVersion`           |                 |
| ❌                  | `facebookFBOP`                    |                 |
| ❌                  | `facebookFBSS`                    |                 |
| ❌                  | `facebookOperatingSystemName`     |                 |
| ❌                  | `facebookOperatingSystemVersion`  |                 |
| ❌                  | `anonymized`                      |                 |
| ❌                  | `hackerAttackVector`              |                 |
| ❌                  | `hackerToolkit`                   |                 |
| ❌                  | `koboAffiliate`                   |                 |
| ❌                  | `koboPlatformId`                  |                 |
| ❌                  | `iECompatibilityVersion`          |                 |
| ❌                  | `iECompatibilityVersionMajor`     |                 |
| ❌                  | `iECompatibilityNameVersion`      |                 |
| ❌                  | `iECompatibilityNameVersionMajor` |                 |
| ❌                  | `carrier`                         |                 |
| ❌                  | `gSAInstallationID`               |                 |
| ❌                  | `networkType`                     |                 |

## Configuration

The optional `database` and `uri` parameters allow you to specify a custom ruleset. By default, the enrichment will use the one defined in the [ua-parser](https://github.com/ua-parser/uap-core/) library.

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow/ua_parser_config/jsonschema/1-0-1",
    data: {
      vendor: "com.snowplowanalytics.snowplow",
      name: "ua_parser_config",
      enabled: true,
      parameters: {
        database: "regexes-latest.yaml",
        uri: "s3://snowplow-hosted-assets/third-party/ua-parser/"
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for configuration of ua-parser enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "ua_parser_config", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "database": { "type": "string" }, "uri": { "type": "string", "format": "uri" } }, "additionalProperties": false } }, "required": ["name", "vendor", "enabled"], "additionalProperties": false }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

## Output

This enrichment adds a `ua_parser_context` entity to the event. The example data shows the output for a `User-Agent` string of

```txt
Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36
```

<SchemaProperties
  overview={{ entity: true }}
  example={{
    useragentFamily: "Chrome",
    useragentMajor: "48",
    useragentPatch: "2564",
    useragentVersion: "48.0.2564",
    osFamily: "Windows 7",
    osVersion: "Windows 7",
    deviceFamily: "Computer"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for useragent context generated by ua-parser enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "ua_parser_context", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "useragentFamily": { "type": "string", "description": "Useragent family (browser) name" }, "useragentMajor": { "type": ["string", "null"], "description": "Useragent major version" }, "useragentMinor": { "type": ["string", "null"], "description": "Useragent minor version" }, "useragentPatch": { "type": ["string", "null"], "description": "Useragent patch version" }, "useragentVersion": { "type": "string", "description": "Full version of the useragent" }, "osFamily": { "type": "string", "description": "Operating system name" }, "osMajor": { "type": ["string", "null"], "description": "Operating system major version" }, "osMinor": { "type": ["string", "null"], "description": "Operating system minor version" }, "osPatch": { "type": ["string", "null"], "description": "Operating system patch version" }, "osPatchMinor": { "type": ["string", "null"], "description": "Operating system patch minor version" }, "osVersion": { "type": "string", "description": "Operating system full version" }, "deviceFamily": { "type": "string", "description": "Device type" } }, "required": ["useragentFamily", "useragentMajor", "useragentMinor", "osFamily", "deviceFamily"], "additionalProperties": false }} />
