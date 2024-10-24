---
title: "Forms"
sidebar_position: 60
---

# Form tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Snowplow form tracking creates three event types: `change_form`, `submit_form` and `focus_form`.  Using the `enableFormTracking` method adds event listeners to all form elements and to all interactive elements inside forms (that is, all `input`, `textarea`, and `select` elements).

This will only work for form elements which exist when it is called. If you are creating a form programmatically, call `enableFormTracking` again after adding it to the document to track it. You can call `enableFormTracking` multiple times without risk of duplicated events. **From v3.2.0**, if you are programmatically adding additional fields to a form after initially calling `enableFormTracking` then calling it again after the new form fields are added will include them in form tracking.

:::note
Events on password fields will not be tracked.
:::

Form events are **automatically tracked** once configured.

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**
<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-form-tracking@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-form-tracking@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-form-tracking@3`
- `yarn add @snowplow/browser-plugin-form-tracking@3`
- `pnpm add @snowplow/browser-plugin-form-tracking@3`

</TabItem>
</Tabs>

## Enable form tracking

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-form-tracking@3/dist/index.umd.min.js",
  ["snowplowFormTracking", "FormTrackingPlugin"]
);

snowplow('enableFormTracking');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

This is part of the `@snowplow/browser-plugin-form-tracking` plugin. You need to install it with your favorite package manager: `npm install @snowplow/browser-plugin-form-tracking` and then initialize it:

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { FormTrackingPlugin, enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ FormTrackingPlugin() ],
});

enableFormTracking();
```

  </TabItem>
</Tabs>

This will only work for form elements which exist when it is called. If you are creating a form programmatically, call `enableFormTracking` again after adding it to the document to track it. You can call `enableFormTracking` multiple times without risk of duplicated events. **From v3.2.0**, if you are programmatically adding additional fields to a form after initially calling `enableFormTracking` then calling it again after the new form fields are added will include them in form tracking.

By default, all three event types are tracked. However, it is possible to subscribe only to specific event types using the `options.events` option when enabling form tracking:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// subscribing to specific event types
snowplow('enableFormTracking', {
    options: {
        events: ['submit_form', 'focus_form', 'change_form']
    },
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
// subscribing to specific event types
enableFormTracking({
    options: {
        events: ['submit_form', 'focus_form', 'change_form']
    },
});
```
  </TabItem>
</Tabs>

### `change_form`

When a user changes the value of a `textarea`, `input`, or `select` element inside a form, a [`change_form`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/change_form/jsonschema/1-0-0) event will be fired. It will capture the name, type, and new value of the element, and the id of the parent form.

### `submit_form`

When a user submits a form, a [`submit_form`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/submit_form/jsonschema/1-0-0) event will be fired. It will capture the id and classes of the form and the name, type, and value of all `textarea`, `input`, and `select` elements inside the form.

Note that this will only work if the original form submission event is actually fired. If you prevent it from firing, for example by using a jQuery event handler which returns `false` to handle clicks on the form's submission button, the Snowplow `submit_form` event will not be fired.

### `focus_form`

When a user focuses on a form element, a [`focus_form`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/focus_form/jsonschema/1-0-0) event will be fired. It will capture the id and classes of the form and the name, type, and value of the `textarea`, `input`, or `select` element inside the form that received focus.


## Configuration

It may be that you do not want to track every field in a form, or every form on a page. You can customize form tracking by passing a configuration argument to the `enableFormTracking` method. This argument should be an object with two elements named "forms" and "fields". The "forms" element determines which forms will be tracked; the "fields" element determines which fields inside the tracked forms will be tracked. As with link click tracking, there are three ways to configure each field: a denylist, an allowlist, or a filter function. You do not have to use the same method for both fields.

**Denylists**

This is an array of strings used to prevent certain elements from being tracked. Any form with a CSS class in the array will be ignored. Any field whose name property is in the array will be ignored. All other elements will be tracked.

**Allowlists**

This is an array of strings used to turn on tracking. Any form with a CSS class in the array will be tracked. Any field in a tracked form whose name property is in the array will be tracked. All other elements will be ignored.

**Filter functions**

This is a function used to determine which elements are tracked. The element is passed as the argument to the function and is tracked if and only if the value returned by the function is truthy.

### Transform functions

This is a function used to transform data in each form field. The value and element (2.15.0+ only) are passed as arguments to the function and the tracked value is replaced by the value returned.

:::note Behavior prior to version 3.16 of the tracker

**In versions prior to 3.16.0**, the transform function would receive 2 arguments, that were different between `submit_form` and `change_form` or `focus_form` events. More specifically, the transform function signature **was**:

```typescript
type transformFn = (x: string | null, elt: ElementData | TrackedHTMLElement) => string | null;
```

For `change_form` and `focus_form` events the `elt` argument was the tracked HTML element itself, while for `submit_form` events, the `elt` argument was an object of type `ElementData` with only some of the original element's attributes:

```typescript
interface ElementData extends Record<string, string | null | undefined> {
  name: string;
  value: string | null;
  nodeName: string;
  type?: string;
}
```

:::

**Since version 3.16.0**, the transform function receives three arguments:

1. The value of the element.
2. Either the HTML element (for `change_form` and `focus_form` events) or an instance of `ElementData` (for `submit_form` events).
3. The HTML element (in all form tracking events).

The function signature is:

```typescript
type transformFn = (
  elementValue: string | null,
  elementInfo: ElementData | TrackedHTMLElement,
  elt: TrackedHTMLElement
) => string | null;
```

This means that you can now specify a transform function that applies the exact same logic to all `submit_form`, `change_form` and `focus_form` events independent of the element's attributes the logic may depend on. For example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
function redactPII(eltValue, _, elt) {
  if (elt.id === 'pid') {
    return 'redacted';
  }
  return eltValue;
}

snowplow('enableFormTracking', {
  options: {
    fields: { transform: redactPII },
  },
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

function redactPII(eltValue, _, elt) {
  if (elt.id === 'pid') {
    return 'redacted';
  }
  return eltValue;
}

enableFormTracking({
  options: {
    fields: { transform: redactPII },
  },
});
```

  </TabItem>
</Tabs>

:::caution

It is recommended that the `transform` function does not return a falsy value but a string even when the intention is to redact a value from being tracked.
E.g. Send `"null"` over `null`.

:::



### Examples

To track every form element and every field except those fields named "password":

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
var opts = {
  forms: {
    denylist: []
  },
  fields: {
    denylist: ['password']
  }
};

snowplow('enableFormTracking', { options: opts });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

var options = {
  forms: {
    denylist: []
  },
  fields: {
    denylist: ['password']
  }
};

enableFormTracking({ options });
```
  </TabItem>
</Tabs>


To track only the forms with CSS class "tracked", and only those fields whose ID is not "private":

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
var opts = {
  forms: {
    allowlist: ["tracked"]
  },
  fields: {
    filter: function (elt) {
      return elt.id !== "private";
    }
  }
};

snowplow('enableFormTracking', { options: opts });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

var opts = {
  forms: {
    allowlist: ["tracked"]
  },
  fields: {
    filter: function (elt) {
      return elt.id !== "private";
    }
  }
};

enableFormTracking({ options: opts });
```

  </TabItem>
</Tabs>

To transform the form fields with an MD5 hashing function:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// For JavaScript tracker versions before 3.16.0
// function hashMD5(value, elt) {
//   // can use elt to make transformation decisions
//   return MD5(value);
// }

// For JavaScript tracker versions 3.16.0+
function hashMD5(value, _, elt) {
  // can use elt to make transformation decisions
  return MD5(value);
}

var opts = {
  forms: {
    allowlist: ["tracked"]
  },
  fields: {
    filter: function (elt) {
      return elt.id !== "private";
    },
    transform: hashMD5
  }
};

snowplow('enableFormTracking', { options: opts });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

// For Browser tracker versions before 3.16.0
// function hashMD5(value, elt) {
//   // can use elt to make transformation decisions
//   return MD5(value);
// }

// For Browser tracker versions 3.16.0+
function hashMD5(value, _, elt) {
  // can use elt to make transformation decisions
  return MD5(value);
}

var options = {
  forms: {
    allowlist: ["tracked"]
  },
  fields: {
    filter: function (elt) {
      return elt.id !== "private";
    },
    transform: hashMD5
  }
};

enableFormTracking({ options });
```
  </TabItem>
</Tabs>

## Tracking forms embedded inside iframes

The options for tracking forms inside of iframes are limited – browsers block access to contents of iframes that are from different domains than the parent page. We are not able to provide a solution to track events using trackers initialized on the parent page in such cases. However, since version 3.4, it is possible to track events from forms embedded in iframes loaded from the same domain as the parent page or iframes created using JavaScript on the parent page (e.g., HubSpot forms).

In case you are able to access form elements inside an iframe, you can pass them in the `options.forms` argument when calling `enableFormTracking` on the parent page. This will enable form tracking for the specific form elements. The feature may also be used for forms not embedded in iframes, but it's most useful in this particular case.

The following example shows how to identify the form elements inside an iframe and pass them to the `enableFormTracking` function:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
let iframe = document.getElementById('form_iframe'); // find the element for the iframe
let forms = iframe.contentWindow.document.getElementsByTagName('form'); // find form elements inside the iframe
snowplow('enableFormTracking', {
    options: {
        forms: forms // pass the embedded forms when enabling form tracking
    },
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
let iframe = document.getElementById('form_iframe'); // find the element for the iframe
let forms = iframe.contentWindow.document.getElementsByTagName('form'); // find form elements inside the iframe
enableFormTracking({
    options: {
        forms: forms // pass the embedded forms when enabling form tracking
    },
});
```

  </TabItem>
</Tabs>

## Custom context entities

Context entities can be sent with all form tracking events by supplying them in an array in the `context` argument.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableFormTracking', { options: {}, context: [] });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

enableFormTracking({ options: {}, context: [] });
```
  </TabItem>
</Tabs>

These context entities can be dynamic, i.e. they can be traditional self-describing JSON objects, or callbacks that generate valid self-describing JSON objects.

For form change events, context generators are passed `(elt, type, value)`, and form submission events are passed `(elt, innerElements)`.

A dynamic context could therefore look something like this for form change events:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
let dynamicContext = function (elt, type, value) {
  // perform operations here to construct the context entity
  return context;
};

snowplow('enableFormTracking', { options: {}, context: [dynamicContext] });
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

var dynamicContext = function (elt, type, value) {
  // perform operations here to construct the context entity
  return context;
};

enableFormTracking({ options: {}, context: [dynamicContext] });
```
  </TabItem>
</Tabs>
