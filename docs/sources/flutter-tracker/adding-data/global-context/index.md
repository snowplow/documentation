---
title: "Global context for Flutter tracker"
sidebar_label: "Global context"
sidebar_position: 10
date: "2026-03-26"
description: "Add static global context entities to all Flutter tracker events. Configure global contexts at initialization or add and remove them at runtime using tags."
keywords: ["flutter global context", "global entities", "context configuration"]
---

**Global context** (also known as global entities) lets you define context entities once and have them sent with every tracked event. This saves you from having to manually attach the same contexts to every individual event call.

Here is an example that adds a global context entity to all subsequently tracked events:

```dart
// Create a global context entity
const userContext = SelfDescribing(
  schema: 'iglu:com.my_company/user/jsonschema/1-0-0',
  data: {
    'userId': 'abc123',
    'plan': 'premium'
  }
);

// Add it as a global context — it will be attached to all events
await tracker.addGlobalContexts('user_context_tag', userContext);

// This event will include the global context automatically
tracker.track(ScreenView(name: 'home_screen'));
```

## Configure global contexts at initialization

You can set up static global contexts when you initialize the tracker. This is the most straightforward approach if you have contexts that should be present for the entire lifetime of the tracker.

Use `GlobalContextsConfiguration` and pass it to `Snowplow.createTracker()`:

```dart
SnowplowTracker tracker = await Snowplow.createTracker(
  namespace: 'ns1',
  endpoint: 'http://your-collector-endpoint.com',
  globalContextsConfig: const GlobalContextsConfiguration(
    contexts: [
      SelfDescribing(
        schema: 'iglu:com.my_company/user/jsonschema/1-0-0',
        data: {
          'userId': 'user-12345',
          'plan': 'premium'
        }
      ),
      SelfDescribing(
        schema: 'iglu:com.my_company/app_environment/jsonschema/1-0-0',
        data: {
          'environment': 'production',
          'release_version': '1.0.0'
        }
      )
    ]
  )
);
```

### GlobalContextsConfiguration

The `GlobalContextsConfiguration` class accepts the following:

| Attribute  | Type                       | Description                                           |
| ---------- | -------------------------- | ----------------------------------------------------- |
| `contexts` | `List<SelfDescribing>`     | List of static context entities to attach to all events. |

## Add and remove global contexts at runtime

You can add and remove global contexts dynamically at any time after tracker initialization. Each global context is identified by a string `tag`, which lets you manage multiple contexts independently.

### Add a global context

Use `addGlobalContexts()` with a tag and a context entity:

```dart
const myContext = SelfDescribing(
  schema: 'iglu:com.my_company/feature_flags/jsonschema/1-0-0',
  data: {
    'feature_a': true,
    'feature_b': false
  }
);

// Add using the tracker instance
await tracker.addGlobalContexts('feature_flags_tag', myContext);

// Or using the static method (requires specifying the tracker namespace)
await Snowplow.addGlobalContexts(
  'feature_flags_tag',
  myContext,
  tracker: 'ns1'
);
```

### Remove a global context

Use `removeGlobalContexts()` with the tag of the context you want to remove:

```dart
// Remove using the tracker instance
await tracker.removeGlobalContexts('feature_flags_tag');

// Or using the static method
await Snowplow.removeGlobalContexts(
  'feature_flags_tag',
  tracker: 'ns1'
);
```

:::note
Global contexts were added in v0.9.0. In this release, only static context entities are supported.
:::
