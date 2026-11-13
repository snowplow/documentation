---
title: "Read attributes from websites and apps"
sidebar_position: 25
sidebar_label: "Read from websites and apps"
description: "Read a public Signals service directly from a website or mobile app, without an API token or a backend proxy, using the browser plugin, the iOS and Android trackers, or the Signals API."
keywords: ["public services", "client-side attributes", "browser plugin", "ios tracker", "android tracker", "getServiceAttributes", "personalization"]
date: "2026-11-08"
content_type: how-to
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Websites and mobile apps can read a [service](/docs/signals/applications/services/index.md) with the `public` access mode directly, without a Snowplow API token. Use this to personalize a page or screen with the current user's attributes, such as showing recently viewed products or adapting content to engagement level, without building a backend to proxy the request.

Each read returns every attribute in the service for one identifier. Reading a public service works the same way as [retrieving attributes](/docs/signals/applications/retrieve-attributes/index.md) with an API token, with these differences:
* Only services with the `public` access mode can be read this way. Any other service returns a `404` error.
* The identifier must be a UUID, and each request reads one identifier
* Requests are allowed from any origin, and responses are never cached

:::warning[Public services expose their attributes]
Anyone who has an identifier can read the attributes stored for it. Only include attributes that are safe to show to the user they describe, keyed by an identifier the browser or device already holds, such as `domain_userid` or `client_session_user_id`. Don't include personal or sensitive data in a public service.
:::

## Make a service public

Set the service's access mode to `public` in Console or with the Python SDK. See [Control who can read a service](/docs/signals/applications/services/index.md#control-who-can-read-a-service).

The service must be keyed by the same attribute key that your application reads it by. For web applications, that's usually `domain_userid` or `domain_sessionid`. For mobile apps, use the built-in `client_session_user_id` or `client_session_session_id` [attribute keys](/docs/signals/attributes/attribute-keys/index.md), which are based on the identifiers in the mobile trackers' session entity.

## Read the service

The Signals browser plugin and the iOS and Android trackers read the service for the current user by default. You'll need your Signals API URL, from the **Signals** > **Overview** page in Console. You don't need any other [connection credentials](/docs/signals/connection/reference/index.md#connection-credentials).

<Tabs groupId="signals-client" queryString>
<TabItem value="browser" label="Browser" default>

Use `getServiceAttributes()` from the [Signals browser plugin](https://www.npmjs.com/package/@snowplow/signals-browser-plugin), together with the Snowplow [browser tracker](/docs/sources/web-trackers/index.md). By default, it reads the service for the tracker's `domain_userid`.

```typescript
import { newTracker } from '@snowplow/browser-tracker';
import {
  SignalsInterventionsPlugin,
  getServiceAttributes,
  ServiceAttributesError,
} from '@snowplow/signals-browser-plugin';

newTracker('sp1', '{{collector_url}}', {
  appId: 'my-app-id',
  plugins: [ SignalsInterventionsPlugin() ],
});

try {
  const attributes = await getServiceAttributes({
    endpoint: '000000000000.signals.snowplowanalytics.com',
    service: 'my_public_service',
  });
  console.log(attributes.page_views_count); // null if there's no value yet
} catch (e) {
  if (e instanceof ServiceAttributesError) {
    console.warn(e.status, e.message);
  }
}
```

The function takes these options:

| Option | Description | Type | Required? |
| --- | --- | --- | --- |
| `endpoint` | Your Signals API URL | `string` | ✅ |
| `service` | The name of a service with the `public` access mode | `string` | ✅ |
| `attributeKey` | The attribute key the identifier belongs to. Defaults to `domain_userid` | `string` | ❌ |
| `identifier` | The UUID to read the service for. Defaults to the tracker's own value for `domain_userid` or `domain_sessionid`, and is required for any other attribute key | `string` | ❌ |
| `tracker` | Which tracker's identifier to use, if the plugin is installed on several trackers. Defaults to the first | `string` | ❌ |
| `apiPath` | The path to request from `endpoint`. Defaults to `/api/v1/services` | `string` | ❌ |
| `timeoutMs` | How long to wait for a response, in milliseconds. Defaults to `5000` | `number` | ❌ |

In TypeScript, you can pass the shape of the service's attributes as a type parameter. The type isn't checked at runtime, so keep it in step with the service definition.

```typescript
type Profile = {
  page_views_count: number | null;
  unique_pages_viewed: string[] | null;
};

const attributes = await getServiceAttributes<Profile>({
  endpoint: '000000000000.signals.snowplowanalytics.com',
  service: 'my_public_service',
});
```

</TabItem>
<TabItem value="ios" label="iOS">

Add a `SignalsConfiguration` when [creating the tracker](/docs/sources/mobile-trackers/signals/index.md), then call `getServiceAttributes` on `tracker.signals`. By default, it reads the service for the session `userId`, under the `client_session_user_id` attribute key.

```swift
tracker.signals.getServiceAttributes(service: "app_profile") { attributes, error in
    if let error = error {
        print("Signals read failed (\(error.status)): \(error.message)")
    } else if let attributes = attributes {
        // NSNull if there's no value yet
        print(attributes["screen_views_count"] ?? "no value")
    }
}
```

On iOS 13 and later, you can use Swift concurrency instead:

```swift
do {
    let attributes = try await tracker.signals.getServiceAttributes(service: "app_profile")
} catch let error as SignalsError {
    print(error.status, error.message)
}
```

To read by session, pass the `client_session_session_id` attribute key. The session ID exists once the tracker has tracked its first event. For any other attribute key, pass the identifier as well:

```swift
let sessionAttributes = try await tracker.signals.getServiceAttributes(
    service: "session_profile",
    attributeKey: "client_session_session_id"
)

let accountAttributes = try await tracker.signals.getServiceAttributes(
    service: "account_profile",
    attributeKey: "user_id",
    identifier: "4b4a5e8c-6c4f-4b8a-9a3b-5a1d2c3e4f5a"
)
```

</TabItem>
<TabItem value="android" label="Android (Kotlin)">

Add a `SignalsConfiguration` when [creating the tracker](/docs/sources/mobile-trackers/signals/index.md), then call `getServiceAttributes` on `tracker.signals`. By default, it reads the service for the session `userId`, under the `client_session_user_id` attribute key. The callback runs on a background thread.

```kotlin
tracker.signals.getServiceAttributes("app_profile") { result ->
    if (result.isSuccess) {
        val screenViews = result.attributes?.get("screen_views_count") // null if there's no value yet
    } else {
        Log.w("Signals", "${result.error?.status}: ${result.error?.message}")
    }
}
```

To read by session, pass the `client_session_session_id` attribute key. The session ID exists once the tracker has tracked its first event. For any other attribute key, pass the identifier as well:

```kotlin
tracker.signals.getServiceAttributes(
    "session_profile",
    SignalsAttributeKeys.CLIENT_SESSION_SESSION_ID
) { result -> /* ... */ }

tracker.signals.getServiceAttributes(
    "account_profile",
    "user_id",
    "7d5a2a8e-0b3c-4a43-a5a3-3b0f2b0c7f6e"
) { result -> /* ... */ }
```

</TabItem>
<TabItem value="android-java" label="Android (Java)">

Add a `SignalsConfiguration` when [creating the tracker](/docs/sources/mobile-trackers/signals/index.md), then call `getServiceAttributes` on the Signals controller. By default, it reads the service for the session `userId`, under the `client_session_user_id` attribute key. The callback runs on a background thread.

```java
tracker.getSignals().getServiceAttributes("app_profile", result -> {
    if (result.isSuccess()) {
        Map<String, Object> attributes = result.getAttributes();
    } else {
        Log.w("Signals", result.getError().getStatus() + ": " + result.getError().getMessage());
    }
});
```

</TabItem>
<TabItem value="api" label="Signals API">

Send a `GET` request to `/api/v1/services/{service}`, with the attribute key name and identifier as a query parameter. Don't include an `Authorization` header.

```bash
curl '{{API_URL}}/api/v1/services/my_public_service?domain_userid=218e8926-3858-431d-b2ed-66da03a1cbe5'
```

The response contains every attribute in the service by name, with `null` where there's no value yet:

```json
{
  "attributes": {
    "page_views_count": 4,
    "unique_pages_viewed": ["https://example.com/", "https://example.com/pricing"]
  }
}
```

</TabItem>
</Tabs>

On iOS and Android, the trackers don't send any request when user anonymization is enabled or session tracking is disabled. In those cases, the read fails with status `0`.

## Handle errors

Each method reports failures with a status code and a message:

| Status | Meaning |
| --- | --- |
| `400` | The request didn't have exactly one identifier, the identifier isn't a UUID, or the attribute key doesn't match the service |
| `404` | The service doesn't exist, isn't published, or doesn't have the `public` access mode |
| `0` | No request was sent, for example because there was no identifier to read by, or no response arrived before the timeout. Only returned by the browser plugin and the mobile trackers |

When calling the API directly, error responses have a JSON body with an `error` message.

If you change a service's access mode, the change can take a few seconds to apply to reads.

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
