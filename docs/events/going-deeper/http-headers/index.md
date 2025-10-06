---
title: "HTTP request headers"
---

Snowplow Collectors will collect any standard HTTP headers and the values of these headers can be extracted during Enrichment. The [HTTP header extractor enrichment](/docs/pipeline/enrichments/available-enrichments/http-header-extractor-enrichment/index.md) can be configured for the headers you wish to extract.

Additionally, the following two headers can be sent on requests:

| Header       | Allowed Values     | Description                                                                                                |
| ------------ | ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Content-Type | `application/json` | See [MDN Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)             |
| SP-Anonymous | `*`                | Enables Server Side Anonymization, preventing the User IP Address and Network User ID from being collected |

#### Cookie Header

Snowplow Collectors will collect any cookie information sent in the `Cookie` HTTP header. Cookies can be attached to events using the [Cookie extractor enrichment](/docs/pipeline/enrichments/available-enrichments/cookie-extractor-enrichment/index.md)
