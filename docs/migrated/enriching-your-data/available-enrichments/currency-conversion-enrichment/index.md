---
title: "Currency conversion enrichment"
date: "2020-02-14"
sidebar_position: 130
---

This enrichment uses [Open Exchange Rates](https://openexchangerates.org/) to convert the currencies used in transactions. It requires an Open Exchange Rates.

When transactional data is collected in multiple currencies, it can be useful to convert it in the one that is used for reporting for instance. This could help to lower discrepancies when reporting revenue amounts across multiple currencies.

The conversion is done by the enrich job at processing time with Open Exchange Rates API so that it can be stored directly with the right currency in the database.

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/currency_conversion_config/jsonschema/1-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/currency_conversion_config.json)

| **Field** | **Description** |
| --- | --- |
| `accountType` | Level of Open Exchange Rates account. Must be “developer”, “enterprise”, or “unlimited”. |
| `apiKey` | Open Exchange Rates API key |
| `baseCurrency` | Currency to convert all transaction values to |
| `rateAt` | Determines which exchange rate will be used. Currently only “EOD\_PRIOR” is supported, meaning that the enrichment uses the exchange rate from the end of the previous day. |

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

| Field | Purpose |
| --- | --- |
| `base_currency` | Base currency code according to [ISO\_4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) |
| `tr_total_base` | Total amount of transaction in base currency |
| `tr_tax_base` | Tax applied in base currency |
| `tr_shipping_base` | Shipping cost in base currency |
| `ti_price_base` | Item price in base currency |
