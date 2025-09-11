---
title: "REST API"
sidebar_position: 1
description: "REST API reference for Snowplow Micro behavioral event testing and validation endpoints."
schema: "TechArticle"
keywords: ["Micro API", "Testing API", "Local API", "Development API", "Micro Interface", "Testing Interface"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

This page documents the REST API of [Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/index.md#what-is-snowplow-micro).

## /micro/all

This endpoint responds with a summary JSON object of the number of total, good and bad events currently in the cache.

### HTTP method

`GET`, `POST`, `OPTIONS`

### Response format

Example:

```json
{
  "total": 7,
  "good": 5,
  "bad": 2
}
```

## /micro/good

This endpoint queries the good events, which are the events that have been successfully validated.

### HTTP method

- `GET`: get _all_ the good events from the cache.
- `POST`: get the good events with the possibility to filter.

### Response format

JSON array of [GoodEvent](https://github.com/snowplow-incubator/snowplow-micro/blob/master/src/main/scala/com.snowplowanalytics.snowplow.micro/model.scala#L19)s. A `GoodEvent` contains 4 fields:

- `rawEvent`: contains the [RawEvent](https://github.com/snowplow/enrich/blob/master/modules/common/src/main/scala/com.snowplowanalytics.snowplow.enrich/common/adapters/RawEvent.scala#L28). It corresponds to the format of a validated event just before being enriched.
- `event`: contains the [canonical snowplow Event](https://github.com/snowplow/snowplow-scala-analytics-sdk/blob/master/src/main/scala/com.snowplowanalytics.snowplow.analytics.scalasdk/Event.scala#L42). It is in the format of an event after enrichment, even if all the enrichments are deactivated.
- `eventType`: type of the event.
- `schema`: schema of the event in case of an unstructured event.
- `contexts`: contexts of the event.

An example of a response with one event can be found below:

```json
[
  {
    "rawEvent":{
      "api":{
        "vendor":"com.snowplowanalytics.snowplow",
        "version":"tp2"
      },
      "parameters":{
        "e":"pv",
        "duid":"36746fd2-8441-4ea2-8ad0-237d6f4c77cf",
        "vid":"1",
        "co":"{\"schema\":\"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0\",\"data\":[{\"schema\":\"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0\",\"data\":{\"id\":\"5cea9899-10df-4ccf-bf66-8c36f4a4bba2\"}}]}",
        "eid":"bee0a6d7-fc17-4392-b2bc-2208e8e944f3",
        "url":"http://localhost:8000/",
        "refr":"http://localhost:8000/__/",
        "aid":"shop",
        "tna":"sp1",
        "cs":"UTF-8",
        "cd":"24",
        "stm":"1630238465752",
        "tz":"Europe/London",
        "tv":"js-3.1.3",
        "vp":"1000x660",
        "ds":"988x670",
        "res":"1920x1080",
        "cookie":"1",
        "p":"web",
        "dtm":"1630238465748",
        "uid":"tester",
        "lang":"en-US",
        "sid":"6d15a4fb-9623-4ba1-b876-5240e72e6970"
      },
      "contentType":"application/json",
      "source":{
        "name":"ssc-2.3.1-stdout$",
        "encoding":"UTF-8",
        "hostname":"0.0.0.0"
      },
      "context":{
        "timestamp":"2021-08-29T12:01:05.787Z",
        "ipAddress":"172.17.0.1",
        "useragent":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
        "refererUri":"http://localhost:8000/",
        "headers":[
          "Timeout-Access: <function1>",
          "Connection: keep-alive",
          "Host: 0.0.0.0:9090",
          "User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
          "Accept: */*",
          "Accept-Language: en-US, en;q=0.5",
          "Accept-Encoding: gzip",
          "Referer: http://localhost:8000/",
          "Origin: http://localhost:8000",
          "Cookie: micro=3734601f-5c3d-47c5-b367-0883e1ed74e6",
          "application/json"
        ],
        "userId":"3734601f-5c3d-47c5-b367-0883e1ed74e6"
      }
    },
    "eventType":"page_view",
    "schema":"iglu:com.snowplowanalytics.snowplow/page_view/jsonschema/1-0-0",
    "contexts":[
      "iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0"
    ],
    "event":{
      "app_id":"shop",
      "platform":"web",
      "etl_tstamp":"2021-08-29T12:01:05.792Z",
      "collector_tstamp":"2021-08-29T12:01:05.787Z",
      "dvce_created_tstamp":"2021-08-29T12:01:05.748Z",
      "event":"page_view",
      "event_id":"bee0a6d7-fc17-4392-b2bc-2208e8e944f3",
      "txn_id":null,
      "name_tracker":"sp1",
      "v_tracker":"js-3.1.3",
      "v_collector":"ssc-2.3.1-stdout$",
      "v_etl":"snowplow-micro-1.3.1-common-2.0.2",
      "user_id":"tester",
      "user_ipaddress":"172.17.0.1",
      "user_fingerprint":null,
      "domain_userid":"36746fd2-8441-4ea2-8ad0-237d6f4c77cf",
      "domain_sessionidx":1,
      "network_userid":"3734601f-5c3d-47c5-b367-0883e1ed74e6",
      "geo_country":null,
      "geo_region":null,
      "geo_city":null,
      "geo_zipcode":null,
      "geo_latitude":null,
      "geo_longitude":null,
      "geo_region_name":null,
      "ip_isp":null,
      "ip_organization":null,
      "ip_domain":null,
      "ip_netspeed":null,
      "page_url":"http://localhost:8000/",
      "page_title":null,
      "page_referrer":"http://localhost:8000/__/",
      "page_urlscheme":"http",
      "page_urlhost":"localhost",
      "page_urlport":8000,
      "page_urlpath":"/",
      "page_urlquery":null,
      "page_urlfragment":null,
      "refr_urlscheme":"http",
      "refr_urlhost":"localhost",
      "refr_urlport":8000,
      "refr_urlpath":"/__/",
      "refr_urlquery":null,
      "refr_urlfragment":null,
      "refr_medium":null,
      "refr_source":null,
      "refr_term":null,
      "mkt_medium":null,
      "mkt_source":null,
      "mkt_term":null,
      "mkt_content":null,
      "mkt_campaign":null,
      "contexts":{
        "schema":"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
        "data":[
          {
            "schema":"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0",
            "data":{
              "id":"5cea9899-10df-4ccf-bf66-8c36f4a4bba2"
            }
          }
        ]
      },
      "se_category":null,
      "se_action":null,
      "se_label":null,
      "se_property":null,
      "se_value":null,
      "unstruct_event":null,
      "tr_orderid":null,
      "tr_affiliation":null,
      "tr_total":null,
      "tr_tax":null,
      "tr_shipping":null,
      "tr_city":null,
      "tr_state":null,
      "tr_country":null,
      "ti_orderid":null,
      "ti_sku":null,
      "ti_name":null,
      "ti_category":null,
      "ti_price":null,
      "ti_quantity":null,
      "pp_xoffset_min":null,
      "pp_xoffset_max":null,
      "pp_yoffset_min":null,
      "pp_yoffset_max":null,
      "useragent":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
      "br_name":null,
      "br_family":null,
      "br_version":null,
      "br_type":null,
      "br_renderengine":null,
      "br_lang":"en-US",
      "br_features_pdf":null,
      "br_features_flash":null,
      "br_features_java":null,
      "br_features_director":null,
      "br_features_quicktime":null,
      "br_features_realplayer":null,
      "br_features_windowsmedia":null,
      "br_features_gears":null,
      "br_features_silverlight":null,
      "br_cookies":true,
      "br_colordepth":"24",
      "br_viewwidth":1000,
      "br_viewheight":660,
      "os_name":null,
      "os_family":null,
      "os_manufacturer":null,
      "os_timezone":"Europe/London",
      "dvce_type":null,
      "dvce_ismobile":null,
      "dvce_screenwidth":1920,
      "dvce_screenheight":1080,
      "doc_charset":"UTF-8",
      "doc_width":988,
      "doc_height":670,
      "tr_currency":null,
      "tr_total_base":null,
      "tr_tax_base":null,
      "tr_shipping_base":null,
      "ti_currency":null,
      "ti_price_base":null,
      "base_currency":null,
      "geo_timezone":null,
      "mkt_clickid":null,
      "mkt_network":null,
      "etl_tags":null,
      "dvce_sent_tstamp":"2021-08-29T12:01:05.752Z",
      "refr_domain_userid":null,
      "refr_dvce_tstamp":null,
      "derived_contexts":{},
      "domain_sessionid":"6d15a4fb-9623-4ba1-b876-5240e72e6970",
      "derived_tstamp":"2021-08-29T12:01:05.783Z",
      "event_vendor":"com.snowplowanalytics.snowplow",
      "event_name":"page_view",
      "event_format":"jsonschema",
      "event_version":"1-0-0",
      "event_fingerprint":null,
      "true_tstamp":null
    }
  }
]
```

### Filters

When querying `/micro/good` with `POST` (`Content-Type: application/json` needs to be set in the headers of the request), it's possible to specify filters, thanks to a JSON in the data of the HTTP request.

Example of command to query the good events: 

```bash
curl -X POST -H 'Content-Type: application/json' <IP:PORT>/micro/good -d '<JSON>'
```

An example of JSON with filters could be:

```json
{
  "schema": "iglu:com.acme/example/jsonschema/1-0-0",
  "contexts": [
    "com.snowplowanalytics.mobile/application/jsonschema/1-0-0",
    "com.snowplowanalytics.mobile/screen/jsonschema/1-0-0"
  ],
  "limit": 10
}
```

List of possible fields for the filters:

- `event_type`: type of the event (in `e` param);
- `schema`: corresponds to the schema of a [self-describing event](/docs/fundamentals/events/index.md#self-describing-events) (schema of the self-describing JSON contained in `ue_pr` or `ue_px`). It automatically implies `event_type` = `ue`.
- `contexts`: list of the schemas contained in the contexts of an event (parameters `co` or `cx`). An event must contain **all** the contexts of the list to be returned. It can also contain more contexts than the ones specified in the request.
- `limit`: limit the number of events in the response (most recent events are returned).

It's not necessary to specify all the fields in a request, only the ones that need to be used for filtering.

## /micro/bad

This endpoint queries the bad events, which are the events that failed validation.

### HTTP method

- `GET`: get _all_ the bad events from the cache.
- `POST`: get the bad events with the possibility to filter.

### Response format

JSON array of [BadEvent](https://github.com/snowplow-incubator/snowplow-micro/blob/master/src/main/scala/com.snowplowanalytics.snowplow.micro/model.scala#L28)s. A `BadEvent` contains 3 fields:

- `collectorPayload`: contains the [CollectorPayload](https://github.com/snowplow/enrich/blob/master/modules/common/src/main/scala/com.snowplowanalytics.snowplow.enrich/common/loaders/CollectorPayload.scala#L107) with all the raw information of the tracking event. This field can be empty if an error occured before trying to validate a payload.
- `rawEvent`: contains the [RawEvent](https://github.com/snowplow/enrich/blob/master/modules/common/src/main/scala/com.snowplowanalytics.snowplow.enrich/common/adapters/RawEvent.scala#L28). It corresponds to the format of a validated event just before being enriched.
- `errors`: list of errors that occured during the validation of the tracking event.

An example of a response with one bad event can be found below:

```json
[
  {
    "collectorPayload":{
      "api":{
        "vendor":"com.snowplowanalytics.snowplow",
        "version":"tp2"
      },
      "querystring":[],
      "contentType":"application/json",
      "body":"{\"schema\":\"iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4\",\"data\":[{\"e\":\"ue\",\"eid\":\"36c39024-7b1b-4c2c-ae85-e95a8cb8340a\",\"tv\":\"js-3.1.3\",\"tna\":\"spmicro\",\"aid\":\"sh0pspr33\",\"p\":\"web\",\"cookie\":\"1\",\"cs\":\"UTF-8\",\"lang\":\"en-US\",\"res\":\"1920x1080\",\"cd\":\"24\",\"tz\":\"Europe/London\",\"dtm\":\"1630234190717\",\"vp\":\"1000x660\",\"ds\":\"1003x2242\",\"vid\":\"1\",\"sid\":\"13c8f5ac-d999-4923-940d-b39f7b74aa94\",\"duid\":\"8a17bb29-e35c-4363-aec3-85b9b363f9bf\",\"uid\":\"tester\",\"refr\":\"http://localhost:8000/\",\"url\":\"http://localhost:8000/shop/\",\"ue_pr\":\"{\\\"schema\\\":\\\"iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"schema\\\":\\\"iglu:test.example.iglu/cart_action_event/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"type\\\":\\\"add\\\"}}}\",\"co\":\"{\\\"schema\\\":\\\"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0\\\",\\\"data\\\":[{\\\"schema\\\":\\\"iglu:test.example.iglu/product_entity/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"sku\\\":\\\"hh456\\\",\\\"name\\\":\\\"One-size bucket hat\\\",\\\"price\\\":24.49,\\\"quantity\\\":\\\"2\\\"}},{\\\"schema\\\":\\\"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"id\\\":\\\"fe0dd7c7-fb0b-43a2-b299-75d20baa94ec\\\"}}]}\",\"stm\":\"1630234190719\"}]}",
      "source":{
        "name":"ssc-2.3.1-stdout$",
        "encoding":"UTF-8",
        "hostname":"0.0.0.0"
      },
      "context":{
        "timestamp":"2021-08-29T10:49:50.727Z",
        "ipAddress":"172.17.0.1",
        "useragent":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
        "refererUri":"http://localhost:8000/",
        "headers":[
          "Timeout-Access: <function1>",
          "Connection: keep-alive",
          "Host: 0.0.0.0:9090",
          "User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
          "Accept: */*",
          "Accept-Language: en-US, en;q=0.5",
          "Accept-Encoding: gzip",
          "Referer: http://localhost:8000/",
          "Origin: http://localhost:8000",
          "Cookie: micro=3734601f-5c3d-47c5-b367-0883e1ed74e6",
          "application/json"
        ],
        "userId":"3734601f-5c3d-47c5-b367-0883e1ed74e6"
      }
    },
    "rawEvent":{
      "api":{
        "vendor":"com.snowplowanalytics.snowplow",
        "version":"tp2"
      },
      "parameters":{
        "e":"ue",
        "duid":"8a17bb29-e35c-4363-aec3-85b9b363f9bf",
        "vid":"1",
        "co":"{\"schema\":\"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0\",\"data\":[{\"schema\":\"iglu:test.example.iglu/product_entity/jsonschema/1-0-0\",\"data\":{\"sku\":\"hh456\",\"name\":\"One-size bucket hat\",\"price\":24.49,\"quantity\":\"2\"}},{\"schema\":\"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0\",\"data\":{\"id\":\"fe0dd7c7-fb0b-43a2-b299-75d20baa94ec\"}}]}",
        "eid":"36c39024-7b1b-4c2c-ae85-e95a8cb8340a",
        "url":"http://localhost:8000/shop/",
        "refr":"http://localhost:8000/",
        "aid":"sh0pspr33",
        "tna":"spmicro",
        "cs":"UTF-8",
        "cd":"24",
        "stm":"1630234190719",
        "tz":"Europe/London",
        "tv":"js-3.1.3",
        "vp":"1000x660",
        "ds":"1003x2242",
        "ue_pr":"{\"schema\":\"iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0\",\"data\":{\"schema\":\"iglu:test.example.iglu/cart_action_event/jsonschema/1-0-0\",\"data\":{\"type\":\"add\"}}}",
        "res":"1920x1080",
        "cookie":"1",
        "p":"web",
        "dtm":"1630234190717",
        "uid":"tester",
        "lang":"en-US",
        "sid":"13c8f5ac-d999-4923-940d-b39f7b74aa94"
      },
      "contentType":"application/json",
      "source":{
        "name":"ssc-2.3.1-stdout$",
        "encoding":"UTF-8",
        "hostname":"0.0.0.0"
      },
      "context":{
        "timestamp":"2021-08-29T10:49:50.727Z",
        "ipAddress":"172.17.0.1",
        "useragent":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
        "refererUri":"http://localhost:8000/",
        "headers":[
          "Timeout-Access: <function1>",
          "Connection: keep-alive",
          "Host: 0.0.0.0:9090",
          "User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
          "Accept: */*",
          "Accept-Language: en-US, en;q=0.5",
          "Accept-Encoding: gzip",
          "Referer: http://localhost:8000/",
          "Origin: http://localhost:8000",
          "Cookie: micro=3734601f-5c3d-47c5-b367-0883e1ed74e6",
          "application/json"
        ],
        "userId":"3734601f-5c3d-47c5-b367-0883e1ed74e6"
      }
    },
    "errors":[
      "Error while validating the event",
      "{\"schema\":\"iglu:com.snowplowanalytics.snowplow.badrows/schema_violations/jsonschema/2-0-0\",\"data\":{\"processor\":{\"artifact\":\"snowplow-micro\",\"version\":\"1.2.1\"},\"failure\":{\"timestamp\":\"2021-08-29T10:49:50.739178Z\",\"messages\":[{\"schemaKey\":\"iglu:test.example.iglu/product_entity/jsonschema/1-0-0\",\"error\":{\"error\":\"ValidationError\",\"dataReports\":[{\"message\":\"$.quantity: string found, integer expected\",\"path\":\"$.quantity\",\"keyword\":\"type\",\"targets\":[\"string\",\"integer\"]}]}}]},\"payload\":{\"enriched\":{\"app_id\":\"sh0pspr33\",\"platform\":\"web\",\"etl_tstamp\":\"2021-08-29 10:49:50.731\",\"collector_tstamp\":\"2021-08-29 10:49:50.727\",\"dvce_created_tstamp\":\"2021-08-29 10:49:50.717\",\"event\":\"unstruct\",\"event_id\":\"36c39024-7b1b-4c2c-ae85-e95a8cb8340a\",\"txn_id\":null,\"name_tracker\":\"spmicro\",\"v_tracker\":\"js-3.1.3\",\"v_collector\":\"ssc-2.3.1-stdout$\",\"v_etl\":\"snowplow-micro-1.2.1-common-2.0.2\",\"user_id\":\"tester\",\"user_ipaddress\":\"172.17.0.1\",\"user_fingerprint\":null,\"domain_userid\":\"8a17bb29-e35c-4363-aec3-85b9b363f9bf\",\"domain_sessionidx\":1,\"network_userid\":\"3734601f-5c3d-47c5-b367-0883e1ed74e6\",\"geo_country\":null,\"geo_region\":null,\"geo_city\":null,\"geo_zipcode\":null,\"geo_latitude\":null,\"geo_longitude\":null,\"geo_region_name\":null,\"ip_isp\":null,\"ip_organization\":null,\"ip_domain\":null,\"ip_netspeed\":null,\"page_url\":\"http://localhost:8000/shop/\",\"page_title\":null,\"page_referrer\":\"http://localhost:8000/\",\"page_urlscheme\":null,\"page_urlhost\":null,\"page_urlport\":null,\"page_urlpath\":null,\"page_urlquery\":null,\"page_urlfragment\":null,\"refr_urlscheme\":null,\"refr_urlhost\":null,\"refr_urlport\":null,\"refr_urlpath\":null,\"refr_urlquery\":null,\"refr_urlfragment\":null,\"refr_medium\":null,\"refr_source\":null,\"refr_term\":null,\"mkt_medium\":null,\"mkt_source\":null,\"mkt_term\":null,\"mkt_content\":null,\"mkt_campaign\":null,\"contexts\":\"{\\\"schema\\\":\\\"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0\\\",\\\"data\\\":[{\\\"schema\\\":\\\"iglu:test.example.iglu/product_entity/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"sku\\\":\\\"hh456\\\",\\\"name\\\":\\\"One-size bucket hat\\\",\\\"price\\\":24.49,\\\"quantity\\\":\\\"2\\\"}},{\\\"schema\\\":\\\"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"id\\\":\\\"fe0dd7c7-fb0b-43a2-b299-75d20baa94ec\\\"}}]}\",\"se_category\":null,\"se_action\":null,\"se_label\":null,\"se_property\":null,\"se_value\":null,\"unstruct_event\":\"{\\\"schema\\\":\\\"iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"schema\\\":\\\"iglu:test.example.iglu/cart_action_event/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"type\\\":\\\"add\\\"}}}\",\"tr_orderid\":null,\"tr_affiliation\":null,\"tr_total\":null,\"tr_tax\":null,\"tr_shipping\":null,\"tr_city\":null,\"tr_state\":null,\"tr_country\":null,\"ti_orderid\":null,\"ti_sku\":null,\"ti_name\":null,\"ti_category\":null,\"ti_price\":null,\"ti_quantity\":null,\"pp_xoffset_min\":null,\"pp_xoffset_max\":null,\"pp_yoffset_min\":null,\"pp_yoffset_max\":null,\"useragent\":\"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0\",\"br_name\":null,\"br_family\":null,\"br_version\":null,\"br_type\":null,\"br_renderengine\":null,\"br_lang\":\"en-US\",\"br_features_pdf\":null,\"br_features_flash\":null,\"br_features_java\":null,\"br_features_director\":null,\"br_features_quicktime\":null,\"br_features_realplayer\":null,\"br_features_windowsmedia\":null,\"br_features_gears\":null,\"br_features_silverlight\":null,\"br_cookies\":1,\"br_colordepth\":\"24\",\"br_viewwidth\":1000,\"br_viewheight\":660,\"os_name\":null,\"os_family\":null,\"os_manufacturer\":null,\"os_timezone\":\"Europe/London\",\"dvce_type\":null,\"dvce_ismobile\":null,\"dvce_screenwidth\":1920,\"dvce_screenheight\":1080,\"doc_charset\":\"UTF-8\",\"doc_width\":1003,\"doc_height\":2242,\"tr_currency\":null,\"tr_total_base\":null,\"tr_tax_base\":null,\"tr_shipping_base\":null,\"ti_currency\":null,\"ti_price_base\":null,\"base_currency\":null,\"geo_timezone\":null,\"mkt_clickid\":null,\"mkt_network\":null,\"etl_tags\":null,\"dvce_sent_tstamp\":\"2021-08-29 10:49:50.719\",\"refr_domain_userid\":null,\"refr_dvce_tstamp\":null,\"derived_contexts\":null,\"domain_sessionid\":\"13c8f5ac-d999-4923-940d-b39f7b74aa94\",\"derived_tstamp\":null,\"event_vendor\":null,\"event_name\":null,\"event_format\":null,\"event_version\":null,\"event_fingerprint\":null,\"true_tstamp\":null},\"raw\":{\"vendor\":\"com.snowplowanalytics.snowplow\",\"version\":\"tp2\",\"parameters\":[{\"name\":\"e\",\"value\":\"ue\"},{\"name\":\"duid\",\"value\":\"8a17bb29-e35c-4363-aec3-85b9b363f9bf\"},{\"name\":\"vid\",\"value\":\"1\"},{\"name\":\"co\",\"value\":\"{\\\"schema\\\":\\\"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0\\\",\\\"data\\\":[{\\\"schema\\\":\\\"iglu:test.example.iglu/product_entity/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"sku\\\":\\\"hh456\\\",\\\"name\\\":\\\"One-size bucket hat\\\",\\\"price\\\":24.49,\\\"quantity\\\":\\\"2\\\"}},{\\\"schema\\\":\\\"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"id\\\":\\\"fe0dd7c7-fb0b-43a2-b299-75d20baa94ec\\\"}}]}\"},{\"name\":\"eid\",\"value\":\"36c39024-7b1b-4c2c-ae85-e95a8cb8340a\"},{\"name\":\"url\",\"value\":\"http://localhost:8000/shop/\"},{\"name\":\"refr\",\"value\":\"http://localhost:8000/\"},{\"name\":\"aid\",\"value\":\"sh0pspr33\"},{\"name\":\"tna\",\"value\":\"spmicro\"},{\"name\":\"cs\",\"value\":\"UTF-8\"},{\"name\":\"cd\",\"value\":\"24\"},{\"name\":\"stm\",\"value\":\"1630234190719\"},{\"name\":\"tz\",\"value\":\"Europe/London\"},{\"name\":\"tv\",\"value\":\"js-3.1.3\"},{\"name\":\"vp\",\"value\":\"1000x660\"},{\"name\":\"ds\",\"value\":\"1003x2242\"},{\"name\":\"ue_pr\",\"value\":\"{\\\"schema\\\":\\\"iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"schema\\\":\\\"iglu:test.example.iglu/cart_action_event/jsonschema/1-0-0\\\",\\\"data\\\":{\\\"type\\\":\\\"add\\\"}}}\"},{\"name\":\"res\",\"value\":\"1920x1080\"},{\"name\":\"cookie\",\"value\":\"1\"},{\"name\":\"p\",\"value\":\"web\"},{\"name\":\"dtm\",\"value\":\"1630234190717\"},{\"name\":\"uid\",\"value\":\"tester\"},{\"name\":\"lang\",\"value\":\"en-US\"},{\"name\":\"sid\",\"value\":\"13c8f5ac-d999-4923-940d-b39f7b74aa94\"}],\"contentType\":\"application/json\",\"loaderName\":\"ssc-2.3.1-stdout$\",\"encoding\":\"UTF-8\",\"hostname\":\"0.0.0.0\",\"timestamp\":\"2021-08-29T10:49:50.727Z\",\"ipAddress\":\"172.17.0.1\",\"useragent\":\"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0\",\"refererUri\":\"http://localhost:8000/\",\"headers\":[\"Timeout-Access: <function1>\",\"Connection: keep-alive\",\"Host: 0.0.0.0:9090\",\"User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0\",\"Accept: */*\",\"Accept-Language: en-US, en;q=0.5\",\"Accept-Encoding: gzip\",\"Referer: http://localhost:8000/\",\"Origin: http://localhost:8000\",\"Cookie: micro=3734601f-5c3d-47c5-b367-0883e1ed74e6\",\"application/json\"],\"userId\":\"3734601f-5c3d-47c5-b367-0883e1ed74e6\"}}}}"
    ]
  }
]
```

### Filters

When querying `/micro/bad` with `POST` (`Content-Type: application/json` needs to be set in the headers of the request), it's possible to specify filters, thanks to a JSON in the data of the HTTP request.

Example of command to query the bad events: 

```bash
curl -X POST -H 'Content-Type: application/json' <IP:PORT>/micro/bad -d '<JSON>'
```

An example of JSON with filters could be:

```json
{
    "vendor":"com.snowplowanalytics.snowplow",
    "version":"tp2",
    "limit": 10
}
```

List of possible fields for the filters:

- `vendor`: vendor for the tracking event.
- `version`: version of the vendor for the tracking event.
- `limit`: limit the number of events in the response (most recent events are returned).

It's not necessary to specify all the fields in each request, only the ones that need to be used for filtering.

## /micro/reset

Sending a request to this endpoint resets Micro's cache.

### HTTP method

`GET`, `POST`

### Response format

Expected:

```json
{
  "total": 0,
  "good": 0,
  "bad": 0
}
```

## /micro/iglu

:::note

This is available since version 1.2.0.

:::

The `/micro/iglu` endpoint can be used in order to check whether a schema can be resolved.

Schema lookup should be in format:

```text
/micro/iglu/{vendor}/{schemaName}/jsonschema/{schemaVersion}
```

Or more specifically:

```text
/micro/iglu/{vendor}/{schemaName}/jsonschema/{model}-{revision}-{addition}
```

For example, assuming Micro running on localhost port `9090`:

```bash
curl -X GET http://localhost:9090/micro/iglu/com.myvendor/myschema/jsonschema/1-0-0
```

### HTTP Method

GET

### Response format

The JSON schema itself, if resolved:

```json
{
  "$schema":"http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description":"A template for a self-describing JSON Schema for use with Iglu",
  "self": {
    "vendor":"com.myvendor",
    "name":"myschema",
    "format":"jsonschema",
    "version":"1-0-0"
  },
  "type":"object",
  "properties": {
    "myStringProperty": {
      "type":"string"
    },
    "myNumberProperty":{
      "type":"number"
    }
  },
  "required": ["myStringProperty","myNumberProperty"],
  "additionalProperties":false
}
```

If a schema cannot be resolved, a JSON indicating the Iglu repositories searched:

```json
{
  "value": {
    "Iglu Central": {
      "errors": [{"error":"NotFound"}],
      "attempts":1,
      "lastAttempt":"2021-08-26T13:41:06.905Z"
    },
    "Iglu Client Embedded": {
      "errors": [{"error":"NotFound"}],
      "attempts":1,
      "lastAttempt":"2021-08-26T13:41:06.677Z"
    }
  }
}
```
