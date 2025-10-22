---
position: 4
title: Define interventions
description: "Create rule-based interventions that trigger personalized experiences based on user behavior."
---

[Interventions](/docs/signals/concepts/#interventions) are rules that trigger when user attributes meet specific conditions. They enable real-time personalization by activating experiences based on current behavior.

When an intervention triggers:

1. Signals evaluates attribute values in real time
2. If the criteria are met, the intervention activates
3. Your Web application can receive intervention notifications via the [browser tracker plugin](/docs/signals/receive-interventions/#using-the-browser-tracker-plugin) directly on the frontend
   * This uses a Server-Sent Events (SSE) connection for real-time streaming

In this section, you'll create three interventions for common ecommerce scenarios: cart abandonment, discount offers for engaged browsers, and free shipping promotions.

## Import intervention classes

Add the intervention-related imports to your notebook:

```python
from snowplow_signals import (
    RuleIntervention,
    InterventionCriterion,
    LinkAttributeKey,
)
```

## Define intervention rules

These [rule-based interventions](/docs/signals/define-interventions/using-python-sdk/) will be triggered automatically when their criteria are met.

Each `InterventionCriterion` specifies:

* `attribute`: the attribute to evaluate, in the format `group_name:attribute_name`
* `operator`: the comparison operator (`>`, `<`, `>=`, `<=`, `==`, `!=`)
* `value`: the threshold value for comparison

### Cart abandonment intervention

This intervention triggers when a user has added items to their cart but hasn't completed checkout:

```python
cart_abandonment_intervention = RuleIntervention(
    name="cart_abandonment",
    description="Show banner to users who have added at least one item to cart.",
    criteria=InterventionCriterion(
        attribute="ecom_attributes:count_add_to_cart",
        operator=">",
        value=0,
    ),
    target_attribute_keys=[
        LinkAttributeKey(name="user_id"),
        LinkAttributeKey(name="domain_userid"),
    ],
    owner="user@company.com",
)
```

Key components:

* **`criteria`**: triggers when `count_add_to_cart > 0`.
* **`target_attribute_keys`**: specifies which user identifiers to use when matching interventions. This intervention targets both the authenticated `user_id` and anonymous `domain_userid` identifiers, to reach as many users as possible.

### Discount intervention

This intervention offers a discount to users who are actively browsing products:

```python
discount_intervention = RuleIntervention(
    name="discount",
    description="Show banner to users who have viewed more than 3 products.",
    criteria=InterventionCriterion(
        attribute="ecom_attributes:count_product_views",
        operator=">",
        value=3,
    ),
    target_attribute_keys=[
        LinkAttributeKey(name="user_id"),
        LinkAttributeKey(name="domain_userid"),
    ],
    owner="user@company.com",
)
```

This intervention activates after a user views more than three products, indicating high purchase intent.

### Free shipping intervention

This intervention encourages larger purchases by offering free shipping:

```python
free_shipping_intervention = RuleIntervention(
    name="free_shipping",
    description="Show banner to users who plan to spend at least $100.",
    criteria=InterventionCriterion(
        attribute="ecom_attributes:total_cart_value",
        operator=">",
        value=100,
    ),
    target_attribute_keys=[
        LinkAttributeKey(name="user_id"),
        LinkAttributeKey(name="domain_userid"),
    ],
    owner="user@company.com",
)
```

This triggers when the cart value exceeds $100, incentivizing users to complete their purchase.

## Publish the interventions

Publish all three interventions to your Signals Sandbox:

```python
sp_signals.publish(
    [
        cart_abandonment_intervention,
        discount_intervention,
        free_shipping_intervention,
    ]
)
```

Once published, these interventions are active and will trigger in real time as users interact with your application.

In the next section, you'll use the demo e-shop application to see these interventions in action. The app uses the [browser tracker plugin](/docs/signals/receive-interventions/#using-the-browser-tracker-plugin) to automatically receive and display intervention banners when they trigger.
