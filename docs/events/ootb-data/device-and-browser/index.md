---
title: "Device and browser information"
sidebar_label: "Device and browser information"
sidebar_position: 60
description: "Track device, browser, and platform information in atomic fields and context entities including YAUAA parsing, Client Hints, and mobile context."
keywords: ["device information", "browser context", "mobile context", "YAUAA", "user agent", "client hints"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Snowplow trackers track information about the device or browser that is sending the events to Snowplow in two ways: setting [atomic event properties](/docs/fundamentals/canonical-event/index.md), or in browser or application entities. You can also choose to configure additional entities through [enrichment](/docs/pipeline/enrichments/index.md).

## Browser atomic event properties

Web trackers populate [several atomic event properties](/docs/fundamentals/canonical-event/index.md#browser-fields).

## Browser entity

You can configure the web trackers to automatically include a browser entity with all tracked events.

| Tracker                                                                          | Supported | Since version | Auto-tracking |
| -------------------------------------------------------------------------------- | --------- | ------------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/index.md#auto-tracked-entities) | ✅         | 3.9.0         | ✅             |
| iOS                                                                              | ❌         |               |               |
| Android                                                                          | ❌         |               |               |
| React Native                                                                     | ❌         |               |               |
| Flutter                                                                          | ❌         |               |               |

The browser entity is only available on web trackers since it captures browser-specific information from the DOM and browser APIs. These APIs aren't available to React Native or Flutter.

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: true}}
  example={{
    viewport: null,
    documentSize: null,
    resolution: null,
    colorDepth: 1,
    devicePixelRatio: 1,
    cookiesEnabled: true,
    online: true,
    browserLanguage: null,
    documentLanguage: null,
    webdriver: true,
    deviceMemory: 1,
    hardwareConcurrency: 1,
    tabId: null
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for browser contexts", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "browser_context", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "viewport": { "type": "string", "maxLength": 20, "description": "Viewport dimensions of the browser. Arrives in the form of WidthxHeight e.g. 1200x900." }, "documentSize": { "type": "string", "maxLength": 20, "description": "Document dimensions. Arrives in the form of WidthxHeight e.g. 1200x900" }, "resolution": { "type": "string", "maxLength": 20, "description": "Device native resolution. Arrives in the form of WidthxHeight e.g. 1200x900" }, "colorDepth": { "type": "integer", "minimum": 0, "maximum": 1000, "description": "The number of bits allocated to colors for a pixel in the output device, excluding the alpha channel." }, "devicePixelRatio": { "type": ["number", "null"], "minimum": 0, "maximum": 1000, "description": "Ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device." }, "cookiesEnabled": { "type": "boolean", "description": "Indicates whether cookies are enabled or not. More info and caveats at https://developer.mozilla.org/en-US/docs/Web/API/Navigator/cookieEnabled." }, "online": { "type": "boolean", "description": "Returns the online status of the browser. Important caveats are described in https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine." }, "browserLanguage": { "type": ["string", "null"], "maxLength": 20, "description": "The preferred language of the user, usually the language of the browser UI. RFC 5646 https://datatracker.ietf.org/doc/html/rfc5646." }, "documentLanguage": { "type": ["string", "null"], "maxLength": 20, "description": "The language of the HTML document. RFC 5646 https://datatracker.ietf.org/doc/html/rfc5646." }, "webdriver": { "type": ["boolean", "null"], "description": "Indicates whether the user agent is controlled by automation." }, "deviceMemory": { "type": ["integer", "null"], "minimum": 0, "maximum": 1000, "description": "Approximate amount of device memory in gigabytes." }, "hardwareConcurrency": { "type": ["integer", "null"], "minimum": 0, "maximum": 1000, "description": "Number of logical processors available to run threads on the user's computer." }, "tabId": { "type": ["string", "null"], "format": "uuid", "description": "An identifier for the client browser tab the event is sent from." } }, "required": ["viewport", "documentSize", "cookiesEnabled", "online", "colorDepth", "resolution"], "additionalProperties": false }} />

## Client Hints entity

[Client Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH) are an alternative to user-agent strings for capturing browser and device information. As browsers move away from high-entropy user-agent strings, Client Hints provide useful information without the privacy concerns of traditional user-agent parsing.

You can enable Client Hints in two ways:

- Basic hints: captures limited device and browser information
- High-entropy hints: captures additional details that could be used for fingerprinting (browsers may prompt the user before providing this data)

| Tracker                                                                         | Supported | Since version | Auto-tracking |
| ------------------------------------------------------------------------------- | --------- | ------------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/client-hints/index.md)         | ✅         | 3.0.0         | ✅             |
| iOS                                                                             | ❌         |               |               |
| Android                                                                         | ❌         |               |               |
| React Native                                                                    | ❌         |               |               |
| Flutter                                                                         | ❌         |               |               |
| Roku                                                                            | ❌         |               |               |

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: true}}
  example={{
    isMobile: false,
    brands: [
      { brand: "Google Chrome", version: "89" },
      { brand: "Chromium", version: "89" }
    ]
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for HTTP Client Hints context", "self": { "vendor": "org.ietf", "name": "http_client_hints", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "isMobile": { "type": "boolean", "description": "Whether the browser is on a mobile device" }, "brands": { "type": "array", "items": { "type": "object", "properties": { "brand": { "type": "string" }, "version": { "type": "string" } } }, "description": "List of browser brands and versions" }, "architecture": { "type": ["string", "null"], "description": "CPU architecture (high entropy)" }, "model": { "type": ["string", "null"], "description": "Device model (high entropy)" }, "platform": { "type": ["string", "null"], "description": "Operating system name (high entropy)" }, "platformVersion": { "type": ["string", "null"], "description": "Operating system version (high entropy)" }, "uaFullVersion": { "type": ["string", "null"], "description": "Full browser version (high entropy)" } }, "additionalProperties": false }} />

## Mobile entity

The mobile entity gives information about the mobile device platform, including identifiers such as IDFA and IDFV. It's sometimes referred to as the platform entity.

It's enabled by default in all supported trackers. You can configure which of the optional properties to track.

This table shows the support for the mobile entity across the main client-side Snowplow [tracker SDKs](/docs/sources/index.md).

| Tracker                                                                                                                       | Supported | Since version | Auto-tracking | Notes                             |
| ----------------------------------------------------------------------------------------------------------------------------- | --------- | ------------- | ------------- | --------------------------------- |
| Web                                                                                                                           | ❌         |               |               |                                   |
| [iOS](/docs/sources/mobile-trackers/tracking-events/platform-and-application-context/index.md#platform-context)               | ✅         | 1.0.0         | ✅             |                                   |
| [Android](/docs/sources/mobile-trackers/tracking-events/platform-and-application-context/index.md#platform-context)           | ✅         | 1.0.0         | ✅             |                                   |
| [React Native](/docs/sources/react-native-tracker/tracking-events/platform-and-application-context/index.md#platform-context) | ✅         | 1.0.0         | ✅             | Only relevant for mobile tracking |
| [Flutter](/docs/sources/flutter-tracker/initialization-and-configuration/index.md)                                            | ✅         | 0.1.0         | ✅             | Only relevant for mobile tracking |
| Roku                                                                                                                          | ❌         |               |               |                                   |

<SchemaProperties
  overview={{event: false, web: false, mobile: true, automatic: true}}
  example={{
    deviceManufacturer: 'Samsung',
    deviceModel: 'SM-N960N Galaxy Note9 TD-LTE KR 128GB',
    osType: 'Google Android 8.1 (Oreo)',
    osVersion: 8.10,
    androidIdfa: '00000000-0000-0000-0000-000000000000',
    appleIdfa: null,
    appleIdfv: null,
    carrier: 'Unknown',
    openIdfa: null,
    networkTechnology: '2G',
    networkType: 'wifi',
    physicalMemory: 1,
    systemAvailableMemory: 1,
    appAvailableMemory: 1,
    batteryLevel: 42,
    batteryState: 'charging',
    lowPowerMode: true,
    availableStorage: 1,
    totalStorage: 128000000000,
    isPortrait: true,
    resolution: '1440x2960',
    scale: 1,
    language: null,
    appSetId: null,
    appSetIdScope: null
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for mobile contexts", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "mobile_context", "format": "jsonschema", "version": "1-0-3" }, "type": "object", "properties": { "osType": { "type": "string", "description": "Operating system type (e.g., ios, tvos, watchos, osx, android)" }, "osVersion": { "type": "string", "description": "The current version of the operating system" }, "deviceManufacturer": { "type": "string", "description": "The manufacturer of the product/hardware" }, "deviceModel": { "type": "string", "description": "The end-user-visible name for the end product" }, "carrier": { "type": ["string", "null"], "description": "The carrier of the SIM inserted in the device" }, "networkType": { "type": ["string", "null"], "enum": ["mobile", "wifi", "offline", null], "description": "Type of network the device is connected to" }, "networkTechnology": { "type": ["string", "null"], "description": "Radio access technology that the device is using" }, "openIdfa": { "type": ["string", "null"], "description": "Deprecated tracking identifier for iOS" }, "appleIdfa": { "type": ["string", "null"], "description": "Advertising identifier on iOS" }, "appleIdfv": { "type": ["string", "null"], "description": "UUID identifier for vendors on iOS" }, "androidIdfa": { "type": ["string", "null"], "description": "Advertising identifier on Android" }, "physicalMemory": { "type": ["integer", "null"], "minimum": 0, "maximum": 9223372036854775807, "description": "Total physical system memory in bytes" }, "systemAvailableMemory": { "type": ["integer", "null"], "minimum": 0, "maximum": 9223372036854775807, "description": "Available memory on the system in bytes (Android only)" }, "appAvailableMemory": { "type": ["integer", "null"], "minimum": 0, "maximum": 9223372036854775807, "description": "Amount of memory in bytes available to the current app (iOS only)" }, "batteryLevel": { "type": ["integer", "null"], "minimum": 0, "maximum": 100, "description": "Remaining battery level as an integer percentage of total battery capacity" }, "batteryState": { "type": ["string", "null"], "enum": ["unplugged", "charging", "full", null], "maxLength": 255, "description": "Battery state for the device" }, "lowPowerMode": { "type": ["boolean", "null"], "description": "A Boolean indicating whether Low Power Mode is enabled (iOS only)" }, "availableStorage": { "type": ["integer", "null"], "minimum": 0, "maximum": 9223372036854775807, "description": "Bytes of storage remaining" }, "totalStorage": { "type": ["integer", "null"], "minimum": 0, "maximum": 9223372036854775807, "description": "Total size of storage in bytes" }, "isPortrait": { "type": ["boolean", "null"], "description": "A Boolean indicating whether the device orientation is portrait (either upright or upside down)" }, "resolution": { "type": ["string", "null"], "maxLength": 20, "description": "Screen resolution in pixels. Arrives in the form of WIDTHxHEIGHT (e.g., 1200x900). Doesn't change when device orientation changes" }, "scale": { "type": ["number", "null"], "minimum": 0, "maximum": 1000, "description": "Scale factor used to convert logical coordinates to device coordinates of the screen (uses UIScreen.scale on iOS and DisplayMetrics.density on Android)" }, "language": { "type": ["string", "null"], "maxLength": 8, "description": "System language currently used on the device (ISO 639)" }, "appSetId": { "type": ["string", "null"], "format": "uuid", "description": "Android vendor ID scoped to the set of apps published under the same Google Play developer account (see https://developer.android.com/training/articles/app-set-id)" }, "appSetIdScope": { "type": ["string", "null"], "enum": ["app", "developer", null], "description": "Scope of the `appSetId`. Can be scoped to the app or to a developer account on an app store (all apps from the same developer on the same device will have the same ID)" } }, "required": ["osType", "osVersion", "deviceManufacturer", "deviceModel"], "additionalProperties": false }} />

## Entities added during enrichment

You can configure your pipeline to add these entities to tracked web events.

### User agent parsing

The [YAUAA (Yet Another User Agent Analyzer) enrichment](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md) enables parsing the user agent string tracked in web events.
It extract information about the user's device and browser.

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: true}}
  example={{
    schema_name: 'yauaa',
    agent_class: 'Browser',
    agent_information_email: 'Unknown',
    agent_name: 'Chrome',
    agent_name_version: 'Chrome109',
    agent_name_version_major: 'Chrome109',
    agent_version: '109',
    agent_version_major: '109.00',
    device_brand: 'Apple',
    device_class: 'Desktop',
    device_cpu: 'Intel',
    device_cpu_bits: '64',
    device_name: 'AppleMacintosh',
    device_version: 'Demo',
    layout_engine_class: 'Browser',
    layout_engine_name: 'Blink',
    layout_engine_name_version: 'Blink109',
    layout_engine_name_version_major: 'Blink109',
    layout_engine_version: '109',
    layout_engine_version_major: '109',
	network_type: 'Unknown',
	operating_system_class: 'Desktop',
	operating_system_name: 'MacOS',
	operating_system_name_version: 'MacOS>=10.15.7',
	operating_system_name_version_major: 'MacOS>=10.15',
	operating_system_version: '>=10.15.7',
	operating_system_version_build: '??',
	operating_system_version_major: '>=10.15',
	webview_app_name: 'Unknown',
	webview_app_name_version_major: 'Unknown??',
	webview_app_version: '??',
	webview_app_version_major: '??'
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a context generated by the YAUAA enrichment after parsing the user agent", "self": { "vendor": "nl.basjes", "name": "yauaa_context", "format": "jsonschema", "version": "1-0-4" }, "type": "object", "properties": { "deviceClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "enum": ["Desktop", "Anonymized", "Unknown", "UNKNOWN", "Mobile", "Tablet", "Phone", "Watch", "Virtual Reality", "eReader", "Set-top box", "TV", "Game Console", "Home Appliance", "Handheld Game Console", "Voice", "Car", "Robot", "Robot Mobile", "Spy", "Hacker", "Augmented Reality", "Robot Imitator"] }, "deviceName": { "description": "Example: Google Nexus 6", "type": "string", "maxLength": 256 }, "deviceBrand": { "description": "Example: Google", "type": "string", "maxLength": 128 }, "deviceCpu": { "type": "string", "maxLength": 128 }, "deviceCpuBits": { "type": "string", "maxLength": 128 }, "deviceFirmwareVersion": { "type": "string", "maxLength": 1000 }, "deviceVersion": { "type": "string", "maxLength": 1000 }, "operatingSystemClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "type": "string", "enum": ["Desktop", "Mobile", "Cloud", "Embedded", "Game Console", "Hacker", "Anonymized", "Unknown"] }, "operatingSystemName": { "description": "Examples: Linux, Android.", "type": "string", "maxLength": 256 }, "operatingSystemVersion": { "type": "string", "maxLength": 1000 }, "operatingSystemNameVersion": { "type": "string", "maxLength": 1000 }, "operatingSystemVersionBuild": { "type": "string", "maxLength": 1000 }, "layoutEngineClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "type": "string", "enum": ["Browser", "Mobile App", "Hacker", "Robot", "Unknown", "Special", "Cloud", "eReader"] }, "layoutEngineName": { "type": "string", "maxLength": 256 }, "layoutEngineVersion": { "type": "string", "maxLength": 1000 }, "layoutEngineVersionMajor": { "type": "string", "maxLength": 1000 }, "layoutEngineNameVersion": { "type": "string", "maxLength": 1000 }, "layoutEngineNameVersionMajor": { "type": "string", "maxLength": 1000 }, "layoutEngineBuild": { "type": "string", "maxLength": 1000 }, "agentClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "type": "string", "enum": ["Browser", "Browser Webview", "Mobile App", "Robot", "Robot Mobile", "Cloud Application", "Email Client", "Voice", "Special", "Testclient", "Hacker", "Unknown", "Desktop App", "eReader"] }, "agentName": { "description": "Example: Chrome.", "type": "string", "maxLength": 256 }, "agentVersion": { "type": "string", "maxLength": 1000 }, "agentVersionMajor": { "type": "string", "maxLength": 1000 }, "agentNameVersion": { "type": "string", "maxLength": 1000 }, "agentNameVersionMajor": { "type": "string", "maxLength": 1000 }, "agentBuild": { "type": "string", "maxLength": 1000 }, "agentLanguage": { "type": "string", "maxLength": 1000 }, "agentLanguageCode": { "type": "string", "maxLength": 1000 }, "agentInformationEmail": { "type": "string" }, "agentInformationUrl": { "type": "string" }, "agentSecurity": { "type": "string", "enum": ["Weak security", "Strong security", "Unknown", "Hacker", "No security"] }, "agentUuid": { "type": "string" }, "webviewAppName": { "type": "string" }, "webviewAppVersion": { "type": "string" }, "webviewAppVersionMajor": { "type": "string", "maxLength": 1000 }, "webviewAppNameVersionMajor": { "type": "string", "maxLength": 1000 }, "facebookCarrier": { "type": "string" }, "facebookDeviceClass": { "type": "string", "maxLength": 1024 }, "facebookDeviceName": { "type": "string", "maxLength": 1024 }, "facebookDeviceVersion": { "type": "string" }, "facebookFBOP": { "type": "string" }, "facebookFBSS": { "type": "string" }, "facebookOperatingSystemName": { "type": "string" }, "facebookOperatingSystemVersion": { "type": "string" }, "anonymized": { "type": "string" }, "hackerAttackVector": { "type": "string" }, "hackerToolkit": { "type": "string" }, "koboAffiliate": { "type": "string" }, "koboPlatformId": { "type": "string" }, "iECompatibilityVersion": { "type": "string", "maxLength": 1000 }, "iECompatibilityVersionMajor": { "type": "string", "maxLength": 1000 }, "iECompatibilityNameVersion": { "type": "string", "maxLength": 1000 }, "iECompatibilityNameVersionMajor": { "type": "string", "maxLength": 1000 }, "carrier": { "type": "string" }, "gSAInstallationID": { "type": "string" }, "networkType": { "type": "string" }, "operatingSystemNameVersionMajor": { "type": "string" }, "operatingSystemVersionMajor": { "type": "string" } }, "required": ["deviceClass"], "additionalProperties": false }} />

### Spiders and robots

The [IAB Spiders and Robots enrichment](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md) uses the IAB/ABC International Spiders and Bots List to determine whether an event was produced by a user or a robot/spider based on its IP address and user agent.

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: true}}
  example={{
    category: 'BROWSER',
    primaryImpact: null,
    reason: 'PASSED_ALL',
    spiderOrRobot: false
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a context generated by the IAB Spiders & Robots enrichment", "self": { "vendor": "com.iab.snowplow", "name": "spiders_and_robots", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "spiderOrRobot": { "description": "true if the IP address or user agent checked against the list is a spider or robot, false otherwise", "type": "boolean" }, "category": { "description": "Category based on activity if the IP/UA is a spider or robot, BROWSER otherwise", "enum": ["SPIDER_OR_ROBOT", "ACTIVE_SPIDER_OR_ROBOT", "INACTIVE_SPIDER_OR_ROBOT", "BROWSER"] }, "reason": { "description": "Type of failed check if the IP/UA is a spider or robot, PASSED_ALL otherwise", "enum": ["FAILED_IP_EXCLUDE", "FAILED_UA_INCLUDE", "FAILED_UA_EXCLUDE", "PASSED_ALL"] }, "primaryImpact": { "description": "Whether the spider or robot would affect page impression measurement, ad impression measurement, both or none", "enum": ["PAGE_IMPRESSIONS", "AD_IMPRESSIONS", "PAGE_AND_AD_IMPRESSIONS", "UNKNOWN", "NONE"] } }, "required": ["spiderOrRobot", "category", "reason", "primaryImpact"], "additionalProperties": false }} />
