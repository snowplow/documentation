---
title: "Cookie extractor enrichment"
sidebar_position: 7
sidebar_label: Cookie extractor
---

This enrichment extracts name-value pairs from cookies set on the collector domain, attaching them to the event as derived contexts.

A powerful attribute of using a custom collector domain is the ability to capture values in first-party cookies set by other services such as ad servers or content management software (CMS). By capturing these cookie fields and attaching them to the event, you can use the data to better identify users of your website.

## Examples

The following table provides examples of how the cookie and collector domains interact, indicating whether or not the cookies can be accessed with this enrichment.

| Collector Domain | Cookie Domain | Cookies Extracted |
| ---------------- | ------------- | ----------------- |
| c.snowplow.io | acme.com | ❌ |
| t.acme.com | c.acme.com | ❌ |
| t.acme.com | acme.com | ✅ |
| sp.track.acme.com | acme.com | ✅ |

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/cookie_extractor_config/jsonschema/1-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/cookie_extractor_config.json)

In the configuration we specify the list of cookie keys for which we want to extract the value and attach it to the event.

The example configuration is capturing Scala Stream Collector’s own “sp” cookie value but in practice we would probably want to extract other more valuable cookies available on the company domain.

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"
```

<TestingWithMicro>

You will likely also need to [configure Micro to work with first-party cookies](/docs/testing/snowplow-micro/remote-usage/index.md#locally-resolving-an-existing-domain-name-to-micro).

</TestingWithMicro>

## Input

This enrichment uses the `Cookie` HTTP header.

## Output

For **each** key listed in the configuration, a context with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.ietf/http_cookie/jsonschema/1-0-0) is added to the enriched event. Each context contains only one key/value pair.
