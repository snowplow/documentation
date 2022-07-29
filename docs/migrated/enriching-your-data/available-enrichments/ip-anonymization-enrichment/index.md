---
title: "IP anonymization enrichment"
date: "2020-02-14"
sidebar_position: 40
---

This enrichment replaces the end of the user's IP address with "x"s, on a configurable length. For instance 13.54.45.87 could become 13.54.x.x.

Both IPv4 and IPv6 are supported.

This enrichment runs after [IP lookup enrichment](/docs/migrated/enriching-your-data/available-enrichments/ip-lookup-enrichment/).

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/anon_ip/jsonschema/1-0-1)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/anon_ip.json)

The number of octets (IPv4) to anonymize is specified with `anonOctets` and the number of segments (IPv6) to anonymize is specified with `anonSegments`.

For example anonymizing one octet would change an IPv4 address of 255.255.255.255 to 255.255.255.x, and anonymizing three octets would change it to 255.x.x.x.

## Input

This enrichment uses the IP of the user, that can be found in `user_ipaddress` field of the atomic event.

## Output

The anonymized value of the IP address is updated in-place in `user_ipaddress` field, before ever being stored.
