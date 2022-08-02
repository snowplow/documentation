### Compatibility

JSON Schema [iglu:com.snowplowanalytics.snowplow/cookie\_extractor\_config/jsonschema/1-0-0](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/cookie_extractor_config/jsonschema/1-0-0) Compatibility r72+, Scala Stream Collector only Data provider None

### Overview

One powerful attribute of having Snowplow event collection on your own domain (e.g. `events.snowplowanalytics.com`) is the ability to capture first-party cookies set by other services on your domain such as ad servers or CMSes; these cookies are stored as HTTP headers in the Thrift raw event payload by the Scala Stream Collector. This community-contributed enrichment lets you specify cookies that you want to extract if found; each extracted cookie will end up a single derived context in the JSON Schema [org.ietf/http\_cookie/jsonschema/1-0-0](http://iglucentral.com/schemas/org.ietf/http_cookie/jsonschema/1-0-0).

### Example

{
	"schema": "iglu:com.snowplowanalytics.snowplow/cookie\_extractor\_config/jsonschema/1-0-0",
	"data": {
		"name": "cookie\_extractor\_config",
		"vendor": "com.snowplowanalytics.snowplow",
		"enabled": true,
		"parameters": {
			"cookies": \["sp"\]
		}
	}
}

This default configuration is capturing the Scala Stream Collector’s own `sp` cookie – in practice you would probably extract other more valuable cookies available on your company domain.

### Data sources

The data source for this enrichment is HTTP headers captured by the Scala Stream Collector and thus present in the Thrift raw event payload. Specifically, it is the `Cookie` header that is targeted here. **Note**: This enrichment only works with events recorded by the Scala Stream Collector – the CloudFront and Clojure Collectors do not capture HTTP headers.

### Algorithm

The name(s) of cookie(s) that are of interest to the user are extracted from the [`cookie_extractor_config.json`](https://github.com/snowplow/snowplow/blob/master/3-enrich/config/enrichments/cookie_extractor_config.json). The HTTP headers from the event payload are examined for presence of the cookie(s) and once found its name and value is captured and “inserted” as a single `derived_contexts` into the `enriched/good` stream/bucket.

### Data generated

As each key-value pair corresponding to the cookie is represented as a `derived_contexts` correlated to the JSON Schema [org.ietf/http\_cookie/jsonschema/1-0-0](http://iglucentral.com/schemas/org.ietf/http_cookie/jsonschema/1-0-0), the output of this enrichment is a separate entity with the `data.name` and `data.value` fields where `data.name` is the name of the cookie and `data.value` is its value. If EMR enrichment is engaged (as opposed to Kinesis) the generated data ends up in `org_ietf_http_cookie_1` table.
