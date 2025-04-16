---
title: "Configuration"
date: "2021-04-07"
sidebar_position: 2
---

You may have additional information about your application's environment, current user and so on, which you want to send to your Snowplow pipeline with each event.

#### Setting event properties

The `tracker` instance has a set of `set...()` methods to attach extra data to all tracked events:

- [Set the platform ID with `setPlatform()`](#set-the-platform-id-withsetplatform)
- [Set user ID with `setUserId()`](#set-user-id-withsetuserid)
- [Set domain user ID with `setDomainUserId()`](#set-domain-user-id-with-setdomainuserid)
- [Set session ID with `setSessionId()`](#set-session-id-with-setsessionid)
- [Set session index with `setSessionIndex()`](#set-session-index-with-setsessionindex)
- [Set network user ID with `setNetworkUserId()`](#set-network-user-id-with-setnetworkuserid)
- [Set screen resolution with `setScreenResolution()`](#set-screen-resolution-with-setscreenresolution)
- [Set viewport dimensions with `setViewport()`](#set-viewport-dimensions-withsetviewport)
- [Set color depth with `setColorDepth()`](#set-color-depth-withsetcolordepth)
- [Set the timezone with `setTimezone()`](#set-the-timezone-withsettimezone)
- [Set the language with `setLang()`](#set-the-language-withsetlang)
- [Set the IP Address with `setIpAddress()`](#set-the-ip-address-withsetipaddress)
- [Set the Useragent with `setUseragent()`](#set-the-useragent-withsetuseragent)

### Set the platform ID with `setPlatform()`

You can set the platform:

```javascript
t.setPlatform('{{PLATFORM}}');
```

Example:

```javascript
t.setPlatform('mob');
```

If the platform is not set manually, it defaults to `'srv'` (for server).

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/sources/trackers/snowplow-tracker-protocol/index.md#application-parameters).

### Set user ID with `setUserId()`

You can set the user ID to any string:

```javascript
t.setUserId('{{USER ID}}');
```

Example:

```javascript
t.setUserId('alexd');
```

### Set domain user ID with `setDomainUserId()`

You can set the domain user ID to any string:

```javascript
t.setDomainUserId('{{DOMAIN USER ID}}');
```

Example:

```javascript
t.setDomainUserId('e8091074-f197-4279-a92e-71a34171d477');
```

### Set session ID with `setSessionId()`

You can set the session ID to any string:

```javascript
t.setSessionId('{{SESSION ID}}');
```

Example:

```javascript
t.setSessionId('s8091074-f197-4279-a92e-71a34171d477');
```

### Set session index with `setSessionIndex()`

You can set the session index to any number:

```javascript
t.setSessionIndex('{{SESSION INDEX}}');
```

Example:

```javascript
t.setSessionIndex(10);
/* t.setSessionIndex('10'); will also work as long as input string can be converted to a valid number. */
```


### Set network user ID with `setNetworkUserId()`

You can set the network user ID to any string:

```javascript
t.setNetworkUserId('{{NETWORK USER ID}}');
```

Example:

```javascript
t.setNetworkUserId('b98c76ad-e45c-45db-a101-224718064ac2');
```

### Set screen resolution with `setScreenResolution()`

If your code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```javascript
t.setScreenResolution( {{WIDTH}}, {{HEIGHT}} );
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```javascript
t.setScreenResolution(1366, 768);
```

### Set viewport dimensions with `setViewport()`

If your code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```javascript
t.setViewport( {{WIDTH}}, {{HEIGHT}} );
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```javascript
t.setViewport(300, 200);
```

### Set color depth with `setColorDepth()`

If your code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```javascript
t.setColorDepth( {{BITS PER PIXEL}} );
```

The number should be a positive integer, in bits per pixel. Example:

```javascript
t.setColorDepth(32);
```

### Set the timezone with `setTimezone()`

This method lets you pass a user's language in to Snowplow:

```javascript
t.setTimezone( {{TIMEZONE}} );
```

Example:

```javascript
t.setTimezone('Europe/London');
```

### Set the language with `setLang()`

This method lets you pass a user's language in to Snowplow:

```javascript
t.setLang( {{LANGUAGE}} );
```

The number should be a positive integer, in bits per pixel. Example:

```javascript
t.setLang('en');
```

### Set the IP Address with `setIpAddress()`

This method lets you set an IP Address on your events:

```javascript
t.setIpAddress( {{IP ADDRESS}} );
```

Example:

```javascript
t.setIpAddress('192.168.0.1');
```

### Set the Useragent with `setUseragent()`

This method lets you override the default Useragent on your events:

```javascript
t.setUseragent( {{USER AGENT}} );
```

Example:

```javascript
t.setUseragent('myapp/0.1.0');
```
