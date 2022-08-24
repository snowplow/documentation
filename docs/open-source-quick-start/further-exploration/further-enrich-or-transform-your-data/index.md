---
title: "Enrich and transform your data"
date: "2021-10-06"
sidebar_position: 200
---

Snowplow's out-of-the-box enrichments allow you to add richness, such as geography, browser, operating system or campaign parameters, as well as the ability to enrich your data against your own 1st party of 3rd party data sets.

By default, the following enrichments are enabled by default in the Quick Start Enrich module:

- [UA parser](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) 
- [Campaign Attribution](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)
- [Event fingerprint](/docs/enriching-your-data/available-enrichments/event-fingerprint-enrichment/index.md) 
- [Referer parser](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)

Our full suite of [enrichments & transformations](/docs/enriching-your-data/available-enrichments/index.md) can be enabled. To enable an enrichment, such as the [IP anonymisation enrichment](/docs/enriching-your-data/available-enrichments/ip-anonymization-enrichment/index.md):

- Follow [these instructions](https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2#inserting-custom-enrichments), updating the `anonOctets` and `anonSegments` according to the number of octets/ segments that you would like to be anonymised
- Run `terraform apply`
- Now when you query your events you should find that the `user_ipaddress` has been anonymised

_Note that the IAB and IP Lookups enrichments require a 3rd party database to function._ 

**To disable any enrichment**, you can [follow these instructions](https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2#disabling-default-enrichments).

#### Next, learn how to deliver marketing attribution, funnel analysis and more with our [Tutorials](/docs/open-source-quick-start/further-exploration/tutorials/index.md) >>

* * *

Do you have any feedback for us?

We are really interested in understanding how you are finding the Quick Start and what we can do to better support you in getting started with our open source. If you have a moment, [let us know via this short survey](https://forms.gle/rKEqpFxwTfLjhQzR6).
