---
title: "Understanding the enriched TSV format"
date: "2021-07-07"
sidebar_position: 1000
---

## Overview - TSV Format

The Snowplow pipeline outputs the enriched stream in a Tab Separated Values (TSV) format. As TSV files do not contain header information, this page exists to help users of the enriched stream understand what each value represents.

Additionally, Snowplow has a number of Analytics SDKs available which help parse the TSV records into JSON:

- [Analytics SDK Scala](https://github.com/snowplow/snowplow-scala-analytics-sdk)
- [Analytics SDK Python](https://github.com/snowplow/snowplow-python-analytics-sdk)
- [Analytics SDK .NET](https://github.com/snowplow/snowplow-dotnet-analytics-sdk)
- [Analytics SDK Javascript](https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/)
- [Analytics SDK Golang](https://github.com/snowplow/snowplow-golang-analytics-sdk)

For explanations of what each field represents, please see the [Canonical Event Model](/docs/understanding-your-pipeline/canonical-event/index.md).

| Property Index | Property Name |
| --- | --- |
| 0 | app_id |
| 1 | platform |
| 2 | etl_tstamp |
| 3 | collector_tstamp |
| 4 | dvce_created_tstamp |
| 5 | event |
| 6 | event_id |
| 7 | txn_id |
| 8 | name_tracker |
| 9 | v_tracker |
| 10 | v_collector |
| 11 | v_etl |
| 12 | user_id |
| 13 | user_ipaddress |
| 14 | user_fingerprint |
| 15 | domain_userid |
| 16 | domain_sessionidx |
| 17 | network_userid |
| 18 | geo_country |
| 19 | geo_region |
| 20 | geo_city |
| 21 | geo_zipcode |
| 22 | geo_latitude |
| 23 | geo_longitude |
| 24 | geo_region_name |
| 25 | ip_isp |
| 26 | ip_organization |
| 27 | ip_domain |
| 28 | ip_netspeed |
| 29 | page_url |
| 30 | page_title |
| 31 | page_referrer |
| 32 | page_urlscheme |
| 33 | page_urlhost |
| 34 | page_urlport |
| 35 | page_urlpath |
| 36 | page_urlquery |
| 37 | page_urlfragment |
| 38 | refr_urlscheme |
| 39 | refr_urlhost |
| 40 | refr_urlport |
| 41 | refr_urlpath |
| 42 | refr_urlquery |
| 43 | refr_urlfragment |
| 44 | refr_medium |
| 45 | refr_source |
| 46 | refr_term |
| 47 | mkt_medium |
| 48 | mkt_source |
| 49 | mkt_term |
| 50 | mkt_content |
| 51 | mkt_campaign |
| 52 | contexts |
| 53 | se_category |
| 54 | se_action |
| 55 | se_label |
| 56 | se_property |
| 57 | se_value |
| 58 | unstruct_event |
| 59 | tr_orderid |
| 60 | tr_affiliation |
| 61 | tr_total |
| 62 | tr_tax |
| 63 | tr_shipping |
| 64 | tr_city |
| 65 | tr_state |
| 66 | tr_country |
| 67 | ti_orderid |
| 68 | ti_sku |
| 69 | ti_name |
| 70 | ti_category |
| 71 | ti_price |
| 72 | ti_quantity |
| 73 | pp_xoffset_min |
| 74 | pp_xoffset_max |
| 75 | pp_yoffset_min |
| 76 | pp_yoffset_max |
| 77 | useragent |
| 78 | br_name |
| 79 | br_family |
| 80 | br_version |
| 81 | br_type |
| 82 | br_renderengine |
| 83 | br_lang |
| 84 | br_features_pdf |
| 85 | br_features_flash |
| 86 | br_features_java |
| 87 | br_features_director |
| 88 | br_features_quicktime |
| 89 | br_features_realplayer |
| 90 | br_features_windowsmedia |
| 91 | br_features_gears |
| 92 | br_features_silverlight |
| 93 | br_cookies |
| 94 | br_colordepth |
| 95 | br_viewwidth |
| 96 | br_viewheight |
| 97 | os_name |
| 98 | os_family |
| 99 | os_manufacturer |
| 100 | os_timezone |
| 101 | dvce_type |
| 102 | dvce_ismobile |
| 103 | dvce_screenwidth |
| 104 | dvce_screenheight |
| 105 | doc_charset |
| 106 | doc_width |
| 107 | doc_height |
| 108 | tr_currency |
| 109 | tr_total_base |
| 110 | tr_tax_base |
| 111 | tr_shipping_base |
| 112 | ti_currency |
| 113 | ti_price_base |
| 114 | base_currency |
| 115 | geo_timezone |
| 116 | mkt_clickid |
| 117 | mkt_network |
| 118 | etl_tags |
| 119 | dvce_sent_tstamp |
| 120 | refr_domain_userid |
| 121 | refr_device_tstamp |
| 122 | derived_contexts |
| 123 | domain_sessionid |
| 124 | derived_tstamp |
| 125 | event_vendor |
| 126 | event_name |
| 127 | event_format |
| 128 | event_version |
| 129 | event_fingerprint |
| 130 | true_tstamp |
