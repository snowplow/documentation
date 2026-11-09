---
title: "Define formula attributes"
sidebar_position: 15
sidebar_label: "Formula attributes"
description: "Combine the attributes in a stream attribute group into ratios, weighted scores, flags, and tiers with formula attributes. Signals works out each formula when the attributes are read, so nothing extra is stored."
keywords: ["formula attributes", "attribute formulas", "ratio attributes", "weighted score", "case when", "fallback value", "python sdk formula attribute"]
date: "2026-10-30"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

A formula attribute combines other [attributes](/docs/signals/attributes/attributes/index.md) in the same [attribute group](/docs/signals/attributes/attribute-groups/index.md) into a new value, for example `carts_abandoned / carts_created`. Signals works out the value each time the attribute is read. Nothing is stored for a formula attribute, so a change to the formula, an expired input, or a backfilled input is reflected the next time you read it.

You read a formula attribute the same way as any other attribute: [retrieve it from a service](/docs/signals/applications/retrieve-attributes/index.md) or from its attribute group, or reference it in [intervention criteria](/docs/signals/interventions/index.md#criteria).

:::note[Requirements]
Formula attributes work on [stream attribute groups](/docs/signals/attributes/attribute-groups/index.md#stream) only, including groups with a backfill. To define them in code you need version 0.5.0 or later of the Signals Python SDK. The feature must also be enabled on your Signals deployment.
:::

## When to use formula attributes

A formula attribute and a [calculated property](/docs/signals/attributes/attributes/index.md#calculated-properties) both combine values, but at different stages. A calculated property combines properties of one event before the attribute's aggregation runs. A formula attribute combines finished attributes after aggregation.

|            | Calculated property                                                                   | Formula attribute                                                           |
| ---------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Combines   | Properties of one event, before aggregation                                           | Attributes of one group, after aggregation                                  |
| Use it for | A per-event value you then aggregate, such as `price * quantity` summed into revenue | Ratios, weighted scores, flags, and tiers from attributes you already have |
| Result     | Feeds the attribute's aggregation                                                     | Number, decimal, true/false, or text, worked out on read and never stored   |

Use a formula attribute when the value you want depends on more than one attribute, such as the share of carts a user abandoned. Neither the numerator nor the denominator exists on a single event, so a calculated property can't express it.

Formula attributes have some limits on where you can use them:
* The intervention [preview](/docs/signals/interventions/index.md#preview) doesn't support criteria on formula attributes yet
* The [ML training dataset builder](/docs/signals/ml-training-datasets/index.md) doesn't include formula attributes as features
* An attribute group can't contain only formula attributes: it needs at least one attribute calculated from events

## Create a formula attribute

Add formula attributes to a stream attribute group alongside its other attributes. Each formula attribute has a name, a formula, an optional fallback value, and an optional description. Signals works out the result type from the formula.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

Open a stream attribute group for editing. The **Formula attributes** section is below the attributes table.

1. Click **Add formula attribute**.
2. Enter a **Name**. It must be unique within the group and can contain letters, digits, and underscores.
3. Type the **Formula**. As you type, Console suggests the names of the group's attributes, keywords such as `CASE`, `AND`, `OR`, and `NOT`, and function names. If an attribute name needs double quotes, the suggestion adds them.
4. Check the **Result type** badge. Console checks the formula as you type and shows **Number**, **Decimal**, **True/false**, or **Text**. If the formula has a problem, Console highlights the part of the formula that's wrong and shows the error instead of a badge.
5. Optionally, set a **Fallback value**. Signals uses it when the formula has data but no answer, for example a division by zero. See [Handle missing data and fallback values](#handle-missing-data-and-fallback-values).
6. Optionally, add a **Description**.

If the formula check can't run because the attributes above aren't finished, Console shows "Finish the attributes above to check formulas." Fix the attributes first, and the check runs again.

Click **Run preview** to [test the group](/docs/signals/attributes/attribute-groups/index.md#test-attribute-definitions). Each formula attribute appears as a column after the attribute columns, with a **Formula** badge next to its name. Run preview only reads recent events from the last hour, so formula values in the preview can differ from live values, which use each attribute's full history.

Formula attributes are versioned with their group. When you edit a published group, its formula attributes are kept in the new version. If you rename or remove an attribute that a formula uses, Console shows an error on that formula until you update it.

</TabItem>
<TabItem value="sdk" label="Python SDK">

Use the `FormulaAttribute` class, and add it to the group's `attributes` list with the other attributes.

```python
from snowplow_signals import (
    Attribute,
    Event,
    FormulaAttribute,
    StreamAttributeGroup,
    domain_userid,
)

carts_created = Attribute(
    name="carts_created",
    type="int64",
    events=[Event(vendor="com.example", name="cart_created", version="1-0-0")],
    aggregation="counter",
)

purchases = Attribute(
    name="purchases",
    type="int64",
    events=[Event(vendor="com.example", name="purchase", version="1-0-0")],
    aggregation="counter",
)

cart_abandonment_rate = FormulaAttribute(
    name="cart_abandonment_rate",
    expression="max(carts_created - purchases, 0) / carts_created",
    default_value=0,
    description="Share of carts that didn't end in a purchase",
)

cart_behavior = StreamAttributeGroup(
    name="cart_behavior",
    version=1,
    attribute_key=domain_userid,
    owner="user@company.com",
    attributes=[carts_created, purchases, cart_abandonment_rate],
)
```

The table below lists the arguments for `FormulaAttribute`:

| Argument | Description | Type | Required? |
| --- | --- | --- | --- |
| `name` | The name of the formula attribute, unique within the group | `string` | ✅ |
| `expression` | The formula, up to 1000 characters | `string` | ✅ |
| `default_value` | The fallback value, used when the formula has data but no answer | `bool`, `int`, `float`, or `string` | ❌ |
| `description` | A description of the formula attribute | `string` | ❌ |
| `type` | The expected result type: `int64`, `double`, `bool`, or `string`. If you set it, Signals checks it against the type it works out from the formula | `string` | ❌ |

Use `test()` to preview the group. The result has one column per formula attribute, after the attribute columns. The preview reads a sample of events from the last hour, so formula values can differ from live values, which use each attribute's full history.

```python
test_data = sp_signals.test(
    attribute_group=cart_behavior,
    app_ids=["website"],
)
```

Publishing a group from code sets its formula attributes to the ones in your code. A formula attribute that someone added in Console, but that isn't in your code, is removed the next time you publish the group from code.

If the Signals deployment you connect to doesn't support formula attributes, the SDK warns you when you publish a group that has formula attributes.

</TabItem>
</Tabs>

Formula attribute names share a namespace with the group's attributes. Within a [service](/docs/signals/applications/services/index.md), a formula attribute's name must also be different from every attribute and formula attribute in the service's other attribute groups.

## Write formulas

Formulas use a small subset of SQL expression syntax. A formula can reference the group's attributes by name, and can also reference other formula attributes in the same group.

### Names and values

Reference an attribute by its exact name. Names are case-sensitive. Put a name in double quotes if it starts with a digit or is a SQL keyword, for example `"7d_views" / 7` or `"interval" * 2`. Quoting any other name is allowed and makes no difference.

Write numbers as `10`, `0.5`, or `1e3`. Write text in single quotes, such as `'gold'`. To include a single quote in text, double it: `'it''s'` is the text `it's`. The literals `true` and `false` are true/false values. Keywords and function names are case-insensitive, so `case when` and `CASE WHEN` mean the same thing.

You can't use attributes whose type is a list, a dictionary, a timestamp, or bytes in a formula.

### Operators and functions

These operators are available, from the loosest to the tightest binding:

| Operators | Meaning |
| --- | --- |
| `OR` | True if either side is true |
| `AND` | True if both sides are true |
| `NOT` | True if the value is false |
| `=`, `!=`, `<>`, `<`, `<=`, `>`, `>=` | Compare two values. `<>` is the same as `!=` |
| `+`, `-` | Add or subtract |
| `*`, `/` | Multiply or divide |
| `-` (prefix) | Negate a number |

Operators on the same level work from left to right, and parentheses change the order. For example, `a + b * c` means `a + (b * c)`, and `NOT a = b` means `NOT (a = b)`.

Division always gives a decimal: `3 / 2` is `1.5`, even when both sides are whole numbers.

These functions are available:

| Function | Result |
| --- | --- |
| `min(a, b)` | The smallest of the values. Takes two or more arguments |
| `max(a, b)` | The largest of the values. Takes two or more arguments |
| `abs(a)` | The absolute value |
| `round(a)` | `a` rounded to a whole number |
| `round(a, n)` | `a` rounded to `n` decimal places, where `n` is a whole number from 0 to 10. The result is a decimal |
| `coalesce(a, b)` | The first argument that has a value. Takes two or more arguments |

`min` and `max` compare values within one formula, row by row. They aren't aggregations, because the attributes they take are already aggregated.

For conditional values, use `CASE`. Signals checks each `WHEN` condition in order and returns the `THEN` value of the first one that's true. If none is true, it returns the `ELSE` value:

```sql
CASE WHEN total_spend > 1000 THEN 'gold' WHEN total_spend > 100 THEN 'silver' ELSE 'bronze' END
```

Only this form of `CASE` is supported. Write `CASE WHEN plan = 'gold' THEN 1 END`, not `CASE plan WHEN 'gold' THEN 1 END`. There's no `IF` function, and `NULL` isn't supported: use `coalesce` or a fallback value to handle missing data.

You can only use text with `=` and `!=`, as an argument to `coalesce`, or as a `CASE` result. Text comparisons are exact and case-sensitive, so `plan = 'Gold'` is false when `plan` is `gold`.

### Result types

Signals works out each formula's result type from the formula and the types of its inputs:

| Result type | Console badge | Python SDK `type` | Example |
| --- | --- | --- | --- |
| Whole number | **Number** | `int64` | `carts_created + carts_abandoned` |
| Decimal | **Decimal** | `double` | `carts_abandoned / carts_created` |
| True or false | **True/false** | `bool` | `page_views_7d > 10` |
| Text | **Text** | `string` | `CASE WHEN total_spend > 1000 THEN 'gold' ELSE 'standard' END` |

Adding, subtracting, or multiplying two whole numbers gives a whole number. Mixing a whole number and a decimal gives a decimal. A `counter` or `approx_count_distinct` attribute is always a whole number, and a `mean` or time since aggregation is always a decimal.

### Formula limits

Each formula can be up to 1000 characters long, and each attribute group can have up to 50 formula attributes. A formula attribute can reference another formula attribute, which can reference another, up to five levels deep.

### Examples

These examples use attributes from a typical ecommerce attribute group.

The cart abandonment rate is the share of carts that didn't end in a purchase. The `max` stops the rate going below zero if a user has more purchases than carts:

```sql
max(carts_created - purchases, 0) / carts_created
```

With a fallback value of `0`, a user who created four carts and made one purchase gets `0.75`. A user who created carts but made no purchases gets `1.0`, because an empty `purchases` counter counts as zero. A user who made purchases without creating a cart gets the fallback value `0.0`, because the formula divides by zero. A user Signals has never seen gets no value.

An engagement score weights two existing scores:

```sql
0.6 * recency_score + 0.4 * frequency_score
```

A user with a `recency_score` of `0.5` and a `frequency_score` of `0.8` gets `0.62`.

An engagement flag is true when a user has viewed more than 10 pages in the last seven days and has an average session longer than 120 seconds:

```sql
page_views_7d > 10 AND avg_session_duration > 120
```

A user with 14 page views and an average session of 95 seconds gets `false`. A user with 14 page views and no sessions yet also gets `false`, because a comparison with a missing value is false.

A customer tier turns total spend into text:

```sql
CASE WHEN total_spend > 1000 THEN 'gold' WHEN total_spend > 100 THEN 'silver' ELSE 'bronze' END
```

A user who has spent 250 gets `silver`.

## Handle missing data and fallback values

An attribute has no value when Signals hasn't seen a matching event for it, or when its value has expired. Formulas handle missing values with these rules:

* Zero rule: a `counter`, `sum`, or `approx_count_distinct` attribute with no value counts as `0`. Other attributes with no value stay empty.
* All inputs empty: if every attribute the formula uses has no value, the formula has no value, and the fallback value isn't used. This way, a user Signals has never seen doesn't look like a user with real zeros.
* Comparisons: a comparison with a missing value on either side is false, including `!=`. In `AND`, `OR`, and `NOT`, a missing value counts as false.
* Arithmetic: any missing value in `+`, `-`, `*`, `/`, `abs`, or `round` makes the result empty
* `min` and `max` ignore missing values, and `coalesce` returns the first argument that has a value

When the formula has some data but no answer, Signals uses the fallback value. This happens on a division by zero, when no `CASE` condition is true and there's no `ELSE`, or when an input such as a `mean` has no value. Without a fallback value, the formula has no value. The fallback value must match the result type. A whole-number fallback value on a decimal formula is returned as a decimal, so a fallback of `0` gives `0.0`.

When one formula attribute references another, it sees the other formula's final value, including its fallback value.

`round` rounds halves away from zero, so `round(2.5)` is `3` and `round(-2.5)` is `-3`.

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
