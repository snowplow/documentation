### Compatibility

JSON Schema [iglu:com.snowplowanalytics.snowplow/campaign\_attribution/jsonschema/1-0-0](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/campaign_attribution/jsonschema/1-0-0)

- Compatibility 0.9.6+

JSON Schema [iglu:com.snowplowanalytics.snowplow/campaign\_attribution/jsonschema/1-0-1](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/campaign_attribution/jsonschema/1-0-1)

- Compatibility r63+

### Overview

#### 1-0-0

The original version of the campaign attribution enrichment lets you choose which querystring parameters will be used to generate the marketing campaign fields `mkt_medium`, `mkt_source`, `mkt_term`, `mkt_content`, and `mkt_campaign`. If you do not enable the campaign\_attribution enrichment, those fields will not be populated.

##### Examples

An example config JSON corresponding to the standard Google parameter names:

{
	"schema": "iglu:com.snowplowanalytics.snowplow/campaign\_attribution/jsonschema/1-0-1",

	"data": {

		"name": "campaign\_attribution",
		"vendor": "com.snowplowanalytics.snowplow",
		"enabled": true,
		"parameters": {
			"mapping": "static",
			"fields": {
				"mktMedium": \["utm\_medium"\],
				"mktSource": \["utm\_source"\],
				"mktTerm": \["utm\_term"\],
				"mktContent": \["utm\_content"\],
				"mktCampaign": \["utm\_campaign"\]
			}
		}
	}
}

This configuration indicates that, for instance, the `mkt_medium` field in the atomic.events table should be populated by the value of the “utm\_medium” field in the querystring. The Omniture version, in which only the `mkt_campaign` field can be populated:

{
	"schema": "iglu:com.snowplowanalytics.snowplow/campaign\_attribution/jsonschema/1-0-1",

	"data": {

		"name": "campaign\_attribution",
		"vendor": "com.snowplowanalytics.snowplow",
		"enabled": true,
		"parameters": {
			"mapping": "static",
			"fields": {
				"mktMedium": \[\],
				"mktSource": \[\],
				"mktTerm": \[\],
				"mktContent": \[\],
				"mktCampaign": \["cid"\]
			}
		}
	}
}

It is possible to have more than one parameter name in each array, for example:

{
    "schema": "iglu:com.snowplowanalytics.snowplow/campaign\_attribution/jsonschema/1-0-1",

    "data": {

        "name": "campaign\_attribution",
        "vendor": "com.snowplowanalytics.snowplow",
        "enabled": false,
        "parameters": {
            "mapping": "static",
            "fields": {
                "mktMedium": \["utm\_medium", "medium"\],
                "mktSource": \["utm\_source", "source"\],
                "mktTerm": \["utm\_term", "legacy\_term"\],
                "mktContent": \["utm\_content"\],
                "mktCampaign": \["utm\_campaign", "cid", "legacy\_campaign"\]
            }
        }
    }
}

If multiple acceptable parameter names for the same field are found in the querystring, the first one listed in the configuration JSON will take precedence. For example, using the above configuration, if the querystring contained:

```
"[...]&legacy_campaign=decoy&utm_campaign=mycampaign&cid=anotherdecoy[...]"
```

then the `mkt_campaign` field would be populated with “my\_campaign”.

#### 1-0-1

Version 1-0-1 of the enrichment will also search the querystring for a name-value pair based on which it can populate the `mkt_clickid` and `mkt_network` fields, which correspond to the click ID and the network responsible for the click. The enrichment automatically knows about Google (corresponding to the “gclid” querystring parameter), Microsoft (“msclkid”), and DoubleClick (“dclid”). For example, if the querystring contained `...&gclid=abc&...` then the `mkt_clickid` field would be populated with `"abc"` and the `mkt_network` field would be populated with `"Google"`.

##### Example

You can add other networks using the `mktClickId` field like this:

{
    "schema": "iglu:com.snowplowanalytics.snowplow/campaign\_attribution/jsonschema/1-0-1",

    "data": {

        "name": "campaign\_attribution",
        "vendor": "com.snowplowanalytics.snowplow",
        "enabled": true,
        "parameters": {
            "mapping": "static",
            "fields": {
                "mktMedium": \["utm\_medium", "medium"\],
                "mktSource": \["utm\_source", "source"\],
                "mktTerm": \["utm\_term", "legacy\_term"\],
                "mktContent": \["utm\_content"\],
                "mktCampaign": \["utm\_campaign", "cid", "legacy\_campaign"\],
                "mktClickId": {
                    "customclid": "MyNetwork"
                }
            }
        }
    }
}

Then for a querystring containing `...&customclid=abc&...` the `mkt_clickid` field would be populated with `"abc"` and the `mkt_network` field would be populated with `"MyNetwork"`. The “mapping” field is currently not implemented. In the future, setting it to “script” will indicate that the enrichment uses custom JavaScript to extract the campaign fields from the querystring.

### Data sources

The input values for this enrichment come from querystring of `url` (`page_url`) parameter. It is mapped to `page_urlquery` field in `atomic.events` table.

### Algorithm

The enrichment is straightforward here. If the enrichment is enabled the query string is parsed and the five marketing campaign fields `mkt_medium`, `mkt_source`, `mkt_term`, `mkt_content`, and `mkt_campaign` are populated with the extracted values the mapping of which is determined by one of the above corresponding schemas. If multiple acceptable parameter names for the same field are found in the querystring, the first one listed in the configuration JSON will take precedence. Additionally, JSON schema 1-0-1 allows to add `mkt_clickid` and `mkt_network` fields which correspond to the click ID and the network responsible for the click. One of the three parameters (if found in querystring) `gclid`, `msclkid`, or `dclid` are mapped to Google, Microsoft, and DoubleClick respectively. The custom network could be introduced if it corresponds to `mktClickId` field of JSON schema.

### Data generated

Below is the summary of the fields in `atomic.events` table driven by the result of this enrichment (no dedicated table).

| Field | Purpose |
| --- | --- |
| `mkt_medium` | The advertising or marketing medium, for example: `banner`, `email newsletter`. |
| `mkt_source` | Identifies the advertiser, site, publication, etc. that is sending traffic to your property, for example: `newsletter4`, `billboard`. |
| `mkt_term` | Identifies keywords (terms). |
| `mkt_content` | Used to differentiate similar content, or links within the same ad. For example, if you have two call-to-action links within the same email message, you can use `mkt_content` and set different values for each so you can tell which version is more effective. |
| `mkt_campaign` | The individual campaign name, slogan, promo code, etc. for a product. |
| `mkt_clickid` | Click ID which resulted in the redirect/follow request |
| `mkt_network` | The advertising network name, either default determined from parameter for Click ID or custom specifically stated |
