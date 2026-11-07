---
title: "Pull attributes or push interventions"
sidebar_position: 10
sidebar_label: "Pull and push"
description: "Signals delivers calculated attributes to your applications in two ways: your application pulls attribute values when it needs them, or Signals pushes interventions when a user meets trigger criteria."
keywords: ["signals services", "signals interventions", "pull vs push", "retrieve attributes", "subscribe interventions"]
date: "2026-11-06"
content_type: concept
---

Signals calculates attributes and stores them in the Profiles Store. Your application gets those values in one of two ways. It can **pull** attribute values when it needs them, through a [service](/docs/signals/applications/services/index.md). Or it can subscribe to [interventions](/docs/signals/interventions/index.md), and Signals **pushes** a payload to it when a user meets the criteria you defined.

Pull suits decisions your application makes at a moment it controls, such as rendering a page or answering a chatbot message. Push suits reactions to user behavior that can happen at any time, such as a user hesitating over a cart. Many applications use both: pull to personalize what the user sees, push to react when something changes.

## How each pattern works

Both patterns start the same way. A tracker sends events, Signals calculates attributes from them, and the [Profiles Store](/docs/signals/concepts/index.md#profiles-store) holds the latest values. They differ in who starts the exchange.

When your application pulls attributes:

1. Your application decides it needs attribute values, for example when a page loads
2. It asks Signals for the values of a service, or of an attribute group, for one attribute key ID, such as the current `domain_sessionid`
3. Signals returns the current values from the Profiles Store
4. Your application uses the values in its own logic

When Signals pushes interventions:

1. Your application subscribes to interventions for one or more attribute key IDs, such as the current `domain_userid` and `domain_sessionid`
2. Signals updates attribute values as events arrive
3. Signals checks each update against the criteria of your published interventions
4. The first time a user meets an intervention's criteria, Signals sends the intervention payload to the subscribed application
5. Your application acts on the payload

An intervention is sent only the first time its criteria are met, not every time an attribute changes. Subscriptions are by attribute key ID, not by intervention, so a subscription receives every intervention that targets that ID.

## Compare pull and push

This table summarizes the differences.

| | Pull: services and attribute groups | Push: interventions |
| --- | --- | --- |
| Who starts it | Your application, when it requests values | Signals, when criteria are met |
| What your application receives | Current attribute values | An intervention payload |
| Decision logic | In your application code | In the intervention criteria, defined in Signals |
| How often | Every request returns current values | Once, the first time the criteria are met |
| How to receive it | [Retrieve attributes](/docs/signals/applications/retrieve-attributes/index.md) with the Python SDK, Node.js SDK, or Signals API | [Subscribe](/docs/signals/applications/subscribe/index.md) with the Python SDK, the browser tracker plugin, or the Signals API |
| Versioning | A service pins specific attribute group versions | Criteria use the latest published version of each attribute group |

Agents can also pull: an agent can read attribute groups and [agentic contexts](/docs/signals/applications/agentic-contexts/index.md) as tools through the [Signals MCP server](/docs/signals/applications/mcp-server/index.md).

## Example

An online store calculates `product_view_count_last_10_min` for each session, in an attribute group with the `domain_sessionid` attribute key.

With pull, the product page calls a service when it loads and reads the session's `product_view_count_last_10_min`. If the value is high, the page shows a "Recently viewed" panel. The application decides what to do, and it asks again on the next page load.

With push, the store defines an intervention with the criteria `product_view_count_last_10_min >= 5` and a name, such as `discount_offer`, that the page recognizes. The browser subscribes to interventions for the current `domain_sessionid`. When the fifth product view arrives, Signals updates the attribute, sees that the criteria are met, and sends the payload: the intervention name plus the attribute values you chose to send with it. The page recognizes `discount_offer` and shows the offer, whose content lives in the page, not in the intervention. Signals doesn't send it again for that session.

For an ecommerce app that reacts to interventions, see [Implement real-time interventions](/tutorials/signals-interventions/start).

## Related concepts

These pages cover the parts of each pattern in more detail:

* [Services](/docs/signals/concepts/index.md#services) explain why production applications should pull through a service rather than directly from attribute groups
* [Interventions](/docs/signals/concepts/index.md#interventions) cover rule-based and direct interventions, targeting, and subscriptions
* [Attribute keys](/docs/signals/attributes/attribute-keys/index.md) are the IDs that both patterns use to identify the user, session, or other entity
* The [subscription delivery example](/docs/signals/applications/subscribe/index.md#delivery-example) walks through the send-once rule with two interventions
