---
title: "Snowplow GTM plugins"
sidebar_label: "Plugins"
sidebar_position: 200
description: "Load JavaScript tracker plugins in Google Tag Manager to extend tracking functionality. Configure external and inline custom plugins with CDN URLs or custom JavaScript variables for enhanced event tracking."
keywords: ["gtm plugins", "tracker plugins", "javascript tracker plugins", "custom plugins", "inline plugins"]
---

Plugins are supported to provide an easy way to extend the functionality of the tracker. This is similar to the [JavaScript Tracker](/docs/sources/web-trackers/plugins/creating-your-own-plugins/index.md) but with the caveat that plugins may be more limited in their functionality due to the constraints of the Google Tag Manager environment.

Each plugin can be loaded from external URLs or provided inline within GTM, and can optionally take some custom configuration.
A plugin may add new methods to the tracker that can be called via [Custom Commands](#custom-commands).

:::note

Snowplow plugins are updated alongside the tracker version to ensure compatibility. For best results, keep the tracker and plugin versions in sync:

- CDN Users: Use a GTM Variable to manage versions in URLs.
- Self-Hosting: Update plugin files whenever you update the tracker version.

:::

## `Load Plugins` table

Plugins are configured by using the `Load Plugins` table, within the Snowplow tag. Each row takes three values to load a plugin.

:::tip

Plugins are loaded by the tracker directly, not via the Tag Template:
You do not need to adjust the Template permissions to allow loading plugins from these URLs.

:::

### Plugin URL

The URL to load the plugin from, e.g. `https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-link-click-tracking@latest/dist/index.umd.min.js`

The tracker will try to load plugins each time they are requested.
This is usually acceptable as the browser will have cached the first request; if you don't want this behavior we suggest creating an empty `Custom Command` Tag with no commands that loads the plugins; you can make this Tag fire [once per page](https://support.google.com/tagmanager/answer/6279951) and add it as a [Setup Tag](https://support.google.com/tagmanager/answer/6238868) to any other Tags that use its commands.

### Plugin Configuration

The name of the plugin to load. These values can be found on the respective plugin documentation.

For example, for the `Link Click Tracking` plugin, the values (`'snowplowLinkClickTracking,LinkClickTrackingPlugin'`) can be found in the snippet [here](https://docs.snowplow.io/docs/sources/web-trackers/tracking-events/link-click/#enable-link-click-tracking).

### Additional Configuration (optional)

Finally, the optional `Additional Configuration` field allows you to add any configuration the plugin may require.

There are two ways to format additional configuration:

- A single comma-seperated string value, which will be split into an array of strings and passed as arguments to the plugin. (e.g. `arg1,arg2,arg3`)
- A reference to a GTM Variable containing an Array of arguments to pass to the plugin.

Plugins are loaded in order, and processed before the configured `Tag Type` configuration is executed -- so you can load a plugin in the same Tag that uses its functionality via Custom Commands.

The plugins will remain configured in the tracker and be accessible to later Tags.

:::warning

The Tag Template will try to call `.indexOf(',')` on the `Additional Configuration` value, so values of types other than Array or String may fail and break the Tag.
String values (before or after splitting) of `true`, `false`, `null`, and numeric values will become their respective typed JSON values.
It is not possible to pass a single `null`, `undefined`, or empty string value as a parameter to a plugin, instead no arguments will be passed to the plugin.

:::

## Custom plugins

[Inline plugins](/docs/sources/web-trackers/plugins/creating-your-own-plugins/index.md#inline-plugins) are plugins that don't require being fetched from an external file to load.

You can create Inline plugins in GTM by using Custom JavaScript Variables in the `Plugin URL` field.
The Variable should return an Object with a method that returns another Object meeting the [plugin interface](/docs/sources/web-trackers/plugins/creating-your-own-plugins/index.md#plugin-interface) (any other methods on the outer Object will become tracker methods).

For `Plugin Configuration`, the UI enforces the comma-seperated values syntax required for external plugins and unconditionally calls `.split(',')` on the string.
The tracker requires that for inline-plugins only a single string may be used.
To work around this limitation, create another Custom JavaScript Variable that returns your constructor method name wrapped in an Object with a fake `split()` method:

```javascript
function() {
  return {
    split: function() {
      return "myInlineConstructorMethodName";
    }
  };
}
```

:::info

If your configuration includes functions, GTM will wrap those functions in [its sandbox](https://developers.google.com/tag-platform/tag-manager/templates/sandboxed-javascript), even when passed to the tracker for execution.

Complex values like DOM elements will be replaced by `null` when passed to or returned from your function, which may make some plugins not function as intended.

:::
