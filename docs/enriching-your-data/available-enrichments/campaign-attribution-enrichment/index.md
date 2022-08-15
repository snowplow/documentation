---
title: "Campaign attribution enrichment"
date: "2020-02-14"
sidebar_position: 10
---

This enrichment can be used to link events to marketing campaigns, using the query string parameters.

When using online marketing campaigns to drive traffic to our website, it is usually possible to find information in the query string parameters to identify the particular campaign, channel, medium and more.

A link for an online advertisement that brings users back to our site might look like:

```
https://www.acme.com/spring_offer_product?utm_source=influencer&utm_medium=blog&utm_channel=web&utm_campaign=spring_offer
```

This could result in the following fields being added to the enrich event :

| field | value |
| --- | --- |
| `mktSource` | "influencer" |
| `mktMedium` | "blog" |
| `mktChannel` | "web" |
| `mktCampaign` | "spring\_offer" |

This enrichment automatically knows about Google (corresponding to the “gclid” query string parameter), Microsoft (“msclkid”), and DoubleClick (“dclid”). For example, if the query string contains `&gclid=abc&` then `mkt_clickid` field will be populated with `"abc"` and `mkt_network` field would be populated with `"Google"`.

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/campaign_attribution/jsonschema/1-0-1)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/campaign_attribution.json)

Example for standard Google parameters:

```
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

Example customizing `mktClickId` . This particular example:

1. adds mappings of the `wbraid` and `gbraid` [parameters](https://developers.google.com/google-ads/api/docs/conversions/upload-clicks?hl=en) to `Google` as the corresponding `mkt_network` and
2. overrides the `msclkid` mapping (the other default mappings for `gclid` and `dclid` remain unaffected) :

```
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
        ],
        "mktClickId": {
          "wbraid": "Google",
          "gbraid": "Google",
          "msclkid": "Override"
        }
      }
    }
```

Example for Omniture (only `mkt_campaign` can be populated)

```
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

It is possible to have more than one parameter name in each array. If multiple acceptable parameter names for the same field are found in the query string, the first one listed in the configuration JSON will take precedence. Example:

```
    "parameters":{
      "mapping":"static",
      "fields":{
        "mktMedium":[
          "utm_medium",
          "medium"
        ],
        "mktSource":[
          "utm_source",
          "source"
        ],
        "mktTerm":[
          "utm_term",
          "legacy_term"
        ],
        "mktContent":[
          "utm_content"
        ],
        "mktCampaign":[
          "utm_campaign",
          "cid",
          "legacy_campaign"
        ]
      }
    }
```

## Output

This enrichment populates the following fields of the atomic event :

| Field | Purpose |
| --- | --- |
| `mkt_medium` | The advertising or marketing medium, for example: `banner`, `email newsletter`. |
| `mkt_source` | Identifies the advertiser, site, publication, etc. that is sending traffic to your property, for example: `newsletter4`, `billboard`. |
| `mkt_term` | Identifies keywords (terms). |
| `mkt_content` | Used to differentiate similar content, or links within the same ad. For example, if you have two call-to-action links within the same email message, you can use `mkt_content` and set different values for each so you can tell which version is more effective. |
| `mkt_campaign` | The individual campaign name, slogan, promo code, etc. for a product. |
| `mkt_clickid` | Click ID which resulted in the redirect/follow request |
| `mkt_network` | The advertising network name, either default determined from parameter for Click ID or custom specifically stated |

If the enrichment is not activated, those fields will not be populated.
