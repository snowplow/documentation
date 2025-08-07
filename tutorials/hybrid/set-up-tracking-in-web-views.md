---
title: Set up tracking in web views
position: 9
---

After installing the [WebView tracker](https://github.com/snowplow-incubator/snowplow-webview-tracker) and configuring your mobile trackers to subscribe to web view events, this section explains how to use the WebView tracker to track events inside web views.

## Event tracking API

The tracker provides a set of functions to manually track events. The functions range from single purpose ones, such as `trackScreenView`, to the more complex but flexible `trackSelfDescribingEvent`, which can be used to track any kind of user behavior.

You can import the functions from the `@snowplow/webview-tracker` package:

```javascript
import { trackSelfDescribingEvent, trackScreenView } from '@snowplow/webview-tracker';
```

The following functions are available:

| Method | Event type tracked |
|---|---|
| `trackSelfDescribingEvent` | Track a custom event based on "self-describing" JSON schema |
| `trackStructEvent` | Track a semi-custom structured event |
| `trackScreenView` | Track a view of a screen in the app (to be used with the [Snowplow mobile data model](https://docs.snowplowanalytics.com/docs/modeling-your-data/the-snowplow-mobile-model/)) |
| `trackPageView` | Track a web page visit (to be used with the [Snowplow web data model](https://docs.snowplowanalytics.com/docs/modeling-your-data/the-snowplow-web-data-model/)) |

All methods accept two arguments:

| Argument   | Description                                                    | Required? |
| -----------| -------------------------------------------------------------- | ------------------ |
| `event`    | Event body, depends on the event being tracked                 | Yes                |
| `trackers` | Optional list of tracker namespaces to track the event with (undefined for default tracker) | No  |

## Track self-describing events

Use the `trackSelfDescribingEvent` function to track a custom event. This is the most advanced and powerful tracking method, which requires a certain amount of planning and infrastructure.

Self-describing events are based around "self-describing" JSONs, which are a specific kind of [JSON schema](http://json-schema.org/). A unique schema can be designed for each type of event that you want to track.

| Argument       | Description                                                    | Required? |
| ---------------| -------------------------------------------------------------- | ------------------ |
| `event.schema` | The schema for the event                                       | Yes                |
| `event.data`   | The event data conforming to the schema                       | Yes                |
| `context`      | List of context entities as self-describing JSONs              | No                 |

Example:

```javascript
trackSelfDescribingEvent({
    event: {
        schema: 'iglu:com.example_company/save_game/jsonschema/1-0-2',
        data: {
            'saveId': '4321',
            'level': 23,
            'difficultyLevel': 'HARD',
            'dlContent': true
        }
    }
});
```

## Track structured events

This method provides a halfway-house between tracking fully user-defined self-describing events and out-of-the box predefined events. Structured events closely mirror the structure of Google Analytics events, with "category", "action", "label", and "value" properties.

| Argument   | Description                                                    | Required? |
| -----------| -------------------------------------------------------------- | ------------------ |
| `category` | The grouping of structured events which this action belongs to | Yes                |
| `action`   | Defines the type of user interaction which this event involves | Yes                |
| `label`    | Often used to refer to the 'object' the action is performed on | No                 |
| `property` | Describing the 'object', or the action performed on it         | No                 |
| `value`    | Provides numerical data about the event                        | No                 |
| `context`  | List of context entities as self-describing JSONs              | No                 |

Example:

```javascript
trackStructEvent({
    category: 'shop',
    action: 'add-to-basket',
    label: 'Add To Basket',
    property: 'pcs',
    value: 2.00,
});
```

## Track screen views

Use `trackScreenView` to track a user viewing a screen within your web view. This is particularly useful in hybrid apps where web views represent different screens or sections of your application.

| Argument | Description | Required? |
|---|---|---|
| `name` | The human-readable name of the screen viewed | Yes |
| `id` | The id (UUID v4) of screen that was viewed | Yes |
| `type` | The type of screen that was viewed | No |
| `previousName` | The name of the previous screen that was viewed | No |
| `previousType` | The type of screen that was viewed | No |
| `previousId` | The id (UUID v4) of the previous screen that was viewed | No |
| `transitionType` | The type of transition that led to the screen being viewed | No |
| `context` | List of context entities as self-describing JSONs | No |

Example:

```javascript
trackScreenView({
    id: '2c295365-eae9-4243-a3ee-5c4b7baccc8f',
    name: 'checkout',
    type: 'webview',
    transitionType: 'navigation'
});
```

## Track web page views

The `trackPageView` method may be used to track page views on the web portion of your hybrid app.

| Argument | Description | Required? |
|---|---|---|
| `title` | Override the page title | No |
| `context` | List of context entities as self-describing JSONs | No |

```javascript
trackPageView();
```

## Add context to events

Event context is a powerful aspect of Snowplow tracking that allows you to add rich data to your events. Context is based on the same self-describing JSON schemas as self-describing events.

Example with context:

```javascript
trackStructEvent({
    category: 'shop',
    action: 'add-to-basket',
    label: 'Add To Basket',
    property: 'pcs',
    value: 2.00,
    context: [
        {
            schema: 'iglu:com.my_company/user_session/jsonschema/1-0-0',
            data: {
                session_type: 'webview',
                screen_resolution: '1920x1080',
                user_agent: navigator.userAgent
            }
        }
    ]
});
```

Remember that all these events tracked from the web view will be forwarded to the native mobile tracker, ensuring unified session tracking across both native and web components of your hybrid app.
