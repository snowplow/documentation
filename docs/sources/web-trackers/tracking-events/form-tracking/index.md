---
title: "Track form interactions on web"
sidebar_label: "Forms"
sidebar_position: 60
description: "Automatically track form changes, submissions, and focus events with configurable allowlists, denylists, and transform functions for field values."
keywords: ["form tracking", "form interactions"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Snowplow form tracking creates three event types: `change_form`, `submit_form` and `focus_form`.
Using the `enableFormTracking` method adds event listeners to the document listening for events from form elements and their interactive fields (that is, all `input`, `textarea`, and `select` elements).

:::note
Events on password fields will not be tracked.
:::

Form events are **automatically tracked** once configured.

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**
<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-form-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-form-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-form-tracking`
- `yarn add @snowplow/browser-plugin-form-tracking`
- `pnpm add @snowplow/browser-plugin-form-tracking`

</TabItem>
</Tabs>

## Toggle form tracking

Start tracking form events by enabling the plugin:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-form-tracking@latest/dist/index.umd.min.js",
  ["snowplowFormTracking", "FormTrackingPlugin"]
);

snowplow('enableFormTracking');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

Initialize your tracker with the plugin.

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

To stop form tracking, call `disableFormTracking`:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('disableFormTracking');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
disableFormTracking();
```

  </TabItem>
</Tabs>

## Events

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

Check out the [form tracking overview](/docs/events/ootb-data/page-elements/index.md#form-interactions) page to see the schema details.

### Change form

When a user changes the value of a `textarea`, `input`, or `select` element inside a form, a [`change_form`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/change_form/jsonschema/1-0-0) event will be fired. It will capture the name, type, and new value of the element, and the id of the parent form.

### Submit form
When a user submits a form, a [`submit_form`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/submit_form/jsonschema/1-0-0) event will be fired. It will capture the id and classes of the form and the name, type, and value of all `textarea`, `input`, and `select` elements inside the form.

Note that this will only work if the original form submission event is actually fired. If you prevent it from firing, for example by using a jQuery event handler which returns `false` to handle clicks on the form's submission button, the Snowplow `submit_form` event will not be fired.

### Focus form

When a user focuses on a form element, a [`focus_form`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/focus_form/jsonschema/1-0-0) event will be fired. It will capture the id and classes of the form and the name, type, and value of the `textarea`, `input`, or `select` element inside the form that received focus.


## Configuration

It may be that you do not want to track every field in a form, or every form on a page. You can customize form tracking by passing a configuration argument to the `enableFormTracking` method. This argument should be an object with two elements named "forms" and "fields". The "forms" element determines which forms will be tracked; the "fields" element determines which fields inside the tracked forms will be tracked. As with link click tracking, there are three ways to configure each field: a denylist, an allowlist, or a filter function. You do not have to use the same method for both fields.

**Denylists**

This is an array of strings used to prevent certain elements from being tracked. Any form with a CSS class in the array will be ignored. Any field whose name property is in the array will be ignored. All other elements will be tracked.

**Allowlists**

This is an array of strings used to turn on tracking. Any form with a CSS class in the array will be tracked. Any field in a tracked form whose name property is in the array will be tracked. All other elements will be ignored.

**Filter functions**

This is a function used to determine which elements are tracked. The element is passed as the argument to the function and is tracked if and only if the value returned by the function is truthy.

**Event phase**

From v4 onwards, this plugin uses [capture-phase](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase#value) event listeners to detect form events.
The capture phase is the earliest phase of event handlers, so events might be tracked before other code executes (e.g. form validation).
If your filter or transform functions are relying on other event handlers to have executed to function correctly, they may not behave as expected when using capture-phase event handlers.

From v4.6.8 onwards, the plugin supports a `useCapture` option, which you can set to `false` (default is `true`) to revert to the v3 behavior of using bubble-phase event handlers.
This allows other event handlers time to execute before the event is detected and your filter/transform functions are executed.

When using the bubble phase, other event handlers may [cancel the event's propagation](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) and the plugin will not receive the event and nothing will be tracked.
This may be desirable if you want to wait for the form to validate before tracking a "form_submit" event, for example.
Native HTML form validation automatically prevents the "submit" event firing until the form is valid, so only validation code that doesn't integrate with native APIs should require explicitly using the bubble phase.

The `focus` event for form fields [does not bubble](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event), so this setting is ignored for `form_focus` tracking, which will always use capture-phase event listeners; only "change" and "submit" handlers will use the bubble phase when setting `useCapture: false`.

### Transform functions

This is a function used to transform data in each form field. The value and element are passed as arguments to the function and the tracked value is replaced by the value returned.

The transform function receives three arguments:

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

This means that you can specify a transform function that applies the exact same logic to all `submit_form`, `change_form` and `focus_form` events independent of the element's attributes the logic may depend on. For example:

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

To use the bubble-phase event listeners:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('enableFormTracking', { options: { useCapture: false } });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

enableFormTracking({ options: { useCapture: false } });
```
  </TabItem>
</Tabs>

## Tracking forms embedded inside iframes

The options for tracking forms inside of iframes are limited – browsers block access to contents of iframes that are from different domains than the parent page. We are not able to provide a solution to track events using trackers initialized on the parent page in such cases.

It is possible to track events from forms embedded in iframes loaded from the same domain as the parent page or iframes created using JavaScript on the parent page (e.g. HubSpot forms).

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

Alternatively, you can specify the iframe's `document` as a `target` directly; this will enable form tracking for all forms within the iframe's document:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
let iframe = document.getElementById('form_iframe'); // find the element for the iframe
let formDoc = iframe.contentWindow.document; // find iframe document that contains forms
snowplow('enableFormTracking', {
    options: {
        targets: [document, formDoc] // pass the embedded document when enabling form tracking
    },
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
let iframe = document.getElementById('form_iframe'); // find the element for the iframe
let formDoc = iframe.contentWindow.document; // find iframe document that contains forms
enableFormTracking({
    options: {
        targets: [document, formDoc] // pass the embedded document when enabling form tracking
    },
});
```

  </TabItem>
</Tabs>

`targets` can also be used to only track subsets of a document by passing a parent element directly.

## Tracking forms from inside shadow trees

Forms created within [shadow trees](https://developer.mozilla.org/en-US/docs/Glossary/Shadow_tree) (e.g. within custom [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)) can only be tracked once the user first focuses a field.

The plugin relies on composed events to detect the form interactions at the document level. Only `focus` events are considered composed, `change` and `submit` events are not composed and so are not automatically detected by the plugin.

When the user focuses a field in a form that is detected as being inside a shadow tree, the event listeners are added directly to the `form` element within the shadow tree in addition to the document-level event listeners in order to track future `change` and `submit` events correctly.
If the form has no interactive field elements to first trigger the `focus` event, any `change` or `submit` events that fire will not be tracked.

If the shadow root is attached in "closed" mode, no events will be tracked for elements in that shadow tree, only "open" mode is supported.

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
