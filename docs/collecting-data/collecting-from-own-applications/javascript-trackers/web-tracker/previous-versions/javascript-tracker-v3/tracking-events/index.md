---
title: "Tracking Events"
sidebar_position: 1000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

Snowplow has been built to enable users to track a wide range of events that occur when consumers interact with their websites and webapps.

Snowplow has a number of "built-in" events but offers unlimited event types through Self Describing Events. In addition to this, events can have additional data properties attached them by adding "context" to each event.

Typical Snowplow web tracking plans often leverage the following event types:

- [Page Views](#page-views)
- [Page Pings (Activity Tracking)](#activity-tracking-page-pings)
- [Self Describing Events](#tracking-custom-self-describing-events)
- [Event with custom context](#custom-context)

This page goes on to discuss more advanced topics in tracking events:

- [Global context](#global-context)
- [Link click tracking](#link-click-tracking)
- [Form tracking](#form-tracking)
- [Ecommerce tracking](#ecommerce-tracking)
- [Social tracking](#social-tracking)
- [Campaign tracking](#campaign-tracking)
- [Ad tracking methods](#ad-tracking-methods)
- [Enhanced Ecommerce tracking](#enhanced-ecommerce-tracking)
- [Consent tracking](#consent-tracking)
- [GDPR context](#gdpr-context)
- [Setting the true timestamp](#setting-the-true-timestamp)

### Page Views

Page views are tracked using the `trackPageView` method. This is generally part of the first Snowplow tag to fire on a particular web page. As a result, the `trackPageView` method is usually deployed straight after the tag that also invokes the Snowplow JavaScript (sp.js) e.g.

```javascript
<!-- Snowplow starts plowing -->
<script type="text/javascript">
;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
};p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow"));

snowplow('newTracker', 'sp', '{{collector_url_here}}', {
    appId: 'my-app-id',
});

snowplow('enableActivityTracking', {
  minimumVisitLength: 30,
  heartbeatDelay: 10
});
snowplow('trackPageView');

</script>
<!-- Snowplow stops plowing -->
```

#### `trackPageView`

Track pageview is called using the simple:

```javascript runnable
snowplow('trackPageView');
```

This method automatically captures the URL, referrer and page title (inferred from the `Title` tag.

If you wish, you can override the title with a custom value:

```javascript runnable
snowplow('trackPageView', { title: 'my custom page title' });
```

`trackPageView` can also be passed an array of custom context as an additional final parameter. See [custom context](#custom-context) for more information.

Additionally, you can pass a function which returns an array of zero or more contexts to trackPageView. For the page view and for all subsequent page pings, the function will be called and the contexts it returns will be added to the event.

For example:

```javascript
// Turn on page pings every 10 seconds
snowplow('enableActivityTracking', {
  minimumVisitLength: 10,
  heartbeatDelay: 10
});

snowplow('trackPageView', {
  // The usual array of static contexts
  context: [{
    schema: 'iglu:com.acme/static_context/jsonschema/1-0-0',
    data: {
      staticValue: new Date().toString()
    }
  }],
  // Function which returns an array of custom context
  // Gets called once per page view / page ping
  contextCallback: function() {
    return [{
      schema: 'iglu:com.acme/dynamic_context/jsonschema/1-0-0',
      data: {
        dynamicValue: new Date().toString()
      }
    }];
  }
});
```

The page view and every subsequent page ping will have both a static_context and a dynamic_context attached. The static_contexts will all have the same staticValue, but the dynamic_contexts will have different dynamicValues since a new context is created for every event.

### Activity Tracking: page pings

As well as tracking page views, we can monitor whether users continue to engage with pages over time, and record how they digest content on each page over time.

That is accomplished using 'page ping' events. If activity tracking is enabled, the web page is monitored to see if a user is engaging with it. (E.g. is the tab in focus, does the mouse move over the page, does the user scroll, is `updatePageActivity` called, etc.) If any of these things occur in a set period of time, a page ping event fires, and records the maximum scroll left / right and up / down in the last ping period. If there is no activity in the page (e.g. because the user is on a different browser tab), no page ping fires.

#### `enableActivityTracking`

Page pings are enabled by:

```javascript
snowplow('enableActivityTracking', { 
  minimumVisitLength: number, 
  heartbeatDelay: number 
});
```

where `minimumVisitLength` is the time period from page load before the first page ping occurs, in seconds. `heartbeat` is the number of seconds between each page ping, once they have started. So, if you executed:

```javascript
snowplow('enableActivityTracking', { 
  minimumVisitLength: 30, 
  heartbeatDelay: 10 
});

snowplow('trackPageView');
```

The first ping would occur after 30 seconds, and subsequent pings every 10 seconds as long as the user continued to browse the page actively.

Notes:

- In general this is executed as part of the main Snowplow tracking tag. As a result, you can elect to enable this on specific pages.
- The `enableActivityTracking` method **must** be called _before_ the `trackPageView` method.
- Activity tracking will be disabled if either `minimumVisitLength` or `heartbeatDelay` is not integer. This is to prevent relentless callbacks.

#### `enableActivityTrackingCallback`

You can now perform edge analytics in the browser to reduce the number of events sent to you collector whilst still tracking user activity. The Snowplow JavaScript Tracker enabled this by allowing a callback to be specified in place of a page ping being sent. This is enabled by:

```javascript
snowplow('enableActivityTrackingCallback', { 
  minimumVisitLength: number, 
  heartbeatDelay: number, 
  callback: (data: ActivityCallbackData) => void
});
```

where `minimumVisitLength` is the time period from page load before the first page ping occurs, in seconds. `heartbeat` is the number of seconds between each page ping, once they have started. The `callback` should be a function which will receive an event object containing the page ping activity information, including pageivew_id, and any Page View contexts.

```javascript
type ActivityCallbackData = {
    /**
     * All context for the activity tracking
     * Often generated by the page view events context callback
     */
    context: Array<SelfDescribingJson>;
    /** The current page view id */
    pageViewId: string;
    /** The minimum X scroll position for the current page view */
    minXOffset: number;
    /** The maximum X scroll position for the current page view */
    minYOffset: number;
    /** The minimum Y scroll position for the current page view */
    maxXOffset: number;
    /** The maximum Y scroll position for the current page view */
    maxYOffset: number;
};
```

A full example of how this might be used to aggregate page ping information and then send an event on page unload is below:

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
    appId: 'my-app-id',
    eventMethod: 'beacon'
});
var aggregatedEvent = {
    pageViewId: null,
    minXOffset: 0,
    maxXOffset: 0,
    minYOffset: 0,
    maxYOffset: 0,
    numEvents: 0
};
snowplow('enableActivityTrackingCallback', { 
  minimumVisitLength: 10, 
  heartbeatDelay: 10, 
  callback: function (event) {
    aggregatedEvent = {
        pageViewId: event.pageViewId,
        minXOffset: aggregatedEvent.minXOffset < event.minXOffset ? aggregatedEvent.minXOffset : event.minXOffset,
        maxXOffset: aggregatedEvent.maxXOffset > event.maxXOffset ? aggregatedEvent.maxXOffset : event.maxXOffset,
        minYOffset: aggregatedEvent.minYOffset < event.minYOffset ? aggregatedEvent.minYOffset : event.minYOffset,
        maxYOffset: aggregatedEvent.maxYOffset > event.maxYOffset ? aggregatedEvent.maxYOffset : event.maxYOffset,
        numEvents: aggregatedEvent.numEvents + 1
    };
});
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState == 'hidden') {
    window.snowplow('trackSelfDescribingEvent', {
      event: {
        schema: 'iglu:com.acme_company/page_unload/jsonschema/1-0-0',
        data: {
            minXOffset: Math.max(0, Math.round(aggregatedEvent.minXOffset)),
            maxXOffset: Math.max(0, Math.round(aggregatedEvent.maxXOffset)),
            minYOffset: Math.max(0, Math.round(aggregatedEvent.minYOffset)),
            maxYOffset: Math.max(0, Math.round(aggregatedEvent.maxYOffset)),
            activeSeconds: aggregatedEvent.numEvents * 10
        }
      }
    });
  }
});
window.snowplow('trackPageView');
```

:::note

For this technique of sending on visibility change to work reliably, we recommend initializing the Snowplow tracker with `eventMethod: 'beacon'` and/or `stateStorageStrategy: 'cookieAndLocalStorage'` (if navigating to a page that also contains the JS Tracker). Using the visibility change technique may not work as expected for Single Page Applications (SPA), you would need to send the aggregated event to the Snowplow collector on navigation within your application.

:::

:::caution

The `iglu:com.acme_company/page_unload/jsonschema/1-0-0` schema used in the example is not a valid schema. Please define your own schema for these events. Otherwise, they will fail validation and go to the bad event queue.

:::

We are using `visibilitychange` events as `beforeunload` isn't a reliable option for mobile devices when using `beacon`. You can read more about this on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon#description). An idea on the different levels of compatibility of the different Page Visibility API across browsers and mobile can here found [here](https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/).

#### `updatePageActivity`

You can also mark the user as active with:

```javascript
snowplow('updatePageActivity');
```

On the next interval after this call, a ping will be generated even if the user had no other activity.

This is particularly useful when a user is passively engaging with your content, e.g. watching a video.

#### `disableActivityTracking`

:::note
Available since version 3.14 of the tracker.
:::

To disable activity tracking, you can use the `disableActivityTracking` method.

```javascript
snowplow('disableActivityTracking');
```

Disabling activity tracking will stop page activity intervals and will not send additional activity tracking events.

#### `disableActivityTrackingCallback`

:::note
Available since version 3.14 of the tracker.
:::

To disable the activity tracking callback, you can use the `disableActivityTrackingCallback` method.

```javascript
snowplow('disableActivityTracking');
```

This will stop any further activity tracking callback from being executed.

### Tracking custom self-describing events

```mdx-code-block
import DefineCustomEvent from "@site/docs/reusable/define-custom-event/_index.md"

<DefineCustomEvent/>
```

#### `trackSelfDescribingEvent`

To track a self-describing event, you make use the `trackSelfDescribingEvent` method:

```javascript
snowplow('trackSelfDescribingEvent', {{SELF-DESCRIBING EVENT JSON}});
```

For example:

```javascript
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.acme_company/viewed_product/jsonschema/1-0-0',
    data: {
        productId: 'ASO01043',
        category: 'Dresses',
        brand: 'ACME',
        returning: true,
        price: 49.95,
        sizes: ['xs', 's', 'l', 'xl', 'xxl'],
        availableSince: new Date(2013,3,7)
    }
  }
});
```

The second argument is a [self-describing JSON](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/). It has two fields:

- A `data` field, containing the properties of the event
- A `schema` field, containing the location of the [JSON schema](http://json-schema.org/) against which the `data` field should be validated.

The `data` field should be flat, not nested.

`trackSelfDescribingEvent` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

### Tracking custom structured events

There are likely to be a large number of events that can occur on your site, for which a specific tracking method is part of Snowplow.

Our philosophy in creating Snowplow is that users should capture important consumer interactions and design suitable data structures for this data capture. You can read more about that philosophy [here](/docs/understanding-tracking-design/index.md). Using `trackSelfDescribingEvent` captures these interactions with custom schemas, as described above.

However, as part of a Snowplow implementation there may be interactions where custom Self Describing events are perhaps too complex or unwarranted. They are then candidates to track using `trackStructEvent`, if none of the other event-specific methods outlined above are appropriate.

#### `trackStructEvent`

There are five parameters can be associated with each structured event. Of them, only the first two are required:

| **Name**   | **Required?** | **Description**                                                                                                                                                                      |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Category` | Yes           | The name you supply for the group of objects you want to track e.g. 'media', 'ecomm'                                                                                                 |
| `Action`   | Yes           | A string which defines the type of user interaction for the web object e.g. 'play-video', 'add-to-basket'                                                                            |
| `Label`    | No            | An optional string which identifies the specific object being actioned e.g. ID of the video being played, or the SKU or the product added-to-basket                                  |
| `Property` | No            | An optional string describing the object or the action performed on it. This might be the quantity of an item added to basket                                                        |
| `Value`    | No            | An optional float to quantify or further describe the user action. This might be the price of an item added-to-basket, or the starting time of the video where play was just pressed |

The async specification for the `trackStructEvent` method is:

```javascript runnable
snowplow('trackStructEvent', {
  category: 'category',
  action: 'action',
  label: 'label',
  property: 'property',
  value: 0.0
});
```

An example of tracking a user listening to a music mix:

```javascript runnable
snowplow('trackStructEvent', {
  category: 'Mixes', 
  action: 'Play', 
  label: 'MrC/fabric-0503-mix', 
  property: '',
  value: 0.0
});
```

Note that in the above example no value is set for the `event property`.

`trackStructEvent` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

### Custom context

```mdx-code-block
import DefineCustomEntity from "@site/docs/reusable/define-custom-entity/_index.md"

<DefineCustomEntity/>
```

Custom context can be added as an extra argument to any of Snowplow's `track..()` methods and to `addItem` and `addTrans`.

**Important:** Even if only one custom context is being attached to an event, it still needs to be wrapped in an array.

Here are two example custom context JSONs. One describes a page:

```javascript
{
    schema: "iglu:com.example_company/page/jsonschema/1-2-1",
    data: {
        pageType: 'test',
        lastUpdated: new Date(2014,1,26)
    }
}
```

and the other describes a user on that page:

```javascript
{
    schema: "iglu:com.example_company/user/jsonschema/2-0-0",
    data: {
      userType: 'tester'
    }
}
```

#### Tracking events with Custom Context

How to track a **page view** with both of these contexts attached:

```javascript
snowplow('trackPageView', {
  context: [{
    schema: "iglu:com.example_company/page/jsonschema/1-2-1",
    data: {
      pageType: 'test',
      lastUpdated: new Date(2021,04,01)
    }
  },
  {
    schema: "iglu:com.example_company/user/jsonschema/2-0-0",
    data: {
      userType: 'tester'
    }
  }]
});
```

How to track a **self describing event** with both of these contexts attached:

```javascript
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.example_company/product_viewed/jsonschema/1-0-1',
    data: {
      productId: '12345',
      price: 10.99
    }
  },
  context: [{
    schema: 'iglu:com.example_company/page/jsonschema/1-2-1',
    data: {
      pageType: 'test',
      lastUpdated: new Date(2021,04,01)
    }
  },
  {
    schema: "iglu:com.example_company/user/jsonschema/2-0-0",
    data: {
      userType: 'tester'
    }
  }]
});
```

For more information on custom context, see [here](/docs/understanding-your-pipeline/entities/index.md#custom-entities).

### Global context

**Global context** lets you define your own contexts once (e.g. on tracker initialization) and then have this context sent with every single event subsequently recorded on the page. This saves having to manually build and send the context array with every single event fired.

Here is an example that adds a global context entity to all subsequently tracked events:

```javascript
// Create a context entity and add it to global context
let contextEntity = {
  schema: 'iglu:com.acme/user_context/jsonschema/1-0-0',
  data: { userid: 1234, name: 'John Doe' }
};
window.snowplow('addGlobalContexts', [contextEntity]);

// The global context will be added to this page view event as well
window.snowplow('trackPageView');
```

You may not want to add the same context entity to all tracked events. There are several ways to make global context dynamic:

1. Using a **[context generator](#context-generators)** that generates context entities on the fly when events are sent.
2. Using **[filter functions](#filter-functions)** that filter which events to add global context entities to.
3. Using **[rulesets](#rulesets)** that define rules which types of events to accept or reject when generating global context entities.

#### Context generators

Generating context on-the-fly is accomplished with **context generators**. A context generator is a callback that will be evaluated with an optional argument that contains useful information.

A sample context generator that conditionally generates a context entity could look like this:

```javascript
const contextGenerator = (args) => {
    if (args.eventType == 'pv') {
        return {
            schema: 'iglu:com.acme.marketing/some_event/jsonschema/1-0-0',
            data: { test: 1 },
        };
    }
};
window.snowplow('addGlobalContexts', [contextGenerator]);
```

The optional input is an associative array that contains three elements:

- `event` : self-describing JSON
- `eventType` : string
- `eventSchema` : string (schema URI)

Keep in mind that the arguments `eventType` and `eventSchema` are data found in `event`. `eventType` and `eventSchema` are provided for convenience, so that simple tasks don't require users to search through the event payload.

##### `eventType`

This argument is a string taken from the event payload field, `e`.

`eventType` takes the following values:

| Type                           | `e`       |
| ------------------------------ | --------- |
| Pageview tracking              | pv        |
| Page pings                     | pp        |
| Link click                     | ue        |
| Ad impression tracking         | ue        |
| Ecommerce transaction tracking | tr and ti |
| Custom structured event        | se        |
| Custom self describing event   | ue        |

Further information about the event payload can be found in the [tracker protocol documentation](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md).

##### `eventSchema`

Users should be aware of the behavior of the argument `eventSchema`. Since 'first-class events' (e.g. structured events, transactions, pageviews, etc.) lack a proper schema (their event type is determined by the `e` field), callbacks will be provided the upper-level schema that defines the payload of all events:

`iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4`

For self describing events, `eventSchema` will be the schema that describes the self describing event, not the event payload. Again, this behavior isn't necessarily uniform, but provides more utility to differentiate events.

#### Conditional context providers

We can augment context primitives by allowing them to be sent conditionally. While it's possible to define this functionality within context generators (with conditional logic), conditional context providers simplify common ways of sending contexts that follow certain rules.

The general form is an array of two objects:

`[conditional part, context primitive or [array of primitives]]`

The conditional part is standardized into two options:

- a filter function
- a schema ruleset

#### Filter functions

Filter functions take the standard callback arguments defined for context generators, but instead of returning a Self Describing JSON, return a boolean value. As should be expected: `true` will attach the context part, `false` will not attach the context part.

#### Example

```javascript
// A filter that will only attach contexts to structured events
function structuredEventFilter(args) {
  return args['eventType'] === 'se';
}
var globalContextDefinition = [structuredEventFilter, contextEntityToBeAdded];
window.snowplow('addGlobalContexts', [globalContextDefinition]);
```

#### Rulesets

Rulesets define when to attach context primitives based on the event schema. This follows the standard behavior for all callbacks (the schema used to evaluate is the same provided in `eventSchema`, namely the payload schema for "first-class events" and otherwise the schema found within the self describing event).

Here's the specific structure of a ruleset, it's an object with certain optional rules that take the form of fields, each holding an array of strings:

```javascript
{
    accept: [],
    reject: []
}
```

Some examples, take note that wild-card matching URI path components is defined with an asterisk, `*`, in place of the component:

```javascript
// Only attaches contexts to this one schema
var ruleSetAcceptOne = {
  accept: ['iglu:com.mailchimp/cleaned_email/jsonschema/1-0-0']
};

// Only attaches contexts to these schemas
var ruleSetAcceptTwo = {
  accept: ['iglu:com.mailchimp/cleaned_email/jsonschema/1-0-0',
  'iglu:com.mailchimp/subscribe/jsonschema/1-0-0']
};

// Only attaches contexts to schemas with mailchimp vendor
var ruleSetAcceptVendor = {
  accept: ['iglu:com.mailchimp/*/jsonschema/*-*-*']
};

// Only attaches contexts to schemas that aren't mailchimp vendor
var ruleSetRejectVendor = {
  reject: ['iglu:com.mailchimp/*/jsonschema/*-*-*']
};

// Only attach to Snowplow first class events
var ruleSet = {
  accept: ['iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4']
};
```

You can add a global context entity with a ruleset as follows:

```javascript
var globalContextDefinition = [ruleSet, contextEntityToAdd];
window.snowplow('addGlobalContexts', [globalContextDefinition]);
```

#### Rule requirements

All rules and schemas follow a standard form:

`protocol:vendor/event_name/format/version`

And rules must meet some requirements to be considered valid:

- Two parts are invariant: protocol and format. They are always `iglu` and `jsonschema` respectively.
  - Wildcards can therefore be used only in `vendor`, `event_name` and `version`.
- Version matching must be specified like so: `*-*-*`, where any part of the versioning can be defined, e.g. `1-*-*`, but only sequential parts are to be wildcarded, e.g. `1-*-1` is invalid but `1-*-*` is valid.
- Vendors require the first two "larger parts":
  - `com.acme.*`
- Vendors cannot be defined with non-wildcarded parts between wildcarded parts:
  - `com.acme.*.marketing.*` is invalid
  - `com.acme.*.*` is valid

#### Global contexts methods

These are the standard methods to add and remove global contexts:

#### `addGlobalContexts`

To add global contexts: `snowplow('addGlobalContexts', [array of global contexts])`

#### `removeGlobalContexts`

To remove a global context: `snowplow('removeGlobalContexts', [array of global contexts])`.

Global context entities are removed by doing a JSON match of the context to be removed with the added context. So the objects have to be the same in order for them to be matched.

For example:

```javascript
var entity = {
  schema: 'iglu:com.acme.marketing/some_event/jsonschema/1-0-0',
  data: { test: 1 },
};
window.snowplow('addGlobalContexts', [entity]); // add a global context
window.snowplow('removeGlobalContexts', [entity]); // remove the global context
```

#### `clearGlobalContexts`

To remove all global contexts: `snowplow('clearGlobalContexts')`

### Link click tracking

Link click tracking is enabled using the `enableLinkClickTracking` method. Use this method once and the Tracker will add click event listeners to all link elements. Link clicks are tracked as self describing events. Each link click event captures the link's href attribute. The event also has fields for the link's id, classes, and target (where the linked document is opened, such as a new tab or new window).

[Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1) is the JSON schema for a link click event.

#### `enableLinkClickTracking`

Turn on link click tracking like this:

```javascript
snowplow('enableLinkClickTracking');
```

This is its signature (Where `?` defines an optional property):

```javascript
snowplow('enableLinkClickTracking', { 
  options?: FilterCriterion, 
  pseudoClicks?: boolean, 
  trackContent?: boolean
  context?: SelfDescribingJson[]
});
```

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

**Denylists**

This is an array of CSS classes which should be ignored by link click tracking. For example, the below code will stop link click events firing for links with the class "barred" or "untracked", but will fire link click events for all other links:

```javascript
snowplow('enableLinkClickTracking', { 
  options: {
    denylist: ['barred', 'untracked']
  }
});
```

If there is only one class name you wish to deny, you should still put it in an array:

```javascript
snowplow('enableLinkClickTracking', { options: { 'denylist': ['barred'] } });
```

**Allowlists**

The opposite of a denylist. This is an array of the CSS classes of links which you do want to be tracked. Only clicks on links with a class in the list will be tracked.

```javascript
snowplow('enableLinkClickTracking', { 
  options: { 
    'allowlist': ['unbarred', 'tracked']
  }
});
```

If there is only one class name you wish to whitelist, you should still put it in an array:

```javascript
snowplow('enableLinkClickTracking', { options: { 'allowlist': ['unbarred'] } });
```

**Filter functions**

You can provide a filter function which determines which links should be tracked. The function should take one argument, the link element, and return either 'true' (in which case clicks on the link will be tracked) or 'false' (in which case they won't).

The following code will track clicks on those and only those links whose id contains the string "interesting":

```javascript
function myFilter (linkElement) {
  return linkElement.id.indexOf('interesting') > -1;
}

snowplow('enableLinkClickTracking', { options: { 'filter': myFilter } });
```

An optional parameter is `pseudoClicks`. If this is not turned on, Firefox will not recognise middle clicks. If it is turned on, there is a small possibility of false positives (click events firing when they shouldn't). **Turning this feature on is recommended**:

```javascript
snowplow('enableLinkClickTracking', { pseudoClicks: true });
```

Another optional parameter is `trackContent`. Set it to `true` if you want link click events to capture the innerHTML of the clicked link:

```javascript
snowplow('enableLinkClickTracking', { trackContent: true });
```

The innerHTML of a link is all the text between the `a` tags. Note that if you use a base 64 encoded image as a link, the entire base 64 string will be included in the event.

Each link click event will include (if available) the destination URL, id, classes and target of the clicked link. (The target attribute of a link specifies a window or frame where the linked document will be loaded.)

**Contexts**

`enableLinkClickTracking` can also be passed an array of custom context to attach to every link click event as an additional final parameter.

Link click tracking supports dynamic contexts. Callbacks passed in the contexts argument will be evaluated with the source element passed as the only argument. The self-describing JSON context object returned by the callback will be sent with the link click event.

A dynamic context could therefore look something like this for link click events:

```javascript
let dynamicContext = function (element) {
  // perform operations here to construct the context
  return context;
};

snowplow('enableLinkClickTracking', { context: [dynamicContext] });
```

See [custom context](#custom-context) for more information.

#### `refreshLinkClickTracking`

`enableLinkClickTracking` only tracks clicks on links which exist when the page has loaded. If new links can be added to the page after then which you wish to track, just use `refreshLinkClickTracking`. This will add Snowplow click listeners to all links which do not already have them (and which match the denylist, allowlist, or filter function you specified when `enableLinkClickTracking` was originally called). Use it like this:

```javascript
snowplow('refreshLinkClickTracking');
```

#### `trackLinkClick`

You can manually track individual link click events with the `trackLinkClick` method. This is its signature:

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

Of these arguments, only `targetUrl` is required. This is how to use `trackLinkClick`:

```javascript
snowplow('trackLinkClick', {
  targetUrl: 'http://www.example.com', 
  elementId: 'first-link', 
  elementClasses: ['class-1', 'class-2'], 
  elementTarget: '', 
  elementContent: 'this page'
});
```

`trackLinkClick` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

### Form tracking

Snowplow automatic form tracking detects three event types:

1. [change_form](#change_form) – form field changed.
2. [submit_form](#submit_form) – form submitted.
3. [focus_form](#focus_form) – form field focused.

By default, all three event types are tracked. However, it is possible to subscribe only to specific event types using the `options.events` option when enabling form tracking:

```javascript
snowplow('enableFormTracking', {
    options: {
        events: ['submit_form', 'focus_form', 'change_form']
    },
});
```

##### `change_form`

When a user changes the value of a `textarea`, `input`, or `select` element inside a form, a [`change_form`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/change_form/jsonschema/1-0-0) event will be fired. It will capture the name, type, and new value of the element, and the id of the parent form.

##### `submit_form`

When a user submits a form, a [`submit_form`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/submit_form/jsonschema/1-0-0) event will be fired. It will capture the id and classes of the form and the name, type, and value of all `textarea`, `input`, and `select` elements inside the form.

Note that this will only work if the original form submission event is actually fired. If you prevent it from firing, for example by using a jQuery event handler which returns `false` to handle clicks on the form's submission button, the Snowplow `submit_form` event will not be fired.

##### `focus_form`

When a user focuses on a form element, a [`focus_form`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/focus_form/jsonschema/1-0-0) event will be fired. It will capture the id and classes of the form and the name, type, and value of the `textarea`, `input`, or `select` element inside the form that received focus.

#### `enableFormTracking`

Use the `enableFormTracking` method to add event listeners to turn on form tracking by adding event listeners to all form elements and to all interactive elements inside forms (that is, all `input`, `textarea`, and `select` elements).

```javascript
snowplow('enableFormTracking');
```

This will only work for form elements which exist when it is called. If you are creating a form programmatically, call `enableFormTracking` again after adding it to the document to track it. You can call `enableFormTracking` multiple times without risk of duplicated events. **From v3.2.0**, if you are programmatically adding additional fields to a form after initially calling `enableFormTracking` then calling it again after the new form fields are added will include them in form tracking.

:::note

Events on password fields will not be tracked.

:::

#### Custom form tracking

It may be that you do not want to track every field in a form, or every form on a page. You can customize form tracking by passing a configuration argument to the `enableFormTracking` method. This argument should be an object with two elements named "forms" and "fields". The "forms" element determines which forms will be tracked; the "fields" element determines which fields inside the tracked forms will be tracked. As with link click tracking, there are three ways to configure each field: a denylist, an allowlist, or a filter function. You do not have to use the same method for both fields.

**Denylists**

This is an array of strings used to prevent certain elements from being tracked. Any form with a CSS class in the array will be ignored. Any field whose name property is in the array will be ignored. All other elements will be tracked.

**Allowlists**

This is an array of strings used to turn on certail. Any form with a CSS class in the array will be tracked. Any field in a tracked form whose name property is in the array will be tracked. All other elements will be ignored.

**Filter functions**

This is a function used to determine which elements are tracked. The element is passed as the argument to the function and is tracked if and only if the value returned by the function is truthy.

**Transform functions**

This is a function used to transform data in each form field. The value and element (2.15.0+ only) are passed as arguments to the function and the tracked value is replaced by the value returned.

**Contexts**

Contexts can be sent with all form tracking events by supplying them in an array in the `contexts` argument.

```javascript
snowplow('enableFormTracking', { options: {}, context: [] });
```

These contexts can be dynamic, i.e. they can be traditional self-describing JSON objects, or callbacks that generate valid self-describing JSON objects.

For form change events, context generators are passed `(elt, type, value)`, and form submission events are passed `(elt, innerElements)`.

A dynamic context could therefore look something like this for form change events:

```javascript
let dynamicContext = function (elt, type, value) {
  // perform operations here to construct the context
  return context;
};

snowplow('enableFormTracking', { options: {}, context: [dynamicContext] });
```

**Examples**

To track every form element and every field except those fields named "password":

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

To track only the forms with CSS class "tracked", and only those fields whose ID is not "private":

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

To transform the form fields with an MD5 hashing function:

```javascript
var opts = {
  forms: {
    allowlist: ["tracked"]
  },
  fields: {
    filter: function (elt) {
      return elt.id !== "private";
    },
    transform: function (value, elt) {
      // can use elt to make transformation decisions
      return MD5(value);
    }
  }
};

snowplow('enableFormTracking', { options: opts });
```

#### Tracking forms embedded inside iframes

The options for tracking forms inside of iframes are limited – browsers block access to contents of iframes that are from different domains than the parent page. We are not able to provide a solution to track events using trackers initialized on the parent page in such cases. However, since version 3.4, it is possible to track events from forms embedded in iframes loaded from the same domain as the parent page or iframes created using JavaScript on the parent page (e.g., HubSpot forms).

In case you are able to access form elements inside an iframe, you can pass them in the `options.forms` argument when calling `enableFormTracking` on the parent page. This will enable form tracking for the specific form elements. The feature may also be used for forms not embedded in iframes, but it's most useful in this particular case.

The following example shows how to identify the form elements inside an iframe and pass them to the `enableFormTracking` function:

```javascript
let iframe = document.getElementById('form_iframe'); // find the element for the iframe
let forms = iframe.contentWindow.document.getElementsByTagName('form'); // find form elements inside the iframe
snowplow('enableFormTracking', {
    options: {
        forms: forms // pass the embedded forms when enabling form tracking
    },
});
```

### Ecommerce tracking

Modelled on Google Analytics ecommerce tracking capability, Snowplow uses three methods that have to be used together to track online transactions:

1. **Create a transaction object**. Use `addTrans()` method to initialize a transaction object. This will be the object that is loaded with all the data relevant to the specific transaction that is being tracked including all the items in the order, the prices of the items, the price of shipping and the `order_id`.
2. **Add items to the transaction.** Use the `addItem()` method to add data about each individual item to the transaction object.
3. **Submit the transaction to Snowplow** using the trackTrans() method, once all the relevant data has been loaded into the object.

#### `addTrans`

The `addTrans` method creates a transaction object. It takes nine possible parameters, two of which are required:

| **Parameter** | **Description**                                      | **Required?** | **Example value** |
| ------------- | ---------------------------------------------------- | ------------- | ----------------- |
| `orderId`     | Internal unique order id number for this transaction | Yes           | '1234'            |
| `affiliation` | Partner or store affiliation                         | No            | 'Womens Apparel'  |
| `total`       | Total amount of the transaction                      | Yes           | '19.99'           |
| `tax`         | Tax amount of the transaction                        | No            | '1.00'            |
| `shipping`    | Shipping charge for the transaction                  | No            | '2.99'            |
| `city`        | City to associate with transaction                   | No            | 'San Jose'        |
| `state`       | State or province to associate with transaction      | No            | 'California'      |
| `country`     | Country to associate with transaction                | No            | 'USA'             |
| `currency`    | Currency to associate with this transaction          | No            | 'USD'             |

For example:

```javascript
snowplow('addTrans', {
    orderId: '1234',  // required
    total: 11.99,   // required
    affiliation: 'Acme Clothing', 
    tax: 1.29,
    shipping: 5,
    city: 'San Jose',
    state: 'California',
    country: 'USA',
    currency: 'USD'
});
```

`addTrans` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

#### `addItem`

The `addItem` method is used to capture the details of each product item included in the transaction. It should therefore be called once for each item.

There are six potential parameters that can be passed with each call, four of which are required:

| **Parameter** | **Description**                                    | **Required?**                                       | **Example value** |
| ------------- | -------------------------------------------------- | --------------------------------------------------- | ----------------- |
| `orderId`     | Order ID of the transaction to associate with item | Yes                                                 | '1234'            |
| `sku`         | Item's SKU code                                    | Yes                                                 | 'pbz0001234'      |
| `name`        | Product name                                       | No, but advisable (to make interpreting SKU easier) | 'Black Tarot'     |
| `category`    | Product category                                   | No                                                  | 'Large'           |
| `price`       | Product price                                      | Yes                                                 | 9.99              |
| `quantity`    | Purchase quantity                                  | Yes                                                 | 1                 |
| `currency`    | Product price currency                             | No                                                  | 'USD'             |

For example:

```javascript
snowplow('addItem', {
    orderId: '1234', // required
    sku: 'DD44',     // required
    name: 'T-Shirt',      
    category: 'Green Medium',
    price: 11.99,
    quantity: 1,
    currency: 'USD'
});
```

`addItem` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

#### trackTrans

Once the transaction object has been created (using `addTrans`) and the relevant item data added to it using the `addItem` method, we are ready to send the data to the collector. This is initiated using the `trackTrans` method:

```javascript
snowplow('trackTrans');
```

#### Putting the three methods together: a complete example

```html
<html>
<head>
<title>Receipt for your clothing purchase from Acme Clothing</title>
<script type="text/javascript">

  ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
  p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
  };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
  n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow"));

  snowplow('newTracker', 'sp', '{{collector_url_here}}', { appId: 'my-store' });
  snowplow('enableActivityTracking',{ 
    minimumVisitLength: 30, 
    heartbeatDelay: 10 
  });
  snowplow('trackPageView');
  snowplow('enableLinkClickTracking');

  snowplow('addTrans', {
    orderId: '1234',  // required
    total: 11.99,   // required
    affiliation: 'Acme Clothing', 
    tax: 1.29,
    shipping: 5,
    city: 'San Jose',
    state: 'California',
    country: 'USA',
    currency: 'USD'
  });

   // add item might be called for every item in the shopping cart
   // where your ecommerce engine loops through each item in the cart and
   // prints out _addItem for each
  snowplow('addItem', {
    orderId: '1234', // required
    sku: 'DD44',     // required
    name: 'T-Shirt',      
    category: 'Green Medium',
    price: 11.99,
    quantity: 1,
    currency: 'USD'
  });

  // trackTrans sends the transaction to Snowplow tracking servers.
  // Must be called last to commit the transaction.
  snowplow('trackTrans'); //submits transaction to the collector

</script>
</head>
<body>

  Thank you for your order.  You will receive an email containing all your order details.

</body>
</html>
```

#### `trackAddToCart` and `trackRemoveFromCart`

These methods let you track users adding and removing items from a cart on an ecommerce site. Their arguments are identical:

| **Name**    | **Required?** | **Description**                        | **Type** |
| ----------- | ------------- | -------------------------------------- | -------- |
| `sku`       | Yes           | Item SKU                               | string   |
| `name`      | No            | Item name                              | string   |
| `category`  | No            | Item category                          | string   |
| `unitPrice` | Yes           | Item price                             | number   |
| `quantity`  | Yes           | Quantity added to or removed from cart | number   |
| `currency`  | No            | Item price currency                    | string   |

An example:

```javascript
snowplow('trackAddToCart', {
  sku: '000345', 
  name: 'blue tie', 
  category: 'clothing', 
  unitPrice: 3.49, 
  quantity: 2, 
  currency: 'GBP'
});

snowplow('trackRemoveFromCart', {
  sku: '000345', 
  name: 'blue tie', 
  category: 'clothing', 
  unitPrice: 3.49, 
  quantity: 2, 
  currency: 'GBP'
});
```

Both methods are implemented as Snowplow self describing events. You can see schemas for the [`add_to_cart`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/add_to_cart/jsonschema/1-0-0) and [`remove_from_cart`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/remove_from_cart/jsonschema/1-0-0) events.

Both methods can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

### Social tracking

Social tracking will be used to track the way users interact with Facebook, Twitter and Google + widgets, e.g. to capture "like this" or "tweet this" events.

#### `trackSocialInteraction`

The `trackSocialInteraction` method takes three parameters:

| **Parameter** | **Description**                                               | **Required?** | **Example value**     |
| ------------- | ------------------------------------------------------------- | ------------- | --------------------- |
| `action`      | Social action performed                                       | Yes           | 'like', 'retweet'     |
| `network`     | Social network                                                | Yes           | 'facebook', 'twitter' |
| `target`      | Object social action is performed on e.g. page ID, product ID | No            | '19.99'               |

The method is executed in as:

```javascript
snowplow('trackSocialInteraction', { 
  action: string, 
  network: string, 
  target: string 
});
```

For example:

```javascript
snowplow('trackSocialInteraction', {
  action: 'like', 
  network: 'facebook', 
  target: 'pbz00123'
});
```

`trackSocialInteraction` can also be passed an array of custom context as an additional parameter. See [custom context](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/tracking-events/index.md#custom-contexts) for more information.

### Campaign tracking

Campaign tracking is used to identify the source of traffic coming to a website.

At the highest level, we can distinguish **paid** traffic (that derives from ad spend) with **non paid** traffic: visitors who come to the website by entering the URL directly, clicking on a link from a referrer site or clicking on an organic link returned in a search results, for example.

In order to identify **paid** traffic, Snowplow users need to set five query parameters on the links used in ads. Snowplow checks for the presence of these query parameters on the web pages that users load: if it finds them, it knows that that user came from a paid source, and stores the values of those parameters so that it is possible to identify the paid source of traffic exactly.

If the query parameters are not present, Snowplow reasons that the user is from a **non paid** source of traffic. It then checks the page referrer (the url of the web page the user was on before visiting our website), and uses that to deduce the source of traffic:

1. If the URL is identified as a search engine, the traffic medium is set to "organic" and Snowplow tries to derive the search engine name from the referrer URL domain and the keywords from the query string.
2. If the URL is a non-search 3rd party website, the medium is set to "referrer". Snowplow derives the source from the referrer URL domain.

#### Identifying paid sources

Your different ad campaigns (PPC campaigns, display ads, email marketing messages, Facebook campaigns etc.) will include one or more links to your website e.g.:

```html
<a href="http://mysite.com/myproduct.html">Visit website</a>
```

We want to be able to identify people who've clicked on ads e.g. in a marketing email as having come to the site having clicked on a link in that particular marketing email. To do that, we modify the link in the marketing email with query parameters, like so:

```html
<a href="http://mysite.com/myproduct.html?utm_source=newsletter-october&utm_medium=email&utm_campaign=cn0201">Visit website</a>
```

For the prospective customer clicking on the link, adding the query parameters does not change the user experience. (The user is still directed to the webpage at <http://mysite.com/myproduct.html>.) But Snowplow then has access to the fields given in the query string, and uses them to identify this user as originating from the October Newsletter, an email marketing campaign with campaign id = cn0201.

#### Anatomy of the query parameters

Snowplow uses the same query parameters used by Google Analytics. Because of this, Snowplow users who are also using GA do not need to do any additional work to make their campaigns trackable in Snowplow as well as GA. Those parameters are:

| **Parameter**  | **Name**         | **Description**                                                                                                                                       |
| -------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `utm_source`   | Campaign source  | Identify the advertiser driving traffic to your site e.g. Google, Facebook, autumn-newsletter etc.                                                    |
| `utm_medium`   | Campaign medium  | The advertising / marketing medium e.g. cpc, banner, email newsletter, in-app ad, cpa                                                                 |
| `utm_campaign` | Campaign id      | A unique campaign id. This can be a descriptive name or a number / string that is then looked up against a campaign table as part of the analysis     |
| `utm_term`     | Campaign term(s) | Used for search marketing in particular, this field is used to identify the search terms that triggered the ad being displayed in the search results. |
| `utm_content`  | Campaign content | Used either to differentiate similar content or two links in the same ad. (So that it is possible to identify which is generating more traffic.)      |

The parameters are described in the [Google Analytics help page](https://support.google.com/analytics/answer/1033863). Google also provides a [urlbuilder](https://support.google.com/analytics/answer/1033867?hl=en) which can be used to construct the URL incl. query parameters to use in your campaigns.

### Ad tracking methods

Snowplow tracking code can be included in ad tags in order to track impressions and ad clicks. This is used by e.g. ad networks to identify which sites and web pages users visit across a network, so that they can be segmented, for example.

Each ad tracking method has a `costModel` field and a `cost` field. If you provide the `cost` field, you must also provide one of `'cpa'`, `'cpc'`, and `'cpm'` for the `costModel` field.

It may be the case that multiple ads from the same source end up on a single page. If this happens, it is important that the different Snowplow code snippets associated with those ads not interfere with one another. The best way to prevent this is to randomly name each tracker instance you create so that the probability of a name collision is negligible. See [Managing multiple trackers](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/tracker-setup/managing-multiple-trackers/index.md) for more on having more than one tracker instance on a single page.

Below is an example of how to achieve this when using Snowplow ad impression tracking.

```javascript
<!-- Snowplow starts plowing -->
<script type="text/javascript">

// Wrap script in a closure.
// This prevents rnd from becoming a global variable.
// So if multiple copies of the script are loaded on the same page,
// each instance of rnd will be inside its own namespace and will
// not overwrite any of the others.
// See http://benalman.com/news/2010/11/immediately-invoked-function-expression/
(function(){
  // Randomly generate tracker namespace to prevent clashes
  var rnd = Math.random().toString(36).substring(2);

  // Load Snowplow
  ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
  p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
  };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
  n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow"));

  // Create a new tracker namespaced to rnd
  snowplow('newTracker', rnd, '{{COLLECTOR_URL}}', {
    appId: 'myApp',
  });

  // Replace the values below with macros from your adserver
  snowplow('trackAdImpression:' + rnd, {
    impressionId: '67965967893',
    costModel: 'cpm',          // 'cpa', 'cpc', or 'cpm'
    cost: 5.5,
    targetUrl: 'http://www.example.com',
    bannerId: '23',
    zoneId: '7',
    advertiserId: '201',
    campaignId: '12'
  });
}());
</script>
<!-- Snowplow stops plowing -->
```

Even if several copies of the above script appear on a page, the trackers created will all (probably) have different names and so will not interfere with one another. The same technique should be used when tracking ad clicks. The below examples for `trackAdImpression` and `trackAdClick` assume that `rnd` has been defined in this way.

#### `trackAdImpression`

Ad impression tracking is accomplished using the `trackAdImpression` method. Here are the arguments it accepts:

| **Name**       | **Required?** | **Description**                                                      | **Type** |
| -------------- | ------------- | -------------------------------------------------------------------- | -------- |
| `impressionId` | No            | Identifier for the particular impression instance                    | string   |
| `costModel`    | No            | The cost model for the campaign: 'cpc', 'cpm', or 'cpa'              | string   |
| `cost`         | No            | Ad cost                                                              | number   |
| `targetUrl`    | No            | The destination URL                                                  | string   |
| `bannerId`     | No            | Adserver identifier for the ad banner (creative) being displayed     | string   |
| `zoneId`       | No            | Adserver identifier for the zone where the ad banner is located      | string   |
| `advertiserID` | No            | Adserver identifier for the advertiser which the campaign belongs to | string   |
| `campaignId`   | No            | Adserver identifier for the ad campaign which the banner belongs to  | string   |

:::note

All properties are optional but you must specify at least 1 for this to be a valid call to `trackAdImpression`.

:::

An example:

```javascript
snowplow('trackAdImpression', {
    impressionId: '67965967893',
    costModel: 'cpm', // 'cpa', 'cpc', or 'cpm'
    cost: 5.5,
    targetUrl: 'http://www.example.com',
    bannerId: '23',
    zoneId: '7',
    advertiserId: '201',
    campaignId: '12'
});
```

Ad impression events are implemented as Snowplow self describing events. [Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ad_impression/jsonschema/1-0-0) is the JSON schema for an ad impression event.

`trackAdImpression` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

#### `trackAdClick`

Ad click tracking is accomplished using the `trackAdClick` method. Here are the arguments it accepts:

| **Name**       | **Required?** | **Description**                                                      | **Type** |
| -------------- | ------------- | -------------------------------------------------------------------- | -------- |
| `targetUrl`    | Yes           | The destination URL                                                  | string   |
| `clickId`      | No            | Identifier for the particular click instance                         | string   |
| `costModel`    | No            | The cost model for the campaign: 'cpc', 'cpm', or 'cpa'              | string   |
| `cost`         | No            | Ad cost                                                              | number   |
| `bannerId`     | No            | Adserver identifier for the ad banner (creative) being displayed     | string   |
| `zoneId`       | No            | Adserver identifier for the zone where the ad banner is located      | string   |
| `advertiserID` | No            | Adserver identifier for the advertiser which the campaign belongs to | string   |
| `campaignId`   | No            | Adserver identifier for the ad campaign which the banner belongs to  | string   |

An example:

```javascript
snowplow('trackAdClick',
  targetUrl: 'http://www.example.com',
  clickId: '12243253',
  costModel: 'cpm',
  cost: 2.5,
  bannerId: '23',
  zoneId: '7',
  impressionId: '67965967893', // the same as in trackAdImpression
  advertiserId: '201',
  campaignId: '12'
);
```

Ad click events are implemented as Snowplow self describing events.[Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ad_click/jsonschema/1-0-0) is the JSON schema for an ad click event.

`trackAdClick` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

#### `trackAdConversion`

Use the `trackAdConversion` method to track ad conversions. Here are the arguments it accepts:

| **Name**       | **Required?** | **Description**                                                      | **Type** |
| -------------- | ------------- | -------------------------------------------------------------------- | -------- |
| `conversionId` | No            | Identifier for the particular conversion instance                    | string   |
| `costModel`    | No            | The cost model for the campaign: 'cpc', 'cpm', or 'cpa'              | string   |
| `cost`         | No            | Ad cost                                                              | number   |
| `category`     | No            | Conversion category                                                  | number   |
| `action`       | No            | The type of user interaction, e.g. 'purchase'                        | string   |
| `property`     | No            | Describes the object of the conversion                               | string   |
| `initialValue` | No            | How much the conversion is initially worth                           | number   |
| `advertiserID` | No            | Adserver identifier for the advertiser which the campaign belongs to | string   |
| `campaignId`   | No            | Adserver identifier for the ad campaign which the banner belongs to  | string   |

:::note

All properties are optional but you must specify at least 1 for this to be a valid call to `trackAdConversion`.

:::

An example:

```javascript
snowplow('trackAdConversion', {
    conversionId: '743560297',
    costModel: 'cpa',
    cost: 10,
    category: 'ecommerce',
    action: 'purchase',
    property: '',
    initialValue: 99,
    advertiserId: '201',
    campaignId: '12'
});
```

Ad conversion events are implemented as Snowplow self describing events. [Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ad_conversion/jsonschema/1-0-0) is the schema for an ad conversion event.

`trackAdConversion` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

### `trackSiteSearch`

Use the `trackSiteSearch` method to track users searching your website. Here are its arguments:

| **Name**       | **Required?** | **Description**                 | **Type** |
| -------------- | ------------- | ------------------------------- | -------- |
| `terms`        | Yes           | Search terms                    | array    |
| `filters`      | No            | Search filters                  | JSON     |
| `totalResults` | No            | Results found                   | number   |
| `pageResults`  | No            | Results displayed on first page | number   |

An example:

```
snowplow('trackSiteSearch', {
    terms: ['unified', 'log'],
    filters: {'category': 'books', 'sub-category': 'non-fiction'},
    totalResults: 14,
    pageResults: 8
});
```

Site search events are implemented as Snowplow self describing events. [Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0) is the schema for a `site_search` event.

`trackSiteSearch` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

### `trackTiming`

Use the `trackTiming` method to track user timing events such as how long resources take to load. Here are its arguments:

| **Name**   | **Required?** | **Description**                | **Type** |
| ---------- | ------------- | ------------------------------ | -------- |
| `category` | Yes           | Timing category                | string   |
| `variable` | Yes           | Timed variable                 | string   |
| `timing`   | Yes           | Number of milliseconds elapsed | number   |
| `label`    | No            | Label for the event            | string   |

An example:

```javascript
snowplow('trackTiming', {
  category: 'load',
  variable: 'map_loaded',
  timing: 50,
  label: 'Map loading time'
});
```

Site search events are implemented as Snowplow self describing events. [Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/timing/jsonschema/1-0-0) is the schema for a `timing` event.

`trackTiming` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

### Enhanced Ecommerce tracking

For more information on the Enhanced Ecommerce functions please see the Google Analytics [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce).

#### `addEnhancedEcommerceActionContext`

Use the `addEnhancedEcommerceActionContext` method to add a GA Enhanced Ecommerce Action Context to the Tracker:

| **Name**      | **Required?** | **Type**          |
| ------------- | ------------- | ----------------- |
| `id`          | Yes           | string            |
| `affiliation` | No            | string            |
| `revenue`     | No            | number OR string  |
| `tax`         | No            | number OR string  |
| `shipping`    | No            | number OR string  |
| `coupon`      | No            | string            |
| `list`        | No            | string            |
| `step`        | No            | integer OR string |
| `option`      | No            | string            |
| `currency`    | No            | string            |

Adding an action using Google Analytics:

```javascript
ga('ec:setAction', 'purchase', {
  'id': 'T12345',
  'affiliation': 'Google Store - Online',
  'revenue': '37.39',
  'tax': '2.85',
  'shipping': '5.34',
  'coupon': 'SUMMER2013'
});
```

:::note

The action type is passed with the action context in the Google Analytics example. We have seperated this by asking you to call the trackEnhancedEcommerceAction function to actually send the context and the action.

:::

Adding an action using Snowplow:

```javascript
snowplow('addEnhancedEcommerceActionContext', {
  id: 'T12345',
  affiliation: 'Google Store - Online',
  revenue: '37.39', // Can also pass as number
  tax: '2.85', // Can also pass as number
  shipping: '5.34', // Can also pass as number
  coupon: 'WINTER2016'
});
```

#### `addEnhancedEcommerceImpressionContext`

Use the `addEnhancedEcommerceImpressionContext` method to add a GA Enhanced Ecommerce Impression Context to the Tracker:

| **Name**   | **Required?** | **Type**          |
| ---------- | ------------- | ----------------- |
| `id`       | Yes           | string            |
| `name`     | No            | string            |
| `list`     | No            | string            |
| `brand`    | No            | string            |
| `category` | No            | string            |
| `variant`  | No            | string            |
| `position` | No            | integer OR string |
| `price`    | No            | number OR string  |
| `currency` | No            | string            |

Adding an impression using Google Analytics:

```javascript
ga('ec:addImpression', {
  'id': 'P12345',
  'name': 'Android Warhol T-Shirt',
  'list': 'Search Results',
  'brand': 'Google',
  'category': 'Apparel/T-Shirts',
  'variant': 'Black',
  'position': 1
});
```

Adding an impression using Snowplow:

```javascript
snowplow('addEnhancedEcommerceImpressionContext', {
  id: 'P12345',
  name: 'Android Warhol T-Shirt',
  list: 'Search Results',
  brand: 'Google',
  category: 'Apparel/T-Shirts',
  variant: 'Black',
  position: 1
});
```

#### `addEnhancedEcommerceProductContext`

Use the `addEnhancedEcommerceProductContext` method to add a GA Enhanced Ecommerce Product Field Context:

| **Name**   | **Required?** | **Type**          |
| ---------- | ------------- | ----------------- |
| `id`       | Yes           | string            |
| `name`     | No            | string            |
| `list`     | No            | string            |
| `brand`    | No            | string            |
| `category` | No            | string            |
| `variant`  | No            | string            |
| `price`    | No            | number OR string  |
| `quantity` | No            | integer OR string |
| `coupon`   | No            | string            |
| `position` | No            | integer OR string |
| `currency` | No            | string            |

Adding a product using Google Analytics:

```javascript
ga('ec:addProduct', {
  'id': 'P12345',
  'name': 'Android Warhol T-Shirt',
  'brand': 'Google',
  'category': 'Apparel/T-Shirts',
  'variant': 'Black',
  'position': 1
});
```

Adding a product using Snowplow:

```javascript
snowplow('addEnhancedEcommerceProductContext', {
  id: 'P12345',
  name: 'Android Warhol T-Shirt',
  list: 'Search Results',
  brand: 'Google',
  category: 'Apparel/T-Shirts',
  variant: 'Black',
  quantity: 1
});
```

#### `addEnhancedEcommercePromoContext`

Use the `addEnhancedEcommercePromoContext` method to add a GA Enhanced Ecommerce Promotion Field Context:

| **Name**   | **Required?** | **Type** |
| ---------- | ------------- | -------- |
| `id`       | Yes           | string   |
| `name`     | No            | string   |
| `creative` | No            | string   |
| `position` | No            | string   |
| `currency` | No            | string   |

Adding a promotion using Google Analytics:

```javascript
ga('ec:addPromo', {
  'id': 'PROMO_1234',
  'name': 'Summer Sale',
  'creative': 'summer_banner2',
  'position': 'banner_slot1'
});
```

Adding a promotion using Snowplow:

```javascript
snowplow('addEnhancedEcommercePromoContext', {
  id: 'PROMO_1234', // The Promotion ID
  name: 'Summer Sale', // The name
  creative: 'summer_banner2', // The name of the creative
  position: 'banner_slot1' // The position
});
```

#### `trackEnhancedEcommerceAction`

Use the `trackEnhancedEcommerceAction` method to track a GA Enhanced Ecommerce Action. When this function is called all of the added Ecommerce Contexts are attached to this action and flushed from the Tracker.

| **Name** | **Required?** | **Type** |
| -------- | ------------- | -------- |
| `action` | Yes           | string   |

The allowed actions:

- `click`
- `detail`
- `add`
- `remove`
- `checkout`
- `checkout_option`
- `purchase`
- `refund`
- `promo_click`
- `view`

Adding an action using Google Analytics:

```javascript
ga('ec:setAction', 'refund', {
  'id': 'T12345'
});
```

Adding an action using Snowplow:

```javascript
snowplow('addEnhancedEcommerceActionContext', {
  id: 'T12345'
});
snowplow('trackEnhancedEcommerceAction', {
  action: 'refund'
});
```

### Consent tracking

#### `trackConsentGranted`

Use the `trackConsentGranted` method to track a user opting into data collection. A consent document context will be attached to the event if at least the `id` and `version` arguments are supplied. The method arguments are:

| **Name**      | **Description**                                           | **Required?** | **Type**         |
| ------------- | --------------------------------------------------------- | ------------- | ---------------- |
| `id`          | Identifier for the document granting consent              | Yes           | String           |
| `version`     | Version of the document granting consent                  | Yes           | String           |
| `name`        | Name of the document granting consent                     | No            | String           |
| `description` | Description of the document granting consent              | No            | String           |
| `expiry`      | Date-time string specifying when consent document expires | No            | String           |
| `context`     | Custom context for the event                              | No            | Array            |
| `tstamp`      | When the event occurred                                   | No            | Positive integer |

The `expiry` field specifies that the user consents to the attached documents until the date-time provided, after which the consent is no longer valid.

Tracking a consent granted event:

```javascript
snowplow('trackConsentGranted', {
  id: '1234',
  version: '5',
  name: 'consent_document',
  description: 'a document granting consent',
  expiry: '2020-11-21T08:00:00.000Z'
});
```

#### `trackConsentWithdrawn`

Use the `trackConsentWithdrawn` method to track a user withdrawing consent for data collection. A consent document context will be attached to the event if at least the `id` and `version` arguments are supplied. To specify that a user opts out of all data collection, `all` should be set to `true`.

The method arguments are:

| **Name**      | **Description**                                   | **Required?** | **Type**         |
| ------------- | ------------------------------------------------- | ------------- | ---------------- |
| `all`         | Specifies whether all consent should be withdrawn | No            | Boolean          |
| `id`          | Identifier for the document withdrawing consent   | No            | String           |
| `version`     | Version of the document withdrawing consent       | No            | string           |
| `name`        | Name of the document withdrawing consent          | No            | String           |
| `description` | Description of the document withdrawing consent   | No            | String           |
| `context`     | Custom context for the event                      | No            | Array            |
| `tstamp`      | When the event occurred                           | No            | Positive integer |

Tracking a consent withdrawn event:

```javascript
snowplow('trackConsentWithdrawn', {
  all: false,
  id: '1234',
  version: '5',
  name: 'consent_document',
  description: 'a document withdrawing consent'
});
```

#### Consent documents

Consent documents are stored in the context of a consent event. Each consent method adds a consent document to the event. The consent document is a custom context storing the arguments supplied to the method (in both granted and withdrawn events, this will be: id, version, name, and description). In either consent method, additional documents can be appended to the event by passing an array of consent document self-describing JSONs in the context argument.

The fields of a consent document are:

| **Name**      | **Description**             | **Required?** | **Type** |
| ------------- | --------------------------- | ------------- | -------- |
| `id`          | Identifier for the document | Yes           | String   |
| `version`     | Version of the document     | Yes           | String   |
| `name`        | Name of the document        | No            | String   |
| `description` | Description of the document | No            | String   |

A consent document self-describing JSON looks like this:

```json
{
  schema: 'iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0',
  data: {
    id: '1234',
    version: '5',
    name: 'consent_document_name',
    description: 'here is a description'
  }
}
```

As an example, `trackConsentGranted` will store one consent document as a custom context:

```javascript
snowplow('trackConsentGranted',
  id: '1234', 
  version: '5', 
  name: 'consent_document', 
  description: 'a document granting consent', 
  expiry: '2020-11-21T08:00:00.000Z'
);
```

The method call will generate this event:

```json
{
  e: 'ue',
  ue_pr: {
    schema: 'iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0',
    data: {
      schema: 'iglu:com.snowplowanalytics.snowplow/consent_granted/jsonschema/1-0-0',
      data: {
        expiry: '2020-11-21T08:00:00.000Z'
      }
    }
  },
  co: {
    schema: 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0',
    data: {
      schema: 'iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0',
      data: {
        id: '1234',
        version: '5',
        name: 'consent_document',
        description: 'a document granting consent'
      }
    }
  }
}
```

### GDPR context

The GDPR context attaches a context with the GDPR basis for processing and the details of a related document (eg. a consent document) to all events which are fired after it is set.

It takes the following arguments:

| **Name**              | **Description**             | **Required?** | **Type**    |
| --------------------- | --------------------------- | ------------- | ----------- |
| `basisForProcessing`  | GDPR Basis for processing   | Yes           | Enum String |
| `documentId`          | ID of a GDPR basis document | No            | String      |
| `documentVersion`     | Version of the document     | No            | String      |
| `documentDescription` | Description of the document | No            | String      |

```json
{
  e: 'ue',
  ue_pr: {
    schema: 'iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0',
    data: {
      schema: 'iglu:com.snowplowanalytics.snowplow/consent_granted/jsonschema/1-0-0',
      data: {
        expiry: '2020-11-21T08:00:00.000Z'
      }
    }
  },
  co: {
    schema: 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0',
    data: {
      schema: 'iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0',
      data: {
        id: '1234',
        version: '5',
        name: 'consent_document',
        description: 'a document granting consent'
      }
    }
  }
}
```

The required basisForProcessing accepts only the following literals: `consent`, `contract`, `legalObligation`, `vitalInterests`, `publicTask`, `legitimateInterests` - in accordance with the [five legal bases for processing](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/)

The GDPR context is enabled by calling the `enableGdprContext` method once the tracker has been initialized, for example:

```javascript
snowplow('enableGdprContext', {
  basisForProcessing: 'consent',
  documentId: 'consentDoc-abc123',
  documentVersion: '0.1.0',
  documentDescription: 'this document describes consent basis for processing'
});
```

#### Error tracking

Snowplow JS tracker provides two ways of tracking exceptions: manual tracking of handled exceptions using `trackError` and automatic tracking of unhandled exceptions using `enableErrorTracking`.

##### `trackError`

Use the `trackError` method to track handled exceptions (application errors) in your JS code. This is its signature:

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

| **Name**   | **Required?** | **Description**                     | **Type**   |
| ---------- | ------------- | ----------------------------------- | ---------- |
| `message`  | Yes           | Error message                       | string     |
| `filename` | No            | Filename or URL                     | string     |
| `lineno`   | No            | Line number of problem code chunk   | number     |
| `colno`    | No            | Column number of problem code chunk | number     |
| `error`    | No            | JS `ErrorEvent`                     | ErrorEvent |

Of these arguments, only `message` is required. Signature of this method defined to match `window.onerror` callback in modern browsers.

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

`trackError` can also be passed an array of custom context as an additional parameter. See [custom context](#custom-context) for more information.

Using `trackError` it's assumed that developer knows where error could happen, which is not often the case. Therefor it's recommended to use `enableErrorTracking` as it allows you to discover errors that weren't expected.

##### `enableErrorTracking`

Use the `enableErrorTracking` method to track unhandled exceptions (application errors) in your JS code. This is its signature:

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

| **Name**       | **Required?** | **Description**                 | **Type**                                    |
| -------------- | ------------- | ------------------------------- | ------------------------------------------- |
| `filter`       | No            | Predicate to filter exceptions  | `(ErrorEvent) => Boolean`                   |
| `contextAdder` | No            | Function to get dynamic context | `(ErrorEvent) => Array<SelfDescribingJson>` |
| context        | No            | Additional custom context       | `Array<SelfDescribingJson>`                 |

Unlike `trackError` you need enable error tracking only once:

```javascript
snowplow('enableErrorTracking')
```

Application error events are implemented as Snowplow self describing events. [Here](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.snowplowanalytics.snowplow/application_error/jsonschema/1-0-1) is the schema for a `application_error` event.

### Setting the true timestamp

As standard, every event tracked by the Javascript tracker will be recorded with two timestamps:

1. A `device_created_tstamp` - set when the event occurred
2. A `device_sent_tstamp` - set when the event was sent by the tracker to the collector

These are combined downstream in the Snowplow pipeline (with the `collector_tstamp`) to calculate the `derived_tstamp`, which is our best estimate of when the event actually occurred.

In certain circumstances you might want to set the timestamp yourself e.g. if the JS tracker is being used to process historical event data, rather than tracking the events live. In this case you can set the `true_timestamp` for the event. When set, this will be used as the value in the `derived_tstamp` rather than a combination of the `device_created_tstamp`, `device_sent_tstamp` and `collector_tstamp`.

To set the true timestamp add an extra argument to your track method:

```javascript
{type: 'ttm', value: unixTimestampInMs}
```

e.g. to set a true timestamp with a page view event:

```javascript
snowplow('trackPageView', {
  timestamp: { type: 'ttm', value: 1361553733371 }
});
```

e.g. to set a true timestamp for a self-describing event:

```javascript
snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.acme_company/viewed_product/jsonschema/2-0-0',
    data: {
        productId: 'ASO01043',
        category: 'Dresses',
        brand: 'ACME',
        returning: true,
        price: 49.95,
        sizes: ['xs', 's', 'l', 'xl', 'xxl'],
        availableSince: new Date(2013,3,7)
    }
  },
  timestamp: { type: 'ttm', value: 1361553733371 }
});
```
