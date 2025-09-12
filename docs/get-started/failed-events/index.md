---
title: "Inspecting your first failed events"
sidebar_position: 9
sidebar_label: "Inspect failed events"
description: "Understand and handle failed events in Snowplow behavioral data collection for maintaining data quality."
schema: "TechArticle"
keywords: ["Failed Events", "Error Handling", "Getting Started", "Event Errors", "Data Quality", "Error Management"]
---

If you have defined some custom events in the previous section, we recommend playing around with sending invalid data to see what happens.

For example, if your custom event has a numeric field, try sending a string. It will not reach your warehouse! Instead, a [failed event](/docs/fundamentals/failed-events/index.md) will be generated.

:::tip

If you have not defined any custom events yet, you can use the following command-line snippet to send yourself an invalid event (it uses a nonexistent schema `com.my_company/product_view/jsonschema/1-0-0`):

```bash
curl 'https://{{COLLECTOR_URL}}/com.snowplowanalytics.snowplow/tp2' \
   -H 'Content-Type: application/json; charset=UTF-8' \
   -H 'Cookie: _sp=305902ac-8d59-479c-ad4c-82d4a2e6bb9c' \
   --data-raw '{"schema":"iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4","data":[{"e":"ue","ue_px":"eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy91bnN0cnVjdF9ldmVudC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJzY2hlbWEiOiJpZ2x1OmNvbS5teV9jb21wYW55L3Byb2R1Y3Rfdmlldy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJpZCI6IjVOMFctUEwwVyIsImN1cnJlbnRfcHJpY2UiOjQ0Ljk5LCJkZXNjcmlwdGlvbiI6IlB1cnBsZSBTbm93cGxvdyBIb29kaWUifX19","tv":"js-2.17.2","tna":"spExample","aid":"docs-example","p":"web","tz":"Europe/London","lang":"en-GB","cs":"UTF-8","res":"3440x1440","cd":"24","cookie":"1","eid":"542a79d3-a3b8-421c-99d6-543ff140a56a","dtm":"1626182778193","cx":"eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uc25vd3Bsb3dhbmFseXRpY3Muc25vd3Bsb3cvd2ViX3BhZ2UvanNvbnNjaGVtYS8xLTAtMCIsImRhdGEiOnsiaWQiOiI0YTU2ZjQyNy05MTk2LTQyZDEtOWE0YS03ZjRlNzk2OTM3ZmEifX1dfQ","vp":"863x1299","ds":"848x5315","vid":"3","sid":"87c18fc8-2055-4ec4-8ad6-fff64081c2f3","duid":"5f06dbb0-a893-472b-b61a-7844032ab3d6","refr":"https://docs.snowplow.io/","url":"/docs/","stm":"1626182778194"}]}'
```

:::

Follow the [documentation](/docs/data-product-studio/data-quality/failed-events/exploring-failed-events/index.md) to explore your failed events.
