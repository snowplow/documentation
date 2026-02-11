---
title: "Interventions"
sidebar_position: 30
sidebar_label: "Interventions"
description: "Learn about interventions, automated triggers for taking actions based on user behavior, including targeting, subscribing, and the different types of interventions."
keywords: ["interventions", "targeting", "subscribing", "rule-based", "direct"]
date: "2026-02-04"
---

Interventions are opportunities to take actions to improve user outcomes. They're automated triggers fired by changes in attribute values, or by your own applications.

They can be thought of as "if-then" rules that run in real time. For example:
* `If` a user has viewed five products in the last ten minutes
* `Then` automatically send that user a personalized offer

In practice, this rule could work like this:
1. User views product pages
2. The application tracks the user behavior and sends events
3. Signals evaluates the events and updates attribute values
4. Signals checks whether the new attribute values meet any intervention conditions
5. The attribute `product_view_count_last_10_min` has just been updated to `5`, matching the intervention's trigger criteria
6. The application receives the subscribed intervention payload
7. The application sends a personalized offer to the user

Interventions are usually relevant only within a certain moment. Therefore, an intervention is sent only the first time the criteria are met.

Standard rule-based interventions can have multiple conditions, or trigger criteria, based on the values of different attributes.

## Targeting

Interventions are targeted based on attribute keys, which determine both the scope and specificity of when they're delivered.

:::note Key constraints
Interventions can be defined against any attribute key, as long as its values are non-enumerable. For example, the built-in Snowplow attribute keys `domain_userid`, `domain_sessionid`, and `network_userid` are suitable targets since their values are canonically formatted UUIDs, e.g. `8c9104e3-c300-4b20-82f2-93b7fa0b8feb`.
:::

For individual-level targeting, use user-specific attribute keys. For example, use `domain_userid` to target individual users, or `domain_sessionid` to target users during specific sessions, when session-level conditions are met.

For broadcast-level targeting, use attribute keys related to the application context. For example, you could use `campaign_id` to target all users who arrived from a specific marketing campaign.

Interventions can have multiple attribute keys. By default, the intervention will target the attribute keys associated with their criteria attributes.

Custom targeting can be useful when you have broad criteria but want a more narrow target. For example, if your criteria use a broad attribute like `page_id`, you might not want to send the intervention to everyone on that page. If you're also checking user-specific criteria, target `domain_userid` to reach only the specific user who meets all conditions.

Another use for custom targeting is when you want to target an attribute key that's available in the triggering event, but isn't part of your intervention logic. For example, to send an intervention to a `domain_userid` when they do a certain number of things in a single `pageview_id`. By targeting the user rather than the page, you can ensure that the intervention is received even if they've gone onto a new page by the time the triggering event is processed, or if the application is not subscribed to the `pageview_id`.

## Subscribing

To receive and take action on interventions, you'll need to:
* [Subscribe](/docs/signals/receive-interventions/index.md) to them within your application
* Define the logic of how the application should react

:::note Attribute key IDs
Subscription is by attribute key, not by intervention.

A subscription using a specific attribute key ID, for example a `domain_userid` ID for the current user, will receive all triggered interventions for that ID.
:::

Once subscribed, all triggered interventions will be streamed to the consumer application.

For back-end applications using the [Signals Python SDK](https://pypi.org/project/snowplow-signals/), [Signals Node.js SDK](https://www.npmjs.com/package/@snowplow/signals-node), or [Signals API](/docs/signals/connection/index.md#signals-api), subscribe within the application code by passing in the relevant attribute key IDs. For web applications, use the [Signals browser plugin](/docs/signals/receive-interventions/index.md) for the JavaScript tracker to subscribe automatically to relevant interventions.

## Targeting example

As an example, consider these two interventions:
* `intervention1` targets the `domain_userid` and `domain_sessionid` attribute keys
  * It has two criteria rules, where `any` must be met
  * The first rule is: `attribute_group1:page_view_count == 10`
  * The second rule is: `attribute_group2:ad_count is not null`
* `intervention2` targets the `domain_userid` attribute key
  * It has one criteria rule, `attribute_group3:button_click_count > 20`

To receive interventions for the current user and session, subscribe to their interventions by providing the `domain_userid` and `domain_sessionid` ID values.

Interventions will be triggered when:
* The user views 10 pages, **or** the session has an ad event
  * `intervention1` will be delivered to one of the subscribed targets.
  * Signals will initially create a payload for each target. However, they'll have the same ID as they're triggered by a single event, and will be deduped.
* The user exceeds 20 button clicks for the first time
  * `intervention2` will be delivered to the subscribed user.

Assuming it's the user's first session, the flow looks like this:
* First page view
* First ad event
  * `intervention1` is triggered and delivered to one of the targets
* More page views, button clicks, and ad events
* Tenth page view
  * Nothing happens: because `intervention1` sent already on seeing the ad event in this session, it's not triggered again
* Twenty-first button click
  * The attribute value changes from 20 to 21, crossing the required threshold
  * `intervention2` is triggered and delivered to the user target
* Twenty-second button click
  * Nothing happens: the threshold has already passed

This user has already seen more than 10 pages, so `intervention1` can never be triggered by that rule for them. However, if their current session expires, and the application subscribes to their new `domain_sessionid` ID, `intervention1` can be triggered again by the first ad event of the session.

Likewise, the user has already clicked a button more than 20 times, so `intervention2` will never be sent to them again.

## Types of intervention

Signals has two types of interventions: rule-based or direct.

**Rule-based** interventions are the default, and are:
* Based on attribute values
* Defined in advance via Snowplow Console, Python SDK, or API
* Triggered automatically when their criteria are met

Use cases include:
* Real-time personalization
* Agentic chatbots
* Dynamic pricing

**Direct** interventions are:
* Not based on attribute values or rules
* Configurable only via the Python SDK or API
* Sent directly on pushing an intervention configuration to Signals

Use cases for direct interventions include:
* Emergency notifications, e.g. system outages
* Real-time business decisions, e.g. breaking news
* Manual campaign targeting
* Sensitive communications requiring authentication or authorization

:::info Intervention endpoints

Direct interventions use the [Signals API](/docs/signals/connection/index.md#signals-api) `api/v1/registry/interventions` endpoints under the hood. These endpoints check that the submitted bearer token in the API call is valid and authorized.

Conversely, subscription to automated rule-based interventions uses the `api/v1/interventions` endpoint. This endpoint is public: it doesn't perform authentication or authorization, just checks for the requested attribute keys.

:::
