---
title: "Device info context"
description: "Configure device context in Roku tracker for behavioral analytics with streaming device information."
schema: "TechArticle"
keywords: ["Roku Context", "Device Context", "TV Context", "Roku Data", "Device Information", "TV Analytics"]
date: "2021-12-23"
sidebar_position: 4750
---

Device Info Context is an entity attached to events that provides information about the Roku device. It gives information about the device model and OS, adds unique identifiers for the channel and device, includes playback settings, current device usage, locale, display properties, network status, and device features.

The context is automatically added to all tracked events by default. If you prefer not to add the context to events, you may disable it using the `subject.deviceContext` option during tracker initialization:

```brightscript
m.global.snowplow.init = {
   subject: {
      deviceContext: false ' disabling device info context
   },
   ...
}
```

The context entity reflects the [ifDeviceInfo interface](https://developer.roku.com/en-gb/docs/references/brightscript/interfaces/ifdeviceinfo.md) in Roku SDK and picks some useful properties from it. It adds the following information:

| Attribute | Type | Description | Required? |
| --- | --- | --- | --- |
| `model` | String | Model name of the Roku device (e.g., 3940EU) | yes |
| `modelDisplayName` | String | Model display name (e.g., Roku Express 4K) | yes |
| `modelType` | String | Type of device (STB or TV) | yes |
| `osVersion` | String | Roku OS version (e.g., 10.5.1.4059) (Roku OS ≥ 9.2) | no |
| `channelClientId` | String | A unique device identifier that is different across channels (Roku OS ≥ 8.1) | no |
| `isRIDADisabled` | Boolean | Indicates whether tracking via Roku's ID for Advertisers (RIDA) is disabled (Roku OS ≥ 8.1) | no |
| `RIDA` | String | A persistent unique identifier (UUID) for the device (Roku OS ≥ 8.1) | no |
| `captionsMode` | String | Global captions are turned on or off, or are in instant replay mode | yes |
| `audioOutputChannel` | String | Type of audio output | yes |
| `memoryLevel` | String | General memory level of the channel (normal, low, critical) (Roku OS ≥ 8.1) | no |
| `timeSinceLastKeypress` | Integer | Number of seconds since the last remote keypress was received | yes |
| `userCountryCode` | String | ISO 3166-1 country code of the user's Roku account (Roku OS ≥ 8.1) | no |
| `countryCode` | String | Roku Channel Store associated with a user's Roku account | yes |
| `videoMode` | String | Video playback resolution | yes |
| `displayWidth` | Integer | Physical width of the attached display in centimeters | yes |
| `displayHeight` | Integer | Physical height of the attached display in centimeters | yes |
| `displayProperties` | String[] | List of keys for display properties of the screen | yes |
| `connectionType` | String | Type of internet connection the device is using (e.g., WiFiConnection) | yes |
| `internetStatus` | Boolean | Internet connection status of the device (Roku OS ≥ 10.0) . | no |
| `features` | String[] | List of features that the current device/firmware supports | yes |

The `displayProperties` list may include keys for the following display properties: `Internal` (display part of Roku player), `Hdr10` (display supports HDR10), `Hdr10Plus` (display supports HDR10), `DolbyVision` (display supports Dolby Vision). The `features` list of activated features of the device may include `5.1_surround_sound`, `can_output_5.1_surround_sound`, `sd_only_hardware`, `usb_hardware`, `sdcard_hardware`, `ethernet_hardware`, `gaming_hardware`, `energy_star_compliant`, `soundbar_hardware`, and `handsfree_voice`.

## Roku's ID for Advertisers (RIDA)

`RIDA` is a Universally Unique Identifier (UUID) that is unique and persistent for the Roku device. It is designed to generally follow the guidelines established for the IDFA (Identifier for Advertising) that are available on other platforms such as iOS and Android. The ID is intended for Roku publishers to enable frequency capping and targeted advertising on the Roku platform.

Users can disable RIDA tracking by selecting "Limit ad tracking" in the device settings. In this case, the `IsRIDADisabled` property will be true and `RIDA` will be a temporary ID that expires after 30 days.

RIDA is tracked by the tracker by default. However, there may be cases where you may not want to track the identifier. To disable tracking RIDA, deactivate the `subject.RIDATracking` option during tracker initialization:

```brightscript
m.global.snowplow.init = {
   subject: {
      RIDATracking: false ' disabling tracking RIDA
   },
   ...
}
```
