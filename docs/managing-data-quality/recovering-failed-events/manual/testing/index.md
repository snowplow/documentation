---
title: "Testing"
date: "2020-08-26"
sidebar_position: 20
---

Once you know how you want to configure the recovery job, it's worthwhile to test your configuration locally, before deploying an actual recovery job.

There are a couple of ways to go about that:

- Script based – using a pre-made script to test the configuration on a sample row or rows of data to verify that the payload is changed as expected.
- A complete recovery using the event recovery Integration Spec - a sort of "dry-run" of the job. This runs the complete job through to replaying events into a pipeline for enrichment.

## Script based

Prerequisite:

To make use of scripting utility only a single dependency is required – [ammonite](https://ammonite.io/). Follow the [installation instructions for the version compatible with Scala 2.12](https://ammonite.io/#OlderScalaVersions):

```bash
$ sudo sh -c '(echo "#!/usr/bin/env sh" && curl -L https://github.com/com-lihaoyi/Ammonite/releases/download/2.5.5/2.12-2.5.5) > /usr/local/bin/amm && chmod +x /usr/local/bin/amm' && amm 
```

Now your are able to use a prebuilt script that will allow you to run the configuration against a sample data payload.

The test script sets up a local version of the recovery job and applies configuration settings against a specific "bad row":

```scala title="test.sc"
// REQUIRED SETUP
interp.repositories() ++= Seq(coursierapi.MavenRepository.of("http://maven.snplow.com/releases/"), coursierapi.MavenRepository.of("http://snowplow.bintray.com/snowplow-maven"))

@

import $url.{`https://raw.githubusercontent.com/snowplow-incubator/snowplow-event-recovery/0.5.1/scripts/Recovery.sc` => Recovery}, Recovery._
import $ivy.`com.snowplowanalytics::snowplow-event-recovery-core:0.5.1`, com.snowplowanalytics.snowplow.event.recovery._, config._, json._

// Replace cfg with your own configuration
val cfg = """{
  "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/4-0-0",
  "data": {
    "iglu:com.snowplowanalytics.snowplow.badrows/schema_violations/jsonschema/2-0-*": [
      {
        "name": "mainflow",
        "conditions": [{
            "op": "Test",
            "path": "$.payload.enriched.contexts",
            "value": { "regex": "iglu:com.acme/user/jsonschema/2-0-0" }
          }],
        "steps": [
          {
            "op": "Replace",
            "path": "$.raw.parameters.cx.data.[?(@.schema=~iglu:com.acme/user/jsonschema/2-0-0)].schema",
            "match": "iglu:com.acme/user/jsonschema/2-0-0",
            "value": "iglu:com.acme/user/jsonschema/2-0-1"
          }
        ]
      }
    ]
  }
}
"""

// Replace badrow with your own example of a failed event
val badrow = """{"schema":"iglu:com.snowplowanalytics.snowplow.badrows/schema_violations/jsonschema/2-0-0","data":{"processor":{"artifact":"snowplow-stream-enrich","version":"3.2.3"},"failure":{"timestamp":"2022-08-21T16:18:26.982861Z","messages":[{"schemaKey":"iglu:com.com/user/jsonschema/2-0-0","error":{"error":"ValidationError","dataReports":[{"message":"$.value:is missing but it is required","path":"$","keyword":"required","targets":["value"]}]}}]},"payload":{"enriched":{"app_id":"website","platform":"web","etl_tstamp":"2022-08-2116:18:26.962","collector_tstamp":"2022-08-2116:18:24.966","dvce_created_tstamp":"2022-08-2116:18:24.264","event":"page_view","event_id":"d9255ca0-106b-4da9-a8f4-b0a90bb5db40","txn_id":null,"name_tracker":"co","v_tracker":"js-2.16.3","v_collector":"ssc-2.6.1-kinesis","v_etl":"snowplow-stream-enrich-3.2.3-common-3.2.3","user_id":null,"user_ipaddress":"213.205.192.42","user_fingerprint":null,"domain_userid":"1033470d-fba6-41b3-8f77-5e2a43eb28ef","domain_sessionidx":6,"network_userid":"0c8d252a-8dae-41e8-ab59-46bf836948bc","geo_country":null,"geo_region":null,"geo_city":null,"geo_zipcode":null,"geo_latitude":null,"geo_longitude":null,"geo_region_name":null,"ip_isp":null,"ip_organization":null,"ip_domain":null,"ip_netspeed":null,"page_url":"https://www.acme.com/pensions-explained/pension-withdrawal/money-purchase-annual-allowance","page_title":"Moneypurchaseannualallowance|acme","page_referrer":"https://www.acme.com/pensions-explained/pension-withdrawal/money-purchase-annual-allowance","page_urlscheme":null,"page_urlhost":null,"page_urlport":null,"page_urlpath":null,"page_urlquery":null,"page_urlfragment":null,"refr_urlscheme":null,"refr_urlhost":null,"refr_urlport":null,"refr_urlpath":null,"refr_urlquery":null,"refr_urlfragment":null,"refr_medium":null,"refr_source":null,"refr_term":null,"mkt_medium":null,"mkt_source":null,"mkt_term":null,"mkt_content":null,"mkt_campaign":null,"contexts":"{\"schema\":\"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0\",\"data\":[{\"schema\":\"iglu:com.acme/user/jsonschema/2-0-0\",\"data\":{\"name\":\"postgresid\"}},{\"schema\":\"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0\",\"data\":{\"id\":\"7f409c09-3b2a-4fe8-a63f-78d9a0db90b4\"}},{\"schema\":\"iglu:org.w3/PerformanceTiming/jsonschema/1-0-0\",\"data\":{\"navigationStart\":1661098703534,\"unloadEventStart\":0,\"unloadEventEnd\":0,\"redirectStart\":0,\"redirectEnd\":0,\"fetchStart\":1661098703535,\"domainLookupStart\":1661098703536,\"domainLookupEnd\":1661098703587,\"connectStart\":1661098703587,\"connectEnd\":1661098703698,\"secureConnectionStart\":1661098703628,\"requestStart\":1661098703698,\"responseStart\":1661098703851,\"responseEnd\":1661098703851,\"domLoading\":1661098703881,\"domInteractive\":1661098703973,\"domContentLoadedEventStart\":1661098703973,\"domContentLoadedEventEnd\":1661098703973,\"domComplete\":0,\"loadEventStart\":0,\"loadEventEnd\":0}}]}","se_category":null,"se_action":null,"se_label":null,"se_property":null,"se_value":null,"unstruct_event":null,"tr_orderid":null,"tr_affiliation":null,"tr_total":null,"tr_tax":null,"tr_shipping":null,"tr_city":null,"tr_state":null,"tr_country":null,"ti_orderid":null,"ti_sku":null,"ti_name":null,"ti_category":null,"ti_price":null,"ti_quantity":null,"pp_xoffset_min":null,"pp_xoffset_max":null,"pp_yoffset_min":null,"pp_yoffset_max":null,"useragent":"Mozilla/5.0(iPhone;CPUiPhoneOS15_6_1likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/15.6.1Mobile/15E148Safari/604.1","br_name":null,"br_family":null,"br_version":null,"br_type":null,"br_renderengine":null,"br_lang":"en-GB","br_features_pdf":null,"br_features_flash":null,"br_features_java":null,"br_features_director":null,"br_features_quicktime":null,"br_features_realplayer":null,"br_features_windowsmedia":null,"br_features_gears":null,"br_features_silverlight":null,"br_cookies":1,"br_colordepth":"32","br_viewwidth":390,"br_viewheight":656,"os_name":null,"os_family":null,"os_manufacturer":null,"os_timezone":"Europe/London","dvce_type":null,"dvce_ismobile":null,"dvce_screenwidth":390,"dvce_screenheight":844,"doc_charset":"UTF-8","doc_width":390,"doc_height":8781,"tr_currency":null,"tr_total_base":null,"tr_tax_base":null,"tr_shipping_base":null,"ti_currency":null,"ti_price_base":null,"base_currency":null,"geo_timezone":null,"mkt_clickid":null,"mkt_network":null,"etl_tags":null,"dvce_sent_tstamp":"2022-08-2116:18:24.265","refr_domain_userid":null,"refr_dvce_tstamp":null,"derived_contexts":null,"domain_sessionid":"249e4dff-4bdb-4604-b27e-ba22d509b1b0","derived_tstamp":null,"event_vendor":null,"event_name":null,"event_format":null,"event_version":null,"event_fingerprint":null,"true_tstamp":null},"raw":{"vendor":"com.snowplowanalytics.snowplow","version":"tp2","parameters":[{"name":"e","value":"pv"},{"name":"duid","value":"1033470d-fba6-41b3-8f77-5e2a43eb28ef"},{"name":"vid","value":"6"},{"name":"eid","value":"d9255ca0-106b-4da9-a8f4-b0a90bb5db40"},{"name":"url","value":"https://www.acme.com/pensions-explained/pension-withdrawal/money-purchase-annual-allowance"},{"name":"refr","value":"https://www.acme.com/pensions-explained/pension-withdrawal/money-purchase-annual-allowance"},{"name":"aid","value":"website"},{"name":"cx","value":"eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uYWNtZS91c2VyL2pzb25zY2hlbWEvMi0wLTAiLCJkYXRhIjp7Im5hbWUiOiJwb3N0Z3Jlc2lkIn19LHsic2NoZW1hIjoiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25vd3Bsb3cvd2ViX3BhZ2UvanNvbnNjaGVtYS8xLTAtMCIsImRhdGEiOnsiaWQiOiI3ZjQwOWMwOS0zYjJhLTRmZTgtYTYzZi03OGQ5YTBkYjkwYjQifX0seyJzY2hlbWEiOiJpZ2x1Om9yZy53My9QZXJmb3JtYW5jZVRpbWluZy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJuYXZpZ2F0aW9uU3RhcnQiOjE2NjEwOTg3MDM1MzQsInVubG9hZEV2ZW50U3RhcnQiOjAsInVubG9hZEV2ZW50RW5kIjowLCJyZWRpcmVjdFN0YXJ0IjowLCJyZWRpcmVjdEVuZCI6MCwiZmV0Y2hTdGFydCI6MTY2MTA5ODcwMzUzNSwiZG9tYWluTG9va3VwU3RhcnQiOjE2NjEwOTg3MDM1MzYsImRvbWFpbkxvb2t1cEVuZCI6MTY2MTA5ODcwMzU4NywiY29ubmVjdFN0YXJ0IjoxNjYxMDk4NzAzNTg3LCJjb25uZWN0RW5kIjoxNjYxMDk4NzAzNjk4LCJzZWN1cmVDb25uZWN0aW9uU3RhcnQiOjE2NjEwOTg3MDM2MjgsInJlcXVlc3RTdGFydCI6MTY2MTA5ODcwMzY5OCwicmVzcG9uc2VTdGFydCI6MTY2MTA5ODcwMzg1MSwicmVzcG9uc2VFbmQiOjE2NjEwOTg3MDM4NTEsImRvbUxvYWRpbmciOjE2NjEwOTg3MDM4ODEsImRvbUludGVyYWN0aXZlIjoxNjYxMDk4NzAzOTczLCJkb21Db250ZW50TG9hZGVkRXZlbnRTdGFydCI6MTY2MTA5ODcwMzk3MywiZG9tQ29udGVudExvYWRlZEV2ZW50RW5kIjoxNjYxMDk4NzAzOTczLCJkb21Db21wbGV0ZSI6MCwibG9hZEV2ZW50U3RhcnQiOjAsImxvYWRFdmVudEVuZCI6MH19XX0="},{"name":"tna","value":"co"},{"name":"cs","value":"UTF-8"},{"name":"cd","value":"32"},{"name":"page","value":"Moneypurchaseannualallowance|acme"},{"name":"stm","value":"1661098704265"},{"name":"tz","value":"Europe/London"},{"name":"tv","value":"js-2.16.3"},{"name":"vp","value":"390x656"},{"name":"ds","value":"390x8781"},{"name":"res","value":"390x844"},{"name":"cookie","value":"1"},{"name":"p","value":"web"},{"name":"dtm","value":"1661098704264"},{"name":"lang","value":"en-GB"},{"name":"sid","value":"249e4dff-4bdb-4604-b27e-ba22d509b1b0"}],"contentType":"application/json","loaderName":"ssc-2.6.1-kinesis","encoding":"UTF-8","hostname":"c.acme.com","timestamp":"2022-08-21T16:18:24.966Z","ipAddress":"213.205.192.42","useragent":"Mozilla/5.0(iPhone;CPUiPhoneOS15_6_1likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/15.6.1Mobile/15E148Safari/604.1","refererUri":"https://www.acme.com/","headers":["Timeout-Access:<function1>","Host:c.acme.com","X-Forwarded-For:213.205.192.42","X-Forwarded-Proto:https","X-Forwarded-Port:443","X-Amzn-Trace-Id:Root=1-63025ad0-7c39b1567bc38b974b309982","Accept:*/*","Origin:https://www.acme.com","Accept-Language:en-GB,en;q=0.9","User-Agent:Mozilla/5.0(iPhone;CPUiPhoneOS15_6_1likeMacOSX)AppleWebKit/605.1.15(KHTML,likeGecko)Version/15.6.1Mobile/15E148Safari/604.1","Referer:https://www.acme.com/","Accept-Encoding:gzip,deflate,br","Cookie:ABTasty=uid=6gg578fdm3zm389g&fst=1660396428298&pst=1660737879543&cst=1661098704005&ns=4&pvt=5&pvis=1&th=;ABTastySession=mrasn=&sen=0&lp=https%253A%252F%252Fwww.acme.com%252Fpensions-explained%252Fpension-withdrawal%252Fmoney-purchase-annual-allowance;__adal_ca=so%3Ddirect%26me%3Dnone%26ca%3Ddirect%26co%3D%28not%2520set%29%26ke%3D%28not%2520set%29%26cg%3DDirect;__adal_cw=1661098704224;__adal_id=b159f995-c575-4d73-a10e-b83803b0d9d0.1660396429.5.1661098704.1660737880.c4df4a2d-c12c-4273-8f35-40a1c44e45e5;__adal_ses=*;_fbp=fb.1.1660396428486.1216675597;_ga=GA1.1.1075747631.1660396428;_ga_H0QTTPRT37=GS1.1.1661098704.4.0.1661098704.0.0.0;_gat=1;_gcl_au=1.1.615070873.1661098704;_gid=GA1.2.570290555.1661098704;_hjAbsoluteSessionInProgress=1;_hjSessionUser_863191=eyJpZCI6IjNiZGVlZTk3LWVhMDMtNWZiYi1iNWVkLTljYzY2NjhhNzgxNyIsImNyZWF0ZWQiOjE2NjAzOTY0Mjg1ODUsImV4aXN0aW5nIjp0cnVlfQ==;_hjSession_863191=eyJpZCI6IjdmYjI0NTljLWNmZjAtNGIzYy04NDk1LTc5NGRiZmMxZGNjNCIsImNyZWF0ZWQiOjE2NjEwOTg3MDQzMDcsImluU2FtcGxlIjpmYWxzZX0=;_sp_id.169c=1033470d-fba6-41b3-8f77-5e2a43eb28ef.1660396429.6.1661098704.1660738159.249e4dff-4bdb-4604-b27e-ba22d509b1b0;_sp_ses.169c=*;_uetsid=e184c6f0216c11edbf5b198559f6d8e9;_uetvid=c49415201b0911ed8cac4b9b03d90715;sp=0c8d252a-8dae-41e8-ab59-46bf836948bc;_clck=jq51rv|1|f43|0","application/json"],"userId":"0c8d252a-8dae-41e8-ab59-46bf836948bc"}}}}"""

configs.validate(cfg)

jobs.test(cfg, badrow)

// To test multiple events:
// val badrow1 = ...
// val badrow2 = ...
// jobs.testMany(cfg, List(badrow1, badrow2))
```

The main sections that need editing are `val cfg` and `val badrow`:
* `cfg` refers to the configuration you'd like to test;
* `badrow` refers to an example failed event.

Start by adding your flows, conditions and/or steps as described in the [previous section](/docs/managing-data-quality/recovering-failed-events/manual/configuration/index.md).

Then replace the `badrow` value with a representative failed event example. Be careful with using actual failed events from your production data as it may contain sensitive information. Check with your Data Protection Officer whether you are allowed to copy production data to your local machine.

To run above example, assuming the file is named locally as `test.sc`, run: `amm test.sc`.

This will run the operation that you specified in your configuration (e.g. `replace`) and output the result to the console. You should then be able to check if the payload was modified as expected based on your configuration.

See the [main script](https://github.com/snowplow-incubator/snowplow-event-recovery/blob/master/scripts/Recovery.sc) for additional available convenience functions.

## A complete recovery

As part of the event recovery project there is the ability to run it in `testOnly` mode. It might be worth while to take a look at the documentation on [running the recovery](/docs/managing-data-quality/recovering-failed-events/manual/running/index.md) first, in order to familiarize yourself with the full process of triggering a recovery job.

You can test a complete recovery, starting from bad rows to getting the data enriched by:

- Modifying a `bad_rows.json` file which should contain examples of bad rows you want to recover
- Adding your recovery scenarios to a `recovery_scenarios.json`
- If your recovery is relying on specific Iglu repositories additionally to Iglu central, you’ll need to specify those repositories in a `resolver.json`
- If your recovery is relying on specific enrichments, you’ll need to add them to an `enrichments.json`.

Once this is all done, you can run `sbt "project core" "testOnly *IntegrationSpec"`. What this process will do is:

- Run the recovery on the bad rows contained in `bad_rows.json` according to the configuration in `recovery_scenarios.json`
- Check that these recovered payloads pass enrichments, optionally leveraging the additional Iglu repositories and enrichments

### A custom recovery scenario

If you’ve written an additional recovery scenario you’ll need to add the corresponding unit tests to `RecoverScenarioSpec.scala` and then run `sbt test`.

## Output

The output of Snowplow Event Recovery can also be fed into an enrichment platform to be enriched.
