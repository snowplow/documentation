---
title: "Track page element visibility and lifecycle on web"
sidebar_label: "Element visibility tracking"
sidebar_position: 55
description: "Declaratively track page element visibility and lifecycle events as they are created, destroyed, scrolled into view, or scrolled out of view with configurable rules."
keywords: ["element tracking", "visibility", "impression tracking"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Element visibility tracking enables declarative tracking of page elements existing on web pages and scrolling into view.

This is useful for impression tracking, including:

* Funnel steps e.g. form on page > form in view > [form tracking events](/docs/sources/web-trackers/tracking-events/form-tracking/index.md)
* List impression tracking e.g. product impressions
* Component performance e.g. recommendations performance, newsletter sign-up forms, modal popups
* Product usage e.g. elements that appear on-hover, labeling or grouping events related to specific features
* Advertisement impression tracking

Once you call `startElementTracking`, the plugin watches the DOM and automatically fires events whenever:
* Elements appear on the page: tracks `create_element`
* Elements scroll into view: tracks `expose_element`
* Elements scroll out of view: tracks `obscure_element`
* Elements are removed from the page: tracks `destroy_element`

You can define rules for which elements to track, and can also trigger events when elements change to match or no longer match a rule. An entity containing details about the element is attached to each event, and you can also configure other entities.


Element lifecycle events are **automatically tracked** once configured.

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


## Start element tracking

Begin tracking elements by providing configuration to the plugin's `startElementTracking` method:

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

First, add the plugin when initializing the tracker.

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

The `elements` configuration can take a single rule, or an array of rules. You can call `startElementTracking` multiple times to add more rules as needed.

## Events and entities

The plugin can generate four events:
- `create_element`: when a matching element is added to the page
- `expose_element`: when a matching element scrolls into view
- `obscure_element`: when a matching element scrolls out of view
- `destroy_element`: when a matching element is removed from the page

Each of these events has only one property, `element_name`. Check out the [page element tracking overview](/docs/events/ootb-data/page-elements/index.md#page-element-visibility-and-lifecycle) page to see the schema details.

Every element event includes an `element` entity with details about the element that triggered the event. The attributes tracked depend on your `detail` configuration.

By default, only the `expose_element` event is tracked. Configure which event types to track using booleans, or provide objects for more fine-grained control. Check out the configuration options on this page for details.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// This minimal example tracks expose events for all `.product-card` elements
snowplow('startElementTracking', {
  elements: { selector: '.product-card' }
});

// It's equivalent to this more explicit configuration
snowplow('startElementTracking', {
  elements: {
    selector: '.product-card',
    create: false,    // won't fire when element added to DOM
    expose: true,     // WILL fire when element scrolls into view
    obscure: false,   // won't fire when element scrolls out of view
    destroy: false    // won't fire when element removed from DOM
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { startElementTracking } from '@snowplow/browser-plugin-element-tracking';

// This minimal example tracks expose events for all `.product-card` elements
startElementTracking({
  elements: { selector: '.product-card' }
});

// It's equivalent to this more explicit configuration
startElementTracking({
  elements: {
    selector: '.product-card',
    create: false,    // won't fire when element added to DOM
    expose: true,     // WILL fire when element scrolls into view
    obscure: false,   // won't fire when element scrolls out of view
    destroy: false    // won't fire when element removed from DOM
  }
});
```

  </TabItem>
</Tabs>

### Example event

This example shows how to track an `expose_element` event as users scroll through a web page. All event types are configured similarly.

The example uses the `details` data selector option to specify what data to capture.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('startElementTracking', {
  elements: {
    selector: "section", // Matches all <section> elements
    expose: { when: "element" }, // Fires when element becomes visible, once per element
    details: { child_text: { title: "h2" } } // Captures the main section header
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { SnowplowElementTrackingPlugin, startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({
  elements: {
    selector: "section", // Matches all <section> elements
    expose: { when: "element" }, // Fires when element becomes visible, once per element
    details: { child_text: { title: "h2" } } // Captures the main section header
  }
});
```
  </TabItem>
</Tabs>

In this example, the page has several sections. As a user scrolls down the page and each section becomes visible, an `expose_element` event is generated for each one. All events will have `"element_name": "section"`.

Example `element` entity for the first section's `expose_element` event. The section title is "Why Data Teams Choose Snowplow":

```json
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

Example `element` entity for the second section's `expose_element` event. The section title is "How Does Snowplow Work?":

```json
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


## Stop element tracking

To turn off tracking, use `endElementTracking`. You can remove all configured rules, or selectively remove specific rules.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Remove all configured rules and listeners
snowplow('endElementTracking');

// Removes based on `name` matching
// Multiple rules may share a name
snowplow('endElementTracking', {
  elements: ['name1', 'name2']
});

// Removes rules based on `id` matching
// At most one rule can have the same `id`
snowplow('endElementTracking', {
  elementIds: ['id1']
});

// More complicated matching
// Rules where the `filter` function returns true will be removed
snowplow('endElementTracking', {
  filter: (rule) => /recommendations/i.test(rule.name)
});

// Passing an empty object removes no rules
snowplow('endElementTracking', {});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { SnowplowElementTrackingPlugin, endElementTracking } from '@snowplow/browser-plugin-element-tracking';

// Remove all configured rules and listeners
endElementTracking();

// Removes based on `name` matching
// Multiple rules may share a name
endElementTracking({
  elements: ['name1', 'name2']
});

// Removes rules based on `id` matching
// At most one rule can have the same `id`
endElementTracking({
  elementIds: ['id1']
});

// More complicated matching
// Rules where the `filter` function returns true will be removed
endElementTracking({
  filter: (rule) => /recommendations/i.test(rule.name)
});

// Passing an empty object removes no rules
endElementTracking({});
```
  </TabItem>
</Tabs>

If you specify more than one of the `elementIds`, `elements`, and `filter` options, they get evaluated in that order.

## Configure entities

You can configure additional element tracking or custom entities by modifying the `startElementTracking` call.

Additional entities can be attached depending on configuration:
- `element_statistics`: visibility and scroll depth statistics for the element
- `element_content`: information about nested elements within the matched element
- `component_parents`: the component hierarchy that the element belongs to
- Custom entities

Check out the [page element tracking overview](/docs/events/ootb-data/page-elements/index.md#page-element-visibility-and-lifecycle) page to see the schema details.

The configuration is per-rule, so different rules can have different settings.

### Element statistics

Use the `includeStats` option to attach the `element_statistics` entity to specified events, including those not generated by this plugin.

This example will add the `element_statistics` entity to `expose_element` and `page_ping` events:

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

Adding element statistics to page pings can be useful to understand how a user moves through the content. It'll show scroll depth increasing over time, backtracking behavior, and total engagement duration.

For [baked-in events](/docs/fundamentals/events/index.md#baked-in-events), use the following names:
* Page view: `page_view`
* Page ping: `page_ping`
* Structured: `event`

Be cautious with the `selector`. If it matches a lot of elements, this can enlarge event payload sizes.

### Element content

Add the `element_content` entity by setting `contents`. It captures data about specified nested elements within the matched parent element.

In this example, the plugin will track an `expose_element` event when a `.product-grid` element scrolls into view. This event will have an `element` entity for the grid itself, and multiple `element_content` entities for each `.product-card` within the grid.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('startElementTracking', {
  elements: {
    selector: '.product-grid',
    name: 'product_list',
    expose: { when: 'element' },
    contents: [
      {
        selector: '.product-card',
        name: 'product_item',
        details: [
          { dataset: ['productId', 'price'] },
          { child_text: { name: 'h3', brand: '.brand-name' } }
        ]
      }
    ]
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { SnowplowElementTrackingPlugin, startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({
  elements: {
    selector: '.product-grid',
    name: 'product_list',
    expose: { when: 'element' },
    contents: [
      {
        selector: '.product-card',
        name: 'product_item',
        details: [
          { dataset: ['productId', 'price'] },
          { child_text: { name: 'h3', brand: '.brand-name' } }
        ]
      }
    ]
  }
});
```

  </TabItem>
</Tabs>

The `details` configuration sets which element `attributes` to capture.

<details>
  <summary>Example entities for this configuration</summary>

The `expose_element` event will have `"element_name": "product_list"`.

One `element` entity:
```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/element/jsonschema/1-0-0",
  "data": {
    "element_name": "product_list",
    "element_index": 1,
    "element_matches": 1,
    "width": 1200,
    "height": 400,
    "attributes": []
  }
}
```

Multiple `element_content` entities:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/element_content/jsonschema/1-0-0",
  "data": {
    "element_name": "product_item",
    "parent_name": "product_list", // element_name of parent element
    "parent_position": 1,          // element_index of parent element
    "position": 1,
    "attributes": [
      { "source": "dataset", "attribute": "productId", "value": "SKU-001" },
      { "source": "dataset", "attribute": "price", "value": "29.99" },
      { "source": "child_text", "attribute": "name", "value": "Wireless Mouse" },
      { "source": "child_text", "attribute": "brand", "value": "Logitech" }
    ]
  }
}
```

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/element_content/jsonschema/1-0-0",
  "data": {
    "element_name": "product_item",
    "parent_name": "product_list", // element_name of parent element
    "parent_position": 1,          // element_index of parent element
    "position": 2,
    "attributes": [
      { "source": "dataset", "attribute": "productId", "value": "SKU-002" },
      { "source": "dataset", "attribute": "price", "value": "49.99" },
      { "source": "child_text", "attribute": "name", "value": "Mechanical Keyboard" },
      { "source": "child_text", "attribute": "brand", "value": "Keychron" }
    ]
  }
}
```

</details>

### Component parents

You can mark elements as components to track hierarchy, using `component` rules. Events for child elements include a `component_parents` entity listing their ancestor components.

This is useful when you have the same appearing in multiple places on your site. Without component tracking, all those events look identical.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('startElementTracking', {
  elements: [
    // Define components (containers)
    {
      selector: 'header', // Mark the header as a component
      name: 'site_header',
      component: true,
      expose: false // Don't track expose events for the component itself
    },
    {
      selector: 'footer', // Mark the footer as a component
      name: 'site_footer',
      component: true,
      expose: false // Don't track expose events for the component itself
    },
    // Track elements - events will include component_parents
    {
      selector: '.newsletter-form',
      name: 'newsletter_signup',
      create: true, // Fire create_element events
      expose: { when: 'element' } // Fire expose_element events
    }
  ]
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { SnowplowElementTrackingPlugin, startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({
  elements: [
    // Define components (containers)
    {
      selector: 'header', // Mark the header as a component
      name: 'site_header',
      component: true,
      expose: false // Don't track expose events for the component itself
    },
    {
      selector: 'footer', // Mark the footer as a component
      name: 'site_footer',
      component: true,
      expose: false // Don't track expose events for the component itself
    },
    // Track elements - events will include component_parents
    {
      selector: '.newsletter-form',
      name: 'newsletter_signup',
      create: true, // Fire create_element events
      expose: { when: 'element' } // Fire expose_element events
    }
  ]
});
```

  </TabItem>
</Tabs>

For this example, imagine a page has two `.newsletter-form` elements: one in the page sidebar, and one in the footer.

The `component_parents` entity for the sidebar form, which isn't within either of the defined component containers, could look like this:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/component_parents/jsonschema/1-0-0",
  "data": {
    "element_name": "newsletter_signup",
    "component_list": []
  }
}
```

The `component_parents` entity for the footer form, which is within the `footer` component, could look like this:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/component_parents/jsonschema/1-0-0",
  "data": {
    "element_name": "newsletter_signup",
    "component_list": ["site_footer"]
  }
}
```

#### Generate entities for other events

The plugin also exposes a `getComponentListGenerator` utility function for attaching component hierarchy information to custom events, or to events generated by other plugins like the [form](/docs/sources/web-trackers/tracking-events/form-tracking/index.md) or [link](/docs/sources/web-trackers/tracking-events/link-click/index.md) tracking plugins.

This function returns two entity generator functions that determine component hierarchy for a given element:
* `componentGenerator`: returns a single `component_parents` entity
* `componentGeneratorWithDetail`: returns a `component_parents` entity plus an `element` entity

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

The JavaScript tracker uses a callback pattern to access the generators asynchronously:

```javascript
// This snippet assumes you've already defined component rules in startElementTracking

snowplow('getComponentListGenerator', function (componentGenerator, componentGeneratorWithDetail) {
   // attach the component_parents entity to events from these plugins
   snowplow('enableLinkClickTracking', { context: [componentGenerator] });
   snowplow('enableFormTracking', { context: [componentGenerator] });
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

The Browser tracker returns the generators directly as an array:

```javascript
// This snippet assumes you've already defined component rules in startElementTracking

import { getComponentListGenerator } from '@snowplow/browser-plugin-element-tracking';
import { enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';
import { enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

const [componentGenerator, componentGeneratorWithDetail] = getComponentListGenerator();

// attach the component_parents entity to events from these plugins
enableLinkClickTracking({ context: [componentGenerator] });
enableFormTracking({ context: [componentGenerator] });
```
  </TabItem>
</Tabs>

:::note Plugin compatibility

`componentGeneratorWithDetail` returns multiple entities and isn't directly compatible with the `context` arrays used by the link and form tracking plugins.

:::

### Custom entities

There are two ways you can add custom entities to element tracking events:
* Plugin `context` option, applies to all rules
* Per-rule `context` option, applies only to events from that specific rule

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Configure at plugin level to apply to all rules
snowplow('startElementTracking', {
  elements: [/* rules */],
  context: [/* entities attached to ALL events */]
});

// Configure at rule level to apply to a specific rule
snowplow('startElementTracking', {
  elements: {
    selector: '.promo-banner',
    name: 'promotion',
    context: [/* entities attached only to this rule's events */]
  }
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
// Configure at plugin level to apply to all rules
startElementTracking({
  elements: [/* rules */],
  context: [/* entities attached to ALL events */]
});

// Configure at rule level to apply to a specific rule
startElementTracking({
  elements: {
    selector: '.promo-banner',
    name: 'promotion',
    context: [/* entities attached only to this rule's events */]
  }
});
```
  </TabItem>
</Tabs>

You can configure static or dynamic entities:
* Use static entities when the same data should be attached to every event, e.g. A/B test variant

```javascript
context: [
    {
      schema: 'iglu:com.example/campaign/jsonschema/1-0-0',
      data: { campaign_id: 'summer_2025', variant: 'A' }
    }
  ]
```

* Use callbacks to generate dynamic entities when the data depends on the specific element that triggered the event

```javascript
context: [
  (element, rule) => ({
    schema: 'iglu:com.example/promotion/jsonschema/1-0-0',
    data: {
      promo_id: element.dataset.promoId,
      position: element.dataset.position,
      rule_name: rule.name
    }
  })
]
```

## Configure the plugin

As well as configuring the `element_statistics`, `element_content`, and `component_parents` entities, you can customize how element visibility tracking works using the options below.

The core options are explained in this table:

| Property   | Type     | Description                                                                                                                                                                                                                                                                                                                                  | Status        |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `selector` | `string` | A CSS selector string that matches one or more elements on the page that should trigger events from this rule.                                                                                                                                                                                                                               | **Required**  |
| `name`     | `string` | A label to name this rule. Allows you to keep a stable name for events generated by this rule, even if the `selector` changes, so the data produced remains consistent. You can share a single `name` between many rules to have different configurations for different selectors. If not supplied, the `selector` value becomes the `name`. | _Recommended_ |
| `id`       | `string` | A specific identifier for this rule. Useful if you share a `name` between many rules and need to specifically remove individual rules within that group.                                                                                                                                                                                     |

You'll see `selector` and `name` in the examples on this page.

### Event frequency with `when`

The `when` option controls how often events fire. The default is `always`.

This example shows the options:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// "always" - fires every time (e.g., every scroll in/out of view)
// Boolean shorthand - expose: true
snowplow('startElementTracking', {
  elements: {
    selector: '.ad-banner',
    name: 'ad_impression',
    expose: { when: 'always' }  // fires each time banner scrolls into view
  }
});

// "element" - fires once per matched element
snowplow('startElementTracking', {
  elements: {
    selector: '.product-card',
    name: 'product_impression',
    expose: { when: 'element' }  // fires once per card, even if user scrolls back
  }
});

// "pageview" - fires once per element, resets on new page view (useful for SPAs)
snowplow('startElementTracking', {
  elements: {
    selector: '.hero-section',
    name: 'hero_viewed',
    expose: { when: 'pageview' }  // resets when tracker fires next page_view event
  }
});

// "once" - fires exactly once for the entire rule, regardless of how many elements match
snowplow('startElementTracking', {
  elements: {
    selector: '.newsletter-form',
    name: 'newsletter_form_exists',
    expose: { when: 'once' }  // fires once even if multiple forms exist
  }
});

// "never": never track this event for this rule
// This is useful for defining components
// Boolean shorthand - expose: false
snowplow('startElementTracking', {
  elements: {
    selector: 'section',
    expose: { when: 'never' }  // never fires
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { startElementTracking } from '@snowplow/browser-plugin-element-tracking';

// "always" - fires every time (e.g., every scroll in/out of view)
// Boolean shorthand - expose: true
startElementTracking({
  elements: {
    selector: '.ad-banner',
    name: 'ad_impression',
    expose: { when: 'always' }  // fires each time banner scrolls into view
  }
});

// "element" - fires once per matched element
startElementTracking({
  elements: {
    selector: '.product-card',
    name: 'product_impression',
    expose: { when: 'element' }  // fires once per card, even if user scrolls back
  }
});

// "pageview" - fires once per element, resets on new page view (useful for SPAs)
startElementTracking({
  elements: {
    selector: '.hero-section',
    name: 'hero_viewed',
    expose: { when: 'pageview' }  // resets when tracker fires next page_view event
  }
});

// "once" - fires exactly once for the entire rule, regardless of how many elements match
startElementTracking({
  elements: {
    selector: '.newsletter-form',
    name: 'newsletter_form_exists',
    expose: { when: 'once' }  // fires once even if multiple forms exist
  }
});

// "never": never track this event for this rule
// This is useful for defining components
// Boolean shorthand - expose: false
startElementTracking({
  elements: {
    selector: 'section',
    expose: { when: 'never' }  // never fires
  }
});
```

  </TabItem>
</Tabs>

If you're using `when: pageview`, ensure that the tracker is firing page view events appropriately for your needs, especially if it's a single page application (SPA).

The plugin assumes that you'll call `startElementTracking()` before `trackPageView()`. The first page view doesn't reset the element visibility state, because the plugin sets `ignoreNextPageView: true` by default internally.

If your site tracks page views before calling `startElementTracking()`, you can disable this behavior by passing `ignoreNextPageView: false` in the plugin options when adding it to the tracker.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-element-tracking@latest/dist/index.umd.min.js",
  ["snowplowElementTracking", "SnowplowElementTrackingPlugin"],
  [{ ignoreNextPageView: false }]
);

snowplow('startElementTracking', { elements: [/* configuration */] });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

First, add the plugin when initializing the tracker.

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { SnowplowElementTrackingPlugin, startElementTracking } from '@snowplow/browser-plugin-element-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ SnowplowElementTrackingPlugin({ ignoreNextPageView: false }) ],
});

startElementTracking({ elements: [/* configuration */] });
```
  </TabItem>
</Tabs>

### Visibility thresholds for `expose`

Control what counts as "visible" for `expose_element` events:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('startElementTracking', {
  elements: {
    selector: '.video-player',
    name: 'video_impression',
    expose: {
      when: 'element',
      minPercentage: 0.5,      // at least 50% of element must be visible
      minTimeMillis: 2000,     // must be visible for 2 seconds cumulative
      minSize: 10000,          // element must be at least 10,000px² (e.g., 100x100)
      boundaryPixels: 50       // adds 50px padding when calculating visibility
    }
  }
});

// boundaryPixels accepts different formats:
expose: {
  when: 'element',
  boundaryPixels: 20           // 20px all sides
  // or: [10, 20]              // 10px vertical, 20px horizontal
  // or: [10, 20, 30, 40]      // top, right, bottom, left
}
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({
  elements: {
    selector: '.video-player',
    name: 'video_impression',
    expose: {
      when: 'element',
      minPercentage: 0.5,      // at least 50% of element must be visible
      minTimeMillis: 2000,     // must be visible for 2 seconds cumulative
      minSize: 10000,          // element must be at least 10,000px² (e.g., 100x100)
      boundaryPixels: 50       // adds 50px padding when calculating visibility
    }
  }
});

// boundaryPixels accepts different formats:
expose: {
  when: 'element',
  boundaryPixels: 20           // 20px all sides
  // or: [10, 20]              // 10px vertical, 20px horizontal
  // or: [10, 20, 30, 40]      // top, right, bottom, left
}
```

  </TabItem>
</Tabs>

### Data selectors using `details`

The plugin uses data selectors when deciding if an element should trigger an event using `condition`, or when building the `element` entity's `attributes` property.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('startElementTracking', {
  elements: {
    selector: '.product-card',
    name: 'product',
    expose: { when: 'element' },
    details: [
      // HTML attributes (from getAttribute)
      { attributes: ['id', 'data-category'] },

      // Element properties (may differ from HTML attributes)
      { properties: ['className', 'tagName'] },

      // Dataset values (data-* attributes, camelCase)
      // <div data-product-id="123" data-price="29.99">
      { dataset: ['productId', 'price'] },

      // Text content from child elements
      { child_text: {
          name: 'h3',           // text from first <h3>
          brand: '.brand-name'  // text from first .brand-name
      }},

      // Regex extraction from element's textContent
      { content: {
          sku: /SKU-(\d+)/     // captures first group
      }},

      // Include the selector that matched
      { selector: true },

      // Validate collected attributes - discards results if no match
      // Useful for filtering in `condition`
      { match: {
          category: 'electronics',                        // exact value match
          price: (val) => parseFloat(val) > 0             // function match
      }},

      // Custom callback function
      (element) => ({
        isOnSale: element.classList.contains('on-sale') ? 'true' : 'false',
        position: element.dataset.position
      })
    ]
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({
  elements: {
    selector: '.product-card',
    name: 'product',
    expose: { when: 'element' },
    details: [
      // HTML attributes (from getAttribute)
      { attributes: ['id', 'data-category'] },

      // Element properties (may differ from HTML attributes)
      { properties: ['className', 'tagName'] },

      // Dataset values (data-* attributes, camelCase)
      // <div data-product-id="123" data-price="29.99">
      { dataset: ['productId', 'price'] },

      // Text content from child elements
      { child_text: {
          name: 'h3',           // text from first <h3>
          brand: '.brand-name'  // text from first .brand-name
      }},

      // Regex extraction from element's textContent
      { content: {
          sku: /SKU-(\d+)/     // captures first group
      }},

      // Include the selector that matched
      { selector: true },

      // Validate collected attributes - discards results if no match
      // Useful for filtering in `condition`
      { match: {
          category: 'electronics',                        // exact value match
          price: (val) => parseFloat(val) > 0             // function match
      }},

      // Custom callback function
      (element) => ({
        isOnSale: element.classList.contains('on-sale') ? 'true' : 'false',
        position: element.dataset.position
      })
    ]
  }
});
```

  </TabItem>
</Tabs>

### Conditional event firing with `condition`

Only fire events when elements match certain criteria. Use data selectors to define the conditions:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Example: only track visible notifications
snowplow('startElementTracking', {
  elements: {
    selector: '.notification',
    name: 'notification_shown',
    create: {
      when: 'element',
      condition: [
        // Only fire if notification has data-visible="true"
        { dataset: ['visible'] },
        { match: { visible: 'true' } }
      ]
    }
  }
});

// Example: only track products that are in stock
snowplow('startElementTracking', {
  elements: {
    selector: '.product-card',
    name: 'in_stock_product',
    expose: {
      when: 'element',
      condition: [
        { dataset: ['stockStatus'] },
        { match: { stockStatus: (val) => val !== 'out-of-stock' } }
      ]
    }
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { startElementTracking } from '@snowplow/browser-plugin-element-tracking';

// Example: only track visible notifications
startElementTracking({
  elements: {
    selector: '.notification',
    name: 'notification_shown',
    create: {
      when: 'element',
      condition: [
        // Only fire if notification has data-visible="true"
        { dataset: ['visible'] },
        { match: { visible: 'true' } }
      ]
    }
  }
});

// Example: only track products that are in stock
startElementTracking({
  elements: {
    selector: '.product-card',
    name: 'in_stock_product',
    expose: {
      when: 'element',
      condition: [
        { dataset: ['stockStatus'] },
        { match: { stockStatus: (val) => val !== 'out-of-stock' } }
      ]
    }
  }
});
```

  </TabItem>
</Tabs>

### Shadow DOM tracking

If the elements you want to track exist within [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) trees, the plugin might not identify them automatically.

Use these settings to notify the plugin that it should descend into shadow hosts to identify elements to match the rule against.

By default, the plugin matches specified elements both outside and inside `shadowSelector` shadow hosts. Set `shadowOnly` to `true` to only match elements within those shadow hosts.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('startElementTracking', {
  elements: {
    selector: 'button.submit',
    name: 'submit_button',
    shadowSelector: 'my-custom-form',  // CSS selector for elements that are shadow hosts containing the targeted elements
    shadowOnly: true,  // only match elements inside shadow DOM, not elsewhere
    expose: { when: 'element' }
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({
  elements: {
    selector: 'button.submit',
    name: 'submit_button',
    shadowSelector: 'my-custom-form',  // CSS selector for elements that are shadow hosts containing the targeted elements
    shadowOnly: true,  // only match elements inside shadow DOM, not elsewhere
    expose: { when: 'element' }
  }
});
```

  </TabItem>
</Tabs>

### Send to specific trackers

If you have multiple trackers loaded on the same page, you can specify which trackers should receive events using the `tracker` option. Provide a list of tracker namespaces.

If omitted, events go to all trackers the plugin has been activated for.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('startElementTracking', {
  elements: { selector: '.promo-banner' }
}, ['tracker1', 'tracker2']);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({
  elements: { selector: '.promo-banner' }
}, ['tracker1', 'tracker2']);
```

  </TabItem>
</Tabs>

## Further examples

These examples are based on [a snapshot](https://web.archive.org/web/20250422013533/https://snowplow.io/) of the [Snowplow website](https://snowplow.io/).

### Content depth

The blog posts have longer-form content.
Snowplow's page ping events track scroll depth by pixels, but those measurements become inconsistent between devices and page.
To see how much content gets consumed, you can generate stats based on the paragraphs in the content.
You can also get periodic stats based on the entire article in page pings.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

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

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript title="Rule configuration"
import { startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({
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

  </TabItem>
</Tabs>

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

### Simple funnels

A newsletter sign-up form exists at the bottom of the page.
Performance measurement becomes difficult because many visitors don't even see it.
To test this you first need to know:

- When the form exists on a page
- When the form is actually seen
- When people actually interact with the form
- When the form is finally submitted

The form tracking plugin can only do the last parts, but the element tracker gives you the earlier steps.
If you end up adding more forms in the future, you'll want to know which is which, so you can mark the footer as a component so you can split it out later.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

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

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript title="Rule configuration"
import { startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({
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

  </TabItem>
</Tabs>

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

### Recommendations performance

The homepage contains a section for the "Latest Blogs from Snowplow."
This could represent recommendations or some other form of personalization.
If it did, one might want to optimize it.
Link tracking could tell you when a recommendation worked and a visitor clicked it, but how would identify the recommendation not encouraging clicks?
If you track when the widget becomes visible and include the items that got recommended, you could correlate that with the clicks to measure performance.
For fairer measurement of visibility, you can configure that visibility only counts if at least 50% is in view, and it has to be on screen for at least 1.5 seconds.
You'll also collect the post title and author information.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

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

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript title="Rule configuration"
import { startElementTracking } from '@snowplow/browser-plugin-element-tracking';

startElementTracking({
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

  </TabItem>
</Tabs>

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
