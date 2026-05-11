---
title: "YAUAA enrichment"
sidebar_position: 9
sidebar_label: YAUAA
description: "Parse user agent strings with advanced detection using Yet Another UserAgent Analyzer for detailed device insights."
keywords: ["YAUAA", "user agent analysis", "device fingerprinting"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

The YAUAA (Yet Another User Agent Analyzer) enrichment is a user agent parser and analyzer. It uses the [YAUAA library](https://yauaa.basjes.nl/). This enrichment doesn't call any external APIs.

:::note[Memory usage]
YAUAA parsing relies on in-memory `HashMaps`, and requires approximately [120 MB of RAM](https://yauaa.basjes.nl/using/memoryusage/). Additional memory is also used for caching by default.

If memory usage is a concern, consider using the [UA parser enrichment](/docs/pipeline/enrichments/available-enrichments/ua-parser-enrichment/index.md) instead.
:::

This enrichment adds an additional entity to the event.

## Configure your website to send client hints TODO

The current trend in web browsers is to reduce the amount of information sent to servers in the `User-Agent` HTTP header, to help with user privacy. [Client Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints) are a way for sites to opt in to sending the extra information which previously would have been part of the user agent header.

The YAUAA enrichment does not require you to make any changes to your website, if you are happy with the level of detail you get from the reduced user agent.  However, it is possible to improve the accuracy of the user agent data produced by YAUAA, if you are able to configure your website to send [high entropy client hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints) to the collector by following these instructions.

There are two ways for your website to opt-in to sending client hints to the collector.  In the first method, you must configure your webserver to set both a [`Accept-CH` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) and a [`Permissions-Policy` HTTP header](https://www.w3.org/TR/permissions-policy-1/) when serving the your site's main HTML pages:

```
Accept-CH: sec-ch-ua, sec-ch-ua-full-version-list, sec-ch-ua-full-version, sec-ch-ua-mobile, sec-ch-ua-platform, sec-ch-ua-platform-version, sec-ch-ua-arch, sec-ch-ua-bitness, sec-ch-ua-model, sec-ch-ua-wow64
Permissions-Policy: ch-ua=("https://<YOUR COLLECTOR>"), ch-ua-full-version-list=("https://<YOUR COLLECTOR>"), ch-ua-full-version=("https://<YOUR COLLECTOR>"), ch-ua-mobile=("https://<YOUR COLLECTOR>"), ch-ua-platform=("https://<YOUR COLLECTOR>"), ch-ua-platform-version=("https://<YOUR COLLECTOR>"), ch-ua-arch=("https://<YOUR COLLECTOR>"), ch-ua-bitness=("https://<YOUR COLLECTOR>"), ch-ua-model=("https://<YOUR COLLECTOR>"), ch-ua-wow64=("https://<YOUR COLLECTOR>"),
```

Alternatively, in the second method, you can put a `meta` tag in the header secion of your site's HTML:

```
<meta http-equiv="delegate-ch" content="sec-ch-ua https://<YOUR COLLECTOR>; sec-ch-ua-full-version-list https://<YOUR COLLECTOR>; sec-ch-ua-full-version https://<YOUR COLLECTOR>; sec-ch-ua-mobile https://<YOUR COLLECTOR>; sec-ch-ua-platform https://<YOUR COLLECTOR>; sec-ch-ua-platform-version https://<YOUR COLLECTOR>; sec-ch-ua-arch https://<YOUR COLLECTOR>; sec-ch-ua-bitness https://<YOUR COLLECTOR>; sec-ch-ua-model https://<YOUR COLLECTOR>; sec-ch-ua-wow64 https://<YOUR COLLECTOR>;">
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

## Input

This enrichment uses the following inputs:
- The `User-Agent` HTTP header of the tracker request.
- The `useragent` field from the [tracker payload](/docs/fundamentals/canonical-event/index.md#device-and-operating-system-fields), if set. This field has priority over the `User-Agent` HTTP header.
- Client hint HTTP headers.  These are [a set of standard headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints) such as `Sec-CH-UA` which provide extra detail about the user agent. TODO

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
