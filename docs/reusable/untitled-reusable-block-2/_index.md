### Compatibility

JSON Schema [iglu:com.snowplowanalytics.snowplow.enrichments/http\_header\_extractor\_config/jsonschema/1-0-0](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow.enrichments/http_header_extractor_config/jsonschema/1-0-0) Compatibility r79+, Scala Stream Collector only Data provider None

### Overview

This enrichment allows to capture and store any header from HTTP request sent by website visitor to collector. HTTP are stored headers in the Thrift raw event payload by the Scala Stream Collector.

This community-contributed enrichment lets you specify headers that you want to extract via a regex pattern in the `headersPattern` parameter, if found each extracted header will end up a single derived context in the JSON Schema [org.ietf/http\_header/jsonschema/1-0-0](http://iglucentral.com/schemas/org.ietf/http_header/jsonschema/1-0-0).

### Example

Below configuration allows to extract all headers present in HTTP request, including cookies and auxiliary headers.

{
	"schema": "iglu:com.snowplowanalytics.snowplow.enrichments/http\_header\_extractor\_config/jsonschema/1-0-0",
	"data": {
		"name": "http\_header\_extractor\_config",
		"vendor": "com.snowplowanalytics.snowplow.enrichments",
		"enabled": true,
		"parameters": {
			"headersPattern": ".\*"
		}
	}
}

### Data sources

The data source for this enrichment is HTTP headers captured by the Scala Stream Collector and thus present in the Thrift raw event payload.

**Note**: This enrichment only works with events recorded by the Scala Stream Collector - the CloudFront and Clojure Collectors do not capture HTTP headers.

### Algorithm

The name(s) of header(s) that are of interest to the user are extracted from the [`http_header_extractor_config.json`](https://github.com/snowplow/snowplow/blob/master/3-enrich/config/enrichments/http_header_extractor_config.json).

The HTTP headers from the event payload are examined for presence and once pattern is found, value is captured and "inserted" as a single `derived_contexts` into the `enriched/good` stream/bucket.

### Data generated

As each key-value pair corresponding to the header is represented as a `derived_contexts` correlated to the JSON Schema [org.ietf/http\_header/jsonschema/1-0-0](http://iglucentral.com/schemas/org.ietf/http_header/jsonschema/1-0-0), the output of this enrichment is a separate entity with the `data.name` and `data.value` fields where `data.name` is the name of the header and `data.value` is its value.

If EMR enrichment is engaged (as opposed to Kinesis) the generated data ends up in `org_ietf_http_header_1` table.
