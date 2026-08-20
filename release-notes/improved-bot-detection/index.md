---
title: "Improved bot detection"
description: "When looking at page views, conversion rates, as so on, you typically want to focus on human users."
date: "2026-04-17"
category:
  - "Product news"
components:
  - "Trackers"
  - "Pipeline components"
---
When looking at page views, conversion rates, as so on, you typically want to focus on _human_ users. According to [a Cloudflare report](https://radar.cloudflare.com/year-in-review/2025#ai-traffic-share), however, **over 50% of web traffic does not come from people**: it comes from bots and agents.

Many bots and agents end up in your analytics data and pollute key metrics. The page views are inflated, and conversion rates dwindle because bots don’t convert.

We have released a number of features to help you detect bots and filter them out from the data:

* [Client-side bot detection tracker plugin](/docs/sources/web-trackers/tracking-events/bot-detection/) — identify various automation frameworks like Selenium and Puppeteer
* [ASN Lookup enrichment](/docs/pipeline/enrichments/available-enrichments/asn-lookup-enrichment/) — detect traffic coming from cloud hosting providers (AWS, DigitalOcean, ...) which is often indicative of bots
* [Bot detection enrichment](/docs/pipeline/enrichments/available-enrichments/bot-detection-enrichment/) — consolidate multiple bot indicators (the above plugin, ASN data, YAUAA and IAB enrichment data) into a single convenient bot entity that you can use in event forwarding or data models

We have also improved existing enrichments:

* The [IAB enrichment](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/) now provides a way to override how specific user agent strings are classified. This is useful, e.g., to prevent server-side trackers from being flagged as bots. ([Referrer parser enrichment](/docs/pipeline/enrichments/available-enrichments/referrer-parser-enrichment/) also supports overrides now.)
* [IP Lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/) can be configured to output ASN information (required for the ASN Lookup enrichment)

**The new enrichments are not enabled automatically**, so that you can configure what’s best for your use case. To start improving your bot detection, head to the [filtering bot events](/docs/events/filtering-bot-events/) overview in our documentation.

This release is the first instalment of a wider Agent & Bot Intelligence initiative. Stay tuned!
