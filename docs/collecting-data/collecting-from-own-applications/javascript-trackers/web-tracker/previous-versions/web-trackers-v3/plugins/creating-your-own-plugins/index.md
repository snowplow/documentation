---
title: "Creating your own plugins"
sidebar_position: 750
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The Snowplow JavaScript Trackers v3 allow extension via plugins. There are a number of official Snowplow plugins, but we also encourage building your own. You can either include them directly in your codebase or tag management tool, or you could publish them to npm as public packages that the whole community can use.

## Plugin Interface

The Browser Plugins conform to a common interface which describes a number of functions you can optionally use to create your own plugin.

```javascript
interface BrowserPlugin {
 /**
 Called when the plugin is initialised during the Tracker construction
 *
 @remark
 Use to capture the specific Tracker instance for each instance of a Browser Plugin
 */
 activateBrowserPlugin?: (tracker: BrowserTracker) => void;

 /**
 Called when the plugin is initialised during the trackerCore construction
 *
 @remark
 Use to capture the specific core instance for each instance of a core plugin
 */;
 activateCorePlugin?: (core: TrackerCore) => void;

 /**
 Called just before the trackerCore callback fires
 @param payloadBuilder - The payloadBuilder which will be sent to the callback, can be modified
 */
 beforeTrack?: (payloadBuilder: PayloadBuilder) => void;

 /**
 Called just after the trackerCore callback fires
 @param payload - The final built payload
 */
 afterTrack?: (payload: Payload) => void;

 /**
 Called when constructing the context for each event
 Useful for adding additional context to events
 */
 contexts?: () => SelfDescribingJson[];

 /**
 Passed a logger instance which can be used to send log information
 to the active logger
 */
 logger?: (logger: Logger) => void;
} 
```

## Plugin Templates

If you'd like to build your own plugins and publish them on NPM then we've created two template repositories to help you get started.

### Simple Context Plugin Template

This template shows how you can add a context to every single event that is emitted from a tracker which is using this plugin. The template is written in TypeScript, so you'll need to build it before using it and/or publishing. We've also included some example Jest tests to help you write tests for your plugin.

[https://github.com/snowplow-incubator/snowplow-browser-plugin-simple-template](https://github.com/snowplow-incubator/snowplow-browser-plugin-simple-template)

The README should guide you through building, testing, publishing and using a plugin built with this template.

### Advanced Plugin Template

This template shows how you can use all the available functions of a plugin, as well as how to make the plugin only respond to certain trackers in a multi-tracker setup. The template is written in TypeScript, so you'll need to build it before using it and/or publishing. We've also included some example Jest tests to help you write tests for your plugin.

[https://github.com/snowplow-incubator/snowplow-browser-plugin-advanced-template](https://github.com/snowplow-incubator/snowplow-browser-plugin-advanced-template)

The README should guide you through building, testing, publishing and using a plugin built with this template.

## Inline Plugins

You might not want to publish a package for your plugin but directly include the code in your codebase. In that case, you can pass the plugin directly into the tracker when you call `newTracker`.

### Example

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
const myPlugin = {
  SimpleContextPlugin: function () {
    return {
      contexts: () => {
        return [
          {
            schema: 'iglu:com.acme/my_context/jsonschema/1-0-0',
            data: {
              property: 'value',
            },
          },
        ];
      },
    };
  },
  trackMyEvent: function (event) {
    // Extend the API and track something here (see advanced-template above)
    console.log(event);
  }
};

window.snowplow('addPlugin:sp1', myPlugin, 'SimpleContextPlugin');
window.snowplow('trackMyEvent', { eventProp: 'value' }); );
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker } from '@snowplow/browser-tracker'; 

const myPlugin = {
  contexts: () => {
    return [
      {
        schema: 'iglu:com.acme/my_context/jsonschema/1-0-0',
        data: {
          property: 'value',
        },
      },
    ];
  },
};

newTracker('sp1', '{{COLLECTOR_URL}}', { plugins: [myPlugin] });
```

  </TabItem>
</Tabs>
