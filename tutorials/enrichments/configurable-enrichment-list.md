---
position: 3
title: Configurable Enrichment List
description: "Configurable enrichment options for customizing behavioral data processing and enhancement workflows."
schema: "HowTo"
keywords: ["Enrichment List", "Available Enrichments", "Enrichment Catalog", "Enhancement Options", "Enrichment Types", "Processing Options"]
---


- [IP anonymization enrichment](https://github.com/snowplow/snowplow/wiki/IP-anonymization-enrichment): Anonymizes IP addresses in your data to protect user privacy.
- [IP lookups enrichment](https://github.com/snowplow/snowplow/wiki/IP-lookups-enrichment): Adds geographical data based on the IP address.
- [Campaign attribution enrichment](https://github.com/snowplow/snowplow/wiki/Campaign-attribution-enrichment): Assigns marketing campaign information to events based on UTM parameters and other tracking tags.
- [Currency conversion enrichment](https://github.com/snowplow/snowplow/wiki/Currency-conversion-enrichment): Converts transaction amounts into a common currency using exchange rates.
- [JavaScript script enrichment](https://github.com/snowplow/snowplow/wiki/JavaScript-script-enrichment): Allows custom JavaScript code to be executed on event data for additional processing.
- [referer-parser enrichment](https://github.com/snowplow/snowplow/wiki/referer-parser-enrichment): Analyzes referer URLs to determine the source of the traffic.
- [ua-parser enrichment](https://github.com/snowplow/snowplow/wiki/ua-parser-enrichment): Converts user-agent strings into structured data.
- [user-agent-utils enrichment](https://github.com/snowplow/snowplow/wiki/user-agent-utils-enrichment): Extracts details about the browser, operating system, and device from user-agent strings.
- [Event fingerprint enrichment](https://github.com/snowplow/snowplow/wiki/Event-fingerprint-enrichment): Generates a unique fingerprint for events to help identify duplicates.
- [Cookie extractor enrichment](https://github.com/snowplow/snowplow/wiki/Cookie-extractor-enrichment): Extracts specific cookie values from incoming requests.
- [Weather enrichment](https://github.com/snowplow/snowplow/wiki/Weather-enrichment): Adds weather information to events based on their geographical location and timestamp.
- [API Request enrichment](https://github.com/snowplow/snowplow/wiki/API-Request-enrichment): Makes external API requests and incorporates the response data.
- [HTTP Header extractor enrichment](https://github.com/snowplow/snowplow/wiki/HTTP-header-extractor-enrichment): Extracts specified HTTP headers from incoming requests for additional context.
- [SQL Query enrichment](https://github.com/snowplow/snowplow/wiki/SQL-Query-enrichment): Executes SQL queries against a database to enrich events with additional data.
- [PII Pseudonymization Enrichment](https://github.com/snowplow/snowplow/wiki/PII-pseudonymization-enrichment): Replaces personally identifiable information (PII) in events with pseudonyms to enhance privacy.
- [IAB enrichment](https://github.com/snowplow/snowplow/wiki/IAB-enrichment): Categorizes events based on the Interactive Advertising Bureau's (IAB) taxonomy for digital content.
- [YAUAA enrichment](https://github.com/snowplow/snowplow/wiki/YAUAA-enrichment): Uses the Yet Another User-Agent Analyzer to classify and parse user-agent strings with high accuracy.
