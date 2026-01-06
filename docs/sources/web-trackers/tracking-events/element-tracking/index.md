---
title: "Tracking page element visibility and lifecycle on web"
sidebar_label: "Element tracking"
sidebar_position: 55
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Element tracking enables declarative tracking of page elements existing on web pages and scrolling into view.

The plugin lets you define rules for which elements to track, and lets you trigger events for any combination of:

- New matching elements get added to a page
- Existing elements get changed to match a rule
- Matching elements get scrolled into a user's view and become visible
- Matching elements get scrolled out of a user's view and become no longer visible
- Elements get changed to no longer match a rule
- Matching elements get removed from a page

As a configuration-based plugin, you only need to define which elements should generate events, and in which scenarios.
You can reuse the same configuration for generic tracking across a varying number of pages or sites.

Each event contains information about the matching element, and you can configure extra details to extract to allow dynamic event payloads.

Example use cases for these events include:

- Funnel steps (form on page > form in view > [form tracking events](/docs/sources/web-trackers/tracking-events/form-tracking/index.md))
- List impression tracking (product impressions)
- Component performance (recommendations performance, newsletter sign-up forms, modal popups)
- Product usage (elements that appear on-hover, labeling or grouping events related to specific features)
- Advertisement impression tracking

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">GitHub Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-element-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-element-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

:::note

The links to the CDNs point to the current latest version.
You should pin to a specific version when integrating this plugin on your website if you are using a third-party CDN in production.

:::

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-element-tracking`
- `yarn add @snowplow/browser-plugin-element-tracking`
- `pnpm add @snowplow/browser-plugin-element-tracking`

</TabItem>
</Tabs>

## Examples

Here are some example rules for simple use cases on the [Snowplow website](https://snowplow.io/) ([snapshot at time of writing](https://web.archive.org/web/20250422013533/https://snowplow.io/)).

The code examples use the [JavaScript Tracker syntax](/docs/sources/web-trackers/index.md), but should easily adapt to Browser Tracker syntax if needed.

<details>
  <summary>Scroll sections</summary>

  The homepage has content grouped into distinct "layers" as you scroll down the page.
  To see when users scroll down to each section, you can track an `expose` event for each section.
  You can capture the header element text to identify each one.

  ```javascript title="Rule configuration"
  snowplow('startElementTracking', {
    elements: {
      selector: "section",
      expose: { when: "element" },
      details: { child_text: { title: "h2" } }
    }
  });
  ```

  ```json title="Event: expose_event"
  {
    "schema": "iglu:com.snowplowanalytics.snowplow/element/jsonschema/1-0-0",
    "data": {
      "element_name": "section",
      "width": 1920,
      "height": 1111.7333984375,
      "position_x": 0,
      "position_y": 716.4500122070312,
      "doc_position_x": 0,
      "doc_position_y": 716.4500122070312,
      "element_index": 2,
      "element_matches": 10,
      "originating_page_view": "06dbb0a2-9acf-4ae4-9562-1469b6d12c5d",
      "attributes": [
        {
          "source": "child_text",
          "attribute": "title",
          "value": "Why Data Teams Choose Snowplow"
        }
      ]
    }
  }
  ```

  ```json title="Event: expose_event"
  {
    "schema": "iglu:com.snowplowanalytics.snowplow/element/jsonschema/1-0-0",
    "data": {
      "element_name": "section",
      "width": 1920,
      "height": 2880,
      "position_x": 0,
      "position_y": 896.683349609375,
      "doc_position_x": 0,
      "doc_position_y": 1828.183349609375,
      "element_index": 3,
      "element_matches": 10,
      "originating_page_view": "06dbb0a2-9acf-4ae4-9562-1469b6d12c5d",
      "attributes": [
        {
          "source": "child_text",
          "attribute": "title",
          "value": "How Does Snowplow Work?"
        }
      ]
    }
  }
  ```

</details>

<details>
  <summary>Content depth</summary>

  The blog posts have longer-form content.
  Snowplow's page ping events track scroll depth by pixels, but those measurements become inconsistent between devices and page.
  To see how much content gets consumed, you can generate stats based on the paragraphs in the content.
  You can also get periodic stats based on the entire article in page pings.

  ```javascript title="Rule configuration"
  snowplow('startElementTracking', {
    elements: [
      {
        selector: ".blogs_blog-post-body_content",
        name: "blog content",
        expose: false,
        includeStats: ["page_ping"]
      },
      {
        selector: ".blogs_blog-post-body_content p",
        name: "blog paragraphs"
      }
    ]
  });
  ```

  Because the expose event contains the `element_index` and `element_matches`, you can easily query the largest `element_index` by page view ID.
  The result tells you consumption statistics for individual views of each article.
  You can then summarize that metric to the content or category level, or converted to a percentage by comparing with `element_matches`.

  ```json title="Event: expose_event"
  {
    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
    "data": [
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/element/jsonschema/1-0-0",
        "data": {
          "element_name": "blog paragraphs",
          "width": 800,
          "height": 48,
          "position_x": 320,
          "position_y": 533.25,
          "doc_position_x": 320,
          "doc_position_y": 1373,
          "element_index": 6,
          "element_matches": 24,
          "originating_page_view": "f390bec5-f63c-48af-b3ad-a03f0511af7f",
          "attributes": []
        }
      },
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0",
        "data": {
          "id": "f390bec5-f63c-48af-b3ad-a03f0511af7f"
        }
      }
    ]
  }
  ```

  The periodic page ping events also give you a summary of the total progress in the `max_y_depth_ratio`/`max_y_depth` values.
  With `y_depth_ratio` you can also see when users backtrack up the page.

  ```json title="Event: page_ping"
  {
    "schema": "iglu:com.snowplowanalytics.snowplow/element_statistics/jsonschema/1-0-0",
    "data": {
      "element_name": "blog content",
      "element_index": 1,
      "element_matches": 1,
      "current_state": "unknown",
      "min_size": "800x3928",
      "current_size": "800x3928",
      "max_size": "800x3928",
      "y_depth_ratio": 0.20302953156822812,
      "max_y_depth_ratio": 0.4931262729124236,
      "max_y_depth": "1937/3928",
      "element_age_ms": 298379,
      "times_in_view": 0,
      "total_time_visible_ms": 0
    }
  }
  ```

</details>

<details>
  <summary>Simple funnels</summary>

  A newsletter sign-up form exists at the bottom of the page.
  Performance measurement becomes difficult because many visitors don't even see it.
  To test this you first need to know:

  - When the form exists on a page
  - When the form is actually seen
  - When people actually interact with the form
  - When the form is finally submitted

  The form tracking plugin can only do the last parts, but the element tracker gives you the earlier steps.
  If you end up adding more forms in the future, you'll want to know which is which, so you can mark the footer as a component so you can split it out later.

  ```javascript title="Rule configuration"
  snowplow('startElementTracking', {
    elements: [
      {
        selector: ".hbspt-form",
        name: "newsletter signup",
        create: true,
      },
      {
        selector: "footer",
        component: true,
        expose: false
      }
    ]
  });
  ```

  If you try this on a blog page, you actually get two `create_element` events.
  Blog posts have a second newsletter sign-up in a sidebar next to the content.
  Because only the second form is a member of the `footer` component, you can easily see which one you are trying to measure when you query the data later.

  ```json title="Event: create_element"
  {
    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
    "data": [
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/element/jsonschema/1-0-0",
        "data": {
          "element_name": "newsletter signup",
          "width": 336,
          "height": 161,
          "position_x": 1232,
          "position_y": 238.88333129882812,
          "doc_position_x": 1232,
          "doc_position_y": 3677.883331298828,
          "element_index": 1,
          "element_matches": 2,
          "originating_page_view": "02e30714-a84a-42f8-8b07-df106d669db0",
          "attributes": []
        }
      },
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0",
        "data": {
          "id": "02e30714-a84a-42f8-8b07-df106d669db0"
        }
      }
    ]
  }
  ```

  ```json title="Event: create_element"
  {
    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
    "data": [
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/element/jsonschema/1-0-0",
        "data": {
          "element_name": "newsletter signup",
          "width": 560,
          "height": 137,
          "position_x": 320,
          "position_y": 1953.5,
          "doc_position_x": 320,
          "doc_position_y": 5392.5,
          "element_index": 2,
          "element_matches": 2,
          "originating_page_view": "02e30714-a84a-42f8-8b07-df106d669db0",
          "attributes": []
        }
      },
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/component_parents/jsonschema/1-0-0",
        "data": {
          "element_name": "newsletter signup",
          "component_list": [
            "footer"
          ]
        }
      },
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/element/jsonschema/1-0-0",
        "data": {
          "element_name": "footer",
          "width": 1920,
          "height": 1071.5,
          "position_x": 0,
          "position_y": 1212,
          "doc_position_x": 0,
          "doc_position_y": 4651,
          "originating_page_view": "",
          "attributes": []
        }
      },
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0",
        "data": {
          "id": "02e30714-a84a-42f8-8b07-df106d669db0"
        }
      }
    ]
  }
  ```

</details>

<details>
  <summary>Recommendations performance</summary>

  The homepage contains a section for the "Latest Blogs from Snowplow."
  This could represent recommendations or some other form of personalization.
  If it did, one might want to optimize it.
  Link tracking could tell you when a recommendation worked and a visitor clicked it, but how would identify the recommendation not encouraging clicks?
  If you track when the widget becomes visible and include the items that got recommended, you could correlate that with the clicks to measure performance.
  For fairer measurement of visibility, you can configure that visibility only counts if at least 50% is in view, and it has to be on screen for at least 1.5 seconds.
  You'll also collect the post title and author information.


  ```javascript title="Rule configuration"
  snowplow('startElementTracking', {
    elements: [
      {
        selector: ".blog_list-header_list-wrapper",
        name: "recommended_posts",
        create: true,
        expose: { when: "element", minTimeMillis: 1500, minPercentage: 0.5 },
        contents: [
          {
            selector: ".collection-item",
            name: "recommended_item",
            details: { child_text: { title: "h3", author: ".blog_list-header_author-text > p" } }
          }
        ]
      }
    ]
  });
  ```

  Scrolling down to see the items and you see the items that get served to the visitor:

  ```json title="Event: expose_element"
  {
    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
    "data": [
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/element/jsonschema/1-0-0",
        "data": {
          "element_name": "recommended_posts",
          "width": 1280,
          "height": 680.7666625976562,
          "position_x": 320,
          "position_y": 437.70001220703125,
          "doc_position_x": 320,
          "doc_position_y": 6261.066711425781,
          "element_index": 1,
          "element_matches": 1,
          "originating_page_view": "034db1d6-1d60-42ca-8fe1-9aafc0442a22",
          "attributes": []
        }
      },
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/element_content/jsonschema/1-0-0",
        "data": {
          "element_name": "recommended_item",
          "parent_name": "recommended_posts",
          "parent_position": 1,
          "position": 1,
          "attributes": [
            {
              "source": "child_text",
              "attribute": "title",
              "value": "Data Pipeline Architecture Patterns for AI: Choosing the Right Approach"
            },
            {
              "source": "child_text",
              "attribute": "author",
              "value": "Matus Tomlein"
            }
          ]
        }
      },
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/element_content/jsonschema/1-0-0",
        "data": {
          "element_name": "recommended_item",
          "parent_name": "recommended_posts",
          "parent_position": 1,
          "position": 2,
          "attributes": [
            {
              "source": "child_text",
              "attribute": "title",
              "value": "Data Pipeline Architecture For AI: Why Traditional Approaches Fall Short"
            },
            {
              "source": "child_text",
              "attribute": "author",
              "value": "Matus Tomlein"
            }
          ]
        }
      },
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/element_content/jsonschema/1-0-0",
        "data": {
          "element_name": "recommended_item",
          "parent_name": "recommended_posts",
          "parent_position": 1,
          "position": 3,
          "attributes": [
            {
              "source": "child_text",
              "attribute": "title",
              "value": "Agentic AI Applications: How They Will Turn the Web Upside Down"
            },
            {
              "source": "child_text",
              "attribute": "author",
              "value": "Yali\tSassoon"
            }
          ]
        }
      },
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0",
        "data": {
          "id": "034db1d6-1d60-42ca-8fe1-9aafc0442a22"
        }
      }
    ]
  }
  ```

</details>

## Enable element tracking

You can begin tracking elements by providing configuration to the plugin's `startElementTracking` method:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-element-tracking@latest/dist/index.umd.min.js",
  ["snowplowElementTracking", "SnowplowElementTrackingPlugin"]
);

snowplow('startElementTracking', { elements: [/* configuration */] });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

Element tracking is part of a separate plugin, `@snowplow/browser-plugin-element-tracking`. You need to install it with your favorite package manager: `npm install @snowplow/browser-plugin-element-tracking` and then initialize it:

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { SnowplowElementTrackingPlugin, startElementTracking } from '@snowplow/browser-plugin-element-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ SnowplowElementTrackingPlugin() ],
});

startElementTracking({ elements: [/* configuration */] });
```
  </TabItem>
</Tabs>

Each use of this method adds the given list of element rules to the plugin configuration to start automatically tracking events.

The `elements` configuration can take a single rule or an array of rules.

Beyond `elements`, you can also specify `context`: an array of static entities or entity-generating functions to include custom information with all events generated by the plugin.
This can also exist at the individual rule level for more specific entity requirements.

For the specifics of rule configuration, see [Rule configuration](#rule-configuration) below.

## Disabling element tracking

To turn off tracking, use `endElementTracking` to remove the rule configuration.
Providing no options to `endElementTracking` removes all earlier configured rules.
If all rules get removed, the plugin removes its listeners until new rules get configured.

If you want to stop tracking based for specific rules, you can provide the `name` or `id` values to the `endElementTracking` method.
Each rule provided to `startElementTracking` gets associated with a `name` - and optionally, an `id`.
If you don't specify a `name`, the `name` defaults to the `selector` value (required for all rules).

For more complex requirements, you can also specify a callback function to decide if a rule should turn off (callback returns `true`) or not (callback returns `false`).

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('endElementTracking', { elements: ['name1', 'name2'] }); // removes based on `name` matching; multiple rules may share a name
snowplow('endElementTracking', { elementIds: ['id1'] }); // removes rules based on `id` matching; at most one rule can have the same `id`
snowplow('endElementTracking', { filter: (rule) => /recommendations/i.test(rule.name) }); // more complicated matching; rules where the `filter` function returns true will be removed
snowplow('endElementTracking'); // remove all configured rules
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
endElementTracking({ elements: ['name1', 'name2'] }); // removes based on `name` matching; multiple rules may share a name
endElementTracking({ elementIds: ['id1'] }); // removes rules based on `id` matching; at most one rule can have the same `id`
endElementTracking({ filter: (rule) => /recommendations/i.test(rule.name) }); // more complicated matching; rules where the `filter` function returns true will be removed
endElementTracking(); // remove all configured rules
```
  </TabItem>
</Tabs>

Removing rules by name removes all rules with matching names - rule names don't require uniqueness.
Rule IDs _must be_ unique, so only a single rule matches per `elementIds` value.
If you specify more than one of the `elementIds`, `elements`, and `filter` options, they get evaluated in that order.
Passing an empty object to `endElementTracking` counts as specifying no options - and removes no rules - which differs to calling it with no arguments.

## Rule configuration

When calling `startElementTracking`, you specify the `elements` option with either a single rule or an array of rules.
Each rule defines core information like: the elements to match, events to fire, extra details to collect about each element (or their contents), and custom entities to attach.

### Core configuration

The foundational configuration required for working with the plugin APIs.

| Rule property | Type     | Description                                                                                                                                                                                                                                                                                                                                  | Status        |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `selector`    | `string` | A CSS selector string that matches one or more elements on the page that should trigger events from this rule.                                                                                                                                                                                                                               | **Required**  |
| `name`        | `string` | A label to name this rule. Allows you to keep a stable name for events generated by this rule, even if the `selector` changes, so the data produced remains consistent. You can share a single `name` between many rules to have different configurations for different selectors. If not supplied, the `selector` value becomes the `name`. | _Recommended_ |
| `id`          | `string` | A specific identifier for this rule. Useful if you share a `name` between many rules and need to specifically remove individual rules within that group.                                                                                                                                                                                     | Optional      |

### Event configuration

These settings define which events should automatically fire, and the situations when they should occur.
By default, only the `expose` setting gets enabled, so the plugin tracks when elements matching the rule's `selector` become visible on the user's viewport.
For convenience, each option can use a boolean to turn on or off each event type for elements matching the selector.
You can also use an object to have more control on when the events get triggered.

| Rule property | Type                  | Description                                                                                                                        | Default |
| ------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `create`      | `boolean` or `object` | Controls firing `element_create` events when the element gets added to the page (or already exists when the rule gets configured). | `false` |
| `destroy`     | `boolean` or `object` | Controls firing `element_destroy` events when the element gets removed from the page.                                              | `false` |
| `expose`      | `boolean` or `object` | Controls firing `element_expose` events when the element becomes visible in the user's viewport.                                   | `true`  |
| `obscure`     | `boolean` or `object` | Controls firing `element_obscure` events when the element becomes no longer visible in the user's viewport.                        | `false` |

#### General event options

These common options are available for the `create`, `destroy`, `expose`, and `obscure` settings and allow limiting how often the event fires.

| Rule property | Type                 | Description                                                                                                              | Status       |
| ------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------ |
| `when`        | `string` or `object` | Sets the limit on how many times the event should fire for matched elements.                                             | **Required** |
| `condition`   | `array`              | A single or list of many [data selectors](#data-selectors); if the final result has no elements the event won't trigger. | Optional     |

For `when`, the available options include, in descending order of frequency:

- `always`: generate an event every time an element becomes eligible (for example, every time an event becomes visible)
- `element`: only fire 1 event for each specific element that matches the rule for the lifetime of the rule (for example, just the first time each element becomes visible)
- `pageview`: like `element`, but reset the state when the tracker next tracks a page view event; this can be useful for single page applications where the plugin may have a long lifetime but you still want to limit the number of events
- `once`: only fire 1 event _per rule_, so even if there are many elements matching `selector` only track the first time this occurs
- `never`: never track this event for this rule. This is useful for defining `components`

When using the `boolean` shorthand, `true` is identical to `{ when: "always" }`, and `false` is `{ when: "never" }`.

#### Expose event options

As well as the [general event options](#general-event-options), `expose` has some extra options specific to its use case.

| Rule property    | Type                | Description                                                                                                                                                                                                                                                                                 |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minPercentage`  | `number`            | For larger elements, only consider the element visible if at least this percentage of its area is visible.                                                                                                                                                                                  |
| `minTimeMillis`  | `number`            | Only consider the element visible if it's cumulative time on screen exceeds this value, in milliseconds.                                                                                                                                                                                    |
| `minSize`        | `number`            | Unless the elements area (height * width) is at least this size, don't consider the element as visible (for example, don't track empty elements).                                                                                                                                           |
| `boundaryPixels` | `number` or `array` | Add this number of pixels to the dimensions (top, right, bottom, left) of the element when calculating its dimensions for `minPercentage` purposes. You can specify a single value, a pair for vertical and horizontal values, or specific values for each of top, right, bottom, and left. |

### Shadow DOM compatibility

If the elements you want to track exist within [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) trees, the plugin may not identify them.
Use these settings to notify the plugin that it should descend into shadow hosts to identify elements to match the rule against.

| Rule property    | Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shadowSelector` | `string`  | A CSS selector for elements that are shadow hosts containing the actual `selector`-targeted elements.                                                                                                                                                                                                                                                                                                                                  |
| `shadowOnly`     | `boolean` | By default, the plugin matches `selector` elements both outside and inside shadow hosts matched by `shadowSelector`; set this to `true` to only match elements within shadow hosts matched by `shadowSelector`. (for example, you may want all `button` elements in a web component, but that selector is too generic when applied to your whole site, so this setting can limit the matches to only those within those shadow hosts). |

### Element data

These settings control extra information captured about the event generating the event.

| Rule property  | Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `component`    | `boolean` | When `true`, defines these elements as being a component. Events generated by this rule, or other rules targeting their child elements, have this rules `name` attached via the `component_parents` entity, showing the component hierarchy that the element belongs to.                                                                                                                                                                                                                                                                                                                                                                     |
| `details`      | `array`   | A list of [data selectors](#data-selectors) of information to capture about this element. The selected values populate the `attributes` object in the [`element` entity](#events-and-entities).                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `includeStats` | `array`   | An array of `event_name` values that the plugin should attach an [`element_statistics` entity](#element-statistics) to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `contents`     | `array`   | You can nest configurations in this property to collect data about elements nested within the elements matched by this rule (for example, this rule could target a recommendations widget, and using `contents` you could describe the individual recommendations served within it). The nested configurations can not trigger their own events, and their [event configuration](#event-configuration) gets ignored. Nested `details` work for the extra `element_content` entities that get generated (based on the nested `name`), and you can further nest `contents` arbitrarily, though you may end up with a large number of entities. |

## Data selectors

Data selectors are a declarative way to extract information from elements matched by rules.

The plugin uses data selectors when deciding if an element should trigger an event (using [`condition`](#general-event-options)), or when building the `element` entity's `attributes` property based on a rule's [`details` and `contents` settings](#element-data).

The declarative configuration lets you safely extract information without having to explicitly write code, or still get information where callbacks aren't possible.
For example, a function defined in Google Tag Manager that passes through a Tag Template can not work with DOM elements directly, which limits the data it could extract.

The declarative use is optional, and you can also just provide a callback function that accepts an element and returns an object if you prefer.

You define data selectors as a list, so you can also combine the two approaches.
When evaluating each list of data selectors, the result is a list of triplets describing:

1. The `source`/type of the data selector
2. The selected `attribute` name
3. The selected attribute `value`

Each data selector should be a function or an object with any of the following properties:

| Data selector property | Value type | Description                                                                                                                                                                                                                                                                                                                                    |
| ---------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                        | `function` | A custom callback. The function should return an object with `string` properties, each of which produce a result in the output list. Values get cast to `string`; empty values (such as `undefined`) get skipped entirely.                                                                                                                     |
| `attributes`           | `array`    | Produces a result for each provided attribute extracted via the [`getAttribute()` API](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute). The value is often the initial value set in the HTML of the page, compared to `properties` which may be a more recent value.                                                    |
| `properties`           | `array`    | Produces a result for each provided property name sourced from the element.                                                                                                                                                                                                                                                                    |
| `dataset`              | `array`    | Produces a result for each provided property name sourced from the element's dataset attribute. This should be the camel-case format version, rather than the attribute-style name.                                                                                                                                                            |
| `child_text`           | `object`   | The value should be an object mapping names to CSS selectors; produces a result for each name mapped to the `textContent` of the first matching child element. Be cautious of large text values.                                                                                                                                               |
| `content`              | `object`   | The value should be an object mapping names to regular expression patterns. Each pattern gets evaluated against the `textContent` of the matching element and produces an attribute with the matched value. If the pattern contains matching groups, uses the first captured group.                                                            |
| `selector`             | `boolean`  | Attach the rule's `selector` as an attribute. Can be useful if you are sharing `names` between rules and need to know which rule matched.                                                                                                                                                                                                      |
| `match`                | `object`   | The value should be an object mapping other attribute names to values or functions. The current set of attribute results get checked against this object; if no attributes have the same value (or the function doesn't return `true` for the value) then discard the current list of results. This can be useful for the `condition` setting. |

The `source` matches the property used, or `callback` if a callback function is the source.
If the callback encounters an error, it produces an `error`-sourced value.

For the purposes of `condition` matching, events don't fire if the resulting list of attributes is empty.

## Events and entities

Events generated by the plugin have simple payloads, consisting of an `element_name` property that's referenced by the entities attached to the event.

The event schemas are:

- [`create_element`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/create_element/jsonschema/1-0-0)
- [`destroy_element`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/destroy_element/jsonschema/1-0-0)
- [`expose_element`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/expose_element/jsonschema/1-0-0)
- [`obscure_element`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/obscure_element/jsonschema/1-0-0)

These events include an `element` entity which includes:

- An `element_name` matching the one in the event payload
- Size and position information
- Any attributes collected via the [`detail` setting](#element-data)

[See `element` entity schema on GitHub](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/element/jsonschema/1-0-0)

### Optional entities

Depending on configuration, events may also include the following entities:

#### Element statistics

By using the [`includeStats` setting](#element-data), you can configure the plugin to attach this entity to any events sent to the tracker (including those not generated by this plugin).

For each rule with this configured, entities for each matching element include:

- Visibility state at the time of the event
- Smallest, largest, and current size
- Element-specific min/max scroll depth information
- Time since the element was first observed (element age)
- How many times the element has been in view
- Cumulative total time the element has been in view

If the selector matches a lot of elements, this can enlarge event payload sizes, use caution with the `selector` used with this setting.

Note that `includeStats` requires opt-in for all event types, even those generated by this plugin:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('startElementTracking', { elements: {
  selector: 'main.article',
  name: 'article_content',
  includeStats: ['expose_element', 'page_ping']
} });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { SnowplowElementTrackingPlugin, startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({ elements: {
  selector: 'main.article',
  name: 'article_content',
  includeStats: ['expose_element', 'page_ping']
} });
```
  </TabItem>
</Tabs>

Define non-self-describing events with the event names assigned to them during enrichment (`page_view`, `page_ping`, `event` (structured events), `transaction`, and `transaction_item`).

[See `element_statistics` entity schema on GitHub](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/element_statistics/jsonschema/1-0-0)

#### Component hierarchy

If any configured rules are a [`component`](#element-data), events generated by the plugin may include the `component_parents` entity.

This includes an `element_name` reference, and a `component_list` that's a list of any `component`-rule names that are ancestors of that element.
Use these values to aggregate events to different levels of a component hierarchy.

The plugin also exposes a `getComponentListGenerator` command, that returns a function that accepts an element and returns this entity.
This function gets used to attach the entity to custom events, or events generated by other plugins like the [form](/docs/sources/web-trackers/tracking-events/form-tracking/index.md) or [link](/docs/sources/web-trackers/tracking-events/link-click/index.md) tracking plugins.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('getComponentListGenerator', function (componentGenerator, componentGeneratorWithDetail) {
   // access a context generator aware of the startElementTracking "components" configuration
   // this will attach the component_parents entity to events generated by these plugins that show the component hierarchy
   snowplow('enableLinkClickTracking', { context: [componentGenerator] });
   snowplow('enableFormTracking', { context: [componentGenerator] });

   // componentGeneratorWithDetail will also populate element_detail entities for each component, but is not directly compatible with the above plugin APIs
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { getComponentListGenerator } from '@snowplow/browser-plugin-element-tracking';
import { enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';
import { enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

// access a context generator aware of the startElementTracking "components" configuration
const [componentGenerator, componentGeneratorWithDetail] = getComponentListGenerator();

// this will attach the component_parents entity to events generated by these plugins that show the component hierarchy
enableLinkClickTracking({ options: { ... }, psuedoClicks: true, context: [componentGenerator] });
enableFormTracking({ context: [componentGenerator] });

// componentGeneratorWithDetail will also populate element_detail entities for each component, but is not directly compatible with the above plugin APIs
```
  </TabItem>
</Tabs>

[See `component_parents` entity schema on GitHub](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/component_parents/jsonschema/1-0-0)

#### Element contents

The `element_content` schema gets attached when you use the [`contents` setting](#element-data).

There can be many instances of this entity in individual events, and the list of them are a flattened tree representation of the nested configuration provided.
Each instance contains references to the parent `element_content` or `element` entity instance that contains it in the `parent_name` and `parent_index` properties (via `element_name` and `element_index`, respectively).
Nested `details` configurations are also used to populate the `attributes` for each instance.

[See `element_content` entity schema on GitHub](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/element_content/jsonschema/1-0-0)

#### Custom context

You can attach custom entities to the events generated by the plugin.

- You can include `context` alongside `elements` when calling `startElementTracking`. You can pass an array of static entities _or_ a callback function that returns such an array. The function receives the element that the event is relevant to, and the matching rule that defined the event should fire.
- Individual rules may also contain specific `context` in the same format as in the preceding.
