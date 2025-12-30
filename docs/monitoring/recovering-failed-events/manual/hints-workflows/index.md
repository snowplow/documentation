---
title: "Manual event recovery workflows"
date: "2020-08-26"
sidebar_position: 60
sidebar_label: "Hints and workflows"
description: "Explore data structures, build configurations, validate recovery flows, and test jobs locally using scripting utilities."
keywords: ["recovery workflows", "recovery configuration tips"]
---

Most of the following workflows come from testing/working with elaborate bad row structures and configurations and rely heavily on the supplied scripting utility. To set it up locally follow [scripting utility intro](/docs/monitoring/recovering-failed-events/manual/testing/index.md#scripting) or starting with an empty ammonite script file (ie. `test.sc`), set up Snowplow's repository and dependencies:

```scala
interp.repositories() ++= Seq(coursierapi.MavenRepository.of("http://maven.snplow.com/releases/"))
@
import $url.{`https://raw.githubusercontent.com/snowplow-incubator/snowplow-event-recovery/feature/recovery-typeclasses/scripts/Recovery.sc` => Recovery}, Recovery._
import $ivy.`com.snowplowanalytics::snowplow-event-recovery-core:0.2.0-rc10`, com.snowplowanalytics.snowplow.event.recovery._, config._, json._
```

## Exploring data structures

The new bad row format is designed to be, readable and self-contained, however some fields are not captured in [JSON schemas for bad row format](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows).

The unspecified fields can vary from plain JSON types through JSON objects to inline JSON structures and even Base64-encoded.

To explore the data structures we are able to use the convenience scripts as described in Testing section.

Given we got a bad row JSON structure we can turn it into navigable JSON object that we can step through and encode/decode using for example:

```scala
val badrow = """{"schema":"iglu:com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema/1-0-0","data":{"processor":{"artifact":"beam-enrich","version":"1.0.0-rc5"},"failure":{"timestamp":"2020-02-17T09:28:18.100Z","messages":[{"enrichment":{"schemaKey":"iglu:com.snowplowanalytics.snowplow.enrichments/api_request_enrichment_config/jsonschema/1-0-0","identifier":"api-request"},"message":{"error":"Error accessing POJO input field [user]: [java.lang.NoSuchMethodException: com.snowplowanalytics.snowplow.enrich.common.outputs.EnrichedEvent.user_id-foo()]"}}]},"payload":{"enriched":{"app_id":"console","platform":"web","etl_tstamp":"2020-02-17 09:28:18.095","collector_tstamp":"2020-02-17 09:28:16.560","dvce_created_tstamp":"2020-02-17 09:28:16.114","event":"page_view","event_id":"2dfeb9b7-5a87-4214-8a97-a8b23176856b","txn_id":null,"name_tracker":"msc-gcp-stg1","v_tracker":"js-2.10.2","v_collector":"ssc-1.0.0-rc4-googlepubsub","v_etl":"beam-enrich-1.0.0-rc5-common-1.0.0","user_id":null,"user_ipaddress":"18.194.133.57","user_fingerprint":null,"domain_userid":"d6c468de-0aed-4785-9052-b6bb77b6dddb","domain_sessionidx":13,"network_userid":"510b2f05-27e3-4fd3-b449-a2702926da5e","geo_country":"DE","geo_region":"HE","geo_city":"Frankfurt am Main","geo_zipcode":"60313","geo_latitude":50.1188,"geo_longitude":8.6843,"geo_region_name":"Hesse","ip_isp":null,"ip_organization":null,"ip_domain":null,"ip_netspeed":null,"page_url":"https://console.snowplowanalytics.com/","page_title":"Snowplow CDI","page_referrer":null,"page_urlscheme":"https","page_urlhost":"console.snowplowanalytics.com","page_urlport":443,"page_urlpath":"/","page_urlquery":null,"page_urlfragment":null,"refr_urlscheme":null,"refr_urlhost":null,"refr_urlport":0,"refr_urlpath":null,"refr_urlquery":null,"refr_urlfragment":null,"refr_medium":null,"refr_source":null,"refr_term":null,"mkt_medium":null,"mkt_source":null,"mkt_term":null,"mkt_content":null,"mkt_campaign":null,"contexts":"{\"schema\":\"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0\",\"data\":[{\"schema\":\"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0\",\"data\":{\"id\":\"39a9934a-ddd3-4581-a4ea-d0ba20e63b92\"}},{\"schema\":\"iglu:org.w3/PerformanceTiming/jsonschema/1-0-0\",\"data\":{\"navigationStart\":1581931694397,\"unloadEventStart\":1581931696046,\"unloadEventEnd\":1581931694764,\"redirectStart\":0,\"redirectEnd\":0,\"fetchStart\":1581931694397,\"domainLookupStart\":1581931694440,\"domainLookupEnd\":1581931694513,\"connectStart\":1581931694513,\"connectEnd\":1581931694665,\"secureConnectionStart\":1581931694572,\"requestStart\":1581931694665,\"responseStart\":1581931694750,\"responseEnd\":1581931694750,\"domLoading\":1581931694762,\"domInteractive\":1581931695963,\"domContentLoadedEventStart\":1581931696039,\"domContentLoadedEventEnd\":1581931696039,\"domComplete\":0,\"loadEventStart\":0,\"loadEventEnd\":0}}]}","se_category":null,"se_action":null,"se_label":null,"se_property":null,"se_value":null,"unstruct_event":null,"tr_orderid":null,"tr_affiliation":null,"tr_total":null,"tr_tax":null,"tr_shipping":null,"tr_city":null,"tr_state":null,"tr_country":null,"ti_orderid":null,"ti_sku":null,"ti_name":null,"ti_category":null,"ti_price":null,"ti_quantity":0,"pp_xoffset_min":0,"pp_xoffset_max":0,"pp_yoffset_min":0,"pp_yoffset_max":0,"useragent":"Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0","br_name":null,"br_family":null,"br_version":null,"br_type":null,"br_renderengine":null,"br_lang":"en-US","br_features_pdf":0,"br_features_flash":0,"br_features_java":0,"br_features_director":0,"br_features_quicktime":0,"br_features_realplayer":0,"br_features_windowsmedia":0,"br_features_gears":0,"br_features_silverlight":0,"br_cookies":1,"br_colordepth":"24","br_viewwidth":1918,"br_viewheight":982,"os_name":null,"os_family":null,"os_manufacturer":null,"os_timezone":"Europe/Berlin","dvce_type":null,"dvce_ismobile":0,"dvce_screenwidth":1920,"dvce_screenheight":1080,"doc_charset":"UTF-8","doc_width":1918,"doc_height":982,"tr_currency":null,"tr_total_base":null,"tr_tax_base":null,"tr_shipping_base":null,"ti_currency":null,"ti_price_base":null,"base_currency":null,"geo_timezone":"Europe/Berlin","mkt_clickid":null,"mkt_network":null,"etl_tags":null,"dvce_sent_tstamp":"2020-02-17 09:28:16.507","refr_domain_userid":null,"refr_dvce_tstamp":null,"derived_contexts":"{\"schema\":\"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1\",\"data\":[{\"schema\":\"iglu:com.snowplowanalytics.snowplow/ua_parser_context/jsonschema/1-0-0\",\"data\":{\"useragentFamily\":\"Firefox\",\"useragentMajor\":\"72\",\"useragentMinor\":\"0\",\"useragentPatch\":null,\"useragentVersion\":\"Firefox 72.0\",\"osFamily\":\"Linux\",\"osMajor\":null,\"osMinor\":null,\"osPatch\":null,\"osPatchMinor\":null,\"osVersion\":\"Linux\",\"deviceFamily\":\"Other\"}}]}","domain_sessionid":"96958bf6-a8bf-4be8-9c67-fd957b6bc8d2","derived_tstamp":"2020-02-17 09:28:16.167","event_vendor":"com.snowplowanalytics.snowplow","event_name":"page_view","event_format":"jsonschema","event_version":"1-0-0","event_fingerprint":"5acdc8f85f9530081d1a71ec430c8756","true_tstamp":null},"raw":{"vendor":"com.snowplowanalytics.snowplow","version":"tp2","parameters":[{"name":"e","value":"pv"},{"name":"duid","value":"d6c468de-0aed-4785-9052-b6bb77b6dddb"},{"name":"vid","value":"13"},{"name":"eid","value":"2dfeb9b7-5a87-4214-8a97-a8b23176856b"},{"name":"url","value":"https://console.snowplowanalytics.com/"},{"name":"aid","value":"console"},{"name":"cx","value":"eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25vd3Bsb3cvd2ViX3BhZ2UvanNvbnNjaGVtYS8xLTAtMCIsImRhdGEiOnsiaWQiOiIzOWE5OTM0YS1kZGQzLTQ1ODEtYTRlYS1kMGJhMjBlNjNiOTIifX0seyJzY2hlbWEiOiJpZ2x1Om9yZy53My9QZXJmb3JtYW5jZVRpbWluZy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJuYXZpZ2F0aW9uU3RhcnQiOjE1ODE5MzE2OTQzOTcsInVubG9hZEV2ZW50U3RhcnQiOjE1ODE5MzE2OTYwNDYsInVubG9hZEV2ZW50RW5kIjoxNTgxOTMxNjk0NzY0LCJyZWRpcmVjdFN0YXJ0IjowLCJyZWRpcmVjdEVuZCI6MCwiZmV0Y2hTdGFydCI6MTU4MTkzMTY5NDM5NywiZG9tYWluTG9va3VwU3RhcnQiOjE1ODE5MzE2OTQ0NDAsImRvbWFpbkxvb2t1cEVuZCI6MTU4MTkzMTY5NDUxMywiY29ubmVjdFN0YXJ0IjoxNTgxOTMxNjk0NTEzLCJjb25uZWN0RW5kIjoxNTgxOTMxNjk0NjY1LCJzZWN1cmVDb25uZWN0aW9uU3RhcnQiOjE1ODE5MzE2OTQ1NzIsInJlcXVlc3RTdGFydCI6MTU4MTkzMTY5NDY2NSwicmVzcG9uc2VTdGFydCI6MTU4MTkzMTY5NDc1MCwicmVzcG9uc2VFbmQiOjE1ODE5MzE2OTQ3NTAsImRvbUxvYWRpbmciOjE1ODE5MzE2OTQ3NjIsImRvbUludGVyYWN0aXZlIjoxNTgxOTMxNjk1OTYzLCJkb21Db250ZW50TG9hZGVkRXZlbnRTdGFydCI6MTU4MTkzMTY5NjAzOSwiZG9tQ29udGVudExvYWRlZEV2ZW50RW5kIjoxNTgxOTMxNjk2MDM5LCJkb21Db21wbGV0ZSI6MCwibG9hZEV2ZW50U3RhcnQiOjAsImxvYWRFdmVudEVuZCI6MH19XX0"},{"name":"tna","value":"msc-gcp-stg1"},{"name":"cs","value":"UTF-8"},{"name":"cd","value":"24"},{"name":"page","value":"Snowplow CDI"},{"name":"stm","value":"1581931696507"},{"name":"tz","value":"Europe/Berlin"},{"name":"tv","value":"js-2.10.2"},{"name":"vp","value":"1918x982"},{"name":"ds","value":"1918x982"},{"name":"res","value":"1920x1080"},{"name":"cookie","value":"1"},{"name":"p","value":"web"},{"name":"dtm","value":"1581931696114"},{"name":"lang","value":"en-US"},{"name":"sid","value":"96958bf6-a8bf-4be8-9c67-fd957b6bc8d2"}],"contentType":"application/json","loaderName":"ssc-1.0.0-rc4-googlepubsub","encoding":"UTF-8","hostname":"gcp-sandbox-prod1.collector.snplow.net","timestamp":"2020-02-17T09:28:16.560Z","ipAddress":"18.194.133.57","useragent":"Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0","refererUri":"https://console.snowplowanalytics.com/","headers":["Timeout-Access: ","Host: gcp-sandbox-prod1.collector.snplow.net","User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0","Accept: */*","Accept-Language: en-US, en;q=0.5","Accept-Encoding: gzip, deflate, br","Origin: https://console.snowplowanalytics.com","Referer: https://console.snowplowanalytics.com/","Cookie: sp=510b2f05-27e3-4fd3-b449-a2702926da5e","X-Cloud-Trace-Context: 958285ba723e212998af29cec405e002/12535615945289151925","Via: 1.1 google","X-Forwarded-For: 18.194.133.57, 35.201.76.62","X-Forwarded-Proto: https","Connection: Keep-Alive","application/json"],"userId":"510b2f05-27e3-4fd3-b449-a2702926da5e"}}}}"""
parse(badrow).foreach(println)
```

## Building configurations

After being able to explore the data structure and figuring out what amendments to introduce, this needs to be turned into a set of individual building blocks. Configuration building blocks can be tested individually using the scripting utility. To test particular steps you can use following pattern:

```scala
operations.cast("""{"int": "1"}""", "$.int", CastType.String, CastType.Array)
operations.replace("""{"int": "1"}""", "$.int", "(?U)^.*$", "new")
```

## Validating configurations

The rules about setting up configurations are fairly strict to prevent unnecessary delay in empty job evaluations. To validate a built configuration it is easy to simply run it through a validator using the scripting utility:

```scala
val cfg = """{ "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/3-0-0", "data": { "iglu:com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema/1-0-*": [{"name": "passthrough", "conditions": [], "steps": []}]}}"""
configs.validate(cfg)
```

## Testing jobs locally

After validating the configuration it makes sense to try out the full configuration locally using a sample, scrambled data:

```scala
jobs.test(cfg, badrow)
jobs.testMany(cfg, List(badrow))
```
