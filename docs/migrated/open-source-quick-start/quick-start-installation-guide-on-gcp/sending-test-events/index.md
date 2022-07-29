---
title: "Send a test event"
date: "2021-09-23"
sidebar_position: 100
---

Now your pipeline is up and running, we can send a simple page\_view event to it to validate that it is working.

##### Using cURL

Send a simple request using cURL from your terminal. This example is a typical page\_view event, which has been taken from the docs.snowplowanalytics.com website.

The example will also send a sample "failed event" (a custom `product_view` event that will fail due to an appropriate schema not being available to validate against) so that you can get a better understanding of how bad events are generated and what they look like.

```
curl 'https://{{COLLECTOR_URL}}/com.snowplowanalytics.snowplow/tp2' \
   -H 'Content-Type: application/json; charset=UTF-8' \
   -H 'Cookie: _sp=305902ac-8d59-479c-ad4c-82d4a2e6bb9c' \
   --data-raw '{"schema":"iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4","data":[{"e":"pv","url":"/docs/migrated/send-test-events-to-your-pipeline/","page":"Send test events to your pipeline - Snowplow Docs","refr":"https://docs.snowplowanalytics.com/","tv":"js-2.17.2","tna":"spExample","aid":"docs-example","p":"web","tz":"Europe/London","lang":"en-GB","cs":"UTF-8","res":"3440x1440","cd":"24","cookie":"1","eid":"4e35e8c6-03c4-4c17-8202-80de5bd9d953","dtm":"1626182778191","cx":"eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25vd3Bsb3cvd2ViX3BhZ2UvanNvbnNjaGVtYS8xLTAtMCIsImRhdGEiOnsiaWQiOiI0YTU2ZjQyNy05MTk2LTQyZDEtOWE0YS03ZjRlNzk2OTM3ZmEifX1dfQ","vp":"863x1299","ds":"848x5315","vid":"3","sid":"87c18fc8-2055-4ec4-8ad6-fff64081c2f3","duid":"5f06dbb0-a893-472b-b61a-7844032ab3d6","stm":"1626182778194"},{"e":"ue","ue_px":"eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy91bnN0cnVjdF9ldmVudC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJzY2hlbWEiOiJpZ2x1OmNvbS5teV9jb21wYW55L3Byb2R1Y3Rfdmlldy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJpZCI6IjVOMFctUEwwVyIsImN1cnJlbnRfcHJpY2UiOjQ0Ljk5LCJkZXNjcmlwdGlvbiI6IlB1cnBsZSBTbm93cGxvdyBIb29kaWUifX19","tv":"js-2.17.2","tna":"spExample","aid":"docs-example","p":"web","tz":"Europe/London","lang":"en-GB","cs":"UTF-8","res":"3440x1440","cd":"24","cookie":"1","eid":"542a79d3-a3b8-421c-99d6-543ff140a56a","dtm":"1626182778193","cx":"eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25vd3Bsb3cvd2ViX3BhZ2UvanNvbnNjaGVtYS8xLTAtMCIsImRhdGEiOnsiaWQiOiI0YTU2ZjQyNy05MTk2LTQyZDEtOWE0YS03ZjRlNzk2OTM3ZmEifX1dfQ","vp":"863x1299","ds":"848x5315","vid":"3","sid":"87c18fc8-2055-4ec4-8ad6-fff64081c2f3","duid":"5f06dbb0-a893-472b-b61a-7844032ab3d6","refr":"https://docs.snowplowanalytics.com/","url":"/docs/migrated/send-test-events-to-your-pipeline/","stm":"1626182778194"}]}'
```

#### Now [let's query this data](/docs/migrated/open-source-quick-start/quick-start-installation-guide-on-gcp/query-your-postgres-data/) >>

* * *

Do you have any feedback for us?

We are really interested in understanding how you are finding the Quick Start and what we can do to better support you in getting started with our open source. If you have a moment, [let us know via this short survey](https://forms.gle/rKEqpFxwTfLjhQzR6).
