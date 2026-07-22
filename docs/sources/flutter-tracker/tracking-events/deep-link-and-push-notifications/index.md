---
title: "Track deep links and push notifications with the Flutter tracker"
sidebar_label: "Deep links and push notifications"
sidebar_position: 200
description: "Track deep link received events and push notification events in Flutter using DeepLinkReceived and MessageNotification. Mobile-only; not supported on Web."
keywords: ["flutter deep links", "push notifications", "deep link tracking", "message notification", "flutter tracker"]
date: "2026-07-22"
---

The Flutter tracker provides two event types for tracking mobile-specific interactions: received deep links and push (or local) notifications. Both events are only available on iOS and Android; they are not supported on Web.

:::note
`DeepLinkReceived` and `MessageNotification` are not supported on Web. If you call `tracker.track()` with either event on Web, a `PlatformException` with code `Unimplemented` is thrown.
:::

## Track deep link received events with `DeepLinkReceived`

A deep link is a URL that takes the user directly to a specific location within your app. The mobile operating system receives the deep link and passes it to your app. The Flutter tracker cannot detect deep links automatically, but you can manually track them using the `DeepLinkReceived` event as soon as the link arrives.

The event uses the schema `iglu:com.snowplowanalytics.mobile/deep_link_received/jsonschema/1-0-0`.

After you track a `DeepLinkReceived` event, the tracker automatically attaches a `deep_link` [entity](/docs/fundamentals/entities/index.md) to the next `ScreenView` event. This makes it straightforward to relate the screen that the user landed on to the deep link that brought them there.

The tracked `DeepLinkReceived` event and the first subsequent `ScreenView` also include the URL and referrer values in the `page_url` and `page_referrer` atomic event properties, making them compatible with web data models and the campaign attribution enrichment.

| Argument   | Description                              | Required? |
| ---------- | ---------------------------------------- | --------- |
| `url`      | The URL of the received deep link.       | Yes       |
| `referrer` | The referrer URL, source of this link.   | No        |

Example:

```dart
tracker.track(DeepLinkReceived(
    url: 'https://example.com/notes/123',
    referrer: 'https://snowplow.io',
));
```

## Track push and local notification events with `MessageNotification`

Push notifications are messages delivered by the mobile operating system to the user, even when the app is closed or in the background. To track an event when a push or local notification is received or interacted with, use the `MessageNotification` event.

The event uses the schema `iglu:com.snowplowanalytics.mobile/message_notification/jsonschema/1-0-0`.

`MessageNotification` requires a `title`, `body`, and `trigger`. The `trigger` value describes what caused the notification to fire, and must be one of the `MessageNotificationTrigger` enum values: `push`, `location`, `calendar`, `timeInterval`, or `other`.

| Argument                | Description                                                                                                                                    | Required? |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `title`                 | The notification's title.                                                                                                                      | Yes       |
| `body`                  | The notification's body.                                                                                                                       | Yes       |
| `trigger`               | The trigger that raised the notification. One of `MessageNotificationTrigger.push`, `.location`, `.calendar`, `.timeInterval`, or `.other`.    | Yes       |
| `action`                | The action associated with the notification.                                                                                                   | No        |
| `attachments`           | A list of `MessageNotificationAttachment` objects representing media attached to the notification.                                             | No        |
| `bodyLocArgs`           | Variable string values used to localise the body text.                                                                                         | No        |
| `bodyLocKey`            | The key to the body string in the app's string resources for localisation.                                                                     | No        |
| `category`              | The category associated with the notification.                                                                                                 | No        |
| `contentAvailable`      | Whether the app is woken up when the notification is delivered in the foreground or background (iOS only).                                     | No        |
| `group`                 | The group that this notification belongs to.                                                                                                   | No        |
| `icon`                  | The icon associated with the notification (Android only).                                                                                      | No        |
| `notificationCount`     | The number of items this notification represents.                                                                                              | No        |
| `notificationTimestamp` | The time when the notification event occurred.                                                                                                 | No        |
| `sound`                 | The sound played when the device receives the notification.                                                                                    | No        |
| `subtitle`              | The notification's subtitle (iOS only).                                                                                                        | No        |
| `tag`                   | An identifier similar to `group`, usable for different purposes (Android only).                                                                | No        |
| `threadIdentifier`      | An identifier for grouping related notifications in a thread (iOS only).                                                                       | No        |
| `titleLocArgs`          | Variable string values used to localise the title text.                                                                                        | No        |
| `titleLocKey`           | The key to the title string in the app's string resources for localisation.                                                                    | No        |

Example:

```dart
tracker.track(MessageNotification(
    title: 'New message',
    body: 'You have a new message from Alex.',
    trigger: MessageNotificationTrigger.push,
    action: 'reply',
    category: 'messaging',
    notificationTimestamp: '2024-06-01T12:00:00.000Z',
    attachments: [
        MessageNotificationAttachment(
            identifier: 'img_001',
            type: 'image/png',
            url: 'https://example.com/images/img_001.png',
        ),
    ],
));
```

### Notification attachments with `MessageNotificationAttachment`

Attachments represent media files (such as images or audio) associated with a notification. Each attachment requires three string fields.

| Argument     | Description             | Required? |
| ------------ | ----------------------- | --------- |
| `identifier` | The attachment's ID.    | Yes       |
| `type`       | The attachment's type.  | Yes       |
| `url`        | The attachment's URL.   | Yes       |
