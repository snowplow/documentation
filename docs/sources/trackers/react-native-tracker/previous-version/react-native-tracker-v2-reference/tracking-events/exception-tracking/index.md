---
title: "Exception tracking"
description: "Track application exceptions and errors in React Native v2 tracker for behavioral analytics."
schema: "TechArticle"
keywords: ["React Native Exceptions", "Exception Tracking", "Error Tracking", "Mobile Errors", "App Crashes", "Error Analytics"]
sidebar_position: 50
---

# Exception tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Exception tracking captures any unhandled exceptions within the application.

:::info
Exception auto-tracking only captures errors from the native iOS and Android code.
JavaScript errors in your React Native code will not be captured currently.
:::

The exception tracking is enabled by default. It can be set in `trackerConfig` like in the example below:

```typescript
const tracker = createTracker(
    'appTracker',
    {
      endpoint: COLLECTOR_URL,
    },
    {
        trackerConfig: {
            exceptionAutotracking: true, // only errors in native app code
        },
    }
);
```

It allows the tracker to intercept critical exceptions in the app. Exceptions can crash the app so it's likely that the event will be sent after the restart of the app. Being a critical situation we can't be 100% sure that all the exception stacktraces are reliably stored for sending before the crash of the app.
