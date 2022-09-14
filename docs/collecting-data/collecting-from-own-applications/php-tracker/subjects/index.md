---
title: "Subjects"
date: "2020-02-26"
sidebar_position: 30
---

The Subject object lets you send any additional information about your application's environment, current user etc to Snowplow.

To create a new subject:

```php
$subject = new Subject();
```

By default the subject has one piece information in it already, the platform ["p" => "srv"].

The Subject class contains a variety of 'set' methods to attach extra data to your event.

- [`setPlatform`](#set-platform)
- [`setUserId`](#set-user-id)
- [`setScreenRes`](#set-screen-res)
- [`setViewport`](#set-viewport)
- [`setColorDepth`](#set-color-depth)
- [`setTimezone`](#set-timezone)
- `[setLanguage](#set-lang)`
- [`setIpAddress`](#set-ip-address)
- [`setUseragent`](#set-useragent)
- [`setNetworkUserId`](#set-network-user-id)
- [`setSessionId`](#set-session-id)
- [`setSessionIndex`](#set-session-index)

These set methods can be called either directly onto a subject object:

```php
$subject = new Subject();
$subject->setPlatform("tv");
```

Or they can be called through the tracker object:

```php
$tracker->returnSubject()->setPlatform("tv");
```

### `setPlatform`

The default platform is "srv". You can change the platform of the subject by calling:

```php
$subject->setPlatform($platform);
```

For example:

```php
$subject->setPlatform("tv") # Running on a Connected TV
```

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md).

### `setUserId`

You can set the user ID to any string:

```php
$subject->setUserId($id);
```

Example:

```php
$subject->setUserId("jbeem");
```

### `setScreenResolution`

If your PHP code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```php
$subject->setScreenResolution($width, $height);
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```php
$subject->setScreenResolution(1366, 768);
```

### `setViewport`

If your PHP code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```php
$subject->setViewport($width, $height);
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```php
$subject->setViewport(300, 200);
```

### `setColorDepth`

If your PHP code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```php
$subject->setColorDepth($depth);
```

The number should be a positive integer, in bits per pixel. Example:

```php
$subject->setColorDepth(32);
```

### `setTimezone`

This method lets you pass a user's timezone in to Snowplow:

```php
$subject->setTimezone($timezone);
```

The timezone should be a string:

```php
$subject->setTimezone("Europe/London");
```

### `setLanguage`

This method lets you pass a user's language in to Snowplow:

```php
$subject->setLanguage($language);
```

The language should be a string:

```php
$subject->setLanguage('en');
```

### `setIpAddress`

This method lets you pass a user's IP Address in to Snowplow:

```php
$subject->setIpAddress($ip);
```

The IP Address should be a string:

```php
$subject->setIpAddress('127.0.0.1');
```

### `setUseragent`

This method lets you pass a useragent in to Snowplow:

```php
$subject->setUseragent($useragent);
```

The useragent should be a string:

```php
$subject->setUseragent('Agent Smith');
```

### `setNetworkUserId`

This method lets you pass a Network User ID in to Snowplow:

```php
$subject->setNetworkUserId($networkUserId);
```

The network user id should be a string:

```php
$subject->setNetworkUserId("network-id");
```

### `setDomainUserId`

This method lets you pass a Domain User ID in to Snowplow:

```php
$subject->setDomainUserId($domainUserId);
```

The domain user id should be a string:

```php
$subject->setDomainUserId("domain-id");
```

### `setSessionId`

This method lets you pass a session ID in to Snowplow:

```php
$subject->setSessionId($sessionId);
```

The session ID should be a string:

```php
$subject->setSessionId("759e1c9a-6b74-403c-8b6f-18eb9f0c2f02");
```

### `setSessionIndex`

This method lets you pass a session index in to Snowplow:

```php
$subject->setSessionIndex($sessionIndex);
```

The session index should be a number:

```php
$subject->setSessionIndex(1);
```
