---
title: "Adding data to your events: context and more"
date: "2021-10-19"
sidebar_position: 20
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

There are multiple ways to add extra data to your tracked events, adding richness and value to your dataset. Each of them involves a different class from the Ruby tracker.

1. [Event context](#event-context) using SelfDescribingJson. Attach event context, describing anything you like, in the form of self-describing JSONs.
2. [Subject](#adding-user-and-platform-data-with-subject): Include information about the user, or the platform on which the event occurred.
3. [Page](#adding-page-data-with-page): For websites, include data about the page on which the event occurred.
4. [Timestamp](#event-timestamps): Override the default event timestamp with your own timestamp.

You can attach any of these as additional arguments to the `track_x_event` methods.

## Event context

Event context is an incredibly powerful aspect of Snowplow tracking, which allows you to create very rich data. It is based on the same [self-describing JSON schemas](/docs/understanding-your-pipeline/schemas/index.md) as the [self-describing events](/docs/collecting-data/collecting-from-own-applications/ruby-tracker/tracking-events/index.md#self-describing-event). Using event context, you can add any details you like to your events, as long as you can describe them in a self-describing JSON schema.

Each schema will describe a single "entity". All of an event's entities together form the event context. The event context will be sent as one field of the event, finally ending up in one column (`contexts`) in your data storage. There is no limit to how many entities can be attached to one event.

The context entities were originally called "context" themselves, with the event context referred to as "contexts". This was confusing (and not great English grammar), so we changed the name. However, the name "contexts" persists in some places.

Check out our [demo Rails app](https://github.com/snowplow-incubator/snowplow-ruby-tracker-examples) to see an example of a custom eCommerce event created using a self-describing event plus product entity. Note that context can be added to any event type, not just self-describing events. This means that even a simple event type like a page view can hold complex and extensive information - reducing the chances of data loss and the amount of modeling (JOINs etc.) needed in modeling, while increasing the value of each event, and the sophistication of the possible use cases.

The entities you provide are validated against their schemas as the event is processed (during the enrich phase). If there is a mistake or mismatch, the event is processed as a Bad Event.

Once defined, an entity can be attached to any kind of event. This is also an important point; it means your tracking is as [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) as possible. Using the same "user" or "image" or "search result" (etc.) entities throughout your tracking reduces error, and again makes the data easier to model.

Example:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

```ruby
# Tracking a screen view with context made up of two entities
entity1 = SnowplowTracker::SelfDescribingJson.new(
  'iglu:com.my_company/movie_poster/jsonschema/1-0-0',
  { 'movie_name' => 'Solaris',
    'poster_country' => 'JP',
    'poster_year$dt' => Date.new(1978, 1, 1) }
)
entity2 = SnowplowTracker::SelfDescribingJson.new(
  'iglu:com.my_company/customer/jsonschema/1-0-0',
  { 'p_buy' => 0.23,
    'segment' => 'young adult' }
)

tracker.track_screen_view(id: 'sci-123-abc', context: [entity1, entity2])
```
  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

```ruby
# Tracking a screen view with context made up of two entities
entity1 = SnowplowTracker::SelfDescribingJson.new(
  'iglu:com.my_company/movie_poster/jsonschema/1-0-0',
  { 'movie_name' => 'Solaris',
    'poster_country' => 'JP',
    'poster_year$dt' => Date.new(1978, 1, 1) }
)
entity2 = SnowplowTracker::SelfDescribingJson.new(
  'iglu:com.my_company/customer/jsonschema/1-0-0',
  { 'p_buy' => 0.23,
    'segment' => 'young adult' }
)

tracker.track_screen_view(nil, 'sci-123-abc', [entity1, entity2])
```

  </TabItem>
</Tabs>

:::note
The event context is always an array, even if you are only adding one entity.
:::

## Adding user and platform data with Subject

Subject objects store information about the user associated with the event, such as their `user_id`, what type of device they used, or what size screen that device had. Also, they store which platform the event occurred on - e.g. server-side app, mobile, games console, etc.

Each Tracker is initialized with a Subject. This means that every event by default has the platform `srv`: server-side app. Platform is the only preset Subject parameter, which can be overriden using the `set_platform` method. All other parameters must be set manually. This can be done directly on the Subject, or, if it is associated with a Tracker, via the Tracker, which has access to all the methods of its Subject.

Your server-side code may not have access to all these parameters, or they might not be useful to you. All the Subject parameters are optional, except `platform`.

You could create and define a new Subject for every user or every event you want to track. Attaching that Subject to the `track_x_event` method call would add those properties to your event. Alternatively, you could swap the tracker-associated Subject for a more appropriate one before tracking the event, using `set_subject`.

The following table lists all the properties that can be set via Subject. These are all part of the [Snowplow Tracker Protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md). Check out the [API docs](https://snowplow.github.io/snowplow-ruby-tracker/SnowplowTracker/Subject.html) for the details of how to set these parameters.

| Property | **Description** |
| --- | --- |
| `platform` | The platform the app runs on |
| `user_id` | Unique identifier for user |
| `domain_userid` | Cookie-based unique identifier for user |
| `network_userid` | Cookie-based unique identifier for user |
| `domain_sessionid` | Cookie-based unique identifier for a visit/session of a `user_id` |
| `domain_sessionidx` | Cookie-based count of separate visits/sessions from a `user_id` |
| `user_fingerprint` | User identifier based on (hopefully unique) browser features |
| `user_ipaddress` | User's IP address |
| `useragent` | User agent or browser string |
| `br_lang` | The device/browser language |
| `os_timezone` | The device OS's timezone |
| `dvce_screenheight` and `dvce_screenwidth` | The device screen resolution |
| `br_viewwidth` and `br_viewheight` | The browser viewport size |
| `br_colordepth` | The browser color depth |

:::note
The methods for defining `domain_sessionid` and `domain_sessionidx` were added in tracker version 0.7.0.
:::

Example:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

:::note
The ability to add `Subject` objects to `track_x_event` method calls (option 1 below) was added in version 0.7.0.
:::

```ruby
# Creating a Subject and adding user data
subject = SnowplowTracker::Subject.new
subject.set_user_id('12345').set_timezone('Europe/London')

# Different ways to add Subject properties to an event
# 1. Providing the Subject as an argument
tracker.track_page_view(page_url: 'www.example.com', subject: subject)

# 2. Swapping the tracker-associated Subject for the new one
# This will affect all subsequent events tracked
tracker.set_subject(subject).track_page_view(page_url: 'www.example.com')

# 3. Setting the user data directly on the tracker-associated Subject
# This will affect all subsequent events tracked
tracker.set_user_id('12345').set_timezone('Europe/London')
tracker.track_page_view(page_url: 'www.example.com')
```
  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

```ruby
# Creating a Subject and adding user data
subject = SnowplowTracker::Subject.new
subject.set_user_id('12345').set_timezone('Europe/London')

# Different ways to add Subject properties to an event
# Either way will affect all subsequent events tracked
# 1. Swapping the tracker-associated Subject for the new one
tracker.set_subject(subject).track_page_view('www.example.com')

# 2. Setting the user data directly on the tracker-associated Subject
tracker.set_user_id('12345').set_timezone('Europe/London')
tracker.track_page_view('www.example.com')
```
  </TabItem>
</Tabs>

### Cookie-based user properties

Several of the user properties listed in the above table are relevant only to web apps, and are intended to derive from cookies. The Snowplow cookies are explained on [this page](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/cookies-and-local-storage/index.md). The client-side Snowplow JavaScript tracker sets first-party cookies, and the event collector sets a third-party cookie. As a server-side tracker, the Ruby tracker doesn't automatically have access to cookies. However, these properties can be extremely useful, e.g. in stitching events together from individual users, or for matching server-side events with client-side events.

Read more about sharing data between client-side and server-side trackers in this [blog post](https://snowplowanalytics.com/blog/2021/11/09/the-unrivaled-power-of-joining-client-and-server-side-tracking/).

If you have implemented the Ruby tracker as well as the JavaScript tracker in your web app, you could extract the values from the cookies, and set them in your Ruby events using these Subject methods. An example of this is included for `domain_user_id` in our [demo Rails app](https://github.com/snowplow-incubator/snowplow-ruby-tracker-examples).

Extracting the `domain_user_id` from the `_sp_id` cookie in Rails:

```ruby
def snowplow_domain_userid
  sp_cookie = cookies.find { |key, _value| key =~ /^_sp_id/ }
  sp_cookie.last.split(".").first if sp_cookie.present?
end
```

Similarly, the `domain_session_id` and `domain_session_idx` values are saved in the first-party `_sp_ses` and `_sp_id` cookies. If you configured the JavaScript tracker with a different “cookieName” option, then these cookies will be named differently.

The `network_user_id` derives from the event collector's third-party cookie, hence the name "network" as it is set at a network level. It is the server-side user identifier. The cookie is named `sp` (Snowplow Micro pipelines call it `micro` instead). The default behavior is for the collector to provide a new cookie/network user ID for each event it receives. You can override the collector cookie's value with your own generated ID using the `set_network_user_id` method.

The user fingerprint is also a client-side concept. The JavaScript Tracker generates a fingerprint based on browser features and attaches it to all client-side events. You could develop your own fingerprints to attach to your Ruby server-side events with `set_fingerprint`.

## Adding page data with Page

If the Ruby tracker is incorporated into a website server, the events tracked will describe user activity on specific webpages. Knowing on which page an event occurred can be very valuable.

Add page URL, page title and referrer URL to any event by adding a Page object to any `track_x_event` method call. These parameters, of course, form the basis of the page view event. By directly adding page details to your other event types, you can avoid needing to JOIN onto your page view events to find out where they occurred.

Example:

```ruby
# Adding Page data to a struct event
page = SnowplowTracker::Page.new(page_url: 'http://www.example.com/register')

tracker.track_struct_event(category: 'forms',
                           action: 'start-input',
                           page: page)
```

The Page class was added in tracker version 0.7.0.

## Event timestamps

Processed Snowplow events have five different timestamps. They can have either `dvce_created_tstamp` or `true_tstamp`.

| **Timestamp name** | **Description** |
| --- | --- |
| `dvce_created_tstamp` | Added during event creation |
| `true_tstamp` | This can be manually set as an alternative to `dvce_created_tstamp` |
| `dvce_sent_tstamp` | Added by the Emitter on event sending |
| `collector_tstamp` | Added by the event collector |
| `etl_tstamp` | Added after event enrichment during the processing pipeline |
| `derived_tstamp` | Either a calculated value (`collector_tstamp - (dvce_sent_tstamp - dvce_created_tstamp)`) or the same as `true_tstamp` |

Overriding the default event timestamp (`dvce_created_tstamp`) can be useful in some situations. For example, if the Snowplow event refers to an action that happened previously but is only now being tracked. This can be achieved using the Ruby tracker classes DeviceTimestamp and TrueTimestamp (see [API docs](https://snowplow.github.io/snowplow-ruby-tracker/SnowplowTracker/Timestamp.html)).

This [Discourse forums post](https://discourse.snowplow.io/t/which-timestamp-is-the-best-to-see-when-an-event-occurred/538) explains why you may wish to use `derived_tstamp` as the main event timestamp rather than `dvce_created_tstamp`.
