---
title: "Subjects"
date: "2020-02-26"
sidebar_position: 30
---

The Subject object lets you send any additional information about your application's environment, current user, etc to Snowplow.

To create a new subject:

```php
$subject = new Subject();
```

By default the subject has one piece of information in it already, the [platform](/docs/events/going-deeper/event-parameters/index.md#application-parameters) `["p" => "srv"]`.

The Subject class contains a variety of 'set' methods to attach extra data to your event.

- [`setPlatform`](#setplatform)
- [`setUserId`](#setuserid)
- [`setScreenResolution`](#setscreenresolution)
- [`setViewPort`](#setviewport)
- [`setColorDepth`](#setcolordepth)
- [`setTimezone`](#settimezone)
- [`setLanguage`](#setlanguage)
- [`setIpAddress`](#setipaddress)
- [`setUseragent`](#setuseragent)
- [`setNetworkUserId`](#setnetworkuserid)
- [`setDomainUserId`](#setdomainuserid)
- [`setSessionId`](#setsessionid)
- [`setSessionIndex`](#setsessionindex)
- [`setRefr`](#setrefr)
- [`setPageUrl`](#setpageurl)

These set methods can be called either directly onto a subject object:

```php
$subject = new Subject();
$subject->setPlatform("tv");
```

Or they can be called through the tracker object:

```php
$tracker->returnSubject()->setPlatform("tv");
```

You can also change the active Subject a Tracker is operating with:

```php
$subject2 = new Subject();
$tracker->updateSubject($subject2);
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

For a full list of supported platforms, please see the [Event Parameters reference](/docs/events/going-deeper/event-parameters/index.md#application-parameters).

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

### `setViewPort`

If your PHP code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```php
$subject->setViewPort($width, $height);
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```php
$subject->setViewPort(300, 200);
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

### `setRefr`

This method lets you set the referrer URL to a full URI:

```php
$subject->setRefr("https://example.com/previous-page");
```

### `setPageUrl`

This method lets you set the page URL to a full URI string:

```php
$subject->setPageUrl("https://example.com/current-page");
```
