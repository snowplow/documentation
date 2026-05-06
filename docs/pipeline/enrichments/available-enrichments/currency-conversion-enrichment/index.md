---
title: "Currency conversion enrichment"
sidebar_position: 2
sidebar_label: Currency conversion (legacy)
description: "Convert transaction values to a base currency using Open Exchange Rates API for standardized reporting."
keywords: ["currency conversion", "exchange rates", "multi-currency"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

:::tip[Don't use this enrichment]
We recommend managing currency conversion downstream instead of using this enrichment. For example, you could bring currency exchange rate information into your data warehouse and join that data with your Snowplow data.
:::

This legacy enrichment uses [Open Exchange Rates](https://openexchangerates.org/) to convert the currencies used in transactions. It requires an Open Exchange Rates account and API key.

This enrichment only works with the legacy `tr_` and `ti_` [ecommerce atomic event fields](/docs/fundamentals/canonical-event/index.md#legacy-ecommerce-fields). Also, it can only use the exchange rate from the end of the day prior to the event's `collector_tstamp`. For these reasons, we recommend handling currency conversion downstream instead of using this enrichment.

## Configuration

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow/currency_conversion_config/jsonschema/1-0-0",
    data: {
      enabled: false,
      vendor: "com.snowplowanalytics.snowplow",
      name: "currency_conversion_config",
      parameters: {
        accountType: "DEVELOPER",
        apiKey: "{{KEY}}",
        baseCurrency: "USD",
        rateAt: "EOD_PRIOR"
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for configuration of currency-conversion enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "currency_conversion_config", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "apiKey": { "type": "string", "description": "Open Exchange Rates API key" }, "baseCurrency": { "type": "string", "description": "Currency to convert all transaction values to" }, "rateAt": { "enum": ["EOD_PRIOR"], "description": "Determines which exchange rate will be used. Only EOD_PRIOR is supported, meaning that the enrichment uses the exchange rate from the end of the day prior to the event's collector_tstamp." }, "accountType": { "type": "string", "enum": ["DEVELOPER", "ENTERPRISE", "UNLIMITED"], "description": "Level of Open Exchange Rates account. Must be DEVELOPER, ENTERPRISE, or UNLIMITED." } }, "required": ["apiKey", "baseCurrency", "rateAt", "accountType"], "additionalProperties": false } }, "required": ["name", "vendor", "enabled", "parameters"], "additionalProperties": false }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

## Input

This enrichment uses the following fields :

- `tr_currency`
- `tr_total`
- `tr_tax`
- `tr_shipping`
- `ti_currency`
- `ti_price`

## Output

This enrichment updates the following fields of the atomic event:

| Field              | Purpose                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `base_currency`    | Base currency code according to [ISO_4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) |
| `tr_total_base`    | Total amount of transaction in base currency                                                    |
| `tr_tax_base`      | Tax applied in base currency                                                                    |
| `tr_shipping_base` | Shipping cost in base currency                                                                  |
| `ti_price_base`    | Item price in base currency                                                                     |
