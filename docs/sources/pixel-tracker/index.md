---
title: "Pixel tracker tag"
sidebar_label: "Pixel tracker"
sidebar_position: 160
description: "Track views of HTML-only content like emails with the Snowplow Pixel tracker using simple image tags without JavaScript."
keywords: ["pixel tracker", "html email tracking", "no-js tracking"]
---

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Maintained"></Badges>
```

The Pixel tracker is an HTML-only tracking tag (no JavaScript) to track opens / views of HTML content that does not support JavaScript. Examples of use cases include HTML emails.

In a normal JavaScript tag, the name-value pairs of data that are sent through to the Snowplow Collector via the querystring are calculated on the fly. Examples of data points that are calculated like this include `user_id`, or `page_title`.

In an environment where JavaScript isn't permitted, these values need to be set in advance and hardcoded into the tracking tag. For example, if you want to record a different `page_title` for different pages, you'll need to generate a different tracking tag for each of those pages, with the right `page_title` set for each.

## Example Pixel tracking tags

The structure of a Pixel tracking tag is as follows:

```html
<img src="{{Collector-domain}}/i?{{name-value-pairs}}&tv=no-js-0.1.0" />
```

Some things to note about the tag:
* It's an `<img>` tag
* It sends a GET request using the Snowplow Collector `/i` endpoint
* You can send any name-value pairs that are supported by the [Snowplow Tracker Protocol](/docs/fundamentals/canonical-event/index.md) on the query string
  * The pipeline will drop name-value pairs that aren't supported by the Snowplow Tracker Protocol
* To help with analysis, we recommend you set the tracker version `tv` to `no-js-0.1.0` to identify that this event came from a Pixel tracker

### Page view tag

Here's an example tag to track a [page view](/docs/events/ootb-data/page-and-screen-view-events/index.md) event:

```html
<!--Snowplow start plowing-->
<img src="http://Collector.acme.com/i?&e=pv&page=Root%20README&url=http%3A%2F%2Fgithub.com%2Fsnowplow%2Fsnowplow&aid=snowplow&p=web&tv=no-js-0.1.0" />
<!--Snowplow stop plowing-->
```

The query string contains these key-value pairs:
* Event type `e` is `pv`, for page view event
* Page name `page` is `Root README`
* URL `url` is `http://github.com/snowplow/snowplow`
* Application id `aid` is `snowplow`
* Platform `p` is `web`
* Tracker version `tv` is `no-js-0.1.0`

### Custom self-describing event tag

Here's an example tag to track a [custom self-describing](/docs/events/custom-events/index.md#custom-events) event. This tag tracks an event with the schema `iglu:com.acme/email_open/jsonschema/1-0-0` and the data payload:

```json
{
  "emailId": "abc123",
  "campaign": "spring-sale"
}
```

```html
<!--Snowplow start plowing-->
<img src="http://Collector.acme.com/i?e=ue&ue_pr=%7B%22schema%22%3A%22iglu%3Acom.snowplowanalytics.snowplow%2Funstruct_event%2Fjsonschema%2F1-0-0%22%2C%22data%22%3A%7B%22schema%22%3A%22iglu%3Acom.acme%2Femail_open%2Fjsonschema%2F1-0-0%22%2C%22data%22%3A%7B%22emailId%22%3A%22abc123%22%2C%22campaign%22%3A%22spring-sale%22%7D%7D%7D&aid=acme&p=web&tv=no-js-0.1.0" />
<!--Snowplow stop plowing-->
```

The query string contains these key-value pairs:
* Event type `e` is `ue`, for self-describing event (they used to be called "unstructured events")
* Event payload `ue_pr` is the [JSON-encoded self-describing event](/docs/fundamentals/schemas/index.md#self-describing-json-data-in-the-event-payload)
* Application id `aid` is `acme`
* Platform `p` is `web`
* Tracker version `tv` is `no-js-0.1.0`

The full [`ue_pr` value](/docs/events/http-requests/index.md) is structured like this:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
  "data": {
    "schema": "iglu:com.acme/email_open/jsonschema/1-0-0",
    "data": {
      "emailId": "abc123",
      "campaign": "spring-sale"
    }
  }
}
```

### Entities

You can also include [entities](/docs/fundamentals/entities/index.md) in your Pixel tracking tags. Here's a tag that extends the page view example to add the `email_open` custom data as an entity:

```html
<!--Snowplow start plowing-->
<img src="http://Collector.acme.com/i?e=pv&page=Root%20README&url=http%3A%2F%2Fgithub.com%2Fsnowplow%2Fsnowplow&co=%7B%22schema%22%3A%22iglu%3Acom.snowplowanalytics.snowplow%2Fcontexts%2Fjsonschema%2F1-0-0%22%2C%22data%22%3A%5B%7B%22schema%22%3A%22iglu%3Acom.acme%2Femail_open%2Fjsonschema%2F1-0-0%22%2C%22data%22%3A%7B%22emailId%22%3A%22abc123%22%2C%22campaign%22%3A%22spring-sale%22%7D%7D%5D%7D&aid=snowplow&p=web&tv=no-js-0.1.0" />
<!--Snowplow stop plowing-->
```

The entity data is tracked in the [`co` parameter](docs/fundamentals/schemas/index.md#self-describing-json-data-in-the-event-payload) as a [JSON-encoded array](/docs/events/http-requests/index.md):

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
  "data": [
    {
      "schema": "iglu:com.acme/email_open/jsonschema/1-0-0",
      "data": {
        "emailId": "abc123",
        "campaign": "spring-sale"
      }
    }
  ]
}
```

## A warning about using the Pixel tracker on domains you don't own

The Snowplow Collector sets a `network_userid` and drops this on a browser cookie.

Care must therefore be exercised when using the Pixel tracker on domains that you do not own. **It is your responsibility to abide by the terms and conditions of any domain owner for domains where you post content including uploading Pixel tracking tags.** Some domain owners forbid third parties from dropping cookies on their domains. It is your responsibility to ensure you do not violate the terms and conditions of any domain owners that you work with.

## Setting up the pixel tracker

### Identify the event you wish to track

Identify the event you wish to track. This may be opening a particular email that is sent out via your email marketing system, or viewing a product you are selling on a third-party marketplace.

### Construct the pixel tracker URL

Build your pixel tracker URL using the format shown above. Set your Collector domain and configure the query string parameters according to the [Snowplow Tracker Protocol](/docs/fundamentals/canonical-event/index.md).

### Insert the tracking code into the page or ad you wish to track

If this is an HTML email, you will need to insert it in the email. If it is a webpage hosted on a third-party site, you will need to add it to the source code.

## Click tracking

You can use the Pixel tracker for click tracking aka URI redirects:

- Set your Collector path to `{{Collector-domain}}/r/tp2?{{name-value-pairs}}` - the `/r/tp2` tells Snowplow that you are attempting a URI redirect
- Add a `&u={{uri}}` argument to your Collector URI, where `{{uri}}` is the URL-encoded URI that you want to redirect to
- On clicking this link, the Collector will register the link and then do a 302 redirect to the supplied `{{uri}}`
- As well as the `&u={{uri}}` parameter, you can populate the Collector URI with any other fields from the [Snowplow Tracker Protocol](/docs/fundamentals/canonical-event/index.md)

Redirect tracking is usually disabled by default, and is disabled by default for all Snowplow customers. To use this feature, you need to enable this in your Collector configuration. Snowplow customers can enable this from within the Pipeline Configuration screen of Snowplow Console.

You should also restrict values which are allowed within the `u` parameter to prevent phishing attacks using this redirect endpoint. One option is to use [AWS WAF](https://aws.amazon.com/waf/) or [Google Cloud Armor](https://cloud.google.com/armor) (depending on your cloud). They let you block traffic that matches rules you define, such as a regex that the value of the `u` parameter must match.

Example:

```html
Check out <a href="http://Collector.acme.com/r/tp2?u=https%3A%2F%2Fgithub.com%2Fsnowplow%2Fsnowplow">Snowplow</a>
```

Snowplow converts the `&u={{uri}}` argument into a `com.snowplowanalytics.snowplow/uri_redirect` self-describing JSON.

How Snowplow attaches the `uri_redirect` to the event depends on what other Tracker Protocol fields you attached to the event:

1. If you attached an `&e={{event type}}` to your event, then the `uri_redirect` will be added to the entities array of your event
2. If you did not attach an `&e={{event type}}` to your event, then this event will be treated as an self-describing event and the `uri_redirect` will be attached as the event itself
