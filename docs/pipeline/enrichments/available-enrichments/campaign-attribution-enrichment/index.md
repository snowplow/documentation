---
title: "Campaign attribution enrichment"
description: "Track marketing campaign performance by enriching events with campaign attribution data from UTM parameters."
schema: "TechArticle"
keywords: ["Campaign Attribution", "Marketing Attribution", "UTM Tracking", "Campaign Analysis", "Attribution Model", "Marketing Analytics"]
sidebar_position: 4
sidebar_label: Campaign attribution
---

This enrichment can be used to link events to marketing campaigns, using the query string parameters.

When using online marketing campaigns to drive traffic to our website, it is usually possible to find information in the query string parameters to identify the particular campaign, medium and more.

A link for an online advertisement that brings users back to our site might look like:

```markup
https://www.acme.com/spring_offer_product?utm_source=influencer&utm_medium=blog&utm_campaign=spring_offer
```

This could result in the following fields being added to the enrich event:

| field          | value           |
|----------------|-----------------|
| `mkt_source`   | `influencer`    |
| `mkt_medium`   | `blog`          |
| `mkt_campaign` | `spring_offer`  |

The configuration of the enrichment defines which parameters in the URL (e.g. `utm_source`) map to which fields in the event (e.g. `mkt_source`) — see examples below.

In addition, this enrichment automatically knows about Google (corresponding to the `gclid` query string parameter), Microsoft (`msclkid`), and DoubleClick (`dclid`). For example, if the query string contains `&gclid=abc`, this will be the result:

| field         | value           |
|---------------|-----------------|
| `mkt_clickid` | `abc`           |
| `mkt_network` | `Google`        |

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/campaign_attribution/jsonschema/1-0-1)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/campaign_attribution.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

### Basic usage

Here’s an example for standard Google parameters. It specifies that the `utm_medium` parameter in the query string will map to the `mkt_medium` field in the event, and so on.

```json
    "parameters":{
      "mapping":"static",
      "fields":{
        "mktMedium":[
          "utm_medium"
        ],
        "mktSource":[
          "utm_source"
        ],
        "mktTerm":[
          "utm_term"
        ],
        "mktContent":[
          "utm_content"
        ],
        "mktCampaign":[
          "utm_campaign"
        ]
      }
    }
```

And here’s an example for Omniture (only the `mkt_campaign` field will be populated):

```json
    "parameters":{
      "mapping":"static",
      "fields":{
        "mktMedium":[
        ],
        "mktSource":[
        ],
        "mktTerm":[
        ],
        "mktContent":[
        ],
        "mktCampaign":[
          "cid"
        ]
      }
    }
```

### Supporting multiple parameters

What if some of your links use `utm_campaign=...` and some use `legacy_campaign=...`?
In this case, you can configure more than one parameter name in the array, like so:

```json
    "parameters":{
      "mapping":"static",
      "fields":{
        ...
        "mktCampaign":[
          "utm_campaign",
          "legacy_campaign"
        ]
        ...
      }
    }
```

The same applies to other configuration options, namely `mktMedium`, `mktSource`, `mktTerm` and `mktContent`.

:::note

If the query string includes multiple acceptable parameters (e.g. both `utm_campaign` and `legacy_campaign`), the **first one listed in the configuration** will be used (_not_ the first one present in the query string).

:::

Results:

| query string                           | value of `mkt_campaign` |
|----------------------------------------|-------------------------|
| `utm_campaign=abc`                     | `abc`                   |
| `legacy_campaign=abc`                  | `abc`                   |
| `legacy_campaign=abc&utm_campaign=def` | `def`                   |

### Click and network attribution

You can define which URL parameters are used to populate the `mkt_clickid` field (the defaults include `gclid`, `msclkid` and `dclid`). For each parameter, _the same configuration setting_ also defines what network — the `mkt_network` field — it corresponds to (by default, `gclid` corresponds to `Google`, `msclkid` to `Microsoft` and `dclid` to DoubleClick).

:::tip

You can configure any parameter names or network names, including your custom ones.

:::

In the next example, we will customize the `mktClickId` configuration:
* First, we add support for `wbraid` and `gbraid` [parameters](https://support.google.com/analytics/answer/11367152?hl=en), which will be mapped to `Google` as the corresponding `mkt_network`.
* Second, we override the `msclkid` parameter, so that it maps to `NotMicrosoft` as the marketing network (instead of the default `Microsoft`).
* Third, we add a custom `xyzid` parameter that maps to the `XYZ` network.
* Other default mappings for `gclid` and `dclid` remain unaffected.

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

:::caution

You should not use more than one click parameter in the query string (e.g. both `wbraid` and `gbraid`). If you do, one of them will be picked arbitrarily.

:::

Results:

| query string            | value of `mkt_clickid` | value of `mkt_network` |
|-------------------------|------------------------|------------------------|
| `wbraid=abc`            | `abc`                  | `Google`               |
| `msclkid=abc`           | `abc`                  | `NotMicrosoft`         |
| `xyzid=abc`             | `abc`                  | `XYZ`                  |
| `wbraid=abc&gbraid=def` | `abc` or `def` ⚠️       | `Google`               |

## Output

This enrichment populates the following fields of the atomic event :

| Field          | Purpose                                                                                                                                                                                                                                                           |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `mkt_medium`   | The advertising or marketing medium, for example: `banner`, `email newsletter`.                                                                                                                                                                                   |
| `mkt_source`   | Identifies the advertiser, site, publication, etc. that is sending traffic to your property, for example: `newsletter4`, `billboard`.                                                                                                                             |
| `mkt_term`     | Identifies keywords (terms).                                                                                                                                                                                                                                      |
| `mkt_content`  | Used to differentiate similar content, or links within the same ad. For example, if you have two call-to-action links within the same email message, you can use `mkt_content` and set different values for each so you can tell which version is more effective. |
| `mkt_campaign` | The individual campaign name, slogan, promo code, etc. for a product.                                                                                                                                                                                             |
| `mkt_clickid`  | Click ID which resulted in the redirect/follow request                                                                                                                                                                                                            |
| `mkt_network`  | The advertising network name, either default determined from parameter for Click ID or custom specifically stated                                                                                                                                                 |

If the enrichment is not activated, those fields will not be populated.
