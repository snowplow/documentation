### Compatibility

JSON Schema [iglu:com.snowplowanalytics.snowplow.enrichments/iab\_spiders\_and\_robots\_enrichment/jsonschema/1-0-0](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow.enrichments/iab_spiders_and_robots_enrichment/jsonschema/1-0-0) Compatibility R107 Data provider [IAB](https://www.iab.com/)

### Overview

The IAB Spiders & Robots Enrichment uses the [IAB/ABC International Spiders and Bots List](https://www.iab.com/guidelines/iab-abc-international-spiders-bots-list/) to determine whether an event was produced by a user or a robot/spider based on its’ IP address and user agent. There are three fields that can be added to the “parameters” section of the enrichment configuration JSON: `ipFile`, `excludeUseragentFile` and `includeUseragentFile`. They correspond to one of the IAB/ABC database files, and need to have two inner fields:

- The `database` field containing the name of the database file.
- The `uri` field containing the URI of the bucket in which the database file is found. This field supports http:, https: and s3: schemes.

The table below describes the three types of database fields:

| **Field name** | **Database description** | **Database filename** |
| --- | --- | --- |
| `ipFile` | Blacklist of IP addresses considered to be robots of spiders | `"ip_exclude_current_cidr.txt"` |
| `excludeUseragentFile` | Blacklist of useragent strings considered to be robots or spiders | `"exclude_current.txt"` |
| `includeUseragentFile` | Whitelist of useragent strings considered to be browsers | `"include_current.txt"` |

All three of these fields **must** be added to the enrichment JSON, as the IAB lookup process uses all three databases in order to detect robots and spiders. Note that the database files are commercial and proprietary and should not be stored publically – for instance, on unprotected HTTPS or in a public S3 bucket.

### Examples

Here is an example configuration JSON, containing all databases required by the enrichment:

{
    "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/iab\_spiders\_and\_robots\_enrichment/jsonschema/1-0-0",
    "data": {
        "name": "iab\_spiders\_and\_robots\_enrichment",
        "vendor": "com.snowplowanalytics.snowplow.enrichments",
        "enabled": true,
        "parameters": {
            "ipFile": {
                "database": "ip\_exclude\_current\_cidr.txt",
                "uri": "s3://my-private-bucket/iab"
            },
            "excludeUseragentFile": {
                "database": "exclude\_current.txt",
                "uri": "s3://my-private-bucket/iab"
            },
            "includeUseragentFile": {
                "database": "include\_current.txt",
                "uri": "s3://my-private-bucket/iab"
            }
        }
    }
}

### Data sources

This enrichment uses the following fields of a Snowplow event:

- `useragent` to determine an event’s useragent, which will be validated against the databases described in `excludeUseragentFile` and `includeUseragentFile`.
- `user_ipaddress` to determine an event’s IP address, which will be validated against the database described in `ipFile`.
- `derived_tstamp` to determine an event’s datetime. Some entries in the Spiders & Robots List can be considered “stale”, and will be given a `category` of `INACTIVE_SPIDER_OR_ROBOT` rather than `ACTIVE_SPIDER_OR_ROBOT` based on their age.

### Algorithm

As mentioned previously, this enrichment uses the IAB/ABC International Spiders & Robots List to look up information about an event based on it’s IP address and useragent. It processes IAB/ABC database files using the Snowplow [IAB Spiders And Robots Java Client](https://github.com/snowplow/iab-spiders-and-robots-java-client).

### Data generated

The enrichment adds a new derived context to the enriched event, which is based on the [com.iab.snowplow/spiders\_and\_robots/jsonschema/1-0-0](http://iglucentral.com/schemas/com.iab.snowplow/spiders_and_robots/jsonschema/1-0-0) schema and contains the following data:

| Field | Purpose |
| --- | --- |
| `spiderOrRobot` | true if the event checked against the list is a spider or robot, false otherwise |
| `category` | a category based on activity if event is a spider or robot, BROWSER otherwise |
| `reason` | the type of database that caused the event to be flagged as a spider or robot, PASSED\_ALL otherwise |
| `primaryImpact` | whether the spider or robot would affect page impression measurement, ad impression measurement, both or none |

Here is an example of the derived context attached to an enriched Snowplow event:

{
    "schema": "iglu:com.iab.snowplow/spiders\_and\_robots/jsonschema/1-0-0",
    "data": {
        "spiderOrRobot": false,
        "category": "BROWSER",
        "reason": "PASSED\_ALL",
        "primaryImpact": "NONE"
    }
}
