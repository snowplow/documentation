---
title: "Link clicks"
sidebar_position: 40
description: "Documentation for Link clicks in the web tracker."
keywords: ["tracker", "configuration"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Link click tracking adds click event listeners to all link elements.

Link clicks are tracked as self describing events. Each link click event captures the link’s href attribute. The event also has fields for the link’s id, classes, and target (where the linked document is opened, such as a new tab or new window).

[Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1) is the JSON schema for a link click event.

Link click events are **automatically tracked** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-link-click-tracking@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-link-click-tracking@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-link-click-tracking`
- `yarn add @snowplow/browser-plugin-link-click-tracking`
- `pnpm add @snowplow/browser-plugin-link-click-tracking`

</TabItem>
</Tabs>

## Enable link click tracking

Turn on link click tracking like this:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-link-click-tracking@3/dist/index.umd.min.js",
  ["snowplowLinkClickTracking", "LinkClickTrackingPlugin"]
);

snowplow('enableLinkClickTracking');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

Link click tracking is part of a separate plugin, `@snowplow/browser-plugin-link-click-tracking`. You need to install it with your favourite package manager: `npm install @snowplow/browser-plugin-link-click-tracking@3` and then initialize it:

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { LinkClickTrackingPlugin, enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ LinkClickTrackingPlugin() ],
});

enableLinkClickTracking();
```
  </TabItem>
</Tabs>

Use this method once and the tracker will add click event listeners to all link elements.

An optional parameter is `pseudoClicks`. If this is not turned on, Firefox will not recognize middle clicks. If it is turned on, there is a small possibility of false positives (click events firing when they shouldn't). **Turning this feature on is recommended**:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableLinkClickTracking', { pseudoClicks: true });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

enableLinkClickTracking({ pseudoClicks: true });
```

  </TabItem>
</Tabs>

This is its signature (where `?` is an optional property):

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableLinkClickTracking', {
  options?: FilterCriterion,
  pseudoClicks?: boolean,
  trackContent?: boolean
  context?: SelfDescribingJson[]
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

enableLinkClickTracking({
  options?: FilterCriterion,
  pseudoClicks?: boolean,
  trackContent?: boolean
  context?: SelfDescribingJson[]
});
```

  </TabItem>
</Tabs>

## Refresh link click tracking

The `enableLinkClickTracking` method only tracks clicks on links that exist when the page has loaded. If new links can be added to the page after then that you wish to track, use `refreshLinkClickTracking`. This will add Snowplow click listeners to all links which do not already have them (and which match the denylist, allowlist, or filter function you specified when `enableLinkClickTracking` was originally called). Use it like this:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('refreshLinkClickTracking');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { refreshLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

refreshLinkClickTracking();
```

  </TabItem>
</Tabs>

## Configuration

Control which links to track using the FilterCriterion object.

Where FilterCriterion is an object:

```javascript
interface FilterCriterion {
    /** A collection of class names to include */
    allowlist?: string[];
    /** A collector of class names to exclude */
    denylist?: string[];
    /** A callback which returns a boolean as to whether the element should be included */
    filter?: (elt: HTMLElement) => boolean;
}
```

You can control which links are tracked using the second argument. There are three ways to do this: a denylist, an allowlist, and a filter function.

### Denylist

This is an array of CSS classes which should be ignored by link click tracking. For example, the below code will stop link click events firing for links with the class "barred" or "untracked", but will fire link click events for all other links:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableLinkClickTracking', {
  options: {
    denylist: ['barred', 'untracked']
  }
});

// If there is only one class name you wish to deny,
// you should still put it in an array
snowplow('enableLinkClickTracking', { options: { 'denylist': ['barred'] } });
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

enableLinkClickTracking({
  options: {
    denylist: ['barred', 'untracked']
  }
});

// If there is only one class name you wish to deny,
// you should still put it in an array
enableLinkClickTracking({ options: { 'denylist': ['barred'] } });
```
  </TabItem>
</Tabs>

### Allowlist

The opposite of a denylist. This is an array of the CSS classes of links which you do want to be tracked. Only clicks on links with a class in the list will be tracked.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableLinkClickTracking', {
  options: {
    'allowlist': ['unbarred', 'tracked']
  }
});

 // If there is only one class name you wish to allow,
 // you should still put it in an array
snowplow('enableLinkClickTracking', { options: { 'allowlist': ['unbarred'] } });
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

enableLinkClickTracking({
  options: {
    'allowlist': ['unbarred', 'tracked']
  }
});

 // If there is only one class name you wish to allow,
 // you should still put it in an array
enableLinkClickTracking({ options: { 'allowlist': ['unbarred'] } });
```
  </TabItem>
</Tabs>


### Filter function

You can provide a filter function which determines which links should be tracked. The function should take one argument, the link element, and return either 'true' (in which case clicks on the link will be tracked) or 'false' (in which case they won't).

The following code will track clicks on those and only those links whose id contains the string "interesting":

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
function myFilter (linkElement) {
  return linkElement.id.indexOf('interesting') > -1;
}

snowplow('enableLinkClickTracking', { options: { 'filter': myFilter } });
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

function myFilter (linkElement) {
  return linkElement.id.indexOf('interesting') > -1;
}

enableLinkClickTracking({ options: { 'filter': myFilter } });
```

  </TabItem>
</Tabs>

Another optional parameter is `trackContent`. Set it to `true` if you want link click events to capture the innerHTML of the clicked link:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableLinkClickTracking', { trackContent: true });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

enableLinkClickTracking({ trackContent: true });
```

  </TabItem>
</Tabs>

The innerHTML of a link is all the text between the `a` tags. Note that if you use a base 64 encoded image as a link, the entire base 64 string will be included in the event.

Each link click event will include (if available) the destination URL, id, classes and target of the clicked link. (The target attribute of a link specifies a window or frame where the linked document will be loaded.)

**Context**

`enableLinkClickTracking` can also be passed an array of custom context entities to attach to every link click event as an additional final parameter.

Link click tracking supports dynamic context entities. Callbacks passed in the context argument will be evaluated with the source element passed as the only argument. The self-describing JSON context object returned by the callback will be sent with the link click event.

A dynamic context could therefore look something like this for link click events:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
let dynamicContext = function (element) {
  // perform operations here to construct the context
  return context;
};

snowplow('enableLinkClickTracking', { context: [dynamicContext] });
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

let dynamicContext = function (element) {
  // perform operations here to construct the context
  return context;
};

enableLinkClickTracking({ context: [ dynamicContext ] });
```
  </TabItem>
</Tabs>


See [this page](../../custom-tracking-using-schemas/index.md) for more information about tracking context entities.

## Manual link click tracking

You can manually track individual link click events with the `trackLinkClick` method. This is its signature:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackLinkClick, {
    /** The target URL of the link */
    targetUrl: string;
    /** The ID of the element clicked if present */
    elementId?: string;
    /** An array of class names from the element clicked */
    elementClasses?: Array<string>;
    /** The target value of the element if present */
    elementTarget?: string;
    /** The content of the element if present and enabled */
    elementContent?: string;
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackLinkClick } from '@snowplow/browser-plugin-link-click-tracking';

trackLinkClick({
    /** The target URL of the link */
    targetUrl: string;
    /** The ID of the element clicked if present */
    elementId?: string;
    /** An array of class names from the element clicked */
    elementClasses?: Array<string>;
    /** The target value of the element if present */
    elementTarget?: string;
    /** The content of the element if present and enabled */
    elementContent?: string;
});
```

  </TabItem>
</Tabs>

Of these arguments, only `targetUrl` is required. This is how to use `trackLinkClick`:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackLinkClick', {
  targetUrl: 'http://www.example.com',
  elementId: 'first-link',
  elementClasses: ['class-1', 'class-2'],
  elementTarget: '',
  elementContent: 'this page'
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackLinkClick } from '@snowplow/browser-plugin-link-click-tracking';

trackLinkClick({
  targetUrl: 'http://www.example.com',
  elementId: 'first-link',
  elementClasses: ['class-1', 'class-2'],
  elementTarget: '',
  elementContent: 'this page'
});
```
  </TabItem>
</Tabs>
