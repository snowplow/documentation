---
title: "Referer parser enrichment"
date: "2020-02-14"
sidebar_position: 50
---

This enrichment uses [snowplow referer-parser](https://github.com/snowplow/referer-parser) library to extract attribution data from referer URLs.

Knowing which sites refer users to our website is very much a staple of analytics in order to help understand traffic patterns. This enrichment takes the value of the referring URL and matches it against the company/site it belongs to.

This is particularly useful when looking for specific traffic from search engine providers or social networks for instance. Rather than scouring a full referrer URL list this enrichment adds an additional field so that it's possible to look at reports that combine sub-domains from some of the bigger referrers.

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/referer_parser/jsonschema/2-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/referer_parser.json)

Snowplow has several subdomains like _console.snowplowanalytics.com_ and _discourse.snowplowanalytics.com_. As users move from these subdomains to our main _snowplowanalytics.com_ domain, we would like to capture that traffic as being referred internally. Therefore we would set the configuration as such:

```
"internalDomains": [
    "console.snowplowanalytics.com",
    "discourse.snowplowanalytics.com"
],
```

Enabling this enrichment with the above configuration would fill the `refr_medium` column in our data warehouse with _“Internal”_ (rather then _"Unknown"_) when the referring URL to a page matches the subdomains above.

## Output

This enrichment populates the following fields of the atomic event :

| Field | Purpose |
| --- | --- |
| `refr_medium` | Type of referer. Examples : Search, Internal, Unknown, Social, Email |
| `refr_source` | Name of referer if recognised. Examples: Google, Facebook |
| `refr_term` | Keywords if source is a search engine |

With this information in the data warehouse it's possible to get such insights:

| refr\_medium | number of sessions |
| --- | --- |
| Search | 272,699 |
| Internal | 142,555 |
| Unknown | 127,335 |
| Social | 14,525 |
| Email | 5,345 |
