---
title: "Move to native Snowplow tracking"
sidebar_label: "Move to native tracking"
sidebar_position: 50
description: "Replace external_event with your own Snowplow schemas one event at a time, and keep your Signals attributes working while you do."
keywords: ["native tracking", "external_event", "migration", "self-describing events", "signals attributes", "domain_userid"]
date: "2026-11-13"
content_type: how-to
---

An adapter gets your existing events into Signals without retagging, but every event without a standard Snowplow schema arrives as [`external_event`](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md), with a fixed set of typed fields. When you need a property that doesn't fit those fields, or want an event validated against its own schema, you can replace that event with native Snowplow tracking. You don't have to move everything at once: replace one event, check its attributes, then move to the next.

How smoothly this goes depends on your approach:

| Approach | Visitor ID after the move | What happens to attributes keyed on `domain_userid` |
| --- | --- | --- |
| Client-side, running the Snowplow tracker | The same: the adapter already uses the tracker's own cookie | They carry over |
| Server-side | Changes: `domain_userid` was your tool's ID, and the tracker sets its own | They start again from empty, unless you bridge them |

## What stays and what changes

Page views, ecommerce events, site searches and identify calls already arrive as standard Snowplow events, so they don't need to move. Attributes that read them keep working as they are.

What you move is the `external_event` rung: your own event names, group and alias calls, and any ecommerce event that fell back to `external_event` because it lacked a required field. For each one, you:

1. Create a schema for the event.
2. Track it with the Snowplow tracker.
3. Stop the adapter from forwarding it.
4. Update the attributes that read it.

## Step 1: Create a schema for the event

Find the event's name in your tool's tracking plan, and create a schema with the properties you want to keep. For example, a `Signup Form Submitted` event that arrived as:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0",
  "data": {
    "name": "Signup Form Submitted",
    "tool": "segment",
    "kind": "track",
    "search_term": "snowplow signals",
    "plan": "pro"
  }
}
```

could become a schema of your own, with the plan and the form's source page declared as properties:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "A visitor submitted the signup form",
  "self": {
    "vendor": "com.acme",
    "name": "signup_form_submitted",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "plan": { "type": ["string", "null"], "maxLength": 255 },
    "form_location": { "type": ["string", "null"], "maxLength": 255 }
  },
  "additionalProperties": false
}
```

Create and deploy it as a [data structure](/docs/event-studio/data-structures/create/index.md) in Console. Don't include personal data such as an email address unless your privacy review allows it: the adapters keep email out of Snowplow, and native tracking shouldn't undo that.

## Step 2: Track the event with the Snowplow tracker

### On a client-side approach

The adapter already loads the Snowplow JavaScript tracker in your page. Call the same tracker from your code where the event happens:

```javascript
window.snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.acme/signup_form_submitted/jsonschema/1-0-0',
    data: { plan: 'pro', form_location: 'pricing' },
  },
});
```

Use the tracker the adapter set up, not a second one. The visitor ID lives in the tracker's first-party cookie, so as long as your calls go through the same tracker, with the same `cookieName` and cookie domain, `domain_userid` and `domain_sessionid` stay the same. A tracker with a different cookie name sets a new ID and splits the visitor's attributes in two.

### On a server-side approach

There is no Snowplow tracker in the page yet. You can add one and track the event natively, but the tracker sets its own random `domain_userid`, which is not your tool's ID. See [Keep attributes on a server-side approach](#keep-attributes-on-a-server-side-approach) before you switch.

For events that come from your servers or apps rather than the browser, use the Snowplow tracker for that platform.

## Step 3: Stop the adapter from forwarding the event

If your tool still receives the event, the adapter will keep forwarding it as `external_event`, and the event will be counted twice. Stop the adapter from forwarding it once native tracking ships.

On [Segment's client-side plugin](/docs/signals/data-sources/existing-analytics/tools/segment/index.md#set-up-the-client-side-approach), for example, the change is a check at the top of the function that handles each call:

```javascript
const nativelyTracked = ['Signup Form Submitted'];

snowplowDestination[method] = async (ctx) => {
  const ev = ctx.event;
  if (ev.type === 'track' && nativelyTracked.includes(ev.event)) return ctx;
  // ...the rest of the adapter, unchanged
};
```

Returning `ctx` lets Segment carry on delivering the event to its other destinations.

## Step 4: Update the attributes that read the event

Changing an attribute's definition means publishing a new version of its attribute group. A new version calculates from the moment you publish it, so plan the overlap:

1. Add a new version that reads both the old `external_event` and the new native event.
2. Publish it alongside the old version, and if you have a warehouse connection, backfill it from a date before the switch. Backfill reads your atomic events table, which already holds the `external_event` history.
3. Move your services to the new version, then unpublish the old one.

For the funnel group on the [starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#funnel) page, the new version of `signup_submitted` could read both events:

```python
from datetime import datetime, timezone

from snowplow_signals import AtomicProperty, Attribute, Criteria, Criterion, Event, EventProperty, StreamAttributeGroup, domain_userid

external_event = Event(vendor="com.snowplowanalytics.snowplow", name="external_event", version="1-0-0")
signup_form_submitted = Event(vendor="com.acme", name="signup_form_submitted", version="1-0-0")

signup_submitted = Attribute(
    name="signup_submitted",
    type="int32",
    events=[external_event, signup_form_submitted],
    aggregation="counter",
    criteria=Criteria(
        any=[
            Criterion.eq(
                EventProperty(
                    vendor="com.snowplowanalytics.snowplow",
                    name="external_event",
                    major_version=1,
                    path="name",
                ),
                "Signup Form Submitted",
            ),
            Criterion.eq(AtomicProperty(name="event_name"), "signup_form_submitted"),
        ]
    ),
    default_value=0,
)

funnel_v2 = StreamAttributeGroup(
    name="funnel",
    version=2,
    attribute_key=domain_userid,
    owner="user@company.com",
    attributes=[signup_submitted],  # plus the group's other attributes, unchanged
    backfill_since_tstamp=datetime(2026, 1, 1, tzinfo=timezone.utc),
)
```

Once the `external_event` version of the event has aged out of every attribute's period, you can drop it from the definition in a later version.

You can add attributes on the properties the native schema declares, such as the form location, which `external_event` had no field for.

## Keep attributes on a server-side approach

On a server-side approach, `domain_userid` holds your tool's visitor ID, for example Segment's `anonymousId` or Amplitude's `device_id`. Native tracking in the browser sets Snowplow's own ID instead, so attributes keyed on `domain_userid` start again from empty for every visitor. You have three options:

- **Accept the reset.** For attributes with a short period, such as a 7-day count, the gap closes after one period.
- **Move to the client-side approach first.** Where your tool has one, it runs the Snowplow tracker and keeps your tool's ID in the [`external_identity`](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md) entity. Attributes reset once, at that switch, and after that native tracking keeps the same ID. You also gain sessions and page pings.
- **Key on your tool's ID.** A custom attribute key on `external_identity.anonymous_id` keeps counting on your tool's ID, as long as every event carries the entity, so attach it to your native tracker calls too. This ID is your tool's, so the [guidance on public keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md) still applies: never use a GA client ID, an Adobe ECID, Amplitude's `device_id` or Segment's `anonymousId` on the public intervention endpoint.

```python
from snowplow_signals import AttributeKey, EntityProperty

tool_visitor_key = AttributeKey(
    name="external_anonymous_id",
    description="The visitor ID assigned by the source tool",
    property=EntityProperty(
        vendor="com.snowplowanalytics.snowplow",
        name="external_identity",
        major_version=1,
        path="anonymous_id",
    ),
)
```

If your pipeline has Snowplow Identities, attributes keyed on `snowplow_id` can follow a visitor across `domain_userid` and `user_id`. See [Identifiers and attribute keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).

Amplitude's client-side plugin can also post directly to the Collector without the Snowplow tracker. In that mode, `domain_userid` is Amplitude's `device_id`, so moving to native tracking behaves like a server-side approach.

Where to go next:

- [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md)
- [external_event reference](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md)
- [Identifiers and attribute keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md)
