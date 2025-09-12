---
title: "UA parser enrichment"
description: "Parse user agent strings to extract browser, operating system, and device information for behavioral analysis."
schema: "TechArticle"
keywords: ["User Agent", "UA Parsing", "Browser Detection", "Device Analysis", "Browser Intelligence", "Agent Parser"]
sidebar_position: 1
sidebar_label: UA parser 
---

This enrichment uses the [ua-parser library](https://github.com/ua-parser/uap-core/) to parse the user agent and provide information about the user's device.

Collecting and separating out all the valuable device information to be found in the user agent is a great way to get insight into the types of devices and operating systems and versions your users are using. This helps with deciding which to support as well as in decisions around functionality releases.

With the device family field which is part of the context you can also benefit from the lookup done with our database to sort the multitude of different devices into higher level device types like desktop, mobile, tablet, other, etc.

:::note

The [YAUAA Enrichment](../yauaa-enrichment/index.md) supersedes this enrichment and is preferable in most cases as it will generate a richer dataset. 

You can continue to use the UA Parser Enrichment. It is handy if you have memory constraints running the Enrich application, as it uses significantly less memory than the YAUAA enrichment. Additionally, the UA Parser enrichment does further parsing of the Operating System and Browser Version numbers.

Both enrichments will produce an additional entity attached to an event, based on the information available in the `User-Agent` header of the request from a user’s browser.

<details>

<summary>UA Parser vs YAUAA Output</summary>

| UA Parser Field  | YAUAA Field                                 | Example (Firefox 106 on Mac OS X)       |
|-------------------|----------------------------------------------|-----------------------------------------|
| device_family     | deviceClass                                  | Desktop                                 |
| ❌                | deviceName                                   | Apple Macintosh                         |
| ❌                | deviceBrand                                  | Apple                                   |
| ❌                | deviceCpu                                    | Intel                                   |
| ❌                | deviceCpuBits                                | 32                                      |
| ❌                | deviceFirmwareVersion                        |                                         |
| ❌                | deviceVersion                                |                                         |
| ❌                | operatingSystemClass                         | Desktop                                 |
| os_family         | operatingSystemName                          | Mac OS X                                |
| os_version        | operatingSystemVersion                       | 10.15                                   |
| os_major          | operatingSystemVersionMajor                  | 10                                      |
| os_minor          | ❌                                           | 15                                      |
| os_patch          | ❌                                           |                                         |
| os_patch_minor    | operatingSystemVersionBuild                  |                                         |
| ❌                | operatingSystemNameVersion                   | Mac OS X 10.15                          |
| ❌                | operatingSystemNameVersionMajor              | Mac OS X 10                             |
| ❌                | layoutEngineClass                            | Browser                                 |
| ❌                | layoutEngineName                             | Gecko                                   |
| ❌                | layoutEngineVersion                          | Gecko 106.0                             |
| ❌                | layoutEngineVersionMajor                     | Gecko 106                               |
| ❌                | layoutEngineNameVersion                      | 106.0                                   |
| ❌                | layoutEngineNameVersionMajor                 | 106                                     |
| ❌                | layoutEngineBuild                            | 20100101                                |
| ❌                | agentClass                                   | Browser                                 |
| useragent_family  | agentName                                    | Firefox                                 |
| useragent_version | agentVersion                                 | 106.0                                   |
| useragent_major   | agentVersionMajor                            | 106                                     |
| useragent_minor   | ❌                                           | 0                                       |
| useragent_patch   | ❌                                           |                                         |
| ❌                | agentNameVersion                             | Firefox 106.0                           |
| ❌                | agentNameVersionMajor                        | Firefox 106                             |
| ❌                | agentBuild                                   |                                         |
| ❌                | agentLanguage                                |                                         |
| ❌                | agentLanguageCode                            |                                         |
| ❌                | agentInformationEmail                        |                                         |
| ❌                | agentInformationUrl                          |                                         |
| ❌                | agentSecurity                                |                                         |
| ❌                | agentUuid                                    |                                         |
| ❌                | webviewAppName                               |                                         |
| ❌                | webviewAppVersion                            |                                         |
| ❌                | webviewAppVersionMajor                       |                                         |
| ❌                | webviewAppNameVersionMajor                   |                                         |
| ❌                | facebookCarrier                              |                                         |
| ❌                | facebookDeviceClass                          |                                         |
| ❌                | facebookDeviceName                           |                                         |
| ❌                | facebookDeviceVersion                        |                                         |
| ❌                | facebookFBOP                                 |                                         |
| ❌                | facebookFBSS                                 |                                         |
| ❌                | facebookOperatingSystemName                  |                                         |
| ❌                | facebookOperatingSystemVersion               |                                         |
| ❌                | anonymized                                   |                                         |
| ❌                | hackerAttackVector                           |                                         |
| ❌                | hackerToolkit                                |                                         |
| ❌                | koboAffiliate                                |                                         |
| ❌                | koboPlatformId                               |                                         |
| ❌                | iECompatibilityVersion                       |                                         |
| ❌                | iECompatibilityVersionMajor                  |                                         |
| ❌                | iECompatibilityNameVersion                   |                                         |
| ❌                | iECompatibilityNameVersionMajor              |                                         |
| ❌                | carrier                                      |                                         |
| ❌                | gSAInstallationID                            |                                         |
| ❌                | networkType                                  |                                         |

</details>

:::

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ua_parser_config/jsonschema/1-0-1)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/ua_parser_config.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

## Input

This enrichment uses the field `useragent`.

## Output

This enrichment adds a new context to the enriched event with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ua_parser_context/jsonschema/1-0-0).

| Field               | Description                          |
|---------------------|--------------------------------------|
| `useragent_family`  | Useragent family (browser) name      |
| `useragent_major`   | Useragent major version              |
| `useragent_minor`   | Useragent minor version              |
| `useragent_patch`   | Useragent patch version              |
| `useragent_version` | Full version of the useragent        |
| `os_family`         | Operation system name                |
| `os_major`          | Operation system major version       |
| `os_minor`          | Operation system minor version       |
| `os_patch`          | Operation system patch version       |
| `os_patch_minor`    | Operation system patch minor version |
| `os_version`        | Operation system full version        |
| `device_family`     | Device type                          |

As an example, the `User-Agent` string

```text
Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36
```

would be parsed with the following result:

| PARAMETER        | VALUE     |
|------------------|-----------|
| useragent_family | Chrome    |
| useragent_major  | 48        |
| useragent_minor  | \-        |
| useragent_patch  | 2564      |
| os_family        | Windows 7 |
| os_major         | \-        |
| os_minor         | \-        |
| os_patch_minor   | \-        |
| os_version       | Windows 7 |
| device_family    | Computer  |

_\*empty values denoted by “-“_
