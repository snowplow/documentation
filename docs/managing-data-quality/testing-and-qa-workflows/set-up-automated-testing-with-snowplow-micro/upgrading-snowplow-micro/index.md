---
title: "Upgrading Snowplow Micro"
date: "2021-03-26"
sidebar_position: 10
---

## Upgrading from v0.x to v1

- Snowplow Micro v1 uses the exact same validation with a production Snowplow pipeline, which is even stricter and so ensures that if Micro validates an event, then it cannot fail during the enrichment in production.
- Micro now outputs the post-enrichment, canonical event (just with enrichments deactivated).

If you have been using the previous version (v0.1.0) in your test suites, you can easily upgrade to the new version (recommended). The steps include:

- Point to the newest v1 version `1.2.1` of Micro in your `docker run` command or in your `docker-compose.yml` file.
- Modify the configuration for Micro, an example of which can be found in the `micro.conf` file [here](https://github.com/snowplow-incubator/snowplow-micro/blob/master/example/micro.conf).
- The [response format](https://github.com/snowplow-incubator/snowplow-micro#response-format-1) for `GoodEvents` has changed, since Micro now outputs the post-enrichment event. This means that if in your tests you were filtering on `GoodEvents` through the `/micro/good` endpoint, you will need to change:
    - the expected values for `eventType`.

<table><tbody><tr><td class="has-text-align-center" data-align="center"><strong>v0</strong></td><td class="has-text-align-center" data-align="center"><strong>v1</strong></td></tr><tr><td class="has-text-align-center" data-align="center"><code>pv</code></td><td class="has-text-align-center" data-align="center"><code>page_view</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>pp</code></td><td class="has-text-align-center" data-align="center"><code>page_ping</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>se</code></td><td class="has-text-align-center" data-align="center"><code>struct</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>ue</code></td><td class="has-text-align-center" data-align="center"><code>unstruct</code></td></tr></tbody></table>

- the event specific fields, that were transformed for enrichment. Some of them are in the table below, but you can see all of the transformations [here](https://github.com/snowplow/enrich/blob/master/modules/common/src/main/scala/com.snowplowanalytics.snowplow.enrich/common/enrichments/Transform.scala). Note: The `unstruct_event` and `contexts` fields have already parsed the `ue_pr` and `co` and have already decoded and parsed the `ue_px` and `cx` raw event fields respectively.

<table><tbody><tr><td class="has-text-align-center" data-align="center"><strong>v0</strong></td><td class="has-text-align-center" data-align="center"><strong>v1</strong></td></tr><tr><td class="has-text-align-center" data-align="center"><code>e</code></td><td class="has-text-align-center" data-align="center"><code>event</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>aid</code></td><td class="has-text-align-center" data-align="center"><code>app_id</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>p</code></td><td class="has-text-align-center" data-align="center"><code>platform</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>uid</code></td><td class="has-text-align-center" data-align="center"><code>user_id</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>dtm</code></td><td class="has-text-align-center" data-align="center"><code>dvce_created_tstamp</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>tna</code></td><td class="has-text-align-center" data-align="center"><code>name_tracker</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>page</code></td><td class="has-text-align-center" data-align="center"><code>page_title</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>se_ca</code></td><td class="has-text-align-center" data-align="center"><code>se_category</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>se_ac</code></td><td class="has-text-align-center" data-align="center"><code>se_action</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>se_la</code></td><td class="has-text-align-center" data-align="center"><code>se_label</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>se_pr</code></td><td class="has-text-align-center" data-align="center"><code>se_property</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>se_va</code></td><td class="has-text-align-center" data-align="center"><code>se_value</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>ue_pr</code></td><td class="has-text-align-center" data-align="center"><code>unstruct_event</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>co</code></td><td class="has-text-align-center" data-align="center"><code>contexts</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>ue_px</code></td><td class="has-text-align-center" data-align="center"><code>unstruct_event</code></td></tr><tr><td class="has-text-align-center" data-align="center"><code>cx</code></td><td class="has-text-align-center" data-align="center"><code>contexts</code></td></tr></tbody></table>

- the structure you expect. The event that was the output of Micro's v0, now corresponds to the `rawEvent` field of the event output of v1. A _partial_ example of a `GoodEvent` follows, showing the structure and highlight the differences described above:

```
// raw event parameters
"rawEvent": {
    "parameters": {
      "e": "ue",
      "eid": "966d4d79-11d9-4fa6-a1a5-6a0bc2d06de1",
      "aid": "DemoID",
      "ue_pr": "{\"schema\":\"iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0\",\"data\":{\"schema\":\"iglu:com.snowplowanalytics.snowplow/focus_form/jsonschema/1-0-0\",\"data\":{\"formId\":\"FORM\",\"elementId\":\"user_email\",\"nodeName\":\"INPUT\",\"elementClasses\":[\"form-control\"],\"value\":\"fake@foo.com\",\"elementType\":\"email\"}}}"
    }
}

// corresponding canonical event properties
"event": {
    "event": "unstruct",
    "event_id": "966d4d79-11d9-4fa6-a1a5-6a0bc2d06de1",
    "app_id": "DemoID",
    "unstruct_event": {
      "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
      "data": {
        "schema": "iglu:com.snowplowanalytics.snowplow/focus_form/jsonschema/1-0-0",
        "data": {
          "formId": "FORM",
          "elementId": "user_email",
          "nodeName": "INPUT",
          "elementClasses": [ "form-control" ],
          "value": "fake@foo.com",
          "elementType": "email"
        }
      }
    }
  }
```
