---
title: "Session tracking"
description: "Track user sessions in React Native tracker for mobile engagement and retention analysis."
schema: "TechArticle"
keywords: ["Session Tracking", "User Sessions", "React Native", "Session Analytics", "Session Management", "User Activity"]
sidebar_position: 20
---

# Session tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Session tracking captures the session which helps to keep track of the user activity in the app.

Client session tracking is enabled by default. It can be set using the `sessionContext` option as explained below.

```typescript
const tracker = await newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    sessionContext: true,
});
```

When enabled, the tracker appends a [`client_session` entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) to each event it sends and it maintains this session information as long as the application is installed on the device.

Sessions correspond to tracked user activity. A session expires when no tracking events have occurred for the amount of time defined in a timeout (by default 30 minutes). The session timeout check is executed for each event tracked. If the gap between two consecutive events is longer than the timeout the session is renewed. There are two timeouts since a session can timeout in the foreground (while the app is visible) or in the background (when the app has been suspended, but not closed).

The timeouts for the session can be configured like in the example below:

```typescript
const tracker = await newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    foregroundSessionTimeout: 1800, // seconds
    backgroundSessionTimeout: 1800 // seconds
});
```

The lifecycle events (`Foreground` and `Background` events) have a role in the session expiration. The lifecycle events can be enabled as explained in [App Lifecycle Tracking](../lifecycle-tracking/index.md). Once enabled they will be fired automatically when the app moves from foreground state to background state and vice versa.

When the app moves from foreground to background, the `Background` event is fired. If session tracking is enabled, the session entity will be attached to the event checking the session expiration using the foreground timeout.
When the app moves from background to foreground, the `Foreground` event is fired. If session tracking is enabled, the session entity will be attached to the event checking the session expiration using the background timeout.

For instance, with this configuration:

```typescript
const tracker = await newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    foregroundSessionTimeout: 360, // seconds
    backgroundSessionTimeout: 15 // seconds
});
```

the session would expire if the app is in background for more than 15 seconds, like in this example:

```text
time: 0s - ScreenView event - foreground timeout session check - session 1
time: 3s - Background event - foreground timeout session check (3 < 360) - session 1
time: 30s - Foreground event - background timeout session check (30 > 15) - session 2
```

In the above example, the `Foreground` event triggers a new session because the time spent in background (without tracked events) is bigger than the background timeout for the session.

## Getting session data from the tracker

The React Native tracker has implemented callbacks that enable you to get session data back from the tracker at runtime. The way to do so is by using a tracker's `get..` methods. As with all tracker methods, these callbacks are also asynchronous, and they return a Promise that resolves to the respective value (or `undefined`) when fulfilled.

The available methods, are:

### getSessionUserId

This method returns a promise that resolves to the identifier (string UUIDv4) for the user of the session.

```javascript
const sessionUserId = await tracker.getSessionUserId();
```

### getSessionId

This method returns a promise that resolves to the identifier (string UUIDv4) for the session.

```javascript
const sessionId = await tracker.getSessionId();
```

### getSessionIndex

This method returns a promise to resolve to the index (number) of the current session for this user.

```javascript
const sessionIdx = await tracker.getSessionIndex();
```

### getIsInBackground

This method returns a promise to resolve to whether (boolean) the app is currently in background.

```javascript
const isInBackground = await tracker.getIsInBackground();
```

### getBackgroundIndex

This method returns a promise to resolve to the number of background transitions in the current session.

```javascript
const bgIndex = await tracker.getBackgroundIndex();
```

### getForegroundIndex

This method returns a promise to resolve to the number of foreground transitions in the current session.

```javascript
const fgIndex = await tracker.getForegroundIndex();
```

### getSessionState

This method returns a promise to resolve to the object containing the full state used to build the `client_session` entity in a single call, rather than the individual fields returned by the other methods.

```javascript
const sessionState = await tracker.getSessionState();
```
