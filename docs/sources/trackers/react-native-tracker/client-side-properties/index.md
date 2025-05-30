---
title: "Tracking specific client-side properties"
date: "2022-08-30"
sidebar_position: 23
---

# Tracking specific client-side properties

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

An event describes a single, transient activity. The context in which that event occurs - the relatively persistent environment - is also incredibly valuable data.

The tracker allows to add a persistent set of information through the `SubjectConfiguration` which represents the basic information about the user and the app which will be attached on all the events as context entity.

- **userId** = null: The custom user identifier.

- **useragent** = null: The custom user-agent. It overrides the user-agent used by default.

- **ipAddress** = null: The IP address (not automatically set).

- **timezone** (set by the tracker): The current timezone label.

- **language** (set by the tracker): The language set in the device.

- **screenResolution** (set by the tracker): The screen resolution.

- **screenViewPort** = null: The screen viewport.

- **colorDepth** = null: The color depth.


The fields tracked using `SubjectConfiguration` are relevant in client-side tracking. Some are set automatically in all events during enrichment, even when no _subject_  is added. These properties are marked with `*` below, and discussed below. Timezone, marked with `**`, is only set when a `Subject` is tracked with the event.

Add these fields to an event using `Subject`:

| Property         | Field in raw event | Column(s) in enriched event         |
| ---------------- | ------------------ | ----------------------------------- |
| userId           | uid                | user_id                             |
| ipAddress*       | ip                 | user_ipaddress                      |
| timezone**       | tz                 | os_timezone                         |
| language         | lang               | br_lang                             |
| useragent*       | ua                 | useragent                           |
| viewport         | vp                 | br_viewheight, br_viewwidth         |
| screenResolution | res                | dvce_screenheight, dvce_screenwidth |
| colorDepth       | cd                 | br_colordepth                       |
| networkUserId*   | tnuid              | network_userid                      |


As always, be aware of privacy when tracking [personal identifiable information](https://snowplow.io/blog/2020/09/06/user-identification-and-privacy/) such as email addresses or IP addresses.
The tracker provides anonymous tracking functionality to mask certain user identifiers. Refer to the [section on anonymous tracking to learn more](../anonymous-tracking/index.md).

## Overriding autogenerated event properties

All enriched Snowplow events contain values for `user_ipaddress`, `useragent`, and `network_userid`.

The `user_ipaddress` is automatically added to all enriched events (unless [anonymous tracking with server anonymization](../anonymous-tracking/index.md) is enabled). To manually override this, use a `Subject` and set an `ipAddress` string; use an empty string to prevent IP address tracking. Alternatively, use the [IP anonymization enrichment](/docs/pipeline/enrichments/available-enrichments/ip-anonymization-enrichment/index.md).

The `useragent` is also automatically added but it can be overriden on configuration. Snowplow pipelines provide multiple useragent-parsing [enrichments](/docs/pipeline/enrichments/available-enrichments/index.md). To manually override the detected useragent, use a `Subject` and set a `useragent` string.

The `network_userid` is the cookie value for the event collector's third-party cookie. The cookie is named `sp` (or `micro` for Snowplow Micro pipelines). To override the collector cookie’s value with your own generated ID, use a `Subject` object and set `networkUserId`.

The `network_userid` is stored in the tracker and it's kept the same until the app is deleted or the collector endpoint is changed or the cookie is expired. It is not assigned to events if anonymous tracking with server anonymization is enabled.

## Setting the subject configuration

The client-side properties can be set during tracker initialization using the `newTracker` configuration:

```typescript
const tracker = await newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    // pass the subject properties:
    userId: 'my-user-id',
});
```

See the the full [list of options in the configuration section](/docs/sources/trackers/react-native-tracker/index.md#configuring-the-tracker).

### Setting the subject data in a tracker instance

It is also possible to set or change the subject properties at runtime, using the `set..` methods of the React Native Tracker. The available methods are:

1. `setUserId`

With this method you can set the userId to a new string. To unset the userId, pass a null value as an argument.

```typescript
tracker.setUserId('newUser');
```

2. `setNetworkUserId`

With this method you can set the `network_userid` to a new string(UUIDv4). To unset, pass a null value as an argument.

```typescript
tracker.setNetworkUserId('44df44bc-8844-4067-9a89-f83c4fe1e62f');
```

3. `setDomainUserId`

With this method you can set the `domain_userid` to a new string(UUIDv4). To unset, pass a null value as an argument.

```typescript
tracker.setDomainUserId('0526be47-32cb-44b2-a9e6-fefeaa5ec6fa');
```

4. `setIpAddress`

With this method you can set the `user_ipaddress` to a new string. To unset, pass a null value as an argument.

```typescript
tracker.setIpAddress('123.45.67.89');
```

5. `setUseragent`

With this method you can set the `useragent` to a new string. To unset, pass a null value as an argument.

```typescript
tracker.setUseragent('some-useragent-string');
```

6. `setTimezone`

With this method you can set the `os_timezone` to a new string. To unset, pass a null value as an argument.

```typescript
tracker.setTimezone('Africa/Cairo');
```

7. `setLanguage`

With this method you can set the `br_lang` to a new string. To unset, pass a null value as an argument.

```typescript
tracker.setLanguage('fr');
```

8. `setScreenResolution`

With this method you can set the `dvce_screenwidth` and `dvce_screenheight` fields to new integer values. The argument to this method is an array that represents the ScreenSize as `[width, height]`. For example:

```typescript
tracker.setScreenResolution([123, 456]);
```

9. `setScreenViewport`

With this method you can set the `br_viewwidth` and `br_viewheight` fields to new integer values. The argument to this method is an array that represents the ScreenSize as `[width, height]`. For example:

```typescript
tracker.setScreenViewport([123, 456]);
```

10. `setColorDepth`

With this method you can set the `br_colordepth` to a new value. For example:

```typescript
tracker.setColorDepth(20);
```

Finally, there is an extra "wrapper" method to set may subject properties at once:

- `setSubjectData`

This method accepts as an argument a SubjectConfiguration, with the new values as needed. For example:

```typescript
tracker.setSubjectData({
    userId: 'tester',
    domainUserId: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
    language: 'es',
    colorDepth: 50,
    screenResolution: [300, 300],
});
```
