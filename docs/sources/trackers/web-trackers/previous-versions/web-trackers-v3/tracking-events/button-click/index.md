---
title: "Button clicks"
description: "Track button clicks using web trackers v3 for behavioral user interface analytics."
schema: "TechArticle"
sidebar_position: 50
---

# Button click tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This plugin enables the automatic tracking of clicks on buttons, covering both `<button>` and `<input type="button">` elements.

:::note
The plugin is available from Version 3.18 of the tracker.
:::

Button click events are **automatically tracked** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table>
  <tbody>
    <tr>
      <td>Download from GitHub Releases (Recommended)</td>
      <td>
        <a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a>
      </td>
    </tr>
    <tr>
      <td>Available on jsDelivr</td>
      <td>
        <a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-button-click-tracking@3/dist/index.umd.min.js">jsDelivr</a> (latest)
      </td>
    </tr>
    <tr>
      <td>Available on unpkg</td>
      <td>
        <a href="https://unpkg.com/@snowplow/browser-plugin-button-click-tracking@3/dist/index.umd.min.js">unpkg</a> (latest)
      </td>
    </tr>
  </tbody>
</table>

</TabItem>
<TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-button-click-tracking@3`
- `yarn add @snowplow/browser-plugin-button-click-tracking@3`
- `pnpm add @snowplow/browser-plugin-button-click-tracking@3`

</TabItem>
</Tabs>

## Enable and disable tracking

To start tracking all button clicks, call the `enableButtonClickTracking` function:

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-button-click-tracking@3/dist/index.umd.min.js',
    ['snowplowButtonClickTracking', 'ButtonClickTrackingPlugin']
);

window.snowplow('enableButtonClickTracking');
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { enableButtonClickTracking, enableButtonClickTracking } from '@snowplow/browser-plugin-button-click-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ ButtonClickTrackingPlugin() ],
});

enableButtonClickTracking();
```

</TabItem>
</Tabs>

Then, to stop tracking button clicks, call the `disableButtonClickTracking` function:

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('disableButtonClickTracking');
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { disableButtonClickTracking } from '@snowplow/browser-plugin-button-click-tracking';
disableButtonClickTracking();
```

</TabItem>
</Tabs>

## Configuration

There are three ways to configure which buttons are tracked. If no configuration is specified, as shown above, all buttons on the page will be tracked.

### Allowlist

You can specify a list of CSS classes to match against the buttons you want to track. Only buttons that contain the class will be tracked.

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('enableButtonClickTracking', {
  filter: {
    allowlist: ['my-button'],
  }
});
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { enableButtonClickTracking } from '@snowplow/browser-plugin-button-click-tracking';
enableButtonClickTracking({
  filter: {
    allowlist: ['my-button'],
  }
});
```

</TabItem>
</Tabs>

### Denylist

Inversely, you can specify a list of CSS classes to match against the buttons you want to ignore. Only buttons that do not contain the class will be tracked.

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('enableButtonClickTracking', {
  filter: {
    denylist: ['my-button'],
  }
});
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { enableButtonClickTracking } from '@snowplow/browser-plugin-button-click-tracking';
enableButtonClickTracking({
  filter: {
    denylist: ['my-button'],
  }
});
```

</TabItem>
</Tabs>

### Filter function

Finally, you can specify a function that will be called for each button on the page. If the function returns `true`, the button will be tracked. If it returns `false`, the button will not be tracked.

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('enableButtonClickTracking', {
  filter: (element) => {
    return element.id === 'my-button';
  },
});
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import { enableButtonClickTracking } from '@snowplow/browser-plugin-button-click-tracking';

enableButtonClickTracking({
  filter: (element) => {
    return element.id === 'my-button';
  },
});
```

</TabItem>
</Tabs>

## Tracked data

The plugin will track the following data (if present on the element):

| Field     | Description                                         | Type       | Required? |
| --------- | --------------------------------------------------- | ---------- | --------- |
| `label`   | The text on the button, or a user-provided override | `string`   | Yes       |
| `id`      | The ID of the button                                | `string`   | No        |
| `classes` | The classes of the button                           | `string[]` | No        |
| `name`    | The name of the button                              | `string`   | No        |

[Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0) is the JSON schema for a button click event.

### Overriding the label with `data-sp-button-label`

By default, the plugin will use the text on the button as the label. However, you can override this by adding a `data-sp-button-label` attribute to the button:

```html
<button data-sp-button-label="My custom label">Click me</button>
```

This will result in the following event:

```json
{
    "schema": "iglu:com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0",
    "data": {
        // Note the label is "My custom label", not "Click me"
        "label": "My custom label",
    }
}
```

This can also be useful in the case of icon buttons, where there is no text on the button.

## Full example

<Tabs groupId="platform" queryString>
<TabItem value="js" label="JavaScript (tag)" default>

Suppose we have the following button on our page:

```html
<button id="home-btn" class="nav-btn blue-btn outlined" data-sp-button-label="Home" name="home">
    <i className="fa fa-home">
</button>
```

We can configure the plugin to only track this button class:

```javascript
window.snowplow('enableButtonClickTracking', {
  filter: {
    allowlist: ['nav-btn'],
  }
});
```

On click, this will result in the following event:

```json
{
    "schema": "iglu:com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0",
    "data": {
        "label": "Home",
        "id": "home-btn",
        "classes": ["nav-btn", "blue-btn", "outlined"],
        "name": "home"
    }
}
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

Suppose we have the following button on our page:

```html
<button id="home-btn" class="nav-btn blue-btn outlined" data-sp-button-label="Home" name="home">
    <i className="fa fa-home">
</button>
```

We can configure the plugin to only track this button class:

```javascript
import { enableButtonClickTracking } from '@snowplow/browser-plugin-button-click-tracking';

enableButtonClickTracking({
  filter: {
    allowlist: ['nav-btn'],
  }
});
```

On click, this will result in the following event:

```json
{
    "schema": "iglu:com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0",
    "data": {
        "label": "Home",
        "id": "home-btn",
        "classes": ["nav-btn", "blue-btn", "outlined"],
        "name": "home"
    }
}
```

</TabItem>
</Tabs>
