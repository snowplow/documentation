### Compatibility

JSON Schema [iglu:com.snowplowanalytics.snowplow/anon\_ip/jsonschema/1-0-1](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/anon_ip/jsonschema/1-0-1) Compatibility r117+

### Overview

The IP anonymization enrichment lets you anonymize the IP addresses found in the `user_ipaddress` field by replacing a certain number of octets with “x”s. For example, anonymizing one octet would change the address `255.255.255.255` to `255.255.255.x`, and anonymizing three octets would change it to `255.x.x.x`. Version `1-0-1` adds support for anonymization of IPv6 addresses. `anonSegments` parameter is added to enrichment configuration. It describes how many segments should be anonymized. The IPv6 anonymization changes are backwards compatible. The `anonOctets` param will be read and used also for IPv6 in case of missing `anonSegments`. To fully use IPv6 anonymization it’s better to use the new schema (version `1-0-1`, which has `anonSegments` param). The new code can be used with `1-0-0` schema version also.

### Example

{
	"schema": "iglu:com.snowplowanalytics.snowplow/anon\_ip/jsonschema/1-0-1",

	"data": {

		"name": "anon\_ip",
		"vendor": "com.snowplowanalytics.snowplow",
		"enabled": true,
		"parameters": {
			"anonOctets": 2,
			"anonSegments": 1
		}
	}
}

The `anonOctets` field is set to two, so the last two octets of each IP address will be obscured.

### Data sources

The input value for the enrichment comes from `ip` parameter which is mapped to `user_ipaddress` field in `atomic.events` table.

### Algorithm

This enrichment algorithm is straightforward. The value of `anonOctets` set in [`JSON`](https://github.com/snowplow/snowplow/blob/master/3-enrich/config/enrichments/anon_ip.json) indicates how many octets of the [IPv4 address](https://en.wikipedia.org/wiki/IPv4) are to be masked with `x`s starting from the last octet. The value of the `ip` parameter is masked accordingly.

### Data generated

The masked (anonymized) value of the IP address will be recorded in `user_ipaddress` field of `atomic.events` table.
