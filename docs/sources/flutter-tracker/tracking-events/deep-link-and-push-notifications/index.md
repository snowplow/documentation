---
title: "Deep link and push notification tracking"
sidebar_label: "Deep links and push notifications"
sidebar_position: 200
description: "Track deep links received in your Flutter app and push notifications using the DeepLinkReceived and MessageNotification event types."
keywords: ["flutter deep link", "flutter push notification", "deep link tracking", "message notification", "snowplow flutter"]
date: "2025-09-09"
---

The Flutter tracker provides two event types for tracking how users arrive at your app through deep links and push notifications: `DeepLinkReceived` and `MessageNotification`. Both event types are supported on iOS and Android. They are not supported on Web.

## Track deep link received events

A deep link is a URL that takes the user directly to a specific location within your app. The mobile operating system receives the deep link and passes it to your app. The tracker does not capture deep links automatically — you must track them manually when your app receives one.

The `DeepLinkReceived` event uses the schema `iglu:com.snowplowanalytics.mobile/deep_link_received/jsonschema/1-0-0`.

```dart
tracker.track(DeepLinkReceived(
    url: 'https://example.com/product/123',
    referrer: 'https://example.com/home',
));
```

After tracking a `DeepLinkReceived` event, the tracker automatically attaches a `deep_link` entity to the next `ScreenView` event. This entity makes it easy to analyze the relationship between the deep link source and the screen the user viewed.

The `DeepLinkReceived` event and the subsequent `ScreenView` event also have the URL and referrer information added to the `page_url` and `page_referrer` atomic event properties. This makes them compatible with data models and enrichments built for web events.

The `DeepLinkReceived` event can be used with the [campaign attribution enrichment](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md) in your Snowplow pipeline. When a user taps an advertising banner or marketing message that opens your app via a deep link, the enrichment can parse UTM parameters in the URL to attribute the session back to the originating campaign.

### Properties

| Property   | Type     | Description                       | Required |
| ---------- | -------- | --------------------------------- | -------- |
| `url`      | `String` | URL in the received deep link.    | Yes      |
| `referrer` | `String` | Referrer URL, source of the deep link. | No  |

## Track push notification events

Push notifications are messages delivered to the user's device even when your app is in the background or closed. You can track when a user receives or interacts with a push or local notification using the `MessageNotification` event.

The `MessageNotification` event uses the schema `iglu:com.snowplowanalytics.mobile/message_notification/jsonschema/1-0-0`.

```dart
tracker.track(MessageNotification(
    title: 'New message',
    body: 'You have a new message from Alice.',
    trigger: MessageNotificationTrigger.push,
    action: 'view',
    category: 'chat',
    notificationCount: 3,
    notificationTimestamp: '2025-09-09T10:00:00.000Z',
    sound: 'chime.mp3',
    attachments: [
        MessageNotificationAttachment(
            identifier: 'att1',
            type: 'image/png',
            url: 'https://example.com/image.png',
        ),
    ],
));
```

### Properties

Required properties:

| Property  | Type                           | Description                          |
| --------- | ------------------------------ | ------------------------------------ |
| `title`   | `String`                       | The notification's title.            |
| `body`    | `String`                       | The notification's body.             |
| `trigger` | `MessageNotificationTrigger`   | The trigger that raised the notification. |

Optional properties:

| Property                | Type                               | Description                                                                                       |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| `action`                | `String`                           | The action associated with the notification.                                                      |
| `attachments`           | `List<MessageNotificationAttachment>` | Attachments added to the notification.                                                         |
| `bodyLocArgs`           | `List<String>`                     | Variable string values to substitute format specifiers in `bodyLocKey` to localize the body text. |
| `bodyLocKey`            | `String`                           | The key to the body string in the app's string resources to localize the body text.               |
| `category`              | `String`                           | The category associated with the notification.                                                    |
| `contentAvailable`      | `bool`                             | Whether the app is notified of delivery when in the foreground or background (iOS only).          |
| `group`                 | `String`                           | The group that this notification is part of.                                                      |
| `icon`                  | `String`                           | The icon associated with the notification (Android only).                                         |
| `notificationCount`     | `int`                              | The number of items this notification represents.                                                 |
| `notificationTimestamp` | `String`                           | The time when the notification event occurred (ISO 8601 format).                                  |
| `sound`                 | `String`                           | The sound played when the device receives the notification.                                       |
| `subtitle`              | `String`                           | The notification's subtitle (iOS only).                                                           |
| `tag`                   | `String`                           | An identifier similar to `group` but for different purposes (Android only).                       |
| `threadIdentifier`      | `String`                           | An identifier similar to `group` but for different purposes (iOS only).                           |
| `titleLocArgs`          | `List<String>`                     | Variable string values to substitute format specifiers in `titleLocKey` to localize the title text. |
| `titleLocKey`           | `String`                           | The key to the title string in the app's string resources to localize the title text.              |

### Trigger values

The `trigger` property uses the `MessageNotificationTrigger` enum:

| Value          | Description                                       |
| -------------- | ------------------------------------------------- |
| `push`         | A push notification from a remote server.         |
| `location`     | A notification triggered by a location condition. |
| `calendar`     | A notification triggered by a calendar event.     |
| `timeInterval` | A notification triggered after a time interval.   |
| `other`        | Any other trigger type.                           |

### Attachments

Use `MessageNotificationAttachment` to describe media or file attachments included in the notification.

| Property     | Type     | Description           | Required |
| ------------ | -------- | --------------------- | -------- |
| `identifier` | `String` | Attachment identifier. | Yes     |
| `type`       | `String` | Attachment type.       | Yes     |
| `url`        | `String` | Attachment URL.        | Yes     |
