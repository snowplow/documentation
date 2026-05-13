---
title: "YAUAA enrichment"
sidebar_position: 9
sidebar_label: YAUAA
description: "Parse user agent strings with advanced detection using Yet Another UserAgent Analyzer for detailed device insights."
keywords: ["YAUAA", "user agent analysis", "device fingerprinting"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

The YAUAA (Yet Another User Agent Analyzer) enrichment is a user agent parser and analyzer. It uses the [YAUAA library](https://yauaa.basjes.nl/). The library is stored in memory; there is no interaction with an external system.

If you don't need the full YAUAA output, consider using the [UA parser enrichment](/docs/pipeline/enrichments/available-enrichments/ua-parser-enrichment/index.md) instead.

This enrichment adds an additional entity to the event.

## Input

This enrichment uses the following inputs:
- The `User-Agent` HTTP header of the tracker request.
- The `useragent` field from the [tracker payload](/docs/events/ootb-data/device-and-browser/index.md), if set. This field has priority over the `User-Agent` HTTP header.
- [Client hint](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Client_hints) HTTP request headers.

The supported client hints headers are:
- `Sec-CH-UA` (low entropy)
- `Sec-CH-UA-Mobile` (low entropy)
- `Sec-CH-UA-Platform` (low entropy)
- `Sec-CH-UA-Full-Version-List`
- `Sec-CH-UA-Full-Version` (deprecated)
- `Sec-CH-UA-Arch`
- `Sec-CH-UA-Bitness`
- `Sec-CH-UA-Model`
- `Sec-CH-UA-Platform-Version`

## Configure high-entropy client hints

The YAUAA enrichment does not require you to make any changes to your website, if you are happy with the level of detail you get from the default user agent strings.  However, it is possible to improve the accuracy of the user agent data produced by YAUAA, if you are able to configure your website to send [high-entropy client hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Client_hints#high_entropy_hints) to the Collector by following these instructions.

Chromium browsers will include low-entropy client hint HTTP request headers by default. To include the more detailed high-entropy client hint headers, additional configuration is required: specifying the hints to include with `Permissions-Policy` and `Accept-CH`.

Update the URLs to your Collector, and add this configuration to your web server:

```txt
Accept-CH: sec-ch-ua-full-version-list, sec-ch-ua-platform-version, sec-ch-ua-arch, sec-ch-ua-bitness, sec-ch-ua-model
Permissions-Policy: ch-ua-full-version-list=("https://<YOUR COLLECTOR>"), ch-ua-platform-version=("https://<YOUR COLLECTOR>"), ch-ua-arch=("https://<YOUR COLLECTOR>"), ch-ua-bitness=("https://<YOUR COLLECTOR>"), ch-ua-model=("https://<YOUR COLLECTOR>")
```

Alternatively, add the following `meta` tag with `Delegate-CH` to the header section of your site's HTML, updating the URLs to your Collector:

```html
<meta http-equiv="Delegate-CH" content="sec-ch-ua-full-version-list https://<YOUR COLLECTOR>; sec-ch-ua-platform-version https://<YOUR COLLECTOR>; sec-ch-ua-arch https://<YOUR COLLECTOR>; sec-ch-ua-bitness https://<YOUR COLLECTOR>; sec-ch-ua-model https://<YOUR COLLECTOR>">
```

## Configuration

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow.enrichments/yauaa_enrichment_config/jsonschema/1-0-0",
    data: {
      enabled: true,
      vendor: "com.snowplowanalytics.snowplow.enrichments",
      name: "yauaa_enrichment_config"
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for YAUAA enrichment config", "self": { "vendor": "com.snowplowanalytics.snowplow.enrichments", "name": "yauaa_enrichment_config", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "cacheSize": { "type": "integer" } }, "additionalProperties": false } }, "required": ["vendor", "name", "enabled"], "additionalProperties": false }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

The `cacheSize` property determines the number of already parsed user agents that are kept in memory for faster processing. By default, the cache size is 10000. Set `cacheSize` to 0 to disable caching.

## Output

This enrichment adds a `yauaa_context` entity to the event.

If a field can't be determined, it won't be included. However, some fields can have the value `UNKNOWN`. The only field that will always be present is `deviceClass`. Check out the [YAUAA documentation](https://yauaa.basjes.nl/expect/fieldvalues/) for more details on the output fields.

<SchemaProperties
  overview={{ entity: true }}
  example={{
    deviceClass: "Phone",
    deviceName: "Samsung SM-G960F",
    deviceBrand: "Samsung",
    operatingSystemClass: "Mobile",
    operatingSystemName: "Android",
    operatingSystemVersion: "8.0.0",
    operatingSystemNameVersion: "Android 8.0.0",
    operatingSystemVersionBuild: "R16NW",
    layoutEngineClass: "Browser",
    layoutEngineName: "Blink",
    layoutEngineVersion: "62.0",
    layoutEngineVersionMajor: "62",
    layoutEngineNameVersion: "Blink 62.0",
    layoutEngineNameVersionMajor: "Blink 62",
    agentClass: "Browser",
    agentName: "Chrome",
    agentVersion: "62.0.3202.84",
    agentVersionMajor: "62",
    agentNameVersion: "Chrome 62.0.3202.84",
    agentNameVersionMajor: "Chrome 62"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an entity generated by the YAUAA enrichment after parsing the user agent", "self": { "vendor": "nl.basjes", "name": "yauaa_context", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "deviceClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "enum": ["Desktop", "Anonymized", "Unknown", "UNKNOWN", "Mobile", "Tablet", "Phone", "Watch", "Virtual Reality", "eReader", "Set-top box", "TV", "Game Console", "Handheld Game Console", "Voice", "Robot", "Robot Mobile", "Spy", "Hacker"] }, "deviceName": { "description": "Example: Google Nexus 6", "type": "string", "maxLength": 100 }, "deviceBrand": { "description": "Example: Google", "type": "string", "maxLength": 50 }, "deviceCpu": { "type": "string", "maxLength": 50 }, "deviceCpuBits": { "type": "string", "maxLength": 20 }, "deviceFirmwareVersion": { "type": "string", "maxLength": 100 }, "deviceVersion": { "type": "string", "maxLength": 100 }, "operatingSystemClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "enum": ["Desktop", "Mobile", "Cloud", "Embedded", "Game Console", "Hacker", "Anonymized", "Unknown"] }, "operatingSystemName": { "description": "Examples: Linux, Android.", "type": "string", "maxLength": 100 }, "operatingSystemVersion": { "type": "string", "maxLength": 50 }, "operatingSystemNameVersion": { "type": "string", "maxLength": 150 }, "operatingSystemVersionBuild": { "type": "string", "maxLength": 100 }, "layoutEngineClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "enum": ["Browser", "Mobile App", "Hacker", "Robot", "Unknown"] }, "layoutEngineName": { "type": "string", "maxLength": 100 }, "layoutEngineVersion": { "type": "string", "maxLength": 50 }, "layoutEngineVersionMajor": { "type": "string", "maxLength": 20 }, "layoutEngineNameVersion": { "type": "string", "maxLength": 150 }, "layoutEngineNameVersionMajor": { "type": "string", "maxLength": 120 }, "layoutEngineBuild": { "type": "string", "maxLength": 100 }, "agentClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "enum": ["Browser", "Browser Webview", "Mobile App", "Robot", "Robot Mobile", "Cloud Application", "Email Client", "Voice", "Special", "Testclient", "Hacker", "Unknown"] }, "agentName": { "description": "Example: Chrome.", "type": "string", "maxLength": 100 }, "agentVersion": { "type": "string", "maxLength": 100 }, "agentVersionMajor": { "type": "string", "maxLength": 20 }, "agentNameVersion": { "type": "string", "maxLength": 200 }, "agentNameVersionMajor": { "type": "string", "maxLength": 120 }, "agentBuild": { "type": "string", "maxLength": 100 }, "agentLanguage": { "type": "string", "maxLength": 50 }, "agentLanguageCode": { "type": "string", "maxLength": 20 }, "agentInformationEmail": { "type": "string", "format": "email" }, "agentInformationUrl": { "type": "string" }, "agentSecurity": { "type": "string", "enum": ["Weak security", "Strong security", "Unknown", "Hacker"] }, "agentUuid": { "type": "string" }, "webviewAppName": { "type": "string" }, "webviewAppVersion": { "type": "string" }, "webviewAppVersionMajor": { "type": "string", "maxLength": 50 }, "webviewAppNameVersionMajor": { "type": "string", "maxLength": 50 }, "facebookCarrier": { "type": "string" }, "facebookDeviceClass": { "type": "string", "maxLength": 1024 }, "facebookDeviceName": { "type": "string", "maxLength": 1024 }, "facebookDeviceVersion": { "type": "string" }, "facebookFBOP": { "type": "string" }, "facebookFBSS": { "type": "string" }, "facebookOperatingSystemName": { "type": "string" }, "facebookOperatingSystemVersion": { "type": "string" }, "anonymized": { "type": "string" }, "hackerAttackVector": { "type": "string" }, "hackerToolkit": { "type": "string" }, "koboAffiliate": { "type": "string" }, "koboPlatformId": { "type": "string" }, "iECompatibilityVersion": { "type": "string", "maxLength": 100 }, "iECompatibilityVersionMajor": { "type": "string", "maxLength": 50 }, "iECompatibilityNameVersion": { "type": "string", "maxLength": 50 }, "iECompatibilityNameVersionMajor": { "type": "string", "maxLength": 70 }, "carrier": { "type": "string" }, "gSAInstallationID": { "type": "string" }, "networkType": { "type": "string" }, "operatingSystemNameVersionMajor": { "type": "string" }, "operatingSystemVersionMajor": { "type": "string" } }, "required": ["deviceClass"], "additionalProperties": false }} />
