---
title: "Combine category counts with map formulas"
sidebar_position: 16
sidebar_label: "Map formulas"
description: "Weight, add, rank, and pull single values out of category count attributes with map formulas, for example to build an interest score from page views and article reads."
keywords: ["map formulas", "category count", "interest score", "decay", "top_n", "formula attributes"]
date: "2026-11-06"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

A map formula is a [formula attribute](/docs/signals/attributes/formula-attributes/index.md) that works on `category_count` [attributes](/docs/signals/attributes/attributes/index.md#choose-an-aggregation) category by category. A `category_count` attribute holds a count per value, such as page views per channel. A formula over category counts of text properties returns a map: an object of category to number, for example `{"royals": 20.62, "sport": 16.52}`. You can weight and add maps, and then pull single values out of them, such as a user's favorite channel.

Console shows map formulas with a **Map** badge. In the Python SDK and the Signals API, the result types are `map_int64` for whole numbers and `map_double` for decimals. A formula that takes a single value out of a map, for example with `get`, `total`, `size`, or `top_key`, returns an ordinary number, decimal, text, or true/false value.

:::note[Requirements]
Map formulas work on [stream attribute groups](/docs/signals/attributes/attribute-groups/index.md#stream) only. To define them in code you need version 0.5.0 or later of the Signals Python SDK. Map formulas must also be enabled on your Signals deployment. If they aren't, Signals rejects new or changed map formulas with the error `formula_map_values_disabled`, and existing attribute groups still save, publish, and unpublish.
:::

## When to use map formulas

Use a map formula when you want one value per category that combines several category counts. For example, to score each user's interest in each channel, you can add page views per channel to article reads per channel, give reads a higher weight, and give recent activity more weight than older activity.

A single `category_count` attribute already counts per category, so you don't need a map formula to read one count. You need one when the answer depends on more than one category count, or when you want a single value out of a map, such as the top category, a category's share of the total, or whether a share is above a threshold.

Map formulas only accept category counts of text properties. Category counts of number properties, true/false properties, or [date parts](/docs/signals/attributes/attributes/index.md#apply-a-date-part) such as `hour_of_day` are rejected with `unsupported_input_type`.

## Build an interest score

This example scores each reader's interest in each channel of a news site. It uses eight `category_count` attributes over the same text property, `channel`, of an `article` entity. Four count page views and four count article reads, over 7, 14, 28, and 90 days:
* `channel_views_7d` and `channel_reads_7d`
* `channel_views_14d` and `channel_reads_14d`
* `channel_views_28d` and `channel_reads_28d`
* `channel_views_90d` and `channel_reads_90d`

Four formula attributes build on those counts. `interest_raw` is the weighted score per channel:

```sql
channel_views_7d * 0.10 + channel_reads_7d * 0.30 + channel_views_14d * 0.13 + channel_reads_14d * 0.39 + channel_views_28d * 0.32 + channel_reads_28d * 0.96 + channel_views_90d * 0.45 + channel_reads_90d * 1.35
```

`channel_interest` keeps the 10 highest-scoring channels, to return from a service:

```sql
top_n(interest_raw, 10)
```

`favourite` is the channel with the highest score:

```sql
top_key(interest_raw)
```

`royals_heavy` is true when the `royals` channel has more than 40% of the reader's score:

```sql
get(share(interest_raw), 'royals') > 0.4
```

A read counts as three views, so each reads coefficient is three times the views coefficient for the same window. The views coefficients 0.10, 0.13, 0.32, and 0.45 come from a weekly decay of 0.9, averaged over each band of days, and they add up to 1.00. Because the windows overlap, a view from the last 7 days counts in all four windows and gets a weight of 1.00. A view from 8 to 14 days ago gets 0.90, from 15 to 28 days ago 0.77, and from 29 to 90 days ago 0.45.

This is a 4-step approximation of decay, not real decay. Day 29 gets a weight of 0.45 where real decay gives 0.66, and day 90 gets 0.45 where real decay gives about 0.26 to 0.28.

The result types are `map_double` for `interest_raw` and `channel_interest`, `string` for `favourite`, and `bool` for `royals_heavy`. These are the values for four readers:

| Reader | `interest_raw` | `favourite` | `royals_heavy` |
| --- | --- | --- | --- |
| Anna | `royals` 20.62, `sport` 16.52, `politics` 2.0. The shares are 0.527, 0.422, and 0.051 | `royals` | `true` |
| Views only, with no reads in the last 14 days | `royals` 17.62, `sport` 16.52, `politics` 2.0 | `royals` | `true` |
| Lapsed, active only 29 to 90 days ago | `royals` 7.20, `sport` 15.75 | `sport` | `false` |
| Never seen | No value | No value | No value |

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

Create a stream attribute group with the `domain_userid` attribute key.

1. Add the eight attributes. For each one, choose the **Category Count** aggregation, the `channel` property of the `article` entity, and the period. Use the page view event for the views attributes and your article read event for the reads attributes.
2. In the **Formula attributes** section, add the four formula attributes. When map formulas are enabled, Console suggests the map functions as you type, for example `top_key` and `top_n` after `top`.
3. Check the **Result type** badges: **Map** for `interest_raw` and `channel_interest`, **Text** for `favourite`, and **True/false** for `royals_heavy`.
4. Click **Run preview** to [test the group](/docs/signals/attributes/attribute-groups/index.md#test-attribute-definitions). Map columns show JSON objects.

Below the preview, Console shows this note: "Preview shows the last hour, so the windows look the same. Live values use the full windows." **Run preview** reads events from the last hour only, so every window holds the same events and `channel_views_7d` equals `channel_views_90d`. Live values use each attribute's full window.

</TabItem>
<TabItem value="sdk" label="Python SDK">

Build the eight attributes in a loop, then add the four `FormulaAttribute` objects to the same group:

```python
from datetime import timedelta

from snowplow_signals import (
    Attribute,
    EntityProperty,
    Event,
    FormulaAttribute,
    StreamAttributeGroup,
    domain_userid,
)

channel = EntityProperty(
    vendor="com.example", name="article", major_version=1, path="channel"
)
page_view = Event(
    vendor="com.snowplowanalytics.snowplow", name="page_view", version="1-0-0"
)
article_read = Event(vendor="com.example", name="article_read", version="1-0-0")

channel_counts = [
    Attribute(
        name=f"channel_{kind}_{days}d",
        type="dict",
        events=[event],
        aggregation="category_count",
        property=channel,
        period=timedelta(days=days),
    )
    for days in (7, 14, 28, 90)
    for kind, event in (("views", page_view), ("reads", article_read))
]

interest_raw = FormulaAttribute(
    name="interest_raw",
    expression=(
        "channel_views_7d * 0.10 + channel_reads_7d * 0.30"
        " + channel_views_14d * 0.13 + channel_reads_14d * 0.39"
        " + channel_views_28d * 0.32 + channel_reads_28d * 0.96"
        " + channel_views_90d * 0.45 + channel_reads_90d * 1.35"
    ),
    description="Decayed interest score per channel, with a read worth three views",
)
channel_interest = FormulaAttribute(
    name="channel_interest",
    expression="top_n(interest_raw, 10)",
)
favourite = FormulaAttribute(
    name="favourite",
    expression="top_key(interest_raw)",
)
royals_heavy = FormulaAttribute(
    name="royals_heavy",
    expression="get(share(interest_raw), 'royals') > 0.4",
)

reader_interest = StreamAttributeGroup(
    name="reader_interest",
    version=1,
    attribute_key=domain_userid,
    owner="user@company.com",
    attributes=[
        *channel_counts,
        interest_raw,
        channel_interest,
        favourite,
        royals_heavy,
    ],
)
```

Use `test()` to preview the group. The preview reads the window you pass, one hour by default, so every window holds the same events and the scores don't show the decay. Live values use each attribute's full window.

If the Signals deployment you connect to doesn't support map formulas, the SDK warns you when you publish a group with a formula over category counts.

</TabItem>
</Tabs>

After you publish the group, [read the formula attributes through a service](/docs/signals/applications/retrieve-attributes/index.md). A map formula's value is a JSON object. For Anna:

```json
{
  "channel_interest": {"royals": 20.62, "sport": 16.52, "politics": 2.0},
  "favourite": "royals",
  "royals_heavy": true
}
```

## Write map formulas

Map formulas use the same syntax as other [formula attributes](/docs/signals/attributes/formula-attributes/index.md#write-formulas). The rules below apply when a formula uses a category count, or another formula that returns a map.

### Operators

These operators work on maps:

| Operator | Result |
| --- | --- |
| `map + map`, `map - map` | Adds or subtracts the values category by category. A category missing from one side counts as `0` |
| `map * number`, `number * map` | Multiplies every value by the number |
| `map / number` | Divides every value by the number. The result is a decimal map |
| `-map` | Negates every value |
| `round(map)`, `round(map, n)` | Rounds every value |

Adding two whole-number maps gives a whole-number map. Mixing a whole-number map with a decimal map or a decimal number gives a decimal map.

Signals rejects `map + number`, `map - number`, `number - map`, `number / map`, `map * map`, and `map / map` with `type_mismatch`. Per-category rates, such as a click-through rate per channel, aren't supported yet: they need a rate function that comes in a later release.

You can't use a map in a comparison, in `AND`, `OR`, or `NOT`, in `CASE`, or in `coalesce`, `min`, `max`, or `abs`. Signals rejects these with `map_operator_not_allowed`. Take a single value out of the map first with `get`, `total`, `size`, or `top_key`. For example, write `total(channel_views_7d) > 10`, not `channel_views_7d > 10`.

### Functions

These functions work on maps:

| Function | Result |
| --- | --- |
| `get(m, 'key')` | The value for one category. A missing category gives `0` |
| `total(m)` | The sum of all values |
| `size(m)` | The number of categories |
| `share(m)` | Each value as a fraction of the total, so the values add up to 1. The result is empty if any value is negative or the total is 0 or less |
| `top_key(m)` | The category with the highest value. On a tie, the key that sorts first wins |
| `top_n(m, n)` | A map with the `n` categories that have the highest values. `n` must be a whole number from 1 to 100, written as a number in the formula. Other values are rejected with `invalid_top_n` |

The function names aren't reserved, so you can still use them as attribute names.

### Missing data

Missing category counts work like the zero rule for counters on the [formula attributes](/docs/signals/attributes/formula-attributes/index.md#handle-missing-data-and-fallback-values) page:
* An empty category count counts as an empty map. A reader with page views but no article reads still gets a score.
* If every input of the formula is empty, the formula has no value. A user Signals has never seen gets no value, not an empty score.
* `get(channel_reads_7d, 'royals')` has no value, not `0`, when `channel_reads_7d` is the formula's only input and is empty. Add a second input, such as `get(channel_reads_7d + channel_views_7d, 'royals')`, to get `0` instead.
* Signals drops categories whose value becomes exactly `0`, and keeps negative values.
* An empty map result is returned as `null`.

Chains of formulas treat empty inputs differently depending on the result type. A map formula used by another map formula counts as an empty map when all its own inputs are empty. A scalar formula with all its inputs empty has no value, and that missing value carries through arithmetic.

For example, with `views_7d_total = total(channel_views_7d)` and `views_90d_total = total(channel_views_90d)`, the formula `views_7d_total + views_90d_total` has no value for the lapsed reader, because `views_7d_total` has no value. The formula `total(channel_views_7d + channel_views_90d)` does have a value. Do the map arithmetic in one formula, and take the single value at the end.

### Results and ordering

Map results have no order, including the result of `top_n`. `channel_interest` contains the 10 highest-scoring channels, but not ranked. To show them in order, sort the entries by value in your application.

Build `share`, `top_key`, and flags on the untrimmed formula, such as `interest_raw`, never on the `top_n` result. Use `top_n` only for the map you return to your application. `top_n` drops categories, so a share of its result has a different total. For a map `m` of `{"a": 5, "b": 3, "c": 2}`, `share(m)` gives `{"a": 0.5, "b": 0.3, "c": 0.2}`, but `share(top_n(m, 2))` gives `{"a": 0.625, "b": 0.375}`.

## Limits and costs

Map formulas have these limits:
* Map formulas can't have a fallback value. Signals rejects one with `invalid_default_value` and the message "A map formula can't have a fallback value." Formulas that take a single value out of a map can have one.
* A formula can use at most eight category counts, counted through any formulas it references. More are rejected with `too_many_map_inputs`.
* A map with more than 16,000 categories gives no value. This is a safety limit that real data doesn't reach.
* Intervention criteria can't use map formulas or formulas over category counts yet, including true/false formulas such as `royals_heavy`. Signals rejects them with `map_criteria_not_allowed`. Read them through a [service](/docs/signals/applications/services/index.md) instead. An intervention can still send them in its payload.
* Map formulas can't combine parent and child channels, such as `page_level_1` and `page_level_2`. They're different properties with different keys, so adding them doesn't roll a child channel up into its parent.

Live windows differ from the exact windows in **Run preview**. Signals stores windowed attributes in time buckets, so a 7-day window covers 7 to 7.5 days and a 90-day window covers 90 to 97 days. Each bucket also keeps at most 100 categories. Live counts can therefore differ from the exact counts in a preview or in your warehouse, and the difference between two windows, such as `channel_views_90d - channel_views_28d`, can even be negative for some categories.

Formula attributes store nothing, but their inputs do. A design with one views count and one reads count per dimension needs two category counts, while the decay design on this page needs eight. Stored attributes are limited to 200 per Signals deployment, and three dimensions with decay use 24 of them. Each page view updates four attributes, which takes 12 Redis commands, and each article read takes another 12. Redis memory per active user is about four times that of the two-count design. Start with one dimension, such as channel, and add more once you've checked the cost.

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
