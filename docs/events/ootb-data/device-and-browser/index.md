---
title: "Device and browser information"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
import TOCInline from '@theme/TOCInline';
```

<TOCInline toc={toc} maxHeadingLevel={3} />

## Browser information in the atomic event properties

For an overview of the browser information that is tracked in the atomic event properties, [please refer to the table on this page](/docs/fundamentals/canonical-event/index.md#browser-fields).

## Context entities added by the tracker

The following context entities are attached at the tracker based on information provided by the browser or operating system.

### Browser context

This is an optional feature on the JavaScript tracker that adds browser information that is normally tracked in the atomic event properties (see above) plus some extra information (such as the tab ID) as a context entity.

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: false}}
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
  schema={{ "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for browser contexts", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "browser_context", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "viewport": { "type": "string", "maxLength": 20, "description": "Viewport dimensions of the browser. Arrives in the form of WidthxHeight e.g. 1200x900." }, "documentSize": { "type": "string", "maxLength": 20, "description": "Document dimensions. Arrives in the form of WidthxHeight e.g. 1200x900" }, "resolution": { "type": "string", "maxLength": 20, "description": "Device native resolution. Arrives in the form of WidthxHeight e.g. 1200x900" }, "colorDepth": { "type": "integer", "minimum": 0, "maximum": 1000, "description": "The number of bits allocated to colors for a pixel in the output device, excluding the alpha channel." }, "devicePixelRatio": { "type": ["number", "null"], "minimum": 0, "maximum": 1000, "description": "Ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device." }, "cookiesEnabled": { "type": "boolean", "description": "Indicates whether cookies are enabled or not. More info and caveats at https://developer.mozilla.org/en-US/docs/Web/API/Navigator/cookieEnabled." }, "online": { "type": "boolean", "description": "Returns the online status of the browser. Important caveats are described in https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine." }, "browserLanguage": { "type": ["string", "null"], "maxLength": 20, "description": "The preferred language of the user, usually the language of the browser UI. RFC 5646 https://datatracker.ietf.org/doc/html/rfc5646." }, "documentLanguage": { "type": ["string", "null"], "maxLength": 20, "description": "The language of the HTML document. RFC 5646 https://datatracker.ietf.org/doc/html/rfc5646." }, "webdriver": { "type": ["boolean", "null"], "description": "Indicates whether the user agent is controlled by automation." }, "deviceMemory": { "type": ["integer", "null"], "minimum": 0, "maximum": 1000, "description": "Approximate amount of device memory in gigabytes." }, "hardwareConcurrency": { "type": ["integer", "null"], "minimum": 0, "maximum": 1000, "description": "Number of logical processors available to run threads on the user's computer." }, "tabId": { "type": ["string", "null"], "format": "uuid", "description": "An identifier for the client browser tab the event is sent from." } }, "required": ["viewport", "documentSize", "cookiesEnabled", "online", "colorDepth", "resolution"], "additionalProperties": false }} />

#### How to track?

[See the JavaScript tracker documentation](/docs/sources/web-trackers/tracking-events/index.md#auto-tracked-entities) to learn how to configure the context entity.

### Mobile context

The mobile context entity is tracked on mobile apps gives information about the mobile device platform including some identifiers (IDFA, IDFV).
The context entity is enabled by default but the information that is included is configurable on the tracker.

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
  schema={{ "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for mobile contexts", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "mobile_context", "format": "jsonschema", "version": "1-0-3" }, "type": "object", "properties": { "osType": { "type": "string", "description": "Operating system type (e.g., ios, tvos, watchos, osx, android)" }, "osVersion": { "type": "string", "description": "The current version of the operating system" }, "deviceManufacturer": { "type": "string", "description": "The manufacturer of the product/hardware" }, "deviceModel": { "type": "string", "description": "The end-user-visible name for the end product" }, "carrier": { "type": ["string", "null"], "description": "The carrier of the SIM inserted in the device" }, "networkType": { "type": ["string", "null"], "enum": ["mobile", "wifi", "offline", null], "description": "Type of network the device is connected to" }, "networkTechnology": { "type": ["string", "null"], "description": "Radio access technology that the device is using" }, "openIdfa": { "type": ["string", "null"], "description": "Deprecated tracking identifier for iOS" }, "appleIdfa": { "type": ["string", "null"], "description": "Advertising identifier on iOS" }, "appleIdfv": { "type": ["string", "null"], "description": "UUID identifier for vendors on iOS" }, "androidIdfa": { "type": ["string", "null"], "description": "Advertising identifier on Android" }, "physicalMemory": { "type": ["integer", "null"], "minimum": 0, "maximum": 9223372036854775807, "description": "Total physical system memory in bytes" }, "systemAvailableMemory": { "type": ["integer", "null"], "minimum": 0, "maximum": 9223372036854775807, "description": "Available memory on the system in bytes (Android only)" }, "appAvailableMemory": { "type": ["integer", "null"], "minimum": 0, "maximum": 9223372036854775807, "description": "Amount of memory in bytes available to the current app (iOS only)" }, "batteryLevel": { "type": ["integer", "null"], "minimum": 0, "maximum": 100, "description": "Remaining battery level as an integer percentage of total battery capacity" }, "batteryState": { "type": ["string", "null"], "enum": ["unplugged", "charging", "full", null], "maxLength": 255, "description": "Battery state for the device" }, "lowPowerMode": { "type": ["boolean", "null"], "description": "A Boolean indicating whether Low Power Mode is enabled (iOS only)" }, "availableStorage": { "type": ["integer", "null"], "minimum": 0, "maximum": 9223372036854775807, "description": "Bytes of storage remaining" }, "totalStorage": { "type": ["integer", "null"], "minimum": 0, "maximum": 9223372036854775807, "description": "Total size of storage in bytes" }, "isPortrait": { "type": ["boolean", "null"], "description": "A Boolean indicating whether the device orientation is portrait (either upright or upside down)" }, "resolution": { "type": ["string", "null"], "maxLength": 20, "description": "Screen resolution in pixels. Arrives in the form of WIDTHxHEIGHT (e.g., 1200x900). Doesn't change when device orientation changes" }, "scale": { "type": ["number", "null"], "minimum": 0, "maximum": 1000, "description": "Scale factor used to convert logical coordinates to device coordinates of the screen (uses UIScreen.scale on iOS and DisplayMetrics.density on Android)" }, "language": { "type": ["string", "null"], "maxLength": 8, "description": "System language currently used on the device (ISO 639)" }, "appSetId": { "type": ["string", "null"], "format": "uuid", "description": "Android vendor ID scoped to the set of apps published under the same Google Play developer account (see https://developer.android.com/training/articles/app-set-id)" }, "appSetIdScope": { "type": ["string", "null"], "enum": ["app", "developer", null], "description": "Scope of the `appSetId`. Can be scoped to the app or to a developer account on an app store (all apps from the same developer on the same device will have the same ID)" } }, "required": ["osType", "osVersion", "deviceManufacturer", "deviceModel"], "additionalProperties": false }} />

### How to track?

* [iOS and Android tracker](/docs/sources/mobile-trackers/tracking-events/platform-and-application-context/index.md#platform-context).
* [React Native tracker](/docs/sources/react-native-tracker/tracking-events/platform-and-application-context/index.md#platform-context).

## Context entities added during enrichment

The following context entities are added during enrichment of events in the pipeline based on other tracked event properties.

### YAUAA context for user-agent parsing

[YAUAA (Yet Another User Agent Analyzer) enrichment](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md) enables parsing the user-agent string tracked in Web events.
It extract information about the user's device and browser, like for instance the device class (Phone, Tablet, etc.).

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
  schema={{ "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a context generated by the YAUAA enrichment after parsing the user agent", "self": { "vendor": "nl.basjes", "name": "yauaa_context", "format": "jsonschema", "version": "1-0-4" }, "type": "object", "properties": { "deviceClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "enum": ["Desktop", "Anonymized", "Unknown", "UNKNOWN", "Mobile", "Tablet", "Phone", "Watch", "Virtual Reality", "eReader", "Set-top box", "TV", "Game Console", "Home Appliance", "Handheld Game Console", "Voice", "Car", "Robot", "Robot Mobile", "Spy", "Hacker", "Augmented Reality", "Robot Imitator"] }, "deviceName": { "description": "Example: Google Nexus 6", "type": "string", "maxLength": 256 }, "deviceBrand": { "description": "Example: Google", "type": "string", "maxLength": 128 }, "deviceCpu": { "type": "string", "maxLength": 128 }, "deviceCpuBits": { "type": "string", "maxLength": 128 }, "deviceFirmwareVersion": { "type": "string", "maxLength": 1000 }, "deviceVersion": { "type": "string", "maxLength": 1000 }, "operatingSystemClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "type": "string", "enum": ["Desktop", "Mobile", "Cloud", "Embedded", "Game Console", "Hacker", "Anonymized", "Unknown"] }, "operatingSystemName": { "description": "Examples: Linux, Android.", "type": "string", "maxLength": 256 }, "operatingSystemVersion": { "type": "string", "maxLength": 1000 }, "operatingSystemNameVersion": { "type": "string", "maxLength": 1000 }, "operatingSystemVersionBuild": { "type": "string", "maxLength": 1000 }, "layoutEngineClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "type": "string", "enum": ["Browser", "Mobile App", "Hacker", "Robot", "Unknown", "Special", "Cloud", "eReader"] }, "layoutEngineName": { "type": "string", "maxLength": 256 }, "layoutEngineVersion": { "type": "string", "maxLength": 1000 }, "layoutEngineVersionMajor": { "type": "string", "maxLength": 1000 }, "layoutEngineNameVersion": { "type": "string", "maxLength": 1000 }, "layoutEngineNameVersionMajor": { "type": "string", "maxLength": 1000 }, "layoutEngineBuild": { "type": "string", "maxLength": 1000 }, "agentClass": { "description": "See https://yauaa.basjes.nl/README-Output.html", "type": "string", "enum": ["Browser", "Browser Webview", "Mobile App", "Robot", "Robot Mobile", "Cloud Application", "Email Client", "Voice", "Special", "Testclient", "Hacker", "Unknown", "Desktop App", "eReader"] }, "agentName": { "description": "Example: Chrome.", "type": "string", "maxLength": 256 }, "agentVersion": { "type": "string", "maxLength": 1000 }, "agentVersionMajor": { "type": "string", "maxLength": 1000 }, "agentNameVersion": { "type": "string", "maxLength": 1000 }, "agentNameVersionMajor": { "type": "string", "maxLength": 1000 }, "agentBuild": { "type": "string", "maxLength": 1000 }, "agentLanguage": { "type": "string", "maxLength": 1000 }, "agentLanguageCode": { "type": "string", "maxLength": 1000 }, "agentInformationEmail": { "type": "string" }, "agentInformationUrl": { "type": "string" }, "agentSecurity": { "type": "string", "enum": ["Weak security", "Strong security", "Unknown", "Hacker", "No security"] }, "agentUuid": { "type": "string" }, "webviewAppName": { "type": "string" }, "webviewAppVersion": { "type": "string" }, "webviewAppVersionMajor": { "type": "string", "maxLength": 1000 }, "webviewAppNameVersionMajor": { "type": "string", "maxLength": 1000 }, "facebookCarrier": { "type": "string" }, "facebookDeviceClass": { "type": "string", "maxLength": 1024 }, "facebookDeviceName": { "type": "string", "maxLength": 1024 }, "facebookDeviceVersion": { "type": "string" }, "facebookFBOP": { "type": "string" }, "facebookFBSS": { "type": "string" }, "facebookOperatingSystemName": { "type": "string" }, "facebookOperatingSystemVersion": { "type": "string" }, "anonymized": { "type": "string" }, "hackerAttackVector": { "type": "string" }, "hackerToolkit": { "type": "string" }, "koboAffiliate": { "type": "string" }, "koboPlatformId": { "type": "string" }, "iECompatibilityVersion": { "type": "string", "maxLength": 1000 }, "iECompatibilityVersionMajor": { "type": "string", "maxLength": 1000 }, "iECompatibilityNameVersion": { "type": "string", "maxLength": 1000 }, "iECompatibilityNameVersionMajor": { "type": "string", "maxLength": 1000 }, "carrier": { "type": "string" }, "gSAInstallationID": { "type": "string" }, "networkType": { "type": "string" }, "operatingSystemNameVersionMajor": { "type": "string" }, "operatingSystemVersionMajor": { "type": "string" } }, "required": ["deviceClass"], "additionalProperties": false }} />

<details>
   <summary>UA parser context (outdated, not recommended anymore)</summary>
   <div>

   The UA parser is no longer recommended be used due to being outdated. Use the YAUAA context instead.

| device_family | os_family | os_major | os_minor | os_patch | os_patch_minor | os_version    | useragent_family | useragent_major | useragent_minor | useragent_patch | useragent_version  |
|---------------|-----------|----------|----------|----------|----------------|---------------|------------------|-----------------|-----------------|-----------------|--------------------|
| Mac           | MacOSX    | 10       | 15       | 7        | [NULL]         | MacOSX10.15.7 | Chrome           | 110             | 0               | 0               | Chrome110.0.0      |

  </div>
</details>

### IAB context for spiders and robots

The [IAB Spiders & Robots enrichment](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md) uses the IAB/ABC International Spiders and Bots List to determine whether an event was produced by a user or a robot/spider based on its’ IP address and user agent.


<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: true}}
  example={{
    category: 'BROWSER',
    primaryImpact: null,
    reason: 'PASSED_ALL',
    spiderOrRobot: false
  }}
  schema={{ "$schema": "https://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a context generated by the IAB Spiders & Robots enrichment", "self": { "vendor": "com.iab.snowplow", "name": "spiders_and_robots", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "spiderOrRobot": { "description": "true if the IP address or user agent checked against the list is a spider or robot, false otherwise", "type": "boolean" }, "category": { "description": "Category based on activity if the IP/UA is a spider or robot, BROWSER otherwise", "enum": ["SPIDER_OR_ROBOT", "ACTIVE_SPIDER_OR_ROBOT", "INACTIVE_SPIDER_OR_ROBOT", "BROWSER"] }, "reason": { "description": "Type of failed check if the IP/UA is a spider or robot, PASSED_ALL otherwise", "enum": ["FAILED_IP_EXCLUDE", "FAILED_UA_INCLUDE", "FAILED_UA_EXCLUDE", "PASSED_ALL"] }, "primaryImpact": { "description": "Whether the spider or robot would affect page impression measurement, ad impression measurement, both or none", "enum": ["PAGE_IMPRESSIONS", "AD_IMPRESSIONS", "PAGE_AND_AD_IMPRESSIONS", "UNKNOWN", "NONE"] } }, "required": ["spiderOrRobot", "category", "reason", "primaryImpact"], "additionalProperties": false }} />
