---
title: "Track events"
position: 7
---

With the tracker configured, you can now implement event tracking in your app. The Snowplow mobile trackers provide automatic tracking for common mobile app events, plus the flexibility to track custom events specific to your business.

Events represent user actions at specific points in time. Each event is enriched with context information about the device, session, and app state when the action occurred.

## Automatic event tracking

The tracker automatically captures several types of events when enabled in your tracker configuration:

### Screen view tracking

Screen views track when users navigate to different screens in your app. This is fundamental for understanding user journeys and popular content.

#### iOS

Screen view tracking is enabled by default for UIKit views. The tracker automatically detects when views appear.

For SwiftUI views, you need to track manually using the `onAppear` callback:

```swift
YourView {
    // Your view content
}
.onAppear {
    let event = ScreenView(name: "home", screenId: UUID())
    Snowplow.defaultTracker()?.track(event)
}
```

#### Android

Automatic screen view tracking is enabled by default. It tracks events when `Activity` instances are resumed in their lifecycle.

#### React Native

React Native requires manual tracking. Use the router's location hooks to track screen changes:

```typescript
import React from "react";
import { Switch, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const useLocationChange = () => {
    const location = useLocation();
    React.useEffect(() => {
        tracker.trackScreenViewEvent({
            id: uuidv4(),
            name: location.pathname,
            type: 'full',
            transitionType: 'none'
        });
    }, [location]);
};

function App() {
    useLocationChange();
    return <Switch>...</Switch>;
}
```

#### Flutter

Register a `SnowplowObserver` with your Navigator to automatically track screen changes:

```dart
MaterialApp(
    navigatorObservers: [
        tracker.getObserver()
    ],
    // ... other configuration
);
```

### App lifecycle tracking

Lifecycle tracking captures when your app moves between foreground and background states. Enable this in your tracker configuration with `lifecycleAutotracking: true`.

This automatically tracks:
- **Background events**: When the app moves to background
- **Foreground events**: When the app becomes visible again
- **Lifecycle context**: Attached to all events, indicating app state

### Installation tracking

Installation events track the first time your app is opened after installation. This is enabled by default on iOS, Android, and React Native platforms.

## Custom event tracking

Beyond automatic events, you can track custom events specific to your app's functionality using self-describing events.

Self-describing events use JSON schemas to define their structure. This ensures data quality and makes events self-documenting.

Here's how to track a custom event across platforms:

### iOS

```swift
let schema = "iglu:com.your-company.your-app/button_click/jsonschema/1-0-0"
let data = [
    "buttonName": "signup",
    "screenName": "home",
    "userId": "user123"
]
let event = SelfDescribing(schema: schema, payload: data)
tracker.track(event)
```

### Android

```java
String schema = "iglu:com.your-company.your-app/button_click/jsonschema/1-0-0";
Map<String, Object> data = new HashMap<>();
data.put("buttonName", "signup");
data.put("screenName", "home");
data.put("userId", "user123");

SelfDescribingJson sdj = new SelfDescribingJson(schema, data);
SelfDescribing event = new SelfDescribing(sdj);
tracker.track(event);
```

### React Native

```typescript
tracker.trackSelfDescribingEvent({
    schema: 'iglu:com.your-company.your-app/button_click/jsonschema/1-0-0',
    data: {
        buttonName: 'signup',
        screenName: 'home',
        userId: 'user123'
    }
});
```

### Flutter

```dart
tracker.track(SelfDescribing(
    schema: 'iglu:com.your-company.your-app/button_click/jsonschema/1-0-0',
    data: {
        'buttonName': 'signup',
        'screenName': 'home',
        'userId': 'user123'
    }
));
```

## Common tracking patterns

Here are some examples of events you might want to track in a mobile app:

### User interactions

```javascript
// Button or link clicks
{
    schema: 'iglu:com.your-company/interaction/jsonschema/1-0-0',
    data: {
        type: 'button_click',
        element: 'signup_button',
        screen: 'home'
    }
}

// Form submissions
{
    schema: 'iglu:com.your-company/form_submit/jsonschema/1-0-0',
    data: {
        formName: 'user_registration',
        success: true,
        validationErrors: []
    }
}
```

### Business events

```javascript
// Purchase events
{
    schema: 'iglu:com.your-company/purchase/jsonschema/1-0-0',
    data: {
        orderId: 'order_123',
        totalValue: 29.99,
        currency: 'USD',
        itemCount: 2
    }
}

// Content engagement
{
    schema: 'iglu:com.your-company/content_view/jsonschema/1-0-0',
    data: {
        contentId: 'article_456',
        contentType: 'blog_post',
        timeSpent: 120,
        scrollDepth: 0.8
    }
}
```

## Event context

Events automatically include context entities that describe the environment when the event occurred:

- **Screen context**: Current screen information
- **Application context**: App version and build details
- **Session context**: Session ID and user information
- **Platform context**: Device type, OS, and technical details

You can also add custom context entities to provide additional information relevant to your specific events.

## Best practices

When implementing event tracking:

1. **Start simple**: Begin with automatic tracking and a few key custom events
2. **Use descriptive names**: Make event and property names clear and consistent
3. **Plan your schema**: Design your event structure before implementation
4. **Test thoroughly**: Validate events are tracking correctly before production
5. **Document events**: Keep a record of what each event represents

With events tracking implemented, you're ready to test your implementation and validate that data is being captured correctly.
