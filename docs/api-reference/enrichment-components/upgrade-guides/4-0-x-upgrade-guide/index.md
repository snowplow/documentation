---
title: "4.0.x Upgrade Guide"
description: "Upgrade guide for enrichment components version 4.0.x with behavioral data processing improvements."
schema: "TechArticle"
keywords: ["Enrichment Upgrade", "V4.0.x Upgrade", "Component Migration", "Enrichment Migration", "Version Upgrade", "Breaking Changes"]
sidebar_position: 0
---

## Breaking changes

### New license

Since version 4.0.0, Enrich has been migrated to use the [Snowplow Limited Use License](https://docs.snowplow.io/limited-use-license-1.0/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)).

### `stream-enrich` assets and `enrich-rabbitmq` deprecated

As announced a while ago, these assets are now removed from the codebase.

## Upgrading

### License acceptance

You have to explicitly accept the [Snowplow Limited Use License](https://docs.snowplow.io/limited-use-license-1.0/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)). To do so, either set the `ACCEPT_LIMITED_USE_LICENSE=yes` environment variable, or update the following section in the configuration:

```hcl
{
  license {
    accept = true
  }
  ...
}
```

### Atomic fields limits

Several [atomic](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0) fields, such as `mkt_clickid` have length limits defined (in this case, 128 characters). Recent versions of Enrich enforce these limits, so that oversized data does not break loading into the warehouse columns. However, over time we’ve observed that valid data does not always fit these limits. For example, TikTok click ids can be up to 500 (or 1000, according to some sources) characters long.

In this release, we are adding a way to configure the limits, and we are increasing the default limits for several fields:
* `mkt_clickid` limit increased from `128` to `1000`
* `page_url` limit increased from `4096` to `10000`
* `page_referrer` limit increased from `4096` to `10000`

Depending on your [configuration](/docs/api-reference/enrichment-components/configuration-reference/index.md), this might be a breaking change:
* If you have `featureFlags.acceptInvalid` set to `true` in Enrich, then you probably don’t need to worry, because you had no validation in the first place (although we do recommend to enable it).
* If you have `featureFlags.acceptInvalid` set to `false` (default), then previously invalid events might become valid (which is a good thing), and you need to prepare your warehouse for this eventuality:
  * For Redshift, you should resize the respective columns, e.g. to `VARCHAR(1000)` for `mkt_clickid`. If you don’t, Redshift will truncate the values.
  * For Snowflake and Databricks, we recommend removing the VARCHAR limit altogether. Otherwise, loading might break with longer values. Alternatively, you can alter the Enrich configuration to revert the changes in the defaults.
  * For BigQuery, no steps are necessary.

Below is an example of how to configure these limits:

```hcl
{
  ...
  # Optional. Configuration section for various validation-oriented settings.
  "validation": {
    # Optional. Configuration for custom maximum atomic fields (strings) length.
    # Map-like structure with keys being field names and values being their max allowed length
    "atomicFieldsLimits": {
        "app_id": 5
        "mkt_clickid": 100000
        # ...and any other 'atomic' field with custom limit
    }
  }
}
```
