---
title: "Tracking events"
date: "2021-08-06"
sidebar_position: 20
---

[![Tracker Maintenance Classification](https://img.shields.io/static/v1?style=flat&label=Snowplow&message=Actively%20Maintained&color=6638b8&labelColor=9ba0aa&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAeFBMVEVMaXGXANeYANeXANZbAJmXANeUANSQAM+XANeMAMpaAJhZAJeZANiXANaXANaOAM2WANVnAKWXANZ9ALtmAKVaAJmXANZaAJlXAJZdAJxaAJlZAJdbAJlbAJmQAM+UANKZANhhAJ+EAL+BAL9oAKZnAKVjAKF1ALNBd8J1AAAAKHRSTlMAa1hWXyteBTQJIEwRgUh2JjJon21wcBgNfmc+JlOBQjwezWF2l5dXzkW3/wAAAHpJREFUeNokhQOCA1EAxTL85hi7dXv/E5YPCYBq5DeN4pcqV1XbtW/xTVMIMAZE0cBHEaZhBmIQwCFofeprPUHqjmD/+7peztd62dWQRkvrQayXkn01f/gWp2CrxfjY7rcZ5V7DEMDQgmEozFpZqLUYDsNwOqbnMLwPAJEwCopZxKttAAAAAElFTkSuQmCC)](/docs/migrated/collecting-data/collecting-from-own-applications/tracker-maintenance-classification/)

[![Latest tracker version](https://img.shields.io/npm/v/@snowplow/react-native-tracker)](https://www.npmjs.com/package/@snowplow/react-native-tracker)

[![Supported React Native versions](https://img.shields.io/npm/dependency-version/@snowplow/react-native-tracker/peer/react-native)](https://www.npmjs.com/package/@snowplow/react-native-tracker)

  
  
  
  
  
  

The React Native tracker captures two types of events, automatically captured and manual events.

## Auto Tracking Features

Many of the automatic tracking options available on iOS and Android are also available in React Native – these can be enabled or disabled in the TrackerConfiguration passed to `createTracker` as part of the TrackerController configuration object.

### Events

The React Native Tracker can be configured to automatically track the following events:

- App Lifecycle Tracking
    - Captures application foreground and application background events
- Screen View Tracking
    - Captures each time a new “screen” is loaded
- Exception Tracking
    - Captures any unhandled exceptions within the application
- Installation Tracking
    - Captures an install event which occurs the first time an application is opened
- Deep Link Received
    - Captures a deep link event which is passed to the app
- Message (push or local) Notification
    - Captures a notification received by the app

### Contexts

The contexts that can be set to be automatically attached to all events are:

- Application context
- Platform context
- Geolocation context
- Session context
- Screen context

For more information on the enabled autotracking features by default, see also the Tracker Configuration section.

## Manual tracking

All tracker's `track` methods take two arguments: An object of key-value pairs for the event’s properties, and an optional array of custom event contexts.

### Custom event contexts

Custom contexts can be used to augment any standard Snowplow event type, including self describing events, with additional data. We refer to the custom contexts as [Event Entities](/docs/migrated/understanding-tracking-design/understanding-events-entities/).

Custom contexts can be optionally added as an extra argument to any of the Tracker’s `track..()` methods as an array of self-describing JSON following the same pattern as a self-describing event. As with self-describing events, if you want to create your own custom context, you must create a [JSON schema](/docs/migrated/understanding-tracking-design/understanding-schemas-and-validation/) for it and upload it to an [Iglu repository](https://github.com/snowplow/iglu) using the [Snowplow BDP Console UI](https://snowplowanalytics.com/snowplow-insights/), [Data Structures API](/docs/migrated/understanding-tracking-design/managing-data-structures/), [igluctl](/docs/migrated/open-source-components-and-applications/iglu/) or one of the other supported [Iglu clients](https://github.com/snowplow/iglu/wiki/Setting-up-an-Iglu-client). Since more than one can be attached to an event, the context's argument (if it is provided at all) should be a non-empty array of self-describing JSONs.

**Note:** Even if only one custom context is being attached to an event, it still needs to be wrapped in an array. Also an empty array is acceptable, which will attach no entities to the event.

For example, a custom context to describe a screen could be:

```
const myScreenContext: EventContext = {
    schema: 'iglu:com.example/screen/jsonschema/1-2-1',
    data: {
        screenType: 'test',
        lastUpdated: '2021-06-11'
    }
};
```

Another example custom context to describe a user on a screen could be:

```
const myUserEntity: EventContext = {
    schema: 'iglu:com.example/user/jsonschema/2-0-0',
    data: {
        userType: 'tester'
    }
};
```

Then, to track, for example, a screenViewEvent with both of these contexts attached:

```
tracker.trackScreenViewEvent(
   { name: 'myScreenName' },
   [ myScreenContext, myUserEntity ]
);
```

It is also possible to add custom contexts globally, so that they are applied to all events within an application. For more information, see the Global Contexts section below.

### Events

#### Self-describing events

You may wish to track events, which do not fit into the out-of-the box ones described below. The solution is Snowplow’s self-describing events. Self-describing events are a [data structure based on JSON Schemas](/docs/migrated/understanding-tracking-design/understanding-schemas-and-validation/) and can have arbitrarily many fields.

Just like with custom event entities, to define your own custom self-describing event, you must create a [JSON schema](/docs/migrated/understanding-tracking-design/understanding-schemas-and-validation/) for that event and upload it to an [Iglu Schema Repository](https://github.com/snowplow/iglu) using [igluctl](/docs/migrated/open-source-components-and-applications/iglu/) (or if a Snowplow BDP customer, you can use the [Snowplow BDP Console UI](/docs/migrated/understanding-tracking-design/managing-data-structures/) or [Data Structures API](/docs/migrated/understanding-tracking-design/managing-data-structures-via-the-api/)). Snowplow uses the schema to validate that the JSON containing the event properties is well-formed.

A Self Describing event is a [self-describing JSON](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

**Required properties**

- `schema`: (string) – A valid Iglu schema path. This must point to the location of the custom event’s schema, of the format: `iglu:{vendor}/{name}/{format}/{version}`.
- `data`: (object) – The custom data for your event. This data must conform to the schema specified in the `schema` argument, or the event will fail validation and land in bad rows.

To track a custom self-describing event, use the `trackSelfDescribingEvent` method of the tracker.

For example, to track a link-click event, which is one whose schema is already published in [Iglu Central](https://github.com/snowplow/iglu-central):

```
tracker.trackSelfDescribingEvent({
    schema: 'iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1',
    data: {targetUrl: 'http://a-target-url.com'}
});
```

#### Structured

Our philosophy in creating Snowplow is that users should capture important consumer interactions and design suitable data structures for this data capture. You can read more about that philosophy [here](/docs/migrated/understanding-tracking-design/). Using `trackSelfDescribingEvent` captures these interactions with custom schemas, as desribed above.

However, as part of a Snowplow implementation there may be interactons where custom Self Describing events are perhaps too complex or unwarranted. They are then candidates to track using `trackStructuredEvent`, if none of the other event-specific methods outlined below are appropriate.

For example:

```
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

#### Timing

Use the `trackTimingEvent` tracker method to track user timing events such as how long resources take to load.

For example:

```
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

#### Screen View

Track the user viewing a screen within the application. This type of tracking is typically used when automatic screen view tracking is not suitable within your application.

To track a ScreenViewEvent, use the `trackScreenViewEvent` tracker method. For example:

```
tracker.trackScreenViewEvent({
    name: 'my-screen-name',
    id: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
    type: 'carousel',
    previousName: 'previous-screen',
    previousId: '00d71340-342e-4f3d-b9fd-4de728ffba7a',
    previousType: 'feed',
    transitionType: 'basic'
});
```

**Required properties**

- `name`: (string) - The name of the screen viewed

**Optional properties**

- `id`: (string) - The id(UUID) of screen that was viewed
- `type`: (string) - The type of screen that was viewed
- `previousName`: (string) - The name of the previous screen that was viewed
- `previousId`: (string) - The id(UUID) of the previous screen that was viewed
- `previousType`: (string) - The type of screen that was viewed
- `transitionType`: (string) - The type of transition that led to the screen being viewed

#### Page View

Track a page view event with the `trackPageViewEvent()` method. Typically this is uncommon in apps, but is sometimes used where fitting data into an existing page views model is required. To track page views from an in-app browser, it is advisable to use the javascript tracker in-browser.

An example:

```
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

#### Consent Granted

Use the `trackConsentGrantedEvent` method to track a user opting into data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied.

For example:

```
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

#### Consent Withdrawn

Use the `trackConsentWithdrawnEvent` method to track a user withdrawing consent for data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied. To specify that a user opts out of all data collection, `all` should be set to `true`.

For example:

```
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

#### Ecommerce Transaction

Modelled on Google Analytics ecommerce tracking capability, an ecommerce-transaction event can be tracked as follows:

1. **Create a EcommerceTransaction event object**. This will be the object that is loaded with all the properties relevant to the specific transaction that is being tracked including all the items (see `EcommerceItem` right below) in the order, the prices of the items, the price of shipping and the `order_id`.
2. **Track the transaction** using the `trackEcommerceTransaction` method.

The procedured outlined above will result in the following events being tracked:

1. An EcommerceTransaction event
2. As many as EcommerceItem events as the items passed to the EcommerceTransaction object, that will also inherit the `orderId` from the parent transaction event

##### EcommerceItem

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

```
const ecomItem: EcommerceItem = {
    sku: 'DD44',
    name: 'T-Shirt',
    category: 'Green Medium',
    price: 15,
    quantity: 1,
    currency: 'USD'
};
```

##### EcommerceTransaction

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

```
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

##### `trackEcommerceTransaction`

Then, to track the ecommerce transaction as described in the above examples:

```
tracker.trackEcommerceTransactionEvent(ecomTransaction);
```

#### Deep Link Received

The Deep Link is received by the mobile operating system and passed to the related app. Our React Native tracker can't automatically track the Deep Link, but we provide an out-of-the-box event that can be used by the developer to manually track it as soon as the Deep Link is received in the app.

It will be the duty of the tracker to automatically attach the information of the Deep Link to the first Screen View tracked.

In practice, when the app receives a Deep Link the developer can track it through the `trackDeepLinkReceivedEvent` endpoint:

```
tracker.trackDeepLinkReceivedEvent({
    url: 'https://deeplink.com',
    referrer: 'http://refr.com',
});
```

Please refer to the [Linking API](https://reactnative.dev/docs/linking) in React Native for information on how to retrieve the linked URLs.

The tracker keeps memory of the tracked Deep Link event and will attach a Deep Link entity to the first ScreenView tracked in the tracker. This is helpful during the analysis of the data because it will be clear the relation between the content visualized by the user (ScreenView event) and source (DeepLink entity) that originated that visualisation.

This behaviour is enabled by default but it can be disabled using the `deepLinkContext` boolean property when passing `trackerConfig` to `createTracker`:

```
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

#### Push and Local Notification

Push Notifications are a cornerstone of the user experience on mobile. A Push Notification is a message (like an SMS or a mobile alert) that can quickly show information to the user even if an app is closed or the phone is in stand-by. Push Notifications can be used in many different ways: they can notify of a new message in a chat, rather than informing of a news or just notify of an achievement in a fitness app.

To track an event when a push (or local) notification is used, it is possible to use the `trackMessageNotificationEvent` endpoint:

```
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

##### MessageNotificationAttachmentProps

Attachment object that identifies an attachment in the Message Notification event.

**Required properties**

- `identifier`: (string) – Attachment identifier.
- `type`: (string) – Attachment type.
- `url`: (string) – Attachment URL.

For example:

```
const attachment: MessageNotificationAttachmentProps = {
    identifier: 'id',
    type: 'type',
    url: 'http://att.url',
};
```

## Setting the Subject data

The subject is a persistent object containing global data that applies to all events, such as a manually set userId. As also described in the SubjectConfiguration section, you can set properties of the subject on tracker initailization.

It is also possible to set or change the subject properties at runtime, using the `set..` methods of the React Native Tracker. The available methods are:

1. `setUserId`

With this method you can set the userId to a new string. To unset the userId, pass a null value as an argument.

```
tracker.setUserId('newUser');
```

2\. `setNetworkUserId`

With this method you can set the `network_userid` to a new string(UUIDv4). To unset, pass a null value as an argument.

```
tracker.setNetworkUserId('44df44bc-8844-4067-9a89-f83c4fe1e62f');
```

3\. `setDomainUserId`

With this method you can set the `domain_userid` to a new string(UUIDv4). To unset, pass a null value as an argument.

```
tracker.setDomainUserId('0526be47-32cb-44b2-a9e6-fefeaa5ec6fa');
```

4\. `setIpAddress`

With this method you can set the `user_ipaddress` to a new string. To unset, pass a null value as an argument.

```
tracker.setIpAddress('123.45.67.89');
```

5\. `setUseragent`

With this method you can set the `useragent` to a new string. To unset, pass a null value as an argument.

```
tracker.setUseragent('some-useragent-string');
```

6\. `setTimezone`

With this method you can set the `os_timezone` to a new string. To unset, pass a null value as an argument.

```
tracker.setTimezone('Africa/Cairo');
```

7\. `setLanguage`

With this method you can set the `br_lang` to a new string. To unset, pass a null value as an argument.

```
tracker.setLanguage('fr');
```

8\. `setScreenResolution`

With this method you can set the `dvce_screenwidth` and `dvce_screenheight` fields to new integer values. The argument to this method is an array that represents the ScreenSize as `[width, height]`. For example:

```
tracker.setScreenResolution([123, 456]);
```

9\. `setScreenViewport`

With this method you can set the `br_viewwidth` and `br_viewheight` fields to new integer values. The argument to this method is an array that represents the ScreenSize as `[width, height]`. For example:

```
tracker.setScreenViewport([123, 456]);
```

10\. `setColorDepth`

With this method you can set the `br_colordepth` to a new value. For example:

```
tracker.setColorDepth(20);
```

Finally, there is an extra "wrapper" method to set may subject properties at once:

- `setSubjectData`

This method accepts as an argument a SubjectConfiguration, with the new values as needed. For example:

```
tracker.setSubjectData({
    userId: 'tester',
    domainUserId: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
    language: 'es',
    colorDepth: 50,
    screenResolution: [300, 300],
});
```

## Global Contexts

As mentioned in the GCConfiguration section, you can set global contexts when initializing the tracker.

However, as the user journey evolves, you may need to remove or add global contexts at runtime.

### Removing Global Contexts

A set of global contexts is identified by its tag, which was set when the global contexts was added, either as part of tracker initial configuration or manually (see below).

To remove the global contexts associated with a tag, you can use the `removeGlobalContexts` tracker method, which takes as argument the tag. For example:

```
tracker.removeGlobalContexts('my-old-tag');
```

### Adding Global Contexts

Similarly, you can add global contexts at runtime using the `addGlobalContexts` tracker method. This method takes as argument the GlobalContext to add.

For example:

```
tracker.addGlobalContexts({
    tag: 'my-new-tag',
    globalContexts: [
        {
            schema: 'iglu:com.snowplowanalytics.snowplow/ad_impression/jsonschema/1-0-0',
            data: {impressionId: 'my-ad-impression-id'},
        },
    ]
});
```
