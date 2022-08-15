---
title: "HTTP header extractor enrichment"
date: "2020-02-14"
sidebar_position: 0
---

This enrichment can extract name/value pairs from the HTTP headers and attach them to the event as derived contexts.

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/http_header_extractor_config/jsonschema/1-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/http_header_extractor_config.json)

All the headers that will match the regex defined in `headersPattern` parameter will be attached to the event.

In the example configuration, all the headers of the request would be attached to the event.

If we are only interested in the host for instance, we could have:

```
      "headersPattern": "Host"
```

## Input

This enrichment uses the HTTP headers.

## Output

For **each** header matching the regex defined in `headersPattern`, a context with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.ietf/http_header/jsonschema/1-0-0) is added to the enriched event. Each context contains only one name/value pair.
