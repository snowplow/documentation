---
title: "Pixel Tracker"
sidebar_position: 160
---

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Maintained"></Badges>
```

The Pixel tracker is an HTML-only tracking tag (no JavaScript) to track opens / views of HTML content that does not support JavaScript. Examples of use cases include HTML emails.

In a normal JavaScript tag, the name-value pairs of data that are sent through to the Snowplow collector via the querystring are calculated on the fly by the JavaScript. (Examples of data points that are calculated on the fly include `user_id`, or `browser_features`.)

In an environment where JavaScript is not permitted, these values need to be set in advance and hardcoded into the tracking tag. As a result, if you want to record a different `page_title`, for example, for several different HTML-only web pages using the tracking code, you will need to generate a different tracking tag for each of those different web pages, with the right `page_title` set for each.

## Anatomy of a Pixel tracking tag

An example tag is shown below:

```html
<!--Snowplow start plowing-->
<img src="http://collector.acme.com/i?&e=pv&page=Root%20README&url=http%3A%2F%2Fgithub.com%2Fsnowplow%2Fsnowplow&aid=snowplow&p=web&tv=no-js-0.1.0" />
<!--Snowplow stop plowing-->
```

Some things to note about the tag:

1. It is a straightforward `<img ...>` tag, that results in the GET request to the Snowplow tracking pixel
2. The endpoint is set to a Snowplow collector that we are running at `collector.snplow.com`.
3. Five data points are passed on the query string: the event type (`pageview`), the page name (`Root README`), the URL (`http://github.com/snowplow/snowplow`), the application id (`snowplow`), the platform (`web`) and the tracker version (`no-js-0.1.0`)

## A warning about using the Pixel tracker on domains you do not own

The snowplow collector sets a `network_userid` and drops this on a browser cookie.

Care must therefore be exercised when using the Pixel tracker on domains that you do not own. **It is your responsibility to abide by the terms and conditions of any domain owner for domains where you post content including uploading Pixel tracking tags.** Some domain owners forbid 3rd parties from dropping cookies on their domains. It is your responsibility to ensure you do not violate the terms and conditions of any domain owners that you work with.

## Setting up the pixel tracker

### Identify the event you wish to track

Identify the event you wish to track. This may be opening a particular email that is sent out via your email marketing system, or viewing a product you are selling on a 3rd party marketplace.

### Use the pixel tag generator

Snowplow customers can generate a pixel tracker aimed at structured events via [Snowplow Console](https://console.snowplowanalytics.com/pixel-tracker).

#### Choose your collector domain

Select the collector you'd like events sent to via the dropdown.

#### Choose the platform

Choose the value for the platform the tag will be run on.

#### Structured event fields

The generator is currently built for quickly outputting a pixel tag related to campaign oriented events.

Category, action, label, property and value are all available to input relevant information about your campaign.

#### Select the Generate Pixel tracking tag button.

The tracking code will be displayed. Copy this to the clipboard.

### Insert the tracking code into the page or ad you wish to track

If this is an HTML email, you will need to insert it in the email. If it is a webpage hosted on a third party site, you will need to add it to the source code.

## Click tracking

You can use the Pixel tracker for click tracking aka URI redirects:

- Set your collector path to `{{collector-domain}}/r/tp2?{{name-value-pairs}}` - the `/r/tp2` tells Snowplow that you are attempting a URI redirect
- Add a `&u={{uri}}` argument to your collector URI, where `{{uri}}` is the URL-encoded URI that you want to redirect to
- On clicking this link, the collector will register the link and then do a 302 redirect to the supplied `{{uri}}`
- As well as the `&u={{uri}}` parameter, you can populate the collector URI with any other fields from the [Snowplow Tracker Protocol](/docs/events/index.md)

Redirect tracking is usually disabled by default, and is disabled by default for all Snowplow customers. To use this feature, you need to enable this in your collector configuration. Snowplow customers can enable this from within the Pipeline Configuration screen of Snowplow Console.

You should also restrict values which are allowed within the `u` parameter to prevent phising attacks using this redirect endpoint. One option is to use [AWS WAF](https://aws.amazon.com/waf/) or [Google Cloud Armor](https://cloud.google.com/armor) (depending on your cloud). They let you block traffic that matches rules you define, such as a regex that the value of the `u` parameter must match.

Example:

```html
Check out <a href="http://collector.acme.com/r/tp2?u=https%3A%2F%2Fgithub.com%2Fsnowplow%2Fsnowplow">Snowplow</a>
```

Snowplow converts the `&u={{uri}}` argument into a `com.snowplowanalytics.snowplow/uri_redirect` self-describing JSON.

How Snowplow attaches the `uri_redirect` to the event depends on what other Tracker Protocol fields you attached to the event:

1. If you attached an `&e={{event type}}` to your event, then the `uri_redirect` will be added to the contexts array of your event
2. If you did not attach an `&e={{event type}}` to your event, then this event will be treated as an unstructured event and the `uri_redirect` will be attached as the event itself

## Further sources of information

For further information on the Pixel tracker, see this [introductory blog post](http://snowplowanalytics.com/blog/2013/01/29/introducing-the-pixel-tracker/).
