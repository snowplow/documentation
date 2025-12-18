---
title: "Tracking errors on web"
sidebar_label: "Errors"
sidebar_position: 110
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The Errors tracker plugin provides two ways of tracking exceptions: manual tracking of handled exceptions using `trackError` and automatic tracking of unhandled exceptions using `enableErrorTracking`.

Error events can be **manually tracked** and/or **automatically tracked**.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-error-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-error-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-error-tracking@latest/dist/index.umd.min.js",
  ["snowplowErrorTracking", "ErrorTrackingPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-error-tracking`
- `yarn add @snowplow/browser-plugin-error-tracking`
- `pnpm add @snowplow/browser-plugin-error-tracking`

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { ErrorTrackingPlugin, enableErrorTracking } from '@snowplow/browser-plugin-error-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ ErrorTrackingPlugin() ],
});

enableErrorTracking();
```

  </TabItem>
</Tabs>

## Manual error tracking

Use the `trackError` method to track handled exceptions (application errors) in your JS code. This is its signature:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackError', {
  /** The error message */
  message: string;
  /** The filename where the error occurred */
  filename?: string;
  /** The line number which the error occurred on */
  lineno?: number;
  /** The column number which the error occurred on */
  colno?: number;
  /** The error object */
  error?: Error;
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
trackError({
  /** The error message */
  message: string;
  /** The filename where the error occurred */
  filename?: string;
  /** The line number which the error occurred on */
  lineno?: number;
  /** The column number which the error occurred on */
  colno?: number;
  /** The error object */
  error?: Error;
});
```

  </TabItem>
</Tabs>

| **Name**   | **Required?** | **Description**                     | **Type**   |
| ---------- | ------------- | ----------------------------------- | ---------- |
| `message`  | Yes           | Error message                       | string     |
| `filename` | No            | Filename or URL                     | string     |
| `lineno`   | No            | Line number of problem code chunk   | number     |
| `colno`    | No            | Column number of problem code chunk | number     |
| `error`    | No            | JS `ErrorEvent`                     | ErrorEvent |

Of these arguments, only `message` is required. Signature of this method defined to match `window.onerror` callback in modern browsers.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
try {
  var user = getUser()
} catch(e) {
  snowplow('trackError', {
    message: 'Cannot get user object',
    filename: 'shop.js',
    error: e
  });
}
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
try {
  var user = getUser()
} catch(e) {
  trackError({
    message: 'Cannot get user object',
    filename: 'shop.js',
    error: e
  });
}
```

  </TabItem>
</Tabs>

Using `trackError` it's assumed that developer knows where errors could happen, which is not often the case. Therefor it's recommended to use `enableErrorTracking` as it allows you to discover errors that weren't expected.

## Automatic error tracking

Use the `enableErrorTracking` method to track unhandled exceptions (application errors) in your JS code. This is its signature:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableErrorTracking', {
  /** A callback which allows on certain errors to be tracked */
  filter?: (error: ErrorEvent) => boolean;
  /** A callback to dynamically add extra context based on the error */
  contextAdder?: (error: ErrorEvent) => Array<SelfDescribingJson>;
  /** Context to be added to every error */
  context?: Array<SelfDescribingJson>;
}
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
enableErrorTracking({
  /** A callback which allows on certain errors to be tracked */
  filter?: (error: ErrorEvent) => boolean;
  /** A callback to dynamically add extra context based on the error */
  contextAdder?: (error: ErrorEvent) => Array<SelfDescribingJson>;
  /** Context to be added to every error */
  context?: Array<SelfDescribingJson>;
});
```

  </TabItem>
</Tabs>

| **Name**       | **Required?** | **Description**                 | **Type**                                    |
| -------------- | ------------- | ------------------------------- | ------------------------------------------- |
| `filter`       | No            | Predicate to filter exceptions  | `(ErrorEvent) => Boolean`                   |
| `contextAdder` | No            | Function to get dynamic context | `(ErrorEvent) => Array<SelfDescribingJson>` |
| context        | No            | Additional custom context       | `Array<SelfDescribingJson>`                 |

Unlike `trackError` you need enable error tracking only once:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableErrorTracking')
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
enableErrorTracking();
```

  </TabItem>
</Tabs>

Application error events are implemented as Snowplow self-describing events. [Here](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.snowplowanalytics.snowplow/application_error/jsonschema/1-0-1) is the schema for an `application_error` event.
