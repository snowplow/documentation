---
title: "Campaign attribution enrichment"
sidebar_position: 4
sidebar_label: Campaign attribution
description: "Link events to marketing campaigns by extracting attribution data from query string parameters."
keywords: ["campaign attribution", "marketing attribution", "UTM parameters"]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This enrichment can be used to link events to marketing campaigns, using the query string parameters.

When using online marketing campaigns to drive traffic to a website, it's often possible to find information in the query string parameters to identify the particular campaign, medium, and more.

A link for an online advertisement that brings users back to the site might look like:

```markup
https://www.acme.com/spring_offer_product?utm_source=influencer&utm_medium=blog&utm_campaign=spring_offer
```

The enrichment can extract values from the query string parameters, resulting in the following fields being added to the enriched event:

| field          | value          |
| -------------- | -------------- |
| `mkt_source`   | `influencer`   |
| `mkt_medium`   | `blog`         |
| `mkt_campaign` | `spring_offer` |

The configuration of the enrichment defines which parameters in the URL (e.g. `utm_source`) map to which fields in the event (e.g. `mkt_source`).

## Configuration

The enrichment takes these parameters:

| Parameter | Required | Description                                                          |
| --------- | -------- | -------------------------------------------------------------------- |
| `mapping` | ❌        | Mapping mode. Must be one of: `static`, `script`.                    |
| `fields`  | ✅        | Maps event marketing fields to the URL query string parameter names. |

<Tabs groupId="deployment" queryString>
  <TabItem value="console" label="Console" default>

Configure the parameters in the Console enrichment editor. For example:

```json
{
  "mapping": "static",
  "fields": {
    "mktMedium": ["utm_medium"],
    "mktSource": ["utm_source"],
    "mktTerm": ["utm_term"],
    "mktContent": ["utm_content"],
    "mktCampaign": ["utm_campaign"]
  }
}
```

  </TabItem>
  <TabItem value="self-hosted" label="Self-Hosted">

For Self-Hosted, [provide a complete JSON](/docs/pipeline/enrichments/managing-enrichments/terraform/index.md). For example:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/campaign_attribution/jsonschema/1-0-1",
  "data": {
    "name": "campaign_attribution",
    "vendor": "com.snowplowanalytics.snowplow",
    "enabled": true,
    "parameters": {
      "mapping": "static",
      "fields": {
        "mktMedium": ["utm_medium"],
        "mktSource": ["utm_source"],
        "mktTerm": ["utm_term"],
        "mktContent": ["utm_content"],
        "mktCampaign": ["utm_campaign"]
      }
    }
  }
}
```

  </TabItem>
</Tabs>

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

### Supporting multiple parameters

What if some of your links use `utm_campaign=...` and some use `legacy_campaign=...`? You can configure more than one parameter name in the array, like so:

```json
    "parameters":{
      "mapping":"static",
      "fields":{
        "mktCampaign":[
          "utm_campaign",
          "legacy_campaign"
        ]
      }
    }
```

The same applies to the other configuration options `mktMedium`, `mktSource`, `mktTerm` and `mktContent`.

If the query string includes multiple acceptable parameters (e.g. both `utm_campaign` and `legacy_campaign`), the **first one listed in the configuration** will be used, not the first one present in the query string.

Results:

| Query string                           | Value of `mkt_campaign` |
| -------------------------------------- | ----------------------- |
| `utm_campaign=abc`                     | `abc`                   |
| `legacy_campaign=abc`                  | `abc`                   |
| `legacy_campaign=abc&utm_campaign=def` | `def`                   |

### Click and network attribution

You can define which URL parameters are used to populate the `mkt_clickid` field. For each parameter, the same configuration setting also defines what network — the `mkt_network` field — it corresponds to.

The default mappings are `gclid` for `Google`, `msclkid` for `Microsoft`, and the legacy `dclid` for `DoubleClick`.

:::tip

You can configure any parameter names or network names, including your custom ones.

:::

This example shows how to define your own click attribution settings, using `mktClickId`:
* Add support for `wbraid` and `gbraid` [parameters](https://support.google.com/analytics/answer/11367152?hl=en), which will be mapped to `Google` as the corresponding `mkt_network`
* Override the `msclkid` parameter, so that it maps to `NotMicrosoft` as the marketing network instead of the default `Microsoft`
* Add a custom `xyzid` parameter that maps to the `XYZ` network
* The default mappings for `gclid` and `dclid` remain unaffected

```json
    "parameters":{
      "mapping":"static",
      "fields":{
        ...
        "mktClickId": {
          "wbraid": "Google",
          "gbraid": "Google",
          "msclkid": "NotMicrosoft",
          "xyzid": "XYZ"
        }
        ...
      }
    }
```

Use only one click parameter at a time. If you add multiple e.g. both `wbraid` and `gbraid`, one of them will be picked arbitrarily.

Results:

| Query string            | Value of `mkt_clickid` | Value of `mkt_network` |
| ----------------------- | ---------------------- | ---------------------- |
| `wbraid=abc`            | `abc`                  | `Google`               |
| `msclkid=abc`           | `abc`                  | `NotMicrosoft`         |
| `xyzid=abc`             | `abc`                  | `XYZ`                  |
| `wbraid=abc&gbraid=def` | `abc` or `def` ⚠️       | `Google`               |

## Output

This enrichment populates the [marketing atomic event fields](/docs/fundamentals/canonical-event/index.md#marketing-fields): `mkt_medium`, `mkt_source`, `mkt_term`, `mkt_content`, `mkt_campaign`, `mkt_clickid`, and `mkt_network`.

If the enrichment is not activated, those fields will not be populated.
