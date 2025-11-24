---
title: "Initializing the PHP tracker"
sidebar_label: "Initialization"
date: "2020-02-26"
sidebar_position: 20
---

To instantiate a new Tracker instance we need to make sure the Snowplow Tracker classes are available.

Include these class aliases in your project:

```php
use Snowplow\Tracker\Tracker;
use Snowplow\Tracker\Subject;
use Snowplow\Tracker\Emitters\SyncEmitter;
```

We can now create our Emitter, Subject and Tracker objects.

### Creating a Tracker

The most basic Tracker instance will only require you to provide an [Emitter](/docs/sources/trackers/php-tracker/emitters/index.md) and the data [Subject](/docs/sources/trackers/php-tracker/subjects/index.md) for which the Tracker will log events.

```php
$emitter = new SyncEmitter($collector_uri, "http", "POST", 10, false);
$subject = new Subject();
$tracker = new Tracker($emitter, $subject);
```

Other Tracker arguments:

| **Argument Name** | **Description** | **Required?** | **Default** |
| --- | --- | --- | --- |
| `emitters` | The emitter to which events are sent | Yes | `None` |
| `subject` | The user being tracked | Yes | `Subject()` |
| `namespace` | The name of the tracker instance | No | `None` |
| `app_id` | The application ID | No | `None` |
| `encode_base64` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) | No | `True` |

Another example using all of the allowed arguments:

```php
$tracker = new Tracker($emitter, $subject, "cf", "cf29ea", true);
```

#### `emitters`

This can be either a single emitter or an array of emitters. The tracker will send events to all of these emitters, which will, in turn, send them on to a collector.

```php
$emitter1 = new SyncEmitter($collector_uri);
$emitter2 = new CurlEmitter($collector_uri, false, "GET", 2);

$emitter_array = array($emitter1, $emitter2);

// Tracker Init
$subject = new Subject();
$tracker1 = new Tracker($emitter1, $subject); # Single Emitter
$tracker2 = new Tracker($emitter_array, $subject); # Array of Emitters
```

#### `subject`

The user which the Tracker will track. This will give your events user-specific data such as timezone and language. You change the subject of your tracker at any time by calling `updateSubject($new_subject_object)`. All events sent from this Tracker will now have the new subject information attached.

#### `namespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### `app_id`

The `app_id` argument lets you set the application ID to any string.

#### `encode_base64`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the `encode_base64` argument.
