---
title: "Tracking out-of-the-box events"
description: "Track behavioral events in React Native applications for mobile analytics and user insights."
schema: "TechArticle"
keywords: ["React Native Events", "Event Tracking", "Mobile Events", "App Analytics", "Event Collection", "Mobile Analytics"]
date: "2021-08-06"
sidebar_position: 20
---

The React Native tracker captures two types of out-of-the-box events, automatically captured and manual events.

## Auto-tracked events and entities

Many of the automatic tracking options available on iOS and Android are also available in React Native – these can be enabled or disabled in the TrackerConfiguration passed to `newTracker` as part of the TrackerController configuration object:

```typescript
const tracker = newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,

    // auto-tracked events:
    lifecycleAutotracking: false,
    installAutotracking: true,
    screenEngagementAutotracking: true,

    // auto-tracked context entities:
    applicationContext: true,
    platformContext: true,
    sessionContext: true,
    deepLinkContext: true,
    screenContext: true,
);
```

The automatically captured data are:

* [**Platform and Application Context Tracking**](./platform-and-application-context/index.md): Captures contextual information about the device and the app.
* [**Session Tracking**](./session-tracking/index.md): Captures the session which helps to keep track of the user activity in the app.
* [**App Lifecycle Tracking**](./lifecycle-tracking/index.md): Captures application lifecycle state changes (foreground/background transitions).
* [**Screen View and Engagement Tracking**](./screen-tracking/index.md): Captures each time a new “screen” is loaded.
* [**Installation Tracking**](./installation-tracking/index.md): Captures an install event which occurs the first time an application is opened.

## Manually-tracked events

All tracker's `track` methods take two arguments: An object of key-value pairs for the event’s properties, and an optional array of [custom event contexts](/docs/sources/trackers/react-native-tracker/custom-tracking-using-schemas/index.md).

### Tracking screen view events

Track the user viewing a screen within the application.

To track a ScreenViewEvent, use the `trackScreenViewEvent` tracker method. For example:

```typescript
tracker.trackScreenViewEvent({
    name: 'my-screen-name',
    id: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
    type: 'carousel',
    transitionType: 'basic'
});
```

The tracker will automatically assign references to the previously tracked screen view event in the `previousName`, `previousId`, and `previousType` properties.

**Required properties**

- `name`: (string) - The name of the screen viewed

**Optional properties**

- `id`: (string) - The id(UUID) of screen that was viewed
- `type`: (string) - The type of screen that was viewed
- `previousName`: (string) - The name of the previous screen that was viewed (assigned automatically)
- `previousId`: (string) - The id(UUID) of the previous screen that was viewed (assigned automatically)
- `previousType`: (string) - The type of screen that was viewed (assigned automatically)
- `transitionType`: (string) - The type of transition that led to the screen being viewed

### Tracking page view events

Track a page view event with the `trackPageViewEvent()` method. Typically this is uncommon in apps, but is sometimes used where fitting data into an existing page views model is required. To track page views from an in-app browser, it is advisable to use the javascript tracker in-browser.

An example:

```typescript
tracker.trackPageViewEvent({
  pageUrl: 'https://my-url.com',
  pageTitle: 'My page title',
  referrer: 'http://some-other-url.com'
});
```

Required properties

- `pageUrl`: (string) – Page Url for the page view event. Must be a valid url.

Optional properties

- `pageTitle`: (string) – Page Title for the page view event.
- `referrer`: (string) – Url for the referring page to the page view event. Must be a vaild url.

### Tracking timing events

Use the `trackTimingEvent` tracker method to track user timing events such as how long resources take to load.

For example:

```typescript
tracker.trackTimingEvent({
    category: 'timing-category',
    variable: 'timing-variable',
    timing: 5,
    label: 'optional-label'
});
```

**Required properties**

- `category`: (string) - Defines the timing category
- `variable`: (string) - Define the timing variable measured
- `timing`: (number) - Represent the time

**Optional properties**

- `label`: An optional string to further identify the timing event

### Tracking consent granted events

Use the `trackConsentGrantedEvent` method to track a user opting into data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied.

For example:

```typescript
tracker.trackConsentGrantedEvent({
    expiry: '2022-01-01T00:00:00Z',
    documentId: 'doc-id',
    version: '1.2',
    name: 'doc-name',
    documentDescription: 'consent doc description'
});
```

**Required properties**

- `expiry`: (string) - The expiry (date-time string, e.g.: '2022-01-01T00:00:00Z')
- `documentId`: (string) - The consent document id
- `version`: (string) - The consent document version

**Optional properties**

- `name`: (string) - The consent document name
- `documentDescription`: (string) - The consent document description

### Tracking consent withdrawn events

Use the `trackConsentWithdrawnEvent` method to track a user withdrawing consent for data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied. To specify that a user opts out of all data collection, `all` should be set to `true`.

For example:

```typescript
tracker.trackConsentWithdrawnEvent({
    all: true,
    documentId: 'doc-id',
    version: '1.2',
    name: 'doc-name',
    documentDescription: 'consent doc description'
});
```

**Required properties**

- `all`: (boolean) - Whether user opts out of all data collection
- `documentId`: (string) - The consent document id
- `version`: (string) - The consent document version

**Optional properties**

- `name`: (string) - The consent document name
- `documentDescription`: (string) - The consent document description

### Tracking ecommerce transaction events

Modelled on Google Analytics ecommerce tracking capability, an ecommerce-transaction event can be tracked as follows:

1. **Create a EcommerceTransaction event object**. This will be the object that is loaded with all the properties relevant to the specific transaction that is being tracked including all the items (see `EcommerceItem` right below) in the order, the prices of the items, the price of shipping and the `order_id`.
2. **Track the transaction** using the `trackEcommerceTransaction` method.

The procedured outlined above will result in the following events being tracked:

1. An EcommerceTransaction event
2. As many as EcommerceItem events as the items passed to the EcommerceTransaction object, that will also inherit the `orderId` from the parent transaction event

#### EcommerceItem

More specifically, to start with, the properties of an `EcommerceItem` are:

**Required properties**

- `sku`: (string) - The item sku
- `price`: (number) - The item price
- `quantity`: (number) - The quantity purchased

**Optional properties**

- `name`: (string) - The item name
- `category`: (string) - The item category
- `currency`: (string) - The item currency

For example:

```typescript
const ecomItem: EcommerceItem = {
    sku: 'DD44',
    name: 'T-Shirt',
    category: 'Green Medium',
    price: 15,
    quantity: 1,
    currency: 'USD'
};
```

#### EcommerceTransaction

An ecommerce transaction object has the following properties:

**Required properties**

- `orderId`: (string) - The order ID of the transaction
- `totalValue`: (number) - The total value of the transaction
- `items`: (array of `EcommerceItem`) - The ecommerce items purchased in the transaction.

**Optional properties**

- `affiliation`: (string)
- `taxValue`: (number)
- `shipping`: (number)
- `city`: (string)
- `state`: (string)
- `country`: (string)
- `currency`: (string)

```typescript
const ecomTransaction: EcommerceTransactionProps = {
    orderId: '1234',
    totalValue: 15,
    items: [ ecomItem ],
    affiliation: 'Womens Apparel',
    taxValue: 1.5,
    shipping: 2.99,
    city: 'San Jose',
    state: 'California',
    country: 'USA',
    currency: 'USD'
};
```

#### `trackEcommerceTransaction`

Then, to track the ecommerce transaction as described in the above examples:

```typescript
tracker.trackEcommerceTransactionEvent(ecomTransaction);
```

### Tracking deep link received events

The Deep Link is received by the mobile operating system and passed to the related app. Our React Native tracker can't automatically track the Deep Link, but we provide an out-of-the-box event that can be used by the developer to manually track it as soon as the Deep Link is received in the app.

It will be the duty of the tracker to automatically attach the information of the Deep Link to the first Screen View tracked.

In practice, when the app receives a Deep Link the developer can track it through the `trackDeepLinkReceivedEvent` endpoint:

```typescript
tracker.trackDeepLinkReceivedEvent({
    url: 'https://deeplink.com',
    referrer: 'http://refr.com',
});
```

Please refer to the [Linking API](https://reactnative.dev/docs/linking) in React Native for information on how to retrieve the linked URLs.

The tracker keeps memory of the tracked Deep Link event and will attach a Deep Link entity to the first ScreenView tracked in the tracker. This is helpful during the analysis of the data because it will be clear the relation between the content visualized by the user (ScreenView event) and source (DeepLink entity) that originated that visualisation.

This behavior is enabled by default but it can be disabled using the `deepLinkContext` boolean property when passing `trackerConfig` to `createTracker`:

```typescript
const tracker = createTracker(
    namespace, networkConfig,
    {
        trackerConfig: {
            deepLinkContext: false
        }
    }
);
```

The Deep Link Received event can be used in pair with a campaign-attribution-enrichment appropriately enabled in the Snowplow pipeline. It works exactly like for Page View events in the web/JS tracker. When the user taps on an advertising banner or a marketing email or message, it can trigger the launch of the app through the Deep Linking feature. The referral from the advertising campaigns, websites, or other source can be composed by UTM parameters used to attribute the user activity back to the campaign. The Campaign Attribution Enrichment can parse the DeepLinkReceived event extracting the UTM parameters in the deep link url.

Required properties

- `url`: (string) – URL in the received deep-link

Optional properties

- `referrer`: (string) – Referrer URL, source of this deep-link

### Tracking push and local notification events

Push Notifications are a cornerstone of the user experience on mobile. A Push Notification is a message (like an SMS or a mobile alert) that can quickly show information to the user even if an app is closed or the phone is in stand-by. Push Notifications can be used in many different ways: they can notify of a new message in a chat, rather than informing of a news or just notify of an achievement in a fitness app.

To track an event when a push (or local) notification is used, it is possible to use the `trackMessageNotificationEvent` endpoint:

```typescript
tracker.trackMessageNotificationEvent({
    title: 'title',
    body: 'body',
    trigger: 'push',
    action: 'action',
    attachments: [
        {
            identifier: 'att_id',
            type: 'att_type',
            url: 'http://att.url',
        },
    ],
    bodyLocArgs: ['bodyArg1', 'bodyArg2'],
    bodyLocKey: 'bodyKey',
    category: 'category',
    contentAvailable: true,
    group: 'group',
    icon: 'icon',
    notificationCount: 3,
    notificationTimestamp: '2022-02-02T15:17:42.767Z',
    sound: 'chime.mp3',
    subtitle: 'subtitle1',
    tag: 'tag',
    threadIdentifier: 'threadIdentifier',
    titleLocArgs: ['titleArg1', 'titleArg2'],
    titleLocKey: 'titleKey',
});
```

Required properties

- `title`: (string) – The notification's title.
- `body`: (string) – The notification's body.
- `trigger`: (string) – The trigger that raised the notification message. Must be one of: push, location, calendar, timeInterval, other.

Optional properties

- `action`: (string) – The action associated with the notification.
- `attachments`: (array of `MessageNotificationAttachmentProps`) – Attachments added to the notification (they can be part of the data object).
- `bodyLocArgs` (array of string) - Variable string values to be used in place of the format specifiers in bodyLocArgs to use to localize the body text to the user's current localization.
- `bodyLocKey`: (string) – The key to the body string in the app's string resources to use to localize the body text to the user's current localization.
- `category`: (string) – The category associated to the notification.
- `contentAvailable`: (boolean) – The application is notified of the delivery of the notification if it's in the foreground or background, the app will be woken up (iOS only).
- `group`: (string) – The group which this notification is part of.
- `icon`: (string) – The icon associated to the notification (Android only).
- `notificationCount`: (integer) – The number of items this notification represent.
- `notificationTimestamp`: (string) – The time when the event of the notification occurred.
- `sound`: (string) – The sound played when the device receives the notification.
- `subtitle`: (string) – The notification's subtitle. (iOS only)
- `tag`: (string) – An identifier similar to 'group' but usable for different purposes (Android only).
- `threadIdentifier`: (string) – An identifier similar to 'group' but usable for different purposes (iOS only).
- `titleLocArgs`: (array of string) – Variable string values to be used in place of the format specifiers in titleLocArgs to use to localize the title text to the user's current localization.
- `titleLocKey`: (string) – The key to the title string in the app's string resources to use to localize the title text to the user's current localization.

#### MessageNotificationAttachmentProps

Attachment object that identifies an attachment in the Message Notification event.

**Required properties**

- `identifier`: (string) – Attachment identifier.
- `type`: (string) – Attachment type.
- `url`: (string) – Attachment URL.

For example:

```typescript
const attachment: MessageNotificationAttachmentProps = {
    identifier: 'id',
    type: 'type',
    url: 'http://att.url',
};
```

### Tracking structured events

Our philosophy in creating Snowplow is that users should capture important consumer interactions and design suitable data structures for this data capture. You can read more about that philosophy [here](/docs/data-product-studio/index.md). Using `trackSelfDescribingEvent` captures these interactions with custom schemas, as desribed above.

However, as part of a Snowplow implementation there may be interactons where custom Self Describing events are perhaps too complex or unwarranted. They are then candidates to track using `trackStructuredEvent`, if none of the other event-specific methods outlined below are appropriate.

For example:

```typescript
tracker.trackStructuredEvent({
  category: 'my-category',
  action: 'my-action',
  label: 'my-label',
  property: 'my-property',
  value: 50.00
});
```

**Required properties**

- `category`: The name you supply for the group of objects you want to track e.g. ‘media’, ‘ecomm’
- `action`: A string which defines the type of user interaction for the web object e.g. ‘play-video’, ‘add-to-basket’

**Optional properties**

- `label`: (string) - identifies the specific object being actioned e.g. ID of the video being played, or the SKU or the product added-to-basket
- `property`: (string) - describes the object or the action performed on it. This might be the quantity of an item added to basket
- `value`: (number) - quantifies or further describes the user action. This might be the price of an item added-to-basket, or the starting time of the video where play was just pressed
