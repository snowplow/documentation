---
title: "Currency conversion enrichment"
sidebar_position: 2
sidebar_label: Currency conversion
---

This enrichment uses [Open Exchange Rates](https://openexchangerates.org/) to convert the currencies used in transactions. It requires an Open Exchange Rates account and API key.

When transactional data is collected in multiple currencies, it can be useful to convert it in the one that is used for reporting for instance. This could help to lower discrepancies when reporting revenue amounts across multiple currencies.

:::warning Limitations

This is an older and less actively maintained enrichment, and as such it has several limitations.

* **It can only use the exchange rate from the end of the day prior to the event’s `collector_tstamp`.** You can’t apply a different rate (e.g. the one in effect when the event occurred), and you can’t pick a different timestamp field (e.g. `dvce_sent_tstamp`).
* **It only works with the [`tr_` and `ti_` fields](/docs/fundamentals/canonical-event/index.md#e-commerce-transactions).** These fields are not very convenient to use and exist for legacy reasons. One of their significant downsides is that you have to send a separate event for the transaction itself and then an event for each of the order items in that transaction (as opposed to including all items in a single event).

Over the years, it has become more idiomatic to use dedicated [entities](/docs/fundamentals/entities/index.md) for order items in e-commerce transactions. For instance, our [E-commerce Accelerator](https://docs.snowplow.io/accelerators/ecommerce/) uses this approach, which is _incompatible with this enrichment_.

We recommend to manage currency conversion downstream instead of using this enrichment. For example, you could bring currency exchange rate information into your data warehouse and join that data with your Snowplow data.

:::

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/currency_conversion_config/jsonschema/1-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/currency_conversion_config.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

| **Field**      | **Description**                                                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accountType`  | Level of Open Exchange Rates account. Must be “developer”, “enterprise”, or “unlimited”.                                                                                                                      |
| `apiKey`       | Open Exchange Rates API key                                                                                                                                                                                   |
| `baseCurrency` | Currency to convert all transaction values to                                                                                                                                                                 |
| `rateAt`       | Determines which exchange rate will be used. **Currently only “EOD_PRIOR” is supported**, meaning that the enrichment uses the exchange rate from the end of the day prior to the event’s `collector_tstamp`. |

## Input

This enrichment uses the following fields :

- `tr_currency`
- `tr_total`
- `tr_tax`
- `tr_shipping`
- `ti_currency`
- `ti_price`

## Output

This enrichment updates the following fields of the atomic event :

| Field              | Purpose                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `base_currency`    | Base currency code according to [ISO_4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) |
| `tr_total_base`    | Total amount of transaction in base currency                                                    |
| `tr_tax_base`      | Tax applied in base currency                                                                    |
| `tr_shipping_base` | Shipping cost in base currency                                                                  |
| `ti_price_base`    | Item price in base currency                                                                     |
