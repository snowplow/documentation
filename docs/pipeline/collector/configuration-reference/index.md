---
title: "Collector configuration API reference"
sidebar_position: 10
sidebar_label: "Configuration reference"
description: "Reference for the Console API Collector configuration endpoint, its response fields and defaults, and the HTTP request headers the Snowplow Collector accepts."
keywords: ["collector configuration API", "cookieDomains", "cookieAttributes", "blockUnencrypted", "SP-Anonymous", "collector HTTP headers"]
date: "2026-11-06"
content_type: reference
---

This page describes the Console API endpoint that returns a pipeline's Collector configuration, the fields in its response, and the HTTP request headers the Collector accepts. To view or retrieve the configuration step by step, see [Check your Collector configuration](/docs/pipeline/collector/index.md). For the Self-Hosted Collector's configuration file, see the [Collector configuration options](/docs/api-reference/stream-collector/configure/index.md).

## Parameters

The endpoint takes two path parameters and returns one JSON object.

### Endpoint

`GET https://console.snowplowanalytics.com/api/msc/v1/organizations/{organizationId}/resources/v1/pipelines/{pipelineId}/configuration/collector`

`GET` is the only supported method. Every request needs an `Authorization: Bearer {{token}}` header; [Check your Collector configuration](/docs/pipeline/collector/index.md#get-an-access-token) shows how to get the token. The [API specification](https://console.snowplowanalytics.com/api/msc/v1/docs/index.html?url=/api/msc/v1/docs/docs.yaml#/configuration/getOrganizationsOrganizationidResourcesV1PipelinesPipelineidConfigurationCollector) is the normative definition.

<ParamTable>
  <Param name="organizationId" type="UUID" required>
    Your organization ID, from the **Manage organization** page in Console.
  </Param>
  <Param name="pipelineId" type="UUID" required>
    The pipeline ID: the second UUID in the browser's address bar when you view the pipeline in Console.
  </Param>
</ParamTable>

### Response fields

`cookieDomains`, `paths`, and `cookieAttributes` are always present in the response.

<ParamTable>
  <Param name="cookieDomains" type="object" required>
    The domains the Collector sets cookies for.
  </Param>
  <Param name="cookieDomains.domains" type="string[]" required depth={1}>
    Domains for which Collector cookies are set. May be an empty list.
  </Param>
  <Param name="cookieDomains.fallback" type="string" required={false} default="none" depth={1}>
    The fallback cookie domain.
  </Param>
  <Param name="paths" type="object" required>
    The request paths the Collector accepts.
  </Param>
  <Param name="paths.post.paths" type="string[]" required depth={1}>
    Paths that accept Tracker Protocol 2 compatible `POST` requests.
  </Param>
  <Param name="paths.redirect.enabled" type="boolean" required depth={1}>
    Whether redirect-based tracking is enabled.
  </Param>
  <Param name="paths.redirect.paths" type="string[]" required depth={1}>
    Paths that support redirect-based tracking.
  </Param>
  <Param name="paths.webhook.paths" type="string[]" required depth={1}>
    Paths for events sent in a `GET` or `POST` request with an [Iglu](https://github.com/snowplow/iglu)-compatible event payload.
  </Param>
  <Param name="cookieAttributes" type="object" required>
    Attributes of the Collector cookie.
  </Param>
  <Param name="cookieAttributes.secure" type="boolean" required depth={1}>
    Whether secure connections are enforced.
  </Param>
  <Param name="cookieAttributes.httpOnly" type="boolean" required depth={1}>
    Whether the cookie is inaccessible to non-HTTP requests.
  </Param>
  <Param name="cookieAttributes.sameSite" type="'lax' | 'none' | 'strict'" required depth={1}>
    The cookie's `SameSite` attribute.
  </Param>
  <Param name="blockUnencrypted" type="boolean" required={false} default="false">
    Whether the Collector blocks unencrypted traffic.
  </Param>
</ParamTable>

## Example

A response for a pipeline with one fallback cookie domain and redirect tracking enabled:

```json
{
    "cookieDomains":
    {
        "fallback": "mydomain.com",
        "domains": []
    },
    "paths": {
        "post": {
            "paths": []
        },
        "webhook": {
            "paths": []
        },
        "redirect": {
            "paths": [],
            "enabled": true
        }
    },
    "cookieAttributes": {
        "secure": true,
        "sameSite": "None",
        "httpOnly": false
    },
    "blockUnencrypted": false
}
```

## HTTP request headers

The Collector collects all standard HTTP headers. To add header values to your events, configure the [HTTP header extractor enrichment](/docs/pipeline/enrichments/available-enrichments/http-header-extractor-enrichment/index.md) for the headers you want.

These two headers also change how the Collector handles a request:

| Header         | Allowed values     | Description                                                                                                       |
| -------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `Content-Type` | `application/json` | See [MDN Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)                    |
| `SP-Anonymous` | `*`                | Enables [server-side anonymization](/docs/events/anonymous-tracking/index.md), so the Collector doesn't collect the user's IP address or network user ID |

The Collector also collects the cookies sent in the `Cookie` header. To attach cookie values to your events, use the [cookie extractor enrichment](/docs/pipeline/enrichments/available-enrichments/cookie-extractor-enrichment/index.md).
