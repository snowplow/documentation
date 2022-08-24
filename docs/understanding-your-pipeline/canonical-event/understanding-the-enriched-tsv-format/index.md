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
| 0 | app\_id |
| 1 | platform |
| 2 | etl\_tstamp |
| 3 | collector\_tstamp |
| 4 | dvce\_created\_tstamp |
| 5 | event |
| 6 | event\_id |
| 7 | txn\_id |
| 8 | name\_tracker |
| 9 | v\_tracker |
| 10 | v\_collector |
| 11 | v\_etl |
| 12 | user\_id |
| 13 | user\_ipaddress |
| 14 | user\_fingerprint |
| 15 | domain\_userid |
| 16 | domain\_sessionidx |
| 17 | network\_userid |
| 18 | geo\_country |
| 19 | geo\_region |
| 20 | geo\_city |
| 21 | geo\_zipcode |
| 22 | geo\_latitude |
| 23 | geo\_longitude |
| 24 | geo\_region\_name |
| 25 | ip\_isp |
| 26 | ip\_organization |
| 27 | ip\_domain |
| 28 | ip\_netspeed |
| 29 | page\_url |
| 30 | page\_title |
| 31 | page\_referrer |
| 32 | page\_urlscheme |
| 33 | page\_urlhost |
| 34 | page\_urlport |
| 35 | page\_urlpath |
| 36 | page\_urlquery |
| 37 | page\_urlfragment |
| 38 | refr\_urlscheme |
| 39 | refr\_urlhost |
| 40 | refr\_urlport |
| 41 | refr\_urlpath |
| 42 | refr\_urlquery |
| 43 | refr\_urlfragment |
| 44 | refr\_medium |
| 45 | refr\_source |
| 46 | refr\_term |
| 47 | mkt\_medium |
| 48 | mkt\_source |
| 49 | mkt\_term |
| 50 | mkt\_content |
| 51 | mkt\_campaign |
| 52 | contexts |
| 53 | se\_category |
| 54 | se\_action |
| 55 | se\_label |
| 56 | se\_property |
| 57 | se\_value |
| 58 | unstruct\_event |
| 59 | tr\_orderid |
| 60 | tr\_affiliation |
| 61 | tr\_total |
| 62 | tr\_tax |
| 63 | tr\_shipping |
| 64 | tr\_city |
| 65 | tr\_state |
| 66 | tr\_country |
| 67 | ti\_orderid |
| 68 | ti\_sku |
| 69 | ti\_name |
| 70 | ti\_category |
| 71 | ti\_price |
| 72 | ti\_quantity |
| 73 | pp\_xoffset\_min |
| 74 | pp\_xoffset\_max |
| 75 | pp\_yoffset\_min |
| 76 | pp\_yoffset\_max |
| 77 | useragent |
| 78 | br\_name |
| 79 | br\_family |
| 80 | br\_version |
| 81 | br\_type |
| 82 | br\_renderengine |
| 83 | br\_lang |
| 84 | br\_features\_pdf |
| 85 | br\_features\_flash |
| 86 | br\_features\_java |
| 87 | br\_features\_director |
| 88 | br\_features\_quicktime |
| 89 | br\_features\_realplayer |
| 90 | br\_features\_windowsmedia |
| 91 | br\_features\_gears |
| 92 | br\_features\_silverlight |
| 93 | br\_cookies |
| 94 | br\_colordepth |
| 95 | br\_viewwidth |
| 96 | br\_viewheight |
| 97 | os\_name |
| 98 | os\_family |
| 99 | os\_manufacturer |
| 100 | os\_timezone |
| 101 | dvce\_type |
| 102 | dvce\_ismobile |
| 103 | dvce\_screenwidth |
| 104 | dvce\_screenheight |
| 105 | doc\_charset |
| 106 | doc\_width |
| 107 | doc\_height |
| 108 | tr\_currency |
| 109 | tr\_total\_base |
| 110 | tr\_tax\_base |
| 111 | tr\_shipping\_base |
| 112 | ti\_currency |
| 113 | ti\_price\_base |
| 114 | base\_currency |
| 115 | geo\_timezone |
| 116 | mkt\_clickid |
| 117 | mkt\_network |
| 118 | etl\_tags |
| 119 | dvce\_sent\_tstamp |
| 120 | refr\_domain\_userid |
| 121 | refr\_device\_tstamp |
| 122 | derived\_contexts |
| 123 | domain\_sessionid |
| 124 | derived\_tstamp |
| 125 | event\_vendor |
| 126 | event\_name |
| 127 | event\_format |
| 128 | event\_version |
| 129 | event\_fingerprint |
| 130 | true\_tstamp |
