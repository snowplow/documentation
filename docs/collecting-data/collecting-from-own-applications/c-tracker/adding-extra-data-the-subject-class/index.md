---
title: "Adding extra data: the Subject class"
date: "2020-02-25"
sidebar_position: 30
---

Subject information describes the user and device associated with the event, such as their user ID, what type of device they used, or what size screen that device had.

Create a subject like this and add it to your tracker using the `Snowplow::create_tracker` call:

```cpp
auto subject = make_shared<Subject>();
subject.set_user_id("a-user-id");

auto tracker = Snowplow::create_tracker("ns", "https://com.acme.collector", POST, "events.db", subject);
```

You can also attach custom Subject information to individual events. In this way, you may track events describing different users or devices using the same tracker. Events can be assigned a shared C++ pointer to a Subject instance using the `set_subject` method. The following example shows how to attach a subject instance to a structured event (see [Tracking specific events](/docs/collecting-data/collecting-from-own-applications/c-tracker/tracking-specific-events/index.md) for more information on tracking events):

```cpp
auto subject = std::make_shared<Subject>();
subject->set_user_id("another-user");

StructuredEvent se("category", "action");
se.set_subject(subject);
```

The Subject class has a set of `set...()` methods to attach extra data relating to the user to all tracked events:

- `set_user_id`
- `set_screen_resolution`
- `set_viewport`
- `set_color_depth`
- `set_timezone`
- `set_language`
- `set_useragent`
- `set_ip_address`

We will discuss each of these in turn below:

## Set user ID with "set_user_id"

You can set the user ID to any string:

```cpp
subject->set_user_id( "{{USER ID}}" );
```

Example:

```cpp
subject->set_user_id("alexd");
```

## Set screen resolution with "set_screen_resolution"

If your code has access to the device’s screen resolution, then you can pass this in to Snowplow too:

```cpp
subject->set_screen_resolution( {{WIDTH}}, {{HEIGHT}} );
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```cpp
subject->set_screen_resolution(1366, 768);
```

## Set viewport dimensions with "set_viewport"[](https://file+.vscode-resource.vscode-cdn.net/Users/matus/Projects/Snowplow/snowplow-cpp-tracker/docs/03-adding-data.md#set-viewport-dimensions-with-set_viewport)

If your code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```cpp
subject->set_viewport( {{WIDTH}}, {{HEIGHT}} );
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```cpp
subject->set_viewport(300, 200);
```

## Set color depth with "set_color_depth"[](https://file+.vscode-resource.vscode-cdn.net/Users/matus/Projects/Snowplow/snowplow-cpp-tracker/docs/03-adding-data.md#set-color-depth-with-set_color_depth)

If your code has access to the bit depth of the device’s color palette for displaying images, then you can pass this in to Snowplow too:

```cpp
subject->set_color_depth( {{BITS PER PIXEL}} );
```

The number should be a positive integer, in bits per pixel. Example:

```cpp
subject->set_color_depth(32);
```

## Set timezone with "set_timezone"

This method lets you pass a user’s timezone in to Snowplow:

```cpp
subject->set_timezone( {{TIMEZONE}} );
```

The timezone should be a string:

```cpp
subject->set_timezone("Europe/London");
```

## Set the language with "set_language"[](https://file+.vscode-resource.vscode-cdn.net/Users/matus/Projects/Snowplow/snowplow-cpp-tracker/docs/03-adding-data.md#set-the-language-with-set_language)

This method lets you pass a user’s language in to Snowplow:

```cpp
subject->set_language( {{LANGUAGE}} );
```

The language should be a string:

```cpp
subject->set_language('en');
```

## Set custom user-agent with "set_useragent"

To change the [user-agent string](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) sent along with events to identify the application and system, you may set custom useragent using this method:

```cpp
subject->set_useragent( {{USERAGENT}} );
```

The user-agent should be a string:

```cpp
subject->set_useragent("YourApp/5.0 (Macintosh; Intel Mac OS X 10_15_7)");
```

## Set user's IP address with "set_ip_address"

To set the user's IP address, you may use this method:

```cpp
subject->set_ip_address( {{IP_ADDRESS}} );
```

The IP address should be a string:

```cpp
subject->set_ip_address("169.254.0.2");
```

If the IP address is not set, the events will be assigned the IP address from the HTTP request by the Collector.
