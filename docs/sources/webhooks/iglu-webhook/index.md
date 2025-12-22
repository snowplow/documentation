---
title: "Iglu webhook"
date: "2020-02-25"
sidebar_position: 30
---

This webhook adapter lets you track events sent via a `GET` or `POST` request containing an [Iglu](https://github.com/snowplow/iglu)\-compatible event payload.

You can use this adapter with vendors who allow you define your **own** event types for "postback" events or custom Webhook events.

## Setup

Integrating Iglu-compatible webhooks into Snowplow is a two-stage process:

1. Configure your third-party system to send Iglu-compatible events to Snowplow
2. Setup the appropriate JSON Schema for each Iglu-compatible event you are sending through

## Your webhook

The Iglu webhook adapter supports events send in as `GET` and `POST` requests.

### Path

We use a special path to tell Snowplow that these events should be parsed as Iglu self-describing JSON events:

```markup
http://{{COLLECTOR_URL}}/com.snowplowanalytics.iglu/v1?schema=<iglu schema uri>&...
```

### Required fields

You can send in whatever name-value pairs on the querystring that make sense for your event, but you **must** also include a `schema` parameter, which is set to a valid Iglu self-describing schema URI.

The below examples all use a schema available on Iglu Central. However, you will likely want to create your own schema that describes the event for the platform you are receiving data from.

The below examples use the `social_interaction` schema:

```text
iglu:com.snowplowanalytics.snowplow/social_interaction/jsonschema/1-0-0
```

### Optional fields

If you want to specify which app these events belong to, add an `aid` parameter as taken from the [Snowplow Tracker Protocol](/docs/events/index.md#application-parameters):

```text
...&aid=<company code>&...
```

You can also manually override the event's `platform` parameter like so:

```text
...&p=<platform code>&...
```

Supported platform codes can again be found in the [Snowplow Tracker Protocol](/docs/events/index.md#application-parameters); if not set, then the value for `platform` will default to `srv` for a server-side application.

### Example `GET` request

Here is an example of an Iglu-compatible event sent as a `GET` request, for a [Social Interacton event](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/social_interaction/jsonschema/1-0-0), broken out onto multiple lines to make it easier to read:

```markup
http://{{COLLECTOR_URL}}/com.snowplowanalytics.iglu/v1?schema=iglu%3Acom.snowplowanalytics.snowplow%2Fsocial_interaction%2Fjsonschema%2F1-0-0
  &aid=mobile-attribution
  &p=mob
  &network=twitter
  &action=retweet
```

This will be converted by the Iglu webhook adapter into a self-describing JSON looking like this:

```json
{
  "schema":"iglu:com.snowplowanalytics.snowplow/social_interaction/jsonschema/1-0-0",
  "data": {
    "network": "twitter",
    "action": "retweet"
  }
}
```

The Snowplow enriched event containing this JSON will include `app_id` set to "mobile-attribution" and `platform` set to "mob".

### Example `POST` requests

POST requests can be compiled in three different ways for the Iglu webhook:

- As a full Self Describing JSON in the body
- With a `?schema=<iglu schema uri>` in the querystring and JSON in the body
- As a `x-www-form-urlencoded` payload

**NOTE**: For the event to be accepted the `Content-Type` must be either:

- `application/json`
- `application/json; charset=utf-8`
- `application/x-www-form-urlencoded`

The below examples are written as `curl` requests as an example, however you can send the events using any tool or technology that supports sending POST requests.

To send as a full Self Describing JSON in the body and a Content-Type of `application/json`:

```bash
curl --request POST \
   --url http://{{COLLECTOR_URL}}/com.snowplowanalytics.iglu/v1 \
   --header 'Content-Type: application/json' \
   --data '{
   "schema":"iglu:com.snowplowanalytics.snowplow/social_interaction/jsonschema/1-0-0",
   "data": {
         "network": "twitter",
         "action": "retweet"
     }
 }'
```

To send with a `?schema=<iglu schema uri>` in the querystring and a data JSON in the body and Content-Type of `application/json`:

```bash
curl --request POST \
   --url 'http://{{COLLECTOR_URL}}/com.snowplowanalytics.iglu/v1?schema=iglu%3Acom.snowplowanalytics.snowplow%2Fsocial_interaction%2Fjsonschema%2F1-0-0' \
   --header 'Content-Type: application/json' \
   --data '{
   "network": "twitter",
   "action": "retweet"
 }'
```

To send as a `x-www-form-urlencoded` payload:

```bash
curl --request POST \
   --url 'http://{{COLLECTOR_URL}}/com.snowplowanalytics.iglu/v1?schema=iglu%3Acom.snowplowanalytics.snowplow%2Fsocial_interaction%2Fjsonschema%2F1-0-0' \
   --header 'Content-Type: application/x-www-form-urlencoded' \
   --data 'network=twitter&action=retweet'
```

As with the `GET` request above you can also attach extra information into the querystring to help describe your event. The following parameters can be added:

- `aid=` : The application ID
- `p=` : The platform
- `nuid=` : The network user ID
- `eid=` : A custom event ID
- `ttm=` : The true timestamp
- `url=` : The page URL
- `cv=` : The context vendor (deprecated)
